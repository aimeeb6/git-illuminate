import React from "react";
import Button from '@material-ui/core/Button';
import FormDialog from './NewRepoModal'
const { remote } = require('electron');
const { ipcRenderer } = require("electron");
const currentWindow = remote.getCurrentWindow();

function NewTab({setTabs, openTabs}){

    let openRepo = () => {
        //the current window and if the folder should already contain a repo or not
        //getRepoDir(currentWindow, true );
        console.log('ll');
        let folderPath = ipcRenderer.sendSync('openFile', true);
        createNewTab(folderPath);
    }

    let createNewTab = (folderPath) => {
        let newRepo = {
          name: folderPath.substring(folderPath.lastIndexOf("/") + 1),
          path: folderPath,
          index: openTabs.length + 1,
        };
    
        if (!openTabs.some((repo) => repo.path == newRepo.path)) {
          setTabs([...openTabs, newRepo]);
        }
      };
    
    let startRepo = () => {
    render(<FormDialog />,document.getElementById('root'));
    }
    

    return (
        <div style={{paddingLeft: 10}}>
            <Button onClick={openRepo} variant="contained" color="primary">
                Open a Repo
            </Button>
            <Button onClick={startRepo} variant="contained" color="primary">
            Start a Repo
            </Button>
        </div>
    
    )
}


export default NewTab;