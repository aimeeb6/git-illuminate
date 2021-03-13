import React from "react";
import Button from "@material-ui/core/Button";
import GitTreeViewer from "./GitTreeViewer";
import GitGraphTable from "./GitGraphTable";
import GitGraphWidget from "./GitGraphWidget";

function MainRepoView({ repoPath }) {
  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}
    >
      <GitGraphWidget />
    </div>
  );
}

export default MainRepoView;
