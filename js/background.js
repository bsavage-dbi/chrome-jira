function installNotice() {
  if (localStorage.getItem('install_time')) return;

  const now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({ url: 'options.html' });
}

installNotice();

