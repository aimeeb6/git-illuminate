const { ipcRenderer } = require("electron");
const path = require("path");
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
    });

export default GitViewer
