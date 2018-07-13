const inputIds = ['jiraPath', 'pageRegex', 'regex', 'documentQueries'];
const toggleIds = ['showFixVersion'];

function save() {
  const defaultOptions = getDefaultOptions();

  const inputOptions = inputIds.reduce((acc, option) => {
    acc[option] = document.getElementById(option).value || defaultOptions[option];
    return acc;
  }, {});

  const toggleOptions = toggleIds.reduce((acc, option) => {
    acc[option] = document.getElementById(option).checked;
    return acc;
  }, {});

  const options = { ...inputOptions, ...toggleOptions };
  chrome.storage.sync.set({ options });
}

function init() {
  chrome.storage.sync.get(['options'], (result) => {
    const defaults = getDefaultOptions();
    const custom = result.options || {};

    document.getElementById('optionsForm').onsubmit = save;

    inputIds.forEach((optionId) => {
      const element = document.getElementById(optionId);
      element.placeholder = custom[optionId] || defaults[optionId];
      if (custom[optionId] && custom[optionId] !== defaults[optionId]) {
        element.value = custom[optionId];
      }
    });

    toggleIds.forEach((toggleId) => {
      const element = document.getElementById(toggleId);
      if (custom[toggleId] === true) {
        element.checked = true;
      } else if (custom[toggleId] === undefined && defaults[toggleId] === true) {
        element.checked = true;
      }
    });
  });
}

window.addEventListener('load', init);
