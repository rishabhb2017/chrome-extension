console.log('background script loaded');
// @ts-ignore
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  console.log('chrome installed');
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_IFRAME') {
    chrome.windows.getCurrent({ populate: true }, function (window) {
      let windowId = window.id;
      if (window.tabs && window.tabs.length > 0) {
        var tabId = window.tabs[0].id;
        var tabURL = window.tabs[0].url;
        chrome.sidePanel?.open({
          tabId,
          windowId,
        }, () => {
          console.log('frame opened')
        })
      }
    });
  }
});