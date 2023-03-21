// panel.js

// Listen for messages from the background page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Add the network request data to the list of requests
    const requestsList = document.getElementById('requests');
    const listItem = document.createElement('li');
    listItem.innerText = `${request.request.method} ${request.request.url}`;
    requestsList.appendChild(listItem);
});
