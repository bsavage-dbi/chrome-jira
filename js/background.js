function setNewDefaults(options) {
  if (!options.documentQueries) {
    chrome.storage.sync.set({ options: { ...options, documentQueries: 'p.commit-title, span.branch-details' } });
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'html/options.html' });
  } else if (details.reason === 'update') {
    // TODO remove once everyone is upgraded
    chrome.storage.sync.get(['options'], (result) => {
      try {
        const convertedOptions = JSON.parse(result.options);
        chrome.storage.sync.set({ options: convertedOptions }, () =>
          setNewDefaults(convertedOptions));
      } catch (err) {
        console.log('Options already converted, thanks for upgrading.');
        setNewDefaults(result.options);
      }
    });
  }
});
