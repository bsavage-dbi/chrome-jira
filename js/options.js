const bg = chrome.extension.getBackgroundPage();

let allLoaded = false;

function save() {
  if (!allLoaded) return;

  const options = {
    jira_path: document.getElementById('jira_path').value,
    regex: document.getElementById('regex').value,
  };

  // Reset to defaults if settings are wiped
  if (options.jira_path && !options.jira_path.length) {
    options.jira_path = 'https://jira2.cerner.com/browse/';
  }
  if (options.regex && !options.regex.length) {
    options.regex = '(CONNECT)-[\\d]{1,6}';
  }

  localStorage.options = JSON.stringify(options);
  bg.options = options;
}

function init() {
  document.getElementById('jira_path').value = bg.options.jira_path;
  document.getElementById('regex').value = bg.options.regex;

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
}

window.addEventListener('load', init, false);
