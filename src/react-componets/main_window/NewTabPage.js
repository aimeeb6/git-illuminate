import React from "react";
import Button from '@material-ui/core/Button';
import FormDialog from './NewRepoModal'
const { remote } = require('electron');
const { ipcRenderer } = require("electron");
const currentWindow = remote.getCurrentWindow();
import {render} from 'react-dom';



function NewTab(){

    return (
        <div>
            <Button onClick={openRepo} variant="contained" color="primary">
                Open a Repo
            </Button>
            <Button onClick={startRepo} variant="contained" color="primary">
            Start a Repo
            </Button>
        </div>
    
    )
}

let openRepo = () => {
    //the current window and if the folder should already contain a repo or not
    //getRepoDir(currentWindow, true );
    ipcRenderer.send('openFile', true);
}

let startRepo = () => {
render(<FormDialog />,document.getElementById('app'));

    //mainProcess.getRepoDir(currentWindow, false );
}


export default NewTab;