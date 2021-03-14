import React from "react";
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
