const bg = chrome.extension.getBackgroundPage();

function getDefaultOptions() {
  return {
    jiraPath: 'https://jira2.cerner.com/browse/',
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
    jiraPath: document.getElementById('jiraPath').value,
    regex: document.getElementById('regex').value,
  };

  const defaultOptions = getDefaultOptions();
  if (!pgOptions.jiraPath.length) {
    pgOptions.jiraPath = defaultOptions.jiraPath;
  }
  if (!pgOptions.regex.length) {
    pgOptions.regex = defaultOptions.regex;
  }

  localStorage.options = JSON.stringify(pgOptions);
  bg.options = pgOptions;
}

function init() {
  const options = getSavedOptions() || getDefaultOptions();
  document.getElementById('jiraPath').value = options.jiraPath;
  document.getElementById('regex').value = options.regex;

  document.getElementById('options_form').onchange = save;

  document.getElementById('jiraPath').onkeyup = save;
  document.getElementById('jiraPath').onclick = save;

  document.getElementById('regex').onkeyup = save;
  document.getElementById('regex').onclick = save;
}

window.addEventListener('load', init);
