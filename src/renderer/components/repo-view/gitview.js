const { ipcRenderer } = require("electron");
const path = require("path");
const simpleGit = require('simple-git');
import React from "react";

let repoDir;
var repository;

function GitViewer(){
    return ( 
        <div>
            hello, 
            {repoDir}
        </div>
    )
}

ipcRenderer.on("repo-opened", (event, folder) => {
    repoDir = folder;
    let repo = simpleGit(folder)
    repo.log((err, log) => console.log(log.all[0].author_email))
});


export default GitViewer
