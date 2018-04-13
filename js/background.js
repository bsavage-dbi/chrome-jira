function installNotice() {
  chrome.storage.sync.get(['installTime'], (result) => {
    if (result.installTime) return;

    const now = new Date().getTime();
    chrome.storage.sync.set({ installTime: now });
    chrome.tabs.create({ url: 'options.html' });
  });
}

installNotice();
