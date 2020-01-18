const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const linkRegExInput = core.getInput('link-regex');
        const linkRegExp = new RegExp(linkRegExInput)

        console.log(`Checking for links: ${linkRegExInput}!`);

        const time = (new Date()).toTimeString();      
        const token = core.getInput('repo-token');
        const octokit = new github.GitHub(token);
        const payload = github.context.payload;

        const prComments = await octokit.issues.listComments({
            owner: payload.organization.login,
            repo: payload.repository.name,
            issue_number: payload.pull_request.number
        });
      
        const commentsWithLinks = prComments.data.filter(d => linkRegExp.exec(d.body) && linkRegExp.exec(d.body).length > 0).map(i => linkRegExp.exec(i.body)[0])

        console.log('all prComments:')
        console.log(prComments.data.map(i => i.body));

        console.log('matches:')
        console.log(commentsWithLinks);

        core.setOutput('msg', `Found ${commentsWithLinks.length} with matching links`)

        if(commentsWithLinks.length === 0)
        core.setFailed(`unable to find any comments matching link ${linkRegExInput}`)

    } catch (error) {
          console.log(error);
          core.setFailed(error.message);
      }
}

run();
