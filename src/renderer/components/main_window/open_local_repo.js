import React from "react";
import Button from '@material-ui/core/Button';
const { remote } = require('electron');
const mainProcess = remote.require('../../src/main/index.js');
const currentWindow = remote.getCurrentWindow();

function Open_local_repo_btn(){

    return (
    <Button onClick={openFolderDialogue} variant="contained" color="primary">
        Open A local Repo
    </Button>
    )
}

let openFolderDialogue = () => {
    mainProcess.getRepoDir(currentWindow);
}


export default Open_local_repo_btn