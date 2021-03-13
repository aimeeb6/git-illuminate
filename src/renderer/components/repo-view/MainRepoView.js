import React from "react";
import Button from '@material-ui/core/Button';
import GitTreeViewer from './GitTreeViewer';

function MainRepoView(repoPath){

    return (
        <div>
            <GitTreeViewer repoPath={repoPath} />
        </div>
    
    )
}


export default MainRepoView;