import React, {useEffect } from 'react';
import largeCommits from './largeCommits';
function GitTreeViewer(repoPath) {
  let makeGitTree = () => {
    const graphContainer = document.getElementById("graph-container");

    // Instantiate the graph.
    const gitgraph = GitgraphJS.createGitgraph(graphContainer);
    gitgraph.import(largeCommits);
  };

  useEffect( () => {
      makeGitTree();
      console.log(document.getElementById("graph-container"));
  });

  return (
    <div>
      <div id="graph-container"></div>
    </div>
  );
}

export default GitTreeViewer;
