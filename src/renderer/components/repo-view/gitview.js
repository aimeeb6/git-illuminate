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

export default GitViewer
