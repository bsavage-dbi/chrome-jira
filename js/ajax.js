function fetchJiraStatus(key) {
  console.log(`Fetching JIRA data for ${key}`);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://jira2.cerner.com/rest/api/2/issue/${key}?fields=status`, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const resp = JSON.parse(xhr.responseText);
      const status = resp.fields.status.name;
      console.log(status);
    }
  };
  xhr.send();
}
