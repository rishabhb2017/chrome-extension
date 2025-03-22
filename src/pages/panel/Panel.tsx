import React, { useEffect, useState } from 'react';
import '@pages/panel/Panel.css';

export default function Panel(): JSX.Element {
  const [state, setState] = useState('');
  const [currentTabID, setCurrentTabID] = useState(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TO_IFRAME') {
        setState(JSON.stringify(message.data.data?.value));
      }
    });
  }, []);

  useEffect(() => {

    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        getActiveTab(tab);
      });
    });

    // Function to fetch the active tab information and display it
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]; // Get the first tab in the active window
      getActiveTab(tab);
    });
  }, []);

  function getActiveTab(tab: any) {
    const tabInfoDiv = document.getElementById('tabInfo');

    // Check if we successfully fetched the tab
    if (tab && tabInfoDiv) {
      const { title, url, id } = tab; // Get the tab's title, URL, and ID
      setCurrentTabID(id);

      // Display the tab's information in the popup
      tabInfoDiv.innerHTML = `
              <p><strong>Tab Title:</strong> ${title}</p>
              <p><strong>Tab URL:</strong> <a href="${url}" target="_blank">${url}</a></p>
              <p><strong>Tab ID:</strong> ${id}</p>
            `;
    } else if (tabInfoDiv) {
      tabInfoDiv.innerHTML = "<p>No active tab found.</p>";
    }
  }


  const ackData = () => {
    // Post a message to the tab's window (React app)
    chrome.scripting.executeScript({
      target: { tabId: currentTabID || 0 },
      func: sendMessageToReact
    });

    function sendMessageToReact() {
      // This function will be injected into the page

      // Modify the page (React app) DOM or trigger state changes in the app
      const messageDiv = document.createElement('div');
      messageDiv.innerText = "Hello from the Chrome extension!";
      messageDiv.style.fontSize = '20px';
      messageDiv.style.color = 'red';
      messageDiv.style.position = 'fixed';
      messageDiv.style.top = '50%';
      messageDiv.style.right = '50%';
      messageDiv.style.zIndex = '9999';

      document.body.appendChild(messageDiv);

      const message = {
        type: 'FROM_EXTENSION',
        payload: { message: 'Data Acknowledge!' }
      };

      // Post the message to the React app using window.postMessage
      window.postMessage(message, '*');
    }
  }

  return (
    <div className="container">
      <h1>Active Tab Info</h1>
      <div id="tabInfo">
        <p>Loading active tab information...</p>
      </div>
      <br />
      <b>Data Passed From React Web App: {state}</b>
      <br />
      <br />
      <button onClick={() => ackData()}>Acknowledge Data Received</button>
      <br />
    </div>
  );
}
