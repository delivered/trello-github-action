const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const linkRegEx = core.getInput('link-regex');
  console.log(`Checking for links: ${linkRegEx}!`);
  const time = (new Date()).toTimeString();
  
  core.setOutput("time", time);
  core.setOutput("link", linkRegEx);
  core.setOutput("time", false);

  const payload = github.context.payload;
  const token = core.getInput('repo-token');
  const octokit = new github.GitHub(token);
  const prComments = octokit.issues.listComments({
    owner: payload.organization.login,
    repo: payload.repository.name,
    issue_numer: payload.pull_request.number
  })

  console.log(prComments);
} catch (error) {
    console.log(error);
    core.setFailed(error.message);
}