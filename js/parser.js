function fetchJiraStatus(key, options) {
  console.log(`Fetching JIRA data for ${key}`);
  return fetch(`${options.jiraPath}rest/api/2/issue/${key}?fields=status,fixVersions`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(json => ({
      key,
      status: json.fields.status.name,
      fixVersions: json.fields.fixVersions.map(fixVersion => fixVersion.name),
    })).catch((err) => {
      console.error(err);
    });
}

function addTooltip(element, jiraData, options) {
  const tooltip = document.createElement('span');
  tooltip.setAttribute('class', 'tooltiptext');
  const link = `${options.jiraPath}browse/${jiraData.key}`;
  tooltip.innerHTML = `<a href="${link}" target="_blank">${jiraData.status}</a>`;

  if (options.showFixVersion) {
    const fixLinks = jiraData.fixVersions.map(fix => `<a href="${options.jiraPath}issues/?jql=fixVersion%20%3D%20${fix}" target="_blank">${fix}</a>`);
    tooltip.innerHTML += `<div class="fix-version">${fixLinks.join(', ')}</div>`;
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
