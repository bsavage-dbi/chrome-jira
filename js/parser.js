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

    const match = new RegExp(options.regex, 'gi');
    const elements = document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];

      for (let j = 0; j < element.childNodes.length; j += 1) {
        const node = element.childNodes[j];

        if (node.nodeType === 3) {
          const text = node.nodeValue;

          const matches = match.exec(text);
          if (matches) {
            fetchJiraStatus(matches[0], options).then((status) => {
              addTooltip(element, status, options);
            }).catch((err) => {
              console.error(err);
            });
          }
        }
      }
    }
  });
}

window.addEventListener('load', onPageLoad, false);
