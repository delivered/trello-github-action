const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const linkRegEx = core.getInput('link-regex');
        console.log(`Checking for links: ${linkRegEx}!`);
        const time = (new Date()).toTimeString();
        
        core.setOutput("time", time);
        core.setOutput("link", linkRegEx);
        core.setOutput("time", false);
      
        const token = core.getInput('repo-token');
        const octokit = new github.GitHub(token);
        const prComments = await octokit.issues.listComments(github.context.issue())
      
        console.log(prComments);
      } catch (error) {
          console.log(error);
          core.setFailed(error.message);
      }
}

run();
