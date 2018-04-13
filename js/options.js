function save() {
  const pgOptions = {
    jiraPath: document.getElementById('jiraPath').value,
    pageRegex: document.getElementById('pageRegex').value,
    regex: document.getElementById('regex').value,
    tooltipPosition: document.getElementById('tooltipPosition').value,
  };

  const defaultOptions = getDefaultOptions();
  if (!pgOptions.jiraPath.length) {
    pgOptions.jiraPath = defaultOptions.jiraPath;
  }
  if (!pgOptions.pageRegex.length) {
    pgOptions.pageRegex = defaultOptions.pageRegex;
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
  chrome.storage.sync.get(['options'], (result) => {
    const options = (result.options && JSON.parse(result.options)) || getDefaultOptions();

    document.getElementById('jiraPath').value = options.jiraPath;
    document.getElementById('pageRegex').value = options.pageRegex;
    document.getElementById('regex').value = options.regex;
    document.getElementById('tooltipPosition').value = options.tooltipPosition;

    document.getElementById('optionsForm').onchange = save;

    document.getElementById('jiraPath').onkeyup = save;
    document.getElementById('jiraPath').onclick = save;

    document.getElementById('pageRegex').onkeyup = save;
    document.getElementById('pageRegex').onclick = save;

    document.getElementById('regex').onkeyup = save;
    document.getElementById('regex').onclick = save;

    document.getElementById('tooltipPosition').onkeyup = save;
    document.getElementById('tooltipPosition').onclick = save;
  });
}

window.addEventListener('load', init);
