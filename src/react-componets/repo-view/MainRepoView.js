import React from "react";
import GitGraphWidget from "./GitGraphWidget";
const { ipcRenderer } = require("electron");
let commitsArray = [];


function MainRepoView({ repoPath }) {
  commitsArray = ipcRenderer.sendSync('open-repo', repoPath);
  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
      {commitsArray.length > 0? <GitGraphWidget commitsArray={commitsArray}/> : <h1>Loading ...</h1>}


    </div>
  );
}

export default MainRepoView;
