chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: 'options.html' });
});
