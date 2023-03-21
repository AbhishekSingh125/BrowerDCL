//
// // Get the user ID from the URL parameter
// const urlParams = new URLSearchParams(window.location.search);
// const userId = urlParams.get('userId');
//
// // Send a POST request with the user's browsing data to the server
// function sendBrowsingData(data) {
//     fetch('http://localhost:8080/api/data?userId=' + userId, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => {
//             if (response.ok) {
//                 console.log('Browsing data sent successfully:', data);
//             } else {
//                 console.error('Error sending browsing data:', response.statusText);
//             }
//         })
//         .catch(error => {
//             console.error('Error sending browsing data:', error);
//         });
// }
//
// // Log the user's browsing activity
// function logBrowsingActivity() {
//     const data = {
//         url: window.location.href,
//         timestamp: Date.now(),
//         requests: [],
//         responses: []
//     };
//
//     // Log all network requests and responses
//     chrome.devtools.network.onRequestFinished.addListener(request => {
//         data.requests.push({
//             url: request.request.url,
//             method: request.request.method,
//             headers: request.request.headers,
//             postData: request.request.postData,
//             timestamp: request.startedDateTime.getTime()
//         });
//
//         request.getContent(response => {
//             data.responses.push({
//                 url: request.request.url,
//                 status: request.response.status,
//                 headers: request.response.headers,
//                 content: response,
//                 timestamp: request.startedDateTime.getTime()
//             });
//
//             // Send the browsing data to the server when all requests have been logged
//             if (data.requests.length === data.responses.length) {
//                 sendBrowsingData(data);
//             }
//         });
//     });
// }
//
// // Initialize the logging of browsing activity
// logBrowsingActivity();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'COLLECT_DATA') {
        const { userId } = message.payload;

        console.log(`Collecting data for user ${userId}.`);

        const listener = (event) => {
            const { target } = event;

            if (target.tagName === 'A' && target.href) {
                console.log(`User ${userId} visited ${target.href}.`);

                chrome.runtime.sendMessage({ type: 'DATA_COLLECTION_START', payload: { tabId: window.tab.id, userId } });
            }
        };

        document.addEventListener('click', listener);

        return true;
    }
});
