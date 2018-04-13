const bg = chrome.extension.getBackgroundPage();

function getDefaultOptions() {
  return {
    jira_path: 'https://jira2.cerner.com/browse/',
    regex: '(CONNECT)-[\\d]{1,6}',
  };
}

function getSavedOptions() {
  if (localStorage.options && localStorage.options.length) {
    return JSON.parse(localStorage.options);
  }

  return null;
}

function save() {
  const pgOptions = {
    jira_path: document.getElementById('jira_path').value,
    regex: document.getElementById('regex').value,
  };

  const defaultOptions = getDefaultOptions();
  if (!pgOptions.jira_path.length) {
    pgOptions.jira_path = defaultOptions.jira_path;
  }
  if (!pgOptions.regex.length) {
    pgOptions.regex = defaultOptions.regex;
  }

  localStorage.options = JSON.stringify(pgOptions);
  bg.options = pgOptions;
}

function init() {
  const options = getSavedOptions() || getDefaultOptions();
  document.getElementById('jira_path').value = options.jira_path;
  document.getElementById('regex').value = options.regex;

  document.getElementById('options_form').onchange = save;

  document.getElementById('jira_path').onkeyup = save;
  document.getElementById('jira_path').onclick = save;

  document.getElementById('regex').onkeyup = save;
  document.getElementById('regex').onclick = save;
}

window.addEventListener('load', init);
