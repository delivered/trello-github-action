const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const linkRegExInput = core.getInput('link-regex');
        const linkRegExp = new RegExp(linkRegExInput)

        //matching in pr comments OR body of pr
        let matchedStrings = [];

        console.log(`Checking for links: ${linkRegExInput}!`);

        const time = (new Date()).toTimeString();      
        const token = core.getInput('repo-token');
        const octokit = new github.GitHub(token);
        const payload = github.context.payload;

        const issuesArgs = {
            owner: payload.organization.login,
            repo: payload.repository.name,
            issue_number: payload.pull_request.number
        };

        const pull = await octokit.issues.get(issuesArgs);
        console.log(`pr body: ${pull.body}`);

        const bodyMatches = linkRegExp.exec(pull.body);
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
