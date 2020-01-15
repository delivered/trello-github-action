const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const linkRegExInput = core.getInput('link-regex');
        const linkRegExp = new RegExp(linkRegExInput)
        console.log(`Checking for links: ${linkRegExInput}!`);
        const time = (new Date()).toTimeString();
        
        core.setOutput("time", time);
        core.setOutput("link", linkRegEx);
        core.setOutput("time", false);
      
        const token = core.getInput('repo-token');
        const octokit = new github.GitHub(token);
        const prComments = await octokit.issues.listComments(github.context.issue);
      
        const commentsWithLinks = prComments.data.filter(d => linkRegExp.exec(d.body).length > 0).map(i => linkRegExp.exec(d.body)[0])

        console.log('all:')
        console.log(prComments);
        console.log('matches:')
        console.log(commentsWithLinks);

      } catch (error) {
          console.log(error);
          core.setFailed(error.message);
      }
}

run();
