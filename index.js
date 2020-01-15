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
  const pr = github.pulls.get({
    owner: payload.organization.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number
  })

  console.log(pr);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context, undefined, 2)
} catch (error) {
  core.setFailed(error.message);
}