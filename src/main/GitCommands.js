var Git = require("nodegit");
var path = require("path");
var cp = require("child_process");
var fs = require("fs");

var getMostRecentCommit = function (repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function (commit) {
  return commit.message();
};

function getReferencess() {
  Git.Repository.open(
    "/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/comp2811_ui_group_project"
  ).then((Repo) => {
    if (Repo) {
      return Repo.getReferences().then((refs) => {
        refs = refs.filter((_) => _.shorthand() !== "stash");
        let remoteRefs = refs.filter((_) => _.isRemote());
        let localRefs = refs.filter((_) => _.isBranch());
        localRefs.forEach((localR) => {
          let matching = remoteRefs.filter(
            (ref) => ref.shorthand().indexOf(localR.shorthand()) !== -1
          );
          if (matching.length) {
            localR.diff = localR.cmp(matching[0]);
          }
        });

        let references = refs.map((ref) => {
          let display = "";
          if (ref.isBranch()) {
            display = ref.shorthand();
          } else if (ref.isRemote()) {
            let names = ref.shorthand().split("/");
            display = names.splice(1, names.length).join("/");
          } else if (ref.isTag()) {
            display = ref.shorthand();
          }
          return {
            target: ref.target().toString(),
            isBranch: ref.isBranch(),
            isRemote: ref.isRemote(),
            isTag: ref.isTag(),
            name: ref.name(),
            shorthand: ref.shorthand(),
            display: display,
          };
        });
        let refDict = {};
        references.forEach((ref) => {
          if (refDict[ref.target]) {
            refDict[ref.target].push(ref);
          } else {
            refDict[ref.target] = [ref];
          }
        });
        //window.webContents.send('Repo-RefRetrieved', { references: references, refDict: refDict });
        //console.log(refDict);
        return { refDict: refDict };
      });
    } else {
      return Promise.reject("NO_REPO");
    }
  });
}
async function addRefstoCommitData(){
    let commits = getDataaa();
    let refs = await getReferencess();

   //console.log(refs);
    //console.log('refs');
}

async function getParentsInfo(commit) {
  let parentsSha = await commit.getParents().then((parentsArray) => {
    for (i = 0; i < parentsArray.length; i++) {
      parentsSha.push(parentsArray[i].sha());
    }
    return parentsSha;
  });

  return parentsSha;
}

function getParentsShas(commit) {
  let parentArray = commit.parents();
  let parentCount = commit.parentcount();
  let parentShas = [];
  let parentsAbbrev = [];
  let i = 0;

  for (i = 0; i < parentCount; i++) {
    parentShas.push(parentArray[i].tostrS());
    parentsAbbrev.push(parentArray[i].tostrS().substring(0, 7));
  }

  return [parentShas, parentsAbbrev];
}

function isGitRepository() {
  path =
    "/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/comp2811_ui_group_project";
  if (path === null) return false;

  try {
    cp.execSync("git rev-parse --git-dir", { cwd: path });
    return true;
  } catch (e) {
    return false;
  }
}

var getDataaa = () => {
    var srcDir =
      "/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/comp2811_ui_group_project";
    let globalCommits = [];
     
    return Git.Repository.open(path.join(srcDir)).then(function (repo) {
      var walker = Git.Revwalk.create(repo);
      walker.pushGlob("refs/remotes/*");
      walker
        .getCommitsUntil((c) => true)
        .then(function (commits) {
          commits.map((x) => {
            let cmts = { 
            hash: x.sha(),
            hashAbbrev: x.sha().substring(0, 7),
            parents: getParentsShas(x)[0],
            parentsAbbrev: getParentsShas(x)[1],
            msg: x.message().split("\n")[0],
            author: {
              name: x
                .author()
                .toString(true)
                .substring(0, x.author().toString(true).indexOf("<")),
              email: x
                .author()
                .toString(true)
                .substring(
                  x.author().toString(true).indexOf("<") + 1,
                  x.author().toString(true).lastIndexOf(">")
                ),
              timestamp: x
                .author()
                .toString(true)
                .substring(x.author().toString(true).lastIndexOf(">") + 1),
            },
            committer: {
              name: x
                .committer()
                .toString(true)
                .substring(0, x.committer().toString(true).indexOf("<")),
              email: x
                .committer()
                .toString(true)
                .substring(
                  x.committer().toString(true).indexOf("<") + 1,
                  x.committer().toString(true).lastIndexOf(">")
                ),
              timestamp: x
                .committer()
                .toString(true)
                .substring(x.committer().toString(true).lastIndexOf(">") + 1),
            },
            subject: x.message().split("\n")[0],
            body: x.body()
          }

          globalCommits.push(cmts);

        });
        });
        
        return globalCommits;
    });
  };
  
function getCommits(){
    let commits = []
    Git.Repository.open("/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/comp2811_ui_group_project")
    .then(function(repo){
        var repowalker = Git.Revwalk.create(repo);
        repowalker.pushGlob('refs/remotes/*');
        walker.getCommitsUntil(c => true).then(function (commits) {
            commits.map((x) => {
                let cmts = { 
                hash: x.sha(),
                hashAbbrev: x.sha().substring(0, 7),
                parents: getParentsShas(x)[0],
                parentsAbbrev: getParentsShas(x)[1],
                msg: x.message().split("\n")[0],
                author: {
                  name: x
                    .author()
                    .toString(true)
                    .substring(0, x.author().toString(true).indexOf("<")),
                  email: x
                    .author()
                    .toString(true)
                    .substring(
                      x.author().toString(true).indexOf("<") + 1,
                      x.author().toString(true).lastIndexOf(">")
                    ),
                  timestamp: x
                    .author()
                    .toString(true)
                    .substring(x.author().toString(true).lastIndexOf(">") + 1),
                },
                committer: {
                  name: x
                    .committer()
                    .toString(true)
                    .substring(0, x.committer().toString(true).indexOf("<")),
                  email: x
                    .committer()
                    .toString(true)
                    .substring(
                      x.committer().toString(true).indexOf("<") + 1,
                      x.committer().toString(true).lastIndexOf(">")
                    ),
                  timestamp: x
                    .committer()
                    .toString(true)
                    .substring(x.committer().toString(true).lastIndexOf(">") + 1),
                },
                subject: x.message().split("\n")[0],
                body: x.body()
              }

              commits.push(cmts);

    });
});
});

return commits;

};

let GitLog = {
  commits: getCommits(),
  refs: addRefstoCommitData(),
};

module.exports = GitLog;