function getDefaultOptions() {
  return {
    jiraPath: 'https://jira2.cerner.com/',
    regex: '(CONNECT)-[\\d]{1,6}',
    tooltipPosition: 'left',
  };
}

function getSavedOptions(callback) {
  chrome.storage.sync.get(['options'], callback);
}

function save() {
  const pgOptions = {
    jiraPath: document.getElementById('jiraPath').value,
    regex: document.getElementById('regex').value,
    tooltipPosition: document.getElementById('tooltipPosition').value,
  };

  const defaultOptions = getDefaultOptions();
  if (!pgOptions.jiraPath.length) {
    pgOptions.jiraPath = defaultOptions.jiraPath;
  }
  if (!pgOptions.regex.length) {
    pgOptions.regex = defaultOptions.regex;
  }
  if (!pgOptions.tooltipPosition.length) {
    pgOptions.tooltipPosition = defaultOptions.tooltipPosition;
  }

  chrome.storage.sync.set({ options: JSON.stringify(pgOptions) });
}

function init() {
  getSavedOptions((result) => {
    const options = JSON.parse(result.options) || getDefaultOptions();

    document.getElementById('jiraPath').value = options.jiraPath;
    document.getElementById('regex').value = options.regex;
    document.getElementById('tooltipPosition').value = options.tooltipPosition;

    document.getElementById('options_form').onchange = save;

    document.getElementById('jiraPath').onkeyup = save;
    document.getElementById('jiraPath').onclick = save;

    document.getElementById('regex').onkeyup = save;
    document.getElementById('regex').onclick = save;

    document.getElementById('tooltipPosition').onkeyup = save;
    document.getElementById('tooltipPosition').onclick = save;
  });
}

window.addEventListener('load', init);
