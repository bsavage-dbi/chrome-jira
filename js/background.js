let options;
if (localStorage.options && localStorage.options.length) {
  options = JSON.parse(localStorage.options);
} else {
  options = { // Defaults
    jira_path: 'https://jira2.cerner.com/browse/',
    regex: '[A-Z]{2,10}-[\\d]{1,6}',
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get_options') {
    sendResponse(options);
    return true;
  }
});

function installNotice() {
  if (localStorage.getItem('install_time')) return;

  const now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({ url: 'options.html#install' });
}

installNotice();
