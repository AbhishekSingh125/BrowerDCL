const apiEndpoint = 'http://localhost:8080/api/data';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'DATA_COLLECTION_START') {
        const { tabId, userId } = message.payload;

        chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js']
        }, () => {
            chrome.tabs.sendMessage(tabId, { type: 'COLLECT_DATA', payload: { userId } });
        });
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    if (details.tabId === -1) return;

    const requestHeaders = details.requestHeaders.reduce((headers, header) => {
        headers[header.name.toLowerCase()] = header.value;
        return headers;
    }, {});

    const { url, method } = details;
    const { referer, origin, user_agent } = requestHeaders;
    const timestamp = Date.now();
    const { id: userId } = details.tab;

    const data = {
        userId,
        url,
        method,
        referer,
        origin,
        user_agent,
        timestamp
    };

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(error => console.error(error));
}, { urls: ['<all_urls>'] }, ['requestHeaders']);
