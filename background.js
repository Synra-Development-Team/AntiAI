// background.js

console.log("AI Reducer background loaded.");

const allowedHosts = [
  "chatgpt.com",
  "claude.ai",
  "gemini.google.com",
  "copilot.microsoft.com"
];

function checkAndShow(tabId, url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return;
  }

  if (!allowedHosts.includes(host)) return;

  console.log("Showing page action on:", url);
  browser.pageAction.show(tabId);
}

// On tab updated
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    checkAndShow(tabId, tab.url);
  }
});

// On tab activated
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) checkAndShow(activeInfo.tabId, tab.url);
});

// On startup
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  if (tabs[0] && tabs[0].url) {
    checkAndShow(tabs[0].id, tabs[0].url);
  }
});
