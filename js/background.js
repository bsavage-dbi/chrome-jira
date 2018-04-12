
var defaultOptions = {
	blacklist: 'example.com, another-example.com',
	jira_path: 'https://example.com/browse/',
	regex: '[A-Z]{2,10}-[\\d]{1,6}'
};

if (localStorage.options && localStorage.options.length > 0) {
	var options = JSON.parse(localStorage.options);
} else {
	var options = defaultOptions;
}

options.blacklist = parseBlacklist(options.blacklist);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if ('get_options' == message) {
		sendResponse(options)
		return true;
	}
})

install_notice();
connect_jira();

function connect_jira() {
	console.log('Fetching data for JIRA');
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://jira2.cerner.com/rest/api/2/issue/CONNECT-1648?expand=names", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    var resp = JSON.parse(xhr.responseText);
			console.dir(resp);
	  }
	}
	xhr.send();
}

function parseBlacklist(blacklist) {
	if (blacklist instanceof Array)
		return blacklist;

	blacklist = blacklist.replace(/\n/g, ',');
	blacklist = blacklist.replace(/,+/g, ',');
	blacklist = blacklist.replace(/^,|,$/g, '');
	blacklist = blacklist.split(',');

	for (var i = blacklist.length; i--;)
	    blacklist[i] = blacklist[i].trim();

	if (blacklist.length == 1 && !blacklist[0])
	    blacklist = [];

	return blacklist;
}

function install_notice() {
  if (localStorage.getItem('install_time'))
      return;

  var now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({url: "options.html#install"});
}
