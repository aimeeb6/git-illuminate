const { Gitgraph } = require("@gitgraph/react");
import simple from "./components/repo-view/simple";
import React from 'react';

function App() {
  return (
    <Gitgraph>
      {(gitgraph) => {
        // Simulate git commands with Gitgraph API.
        gitgraph.import(simple);
      }}
    </Gitgraph>
  );
}

export default App;
