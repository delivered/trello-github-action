const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const linkRegExInput = core.getInput('link-regex');
        const linkRegExp = new RegExp(linkRegExInput)

        //matching in pr comments OR body of pr
        let matchedStrings = [];

        console.log(`Checking for links: ${linkRegExInput}!`);

        const token = core.getInput('repo-token');
        const octokit = new github.GitHub(token);
        const payload = github.context.payload;

        // personal repos have no org - allow for those as well as team ones
        const owner = (payload.organization || payload.repository.owner).login;
        const repo = payload.repository.name;

        // issue events (like create comment) supply #issue instead of #pull_request - handle both
        const issue_number = (payload.pull_request || payload.issue).number;
        
        const issuesArgs = { owner, repo, issue_number };

        const pull = await octokit.issues.get(issuesArgs);
        console.log(`pr body: ${pull.data.body}`);

        const bodyMatches = linkRegExp.exec(pull.data.body);
        if(bodyMatches) matchedStrings.push(bodyMatches[0]);
        
        if(matchedStrings.length < 1) {
            const prComments = await octokit.issues.listComments(issuesArgs);

            const commentsWithLinks = prComments.data.reduce((acc, curr) => {
                const matches = linkRegExp.exec(curr.body);
                if(matches) acc.push(matches[0]);
                return acc;
            }, []);
            
            matchedStrings = matchedStrings.concat(commentsWithLinks);
          
            console.log('all prComments:')
            console.log(prComments.data.map(i => i.body));
        }

        console.log('matches:')
        console.log(matchedStrings);

        core.setOutput('msg', `Found ${matchedStrings.length} with matching links`)

        if(matchedStrings.length === 0) core.setFailed(`unable to find any comments matching link ${linkRegExInput}`)
    } catch (error) {
          console.log(error);
          core.setFailed(error.message);
    }
}

run();
