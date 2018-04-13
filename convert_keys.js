let jiraPath;
let regex;

function searchForKeyNames() {
  function createLinkFromNode(node) {
    const txt = node.textContent;
    let mVar;
    let span;
    let pVar = 0;

    if (txt.trim().length === 0) return;

    const jiraTagExpression = new RegExp(`(${regex})`, 'g');

    while ((mVar = jiraTagExpression.exec(txt)) !== null) {
      if (!span) {
        // Create a new span for the replaced text and newly created href
        span = document.createElement('span');
      }

      // Get the link without trailing dots
      const link = mVar[0].replace(/\.*$/, '');

      // Put in text up to the link
      span.appendChild(document.createTextNode(txt.substring(pVar, mVar.index)));

      // Create a link and put it in the span
      const a = document.createElement('a');
      a.className = 'linkclass';
      a.appendChild(document.createTextNode(link));
      a.setAttribute('href', jiraPath + link);
      a.style.textDecoration = 'underline';

      span.appendChild(a);
      // track insertion point
      pVar = mVar.index + mVar[0].length;
    }
    if (span) {
      // Take the text after the last link
      span.appendChild(document.createTextNode(txt.substring(pVar, txt.length)));

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
observer.start = () => {
  observer.observe(document.body, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
  });
};
observer.stop = () => observer.disconnect;

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
