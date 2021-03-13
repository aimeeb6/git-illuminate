import React, {useEffect } from 'react';

function GitTreeViewer(repoPath) {
  let makeGitTree = () => {
    const graphContainer = document.getElementById("graph-container");

    // Instantiate the graph.
    const gitgraph = GitgraphJS.createGitgraph(graphContainer);

    // Simulate git commands with Gitgraph API.
    const master = gitgraph.branch("master");
    master.commit("Initial commit");

    const develop = gitgraph.branch("develop");
    develop.commit("Add TypeScript");

    const aFeature = gitgraph.branch("a-feature");
    aFeature
      .commit("Make it work")
      .commit("Make it right")
      .commit("Make it fast");

    develop.merge(aFeature);
    develop.commit("Prepare v1");

    master.merge(develop).tag("v1.0.0");
    console.log('heree');
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
