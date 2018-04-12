let options;
if (localStorage.options && localStorage.options.length > 0) {
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

function fetchJiraStatus() {
  console.log('Fetching data for JIRA');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jira2.cerner.com/rest/api/2/issue/CONNECT-1648?expand=names', true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const resp = JSON.parse(xhr.responseText);
      const { name } = resp.fields.status;
      console.log(name);
    }
  };
  xhr.send();
}

window.fetchJira = fetchJiraStatus;

function installNotice() {
  if (localStorage.getItem('install_time')) { return; }

  const now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({ url: 'options.html#install' });
}

installNotice();
