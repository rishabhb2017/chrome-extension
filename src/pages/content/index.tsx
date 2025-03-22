import { createRoot } from 'react-dom/client';
const div = document.createElement('div');
document.body.appendChild(div);

const root = createRoot(div);
root.render(
  <div>
    Content from content/index.tsx
  </div>
);

try {
  console.log('content script loaded');

  // content.js (Content Script of the Chrome Extension)
  window.addEventListener('message', function (event) {
    // Only accept messages from the same origin to avoid XSS attacks
    if (event.origin !== window.location.origin) {
      return;
    }
    let innerTime: any = null;
    // Handle the message from the web app
    if (event.data.type === 'FROM_WEB_APP') {
      innerTime = setTimeout(() => {
        chrome?.runtime?.sendMessage({ type: 'TO_IFRAME', data: event.data });
        clearTimeout(innerTime);
      }, 1000);
    }

    // Handle the message from the web app
    if (event.data.type === 'OPEN_IFRAME') {
      //chrome.runtime.sendMessage({ type: 'OPEN_IFRAME' });

      innerTime = setTimeout(() => {
        chrome?.runtime?.sendMessage({ type: 'OPEN_IFRAME' });
        clearTimeout(innerTime);
      }, 1000);
    }
  });

} catch (e) {
  console.error(e);
}
