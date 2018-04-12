const bg = chrome.extension.getBackgroundPage();

let options = {};
let allLoaded = false;
window.addEventListener('load', init, false);

function save() {
  if (!allLoaded) return;

  options.jira_path = document.getElementById('jira_path').value;
  options.regex = document.getElementById('regex').value;

  // Reset to defaults if settings are wiped
  if (options.jira_path && options.jira_path.length === 0) { options.jira_path = 'https://example.com/browse/'; }
  if (options.regex && options.regex.length === 0) { options.regex = '[A-Z]{2,10}-[\\d]{1,6}'; }

  localStorage.options = JSON.stringify(options);
  bg.options = options;
}

function init() {
  options = bg.options;
  document.getElementById('jira_path').value = options.jira_path;

  document.getElementById('regex').value = options.regex;

  document.getElementById('options_form').onchange = save;

  document.getElementById('jira_path').onkeyup = save;
  document.getElementById('jira_path').onclick = save;

  document.getElementById('regex').onkeyup = save;
  document.getElementById('regex').onclick = save;

  allLoaded = true;

  const hash = window.location.hash.substring(1);
  if (hash === 'install') {
    document.getElementById('install').style.display = 'block';
  }

  window.onbeforeunload = (e) => {
    e = e || window.event;

    if (document.getElementById('jira_path').value.indexOf('example.com') !== -1)	{
      return 'You have not changed the default JIRA path from the example path.\n\nYou must first properly set this path in order for this extension to function properly.';
    } else if (document.getElementById('jira_path').value.indexOf('/browse') === -1) {
      return "Most JIRA URLs follow the convention:\nexample.com/browse/ISSUE-123\n\nIt does not appear you have the 'browse' part of the JIRA path in the 'JIRA Browse Path' URL, meaning your links probably won't operate as expected.\n\nYou are highly encouraged to double-check this before leaving the settings page.";
    }
    return null;
  };
}
