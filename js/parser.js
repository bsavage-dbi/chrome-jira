function fetchJiraStatus(key, options) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching JIRA data for ${key}`);

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${options.jiraPath}rest/api/2/issue/${key}?fields=status,fixVersions`, true);
    xhr.onload = () => {
      const { fields } = JSON.parse(xhr.responseText);
      return resolve({
        key,
        status: fields.status.name,
        fixVersions: fields.fixVersions.map(fixVersion => fixVersion.name),
      });
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function addTooltip(element, jiraData, options) {
  const tooltip = document.createElement('span');
  tooltip.setAttribute('class', 'tooltiptext');
  const link = `${options.jiraPath}browse/${jiraData.key}`;
  tooltip.innerHTML = `<a href="${link}" target="_blank">${jiraData.status}</a>`;

  if (options.showFixVersion) {
    const fixVersions = jiraData.fixVersions.join(', ');
    tooltip.innerHTML += `<br /><div class="fix-version">${fixVersions}</div>`;
  }

  element.appendChild(tooltip);
  element.classList.add('tooltip');
  element.setAttribute('data-has-tooltip', true);
}

function onPageLoad() {
  chrome.storage.sync.get(['options'], (result) => {
    const options = result.options || getDefaultOptions();

    if (!window.location.href.match(options.pageRegex)) {
      return;
    }

    const match = new RegExp(options.regex, 'i');
    const elements = document.querySelectorAll(options.documentQueries);

    for (let i = 0; i < elements.length; i += 1) {
      const node = elements[i];
      if (node.getAttribute('data-has-tooltip')) {
        return; // Node already has tooltip
      }

      const matches = match.exec(node.innerText);
      if (node.innerText.match(options.regex)) {
        fetchJiraStatus(matches[0], options).then((jiraData) => {
          addTooltip(node, jiraData, options);
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  });
}

// If page was navigated to directly
window.addEventListener('load', onPageLoad);

// Traditional listeners won't work for navigation within Github since it's a single page app
const observer = new MutationObserver(onPageLoad);
observer.observe(document.body, {
  attributes: true,
  childList: true,
  characterData: true,
});
