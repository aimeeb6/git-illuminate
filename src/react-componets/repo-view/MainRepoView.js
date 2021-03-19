import React from 'react';
import GitGraphWidget from './GitGraphWidget';
import RepoButtons from './RepoButtons';
const { ipcRenderer } = require('electron');
let commitsArray = [];
let centerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
let columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: "#16161F", 
  borderRadius: 5,
  paddingTop: 2
};

function MainRepoView({ repoPath }) {
  commitsArray = ipcRenderer.sendSync('open-repo', repoPath);
  return (
    <div style={centerStyles}>
      <div style={columnStyle}>
        <RepoButtons />
        {commitsArray.length > 0 ? (
          <GitGraphWidget commitsArray={commitsArray} />
        ) : (
          <h1>Loading ...</h1>
        )}
      </div>
    </div>
  );
}

export default MainRepoView;
