import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react";
import React from 'react'
import simple from './simple';

let myTemplateConfig = templateExtend(TemplateName.Metro, {// inherited from 'metro' template
      colors: ["#34b4eb", "#F85BB5", "#008fb5", "#f1c109", "#8fb500"],
      branch: {
        lineWidth: 1,
        spacingX: 19,
        showLabel: false,
        labelRotation: 0
      },
      commit: {
        spacingY: -40.1,
        message: {
          display: false,
          displayAuthor: false,
          displayBranch: false,
          displayHash: false,
          font: "normal 10pt Arial"
        },
        onClick: (commit) => this.onCommitSelection(commit),
        shouldDisplayTooltipsInCompactMode: false,
        tooltipHTMLFormatter: function ( commit ) {
          return "[" + commit.sha1 + "]: " + commit.message;
        }
      }
    }
    );

function GitGraphFunction() {
  return (
    <Gitgraph  options={{
      template: myTemplateConfig }} >
      {(gitgraph) => {
        // Simulate git commands with Gitgraph API.
        gitgraph.import(simple);
        
      }}
    </Gitgraph>
  );
}
export default GitGraphFunction;