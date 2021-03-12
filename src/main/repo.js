const git = require("nodegit");
const path = require('path');
const openFile = require('./index.js')

let repodir;

let print = () => {
    console.log('print')
}

let getCommits = () => {
    if(repoDir != ''){
    masterCommit = git.Repository.open(path.resolve(repoDir, "../.git")).then(function(repo) {
        return repo.getMasterCommit();
    })

    return masterCommit;
    }else{
        return 'nothinghere'
    }
}



