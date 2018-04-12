let jiraPath;
let regex;

function searchForKeyNames() {
  function createLinkFromNode(node) {
    let m;
    const txt = node.textContent;
    let span = null;
    let p = 0;

    if (txt.trim().length === 0) return;

    const jiraTagExpression = new RegExp(`(${regex})`, 'g');

    while ((m = jiraTagExpression.exec(txt)) !== null) {
      if (span === null) {
        // Create a new span for the replaced text and newly created href
        span = document.createElement('span');
      }

      // Get the link without trailing dots
      const link = m[0].replace(/\.*$/, '');

      // Put in text up to the link
      span.appendChild(document.createTextNode(txt.substring(p, m.index)));

      // Create a link and put it in the span
      const a = document.createElement('a');
      a.className = 'linkclass';
      a.appendChild(document.createTextNode(link));
      a.setAttribute('href', jiraPath + link);
      a.style.textDecoration = 'underline';

      span.appendChild(a);
      // track insertion point
      p = m.index + m[0].length;
    }
    if (span) {
      // Take the text after the last link
      span.appendChild(document.createTextNode(txt.substring(p, txt.length)));

      // Replace the original text with the new span
      try {
        node.parentNode.replaceChild(span, node);
      } catch (e) {
        console.error(e);
        console.log(node);
      }
    }
  }

  if (document.contentType !== 'text/xml' && document.contentType !== 'application/xml') {
    let node,
      allLinks = findTextNodes();
    for (let i = 0; i < allLinks.length; i++) {
      node = allLinks[i];
      createLinkFromNode(node);
    }
  }
}

const observer = new MutationObserver(() => {
  observer.stop();
  searchForKeyNames();
  observer.start();
});
const observerConfig = {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true,
};
observer.start = () => {
  observer.observe(document.body, observerConfig);
};
observer.stop = () => {
  observer.disconnect();
};

function findTextNodes(root) {
  root = root || document.body;

  const textNodes = [];

  const ignoreTags = /^(?:a|noscript|option|script|style|textarea)$/i;
  (function findTextNodes(node) {
    node = node.firstChild;
    while (node) {
      if (node.nodeType === 3) {
        textNodes.push(node);
      } else if (!ignoreTags.test(node.nodeName)) {
        findTextNodes(node);
      }
      node = node.nextSibling;
    }
  }(root));
  return textNodes;
}


let options = {};
chrome.runtime.sendMessage('get_options', (options_) => {
  options = options_;

  // Set global regex value
  regex = options.regex;

  // Format JIRA path with a trailing slash if not present
  jiraPath = options.jira_path;
  if (jiraPath.substr(-1) !== '/') jiraPath += '/';

  // Ready to begin search for key names
  searchForKeyNames();
  observer.start();
});
