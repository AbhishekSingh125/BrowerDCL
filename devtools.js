// devtools.js

// Initialize the devtools panel
chrome.devtools.panels.create('Browsing Logger', '', 'panel.html', panel => {});

// Listen for network requests
chrome.devtools.network.onRequestFinished.addListener(request => {
    // Send a message to the content script with the network request data
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { request: request }, response => {});
    });
});
