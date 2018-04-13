function fetchJiraStatus(key) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching JIRA data for ${key}`);
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://jira2.cerner.com/rest/api/2/issue/${key}?fields=status`, true);
    xhr.onload = () => resolve(JSON.parse(xhr.responseText).fields.status.name);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function getOptions() {
  if (localStorage.options && localStorage.options.length) {
    return JSON.parse(localStorage.options);
  }

  return {
    jiraPath: 'https://jira2.cerner.com/browse/',
    regex: '(CONNECT)-[\\d]{1,6}',
  };
}

function addTooltip(element, status) {
  element.setAttribute('data-tooltip', status);
  element.setAttribute('data-tooltip-position', 'left');
}


const match = new RegExp(getOptions().regex, 'gi');
const elements = document.getElementsByTagName('*');

for (let i = 0; i < elements.length; i += 1) {
  const element = elements[i];

  for (let j = 0; j < element.childNodes.length; j += 1) {
    const node = element.childNodes[j];

    if (node.nodeType === 3) {
      const text = node.nodeValue;

      const matches = match.exec(text);
      if (matches) {
        fetchJiraStatus(matches[0]).then((status) => {
          addTooltip(element, status);
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  }
}
