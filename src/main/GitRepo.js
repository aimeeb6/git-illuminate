var Git = require("nodegit");

var getMostRecentCommit = function (repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function (commit) {
  return commit.message();
};

let commits = () => {
  Git.Repository.open("/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/comp2811_ui_group_project")
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  });
};

let GitLog = {
  commits: commits,
};

module.exports = GitLog;
