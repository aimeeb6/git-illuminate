var Git = require("nodegit");
var Repo = Git.Repository.open(
  "/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/comp2811_ui_group_project"
);
var revwalk = Git.Revwalk.create(Repo);

var getMostRecentCommit = function (repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function (commit) {
  return commit.message();
};

let commits = () => {
  console.log('hello')
  revwalk.commitWalk(max_count).then(function(stdVectorGitCommit) {
    console.log(stdVectorGitCommit)
  });
};

let GitLog = {
  commits: commits,
};

module.exports = GitLog;
