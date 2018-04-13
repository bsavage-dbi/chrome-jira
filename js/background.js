chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: 'html/options.html' });
});
