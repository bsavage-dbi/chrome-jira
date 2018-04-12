const defaultOptions = {
  blacklist: 'example.com, another-example.com',
  jira_path: 'https://example.com/browse/',
  regex: '[A-Z]{2,10}-[\\d]{1,6}',
};

if (localStorage.options && localStorage.options.length > 0) {
  var options = JSON.parse(localStorage.options);
} else {
  var options = defaultOptions;
}

options.blacklist = parseBlacklist(options.blacklist);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message == 'get_options') {
    sendResponse(options);
    return true;
  }
});

function fetchJiraStatus() {
  console.log('Fetching data for JIRA');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jira2.cerner.com/rest/api/2/issue/CONNECT-1648?expand=names', true);
  xhr.onreadystatechange = function () {
	  if (xhr.readyState == 4) {
	    const resp = JSON.parse(xhr.responseText);
      const name = resp.fields.status.name;
      console.log(name);
	  }
  };
  xhr.send();
}

window.fetchJira = fetchJiraStatus;

function parseBlacklist(blacklist) {
  if (blacklist instanceof Array) { return blacklist; }

  blacklist = blacklist.replace(/\n/g, ',');
  blacklist = blacklist.replace(/,+/g, ',');
  blacklist = blacklist.replace(/^,|,$/g, '');
  blacklist = blacklist.split(',');

  for (let i = blacklist.length; i--;) { blacklist[i] = blacklist[i].trim(); }

  if (blacklist.length == 1 && !blacklist[0]) { blacklist = []; }

  return blacklist;
}

function installNotice() {
  if (localStorage.getItem('install_time')) { return; }

  const now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({ url: 'options.html#install' });
}

installNotice();
