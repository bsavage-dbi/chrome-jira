chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'html/options.html' });
  } else if (details.reason === 'update') {
    chrome.tabs.create('https://github.cerner.com/NB042447/chrome-jira/blob/master/CHANGELOG.md');
  }
});
