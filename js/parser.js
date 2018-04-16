const queriesToMatch = ['p.commit-title'];

function fetchJiraStatus(key, options) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching JIRA data for ${key}`);

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${options.jiraPath}rest/api/2/issue/${key}?fields=status`, true);
    xhr.onload = () => resolve(JSON.parse(xhr.responseText).fields.status.name);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function addTooltip(element, status, options) {
  element.setAttribute('data-tooltip', status);
  element.setAttribute('data-tooltip-position', options.tooltipPosition);
}

function onPageLoad() {
  chrome.storage.sync.get(['options'], (result) => {
    const options = (result.options && JSON.parse(result.options)) || getDefaultOptions();

    if (!window.location.href.match(options.pageRegex)) {
      return;
    }

    const match = new RegExp(options.regex, 'i');
    const elements = document.querySelectorAll(queriesToMatch.join(', '));

    for (let i = 0; i < elements.length; i += 1) {
      const node = elements[i];
      if (node.getAttribute('data-tooltip')) {
        return; // Node already has tooltip
      }

      const matches = match.exec(node.innerText);
      if (node.innerText.match(options.regex)) {
        fetchJiraStatus(matches[0], options).then((status) => {
          addTooltip(node, status, options);
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
