import { ContactSupportTwoTone } from '@material-ui/icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import GitGraphWidget from './GitGraphWidget';
import RepoButtons from './RepoButtons';
import CommitModal from './CommitModal';
import TerminalComponent from './TerminalComponent';
const { ipcRenderer } = require('electron');
let commitsArray = [];

let centerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'none',
};
let columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#16161F',
  borderRadius: 5,
  paddingTop: 2,
};

function MainRepoView({ repoPath }) {
  const [commitsArray, setCommitsArray] = useState([]);
  const [status, setStatus] = useState([]);
  const [currentBranch, SetCurrentBranch] = useState('');
  const [currentCommand, setCommand] = useState('');

  function RepoButtonPress(gitcommand){
    console.log(gitcommand);
    if(gitcommand == 'Stage All'){
      setCommand(' add .')
      return;
    }
    
    if(gitcommand == 'fetch'){
      setCommand(' fetch --all')
      return;
    }

    if(gitcommand == 'pull'){
      setCommand(' pull')
      return;
    }

    if(gitcommand == 'push'){
      setCommand(' push')
      return;
    }

    if(gitcommand == 'stash'){
      setCommand(' stash')
      return;
    }

    if(gitcommand == 'Unstage All'){
      setCommand(' reset')
      return;
    }

    if(gitcommand[1]){
      console.log(gitcommand)
      if(!gitcommand[2]){
        setCommand(` commit -m "${gitcommand[1]}"`)
        return;
      }else{
        setCommand(` commit -m "${gitcommand[1]}" -m "${gitcommand[2]}"`)
        return;
      }
    }
  }

  function updateRepoView() {
    let repoInfo = ipcRenderer.sendSync('open-repo', repoPath);
    setCommitsArray(repoInfo.commits);
    setStatus(repoInfo.status);
    SetCurrentBranch(repoInfo.branch);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      updateRepoView();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {}, [status, commitsArray]);

  let eventL = (e) => {
    console.log(e.target.parentElement.id);
  };

  return (
    <div id="main-repo-view-div"
    style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    flexDirection:'column',
    height:"90vh",
    paddingTop:130,
    }}>

      <div style={centerStyles} id="commit-graph-div">
        <div style={columnStyle} onClick={eventL}>
          <RepoButtons RepoButtonPress={RepoButtonPress} />
          {commitsArray.length > 0 ? (
            <GitGraphWidget commitsArray={commitsArray} status={status} />
          ) : (
            <h1>Loading ...</h1>
          )}
        </div>
        <div
          style={{
            paddingLeft: '5%',
            minWidth: '25%',
            width: '30%',
            paddingTop: 5,
          }}
        >
          {status.length > 0 ? <CommitModal ButtonPress={RepoButtonPress} status={status} /> : <div></div>}
        </div>
      </div>
      <div id="terminal-div" style={{paddingTop: 20, maxHeight:350, width:"80%"}}>
        <TerminalComponent repoPath={repoPath} currentCommand={currentCommand}  setCommand={setCommand}  />
      </div>
    </div>
  );
}

export default MainRepoView;
