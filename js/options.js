const optionIds = ['jiraPath', 'pageRegex', 'regex', 'documentQueries'];

function save() {
  const defaultOptions = getDefaultOptions();
  const options = optionIds.reduce((acc, option) => {
    acc[option] = document.getElementById(option).value || defaultOptions[option];
    return acc;
  }, {});

  chrome.storage.sync.set({ options });
}

function init() {
  chrome.storage.sync.get(['options'], (result) => {
    const defaults = getDefaultOptions();
    const custom = result.options || {};

    document.getElementById('optionsForm').onchange = save;

    optionIds.forEach((optionId) => {
      const element = document.getElementById(optionId);
      element.placeholder = custom[optionId] || defaults[optionId];
      if (custom[optionId] && custom[optionId] !== defaults[optionId]) {
        element.value = custom[optionId];
      }
    });
  });
}

window.addEventListener('load', init);
