var Git = require('nodegit');
const { ipcMain } = require('electron');
let openRepos = {};

class GitRepo {
  constructor(repoDir) {
    this.repoDir = repoDir;
    this.repo = null;
  }

  async setRepo() {
    const repo = await Git.Repository.open(this.repDir);
    this.repo = repo;
  }

  getParentsShas(commit) {
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

  async getCommits() {
    let repocommits = [];
    var repowalker = Git.Revwalk.create(this.repo);
    repowalker.pushGlob('refs/*');
    const commits = await repowalker.getCommits(500);
    commits.map((x) => {
      let cmts = {
        refs: [],
        hash: x.sha(),
        hashAbbrev: x.sha().substring(0, 7),
        parents: this.getParentsShas(x)[0],
        parentsAbbrev: this.getParentsShas(x)[1],
        msg: x.message().split('\n')[0],
        author: {
          name: x
            .author()
            .toString(true)
            .substring(0, x.author().toString(true).indexOf('<')),
          email: x
            .author()
            .toString(true)
            .substring(
              x.author().toString(true).indexOf('<') + 1,
              x.author().toString(true).lastIndexOf('>')
            ),
          timestamp: x
            .author()
            .toString(true)
            .substring(x.author().toString(true).lastIndexOf('>') + 1),
        },
        committer: {
          name: x
            .committer()
            .toString(true)
            .substring(0, x.committer().toString(true).indexOf('<')),
          email: x
            .committer()
            .toString(true)
            .substring(
              x.committer().toString(true).indexOf('<') + 1,
              x.committer().toString(true).lastIndexOf('>')
            ),
          timestamp: x
            .committer()
            .toString(true)
            .substring(x.committer().toString(true).lastIndexOf('>') + 1),
        },
        subject: x.message().split('\n')[0],
        commitbody: x.body(),
      };

      repocommits.push(cmts);
    });
    return repocommits;
  }

  getRepoRefences() {
    if (this.repo) {
      return this.repo.getReferences().then((refs) => {
        refs = refs.filter((_) => _.shorthand() !== 'stash');
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
          let display = '';
          if (ref.isBranch()) {
            display = ref.shorthand();
          } else if (ref.isRemote()) {
            let names = ref.shorthand().split('/');
            display = names.splice(1, names.length).join('/');
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
        return refDict;
      });
    } else {
      return Promise.reject('NO_REPO');
    }
  }

  async refeshRepo() {
    if (this.repo) {
      const refDict = await this.getRepoRefences();
      return this.getCommits().then((commits) => {
        commits.forEach((commit) => {
          let ref = refDict[commit.hash];
          if (ref) {
            for (let i = 0; i < ref.length; i++) {
              if (ref[i].isTag) {
                commit.refs.push('tag:' + ref[i].display);
              } else {
                commit.refs.push(ref[i].display);
              }
            }
          }
        });
        return commits;
      });
    }
  }

  async branchInfo() {
    if (this.repo) {
      const refDict = await this.getRepoRefences();
      return this.getCommits().then((commits) => {
        commits.forEach((commit) => {
          let ref = refDict[commit.hash];
          if (ref) {
            for (let i = 0; i < ref.length; i++) {
              if (ref[i].isTag) {
                commit.refs.push('tag:' + ref[i].display);
              } else {
                commit.refs.push(ref[i].shorthand);
              }
            }
          }
        });
        return commits;
      });
    }
  }

  async getRepoStatus() {
    let currentStatus = [];
    if (this.repo) {
      return await this.repo.getStatus().then((statusArray) => {
        statusArray.forEach((status) =>
          currentStatus.push({
            path: status.path(),
            status: status.status(),
            isStaged: status.inIndex() > 0 ? true : false,
          })
        );
        return currentStatus;
      });
    }
  }

  async getCurrentBranch() {
    if (this.repo) {
      return await this.repo.getCurrentBranch().then((currentBranch) => {
        return currentBranch.shorthand();
      });
    }
  }

  async refreshRepo(){
    if (this.repo){
      let repoInfo = {
        commits: await this.branchInfo(),
        currentBranch: await this.getCurrentBranch(),
        status: await this.getRepoStatus(),
      }
      return repoInfo;
    }
  }
}

ipcMain.on('open-repo', (event, arg) => {
  let openRepo = new GitRepo(arg);
  let repoStatus = {};
  openRepo.setRepo().then(() => {openRepo.refreshRepo().then((repoInfo) => {event.returnValue = repoInfo})});

});

export { GitRepo };
