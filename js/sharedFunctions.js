function getDefaultOptions() { // eslint-disable-line no-unused-vars
  return {
    jiraPath: 'https://jira2.cerner.com/',
    pageRegex: 'https:\\/\\/github.cerner.com\\/careaware-connect\\/.*',
    regex: '(CONNECT)-[\\d]{1,6}',
    documentQueries: 'p.commit-title, span.branch-details',
  };
}
