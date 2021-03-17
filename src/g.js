import React from 'react'
import { Gitgraph, templateExtend, Orientation, TemplateName } from "@gitgraph/react";
import _ from 'lodash'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import simple from './simple';


class GitGraphWidget extends React.Component {
  constructor(props) {
    super(props)
    this.initializeGraph = this.initializeGraph.bind(this)
    this.onCommitSelection = this.onCommitSelection.bind(this)
    this.importedData = JSON.stringify(this.props.commitsArray)
    this.commitsArray = this.props.commitsArray;
    this.branchStack = [];
    this.branches = [];
    this.branchesBucket = [];
    this.nodesStore = [];

    this.myTemplateConfig = templateExtend(TemplateName.Metro, {// inherited from 'metro' template
    colors: ["#34b4eb", "#F85BB5", "#008fb5", "#f1c109", "#8fb500"],
    branch: {
      lineWidth: 1,
      spacingX: 15,
      labelRotation: 0,
      label:{
        display: false,
      }
    },
    tooltip: {
      display: false,
    },
    commit: {
      subject: "",
      spacingY: -30,
      message: {
        displayAuthor: false,
        displayHash: false,
        display: false,
        font: ".00000000001px sans-serif"
      },
      onClick: (commit) => this.onCommitSelection(commit),
      shouldDisplayTooltipsInCompactMode: false,
      tooltipHTMLFormatter: function ( commit ) {
        return "[" + commit.sha1 + "]: " + commit.message;
      }, 
      dot: {
        size: 5,
        strokeWidth: 6,
      },
    }
  });
  }

  onCommitSelection(commit) {
    alert("You clicked on commit " + commit.sha1)
  }

  commitAttributes(node, color) {
    return {
      dotColor: color,
      dotSize: 5,
      dotStrokeWidth: 3,
      sha1: node.id,
     // message: node.message,
      author: node.author_name + "<" + node.author_email + ">",
      onClick: (commit) => this.onCommitSelection(commit)
    }
  }

  initializeGraph(gitgraph) {
    this.import(gitgraph)
    
    this.nodesStore.forEach((node,index) => {
      var branchIndex = this.findBranchFromCommit(this.branchesBucket, node.full_id)
      if (node.parentIds.length === 2) {
        branchIndex = this.findTheOtherBranchIndex(node.full_id, branchIndex, this.branchesBucket);
      }
      var row = document.getElementById("row-" + node.id).cells
      for (var i = 0; i < row.length; i++) {
        row[i].style.color = this.myTemplateConfig.colors[branchIndex]
      }
    })

    gitgraph.canvas.addEventListener( "commit:mouseover", function ( event ) {
      this.style.cursor = "pointer"
    })

    gitgraph.canvas.addEventListener("commit:mouseout", function (event) {
      this.style.cursor = "auto"
    })
  }


  componentDidMount() {}

  render() {
    
    return(
      <TableContainer style={{ maxHeight: 550, maxWidth: 680, position:"relative" }} component={Paper}>
        <div id="gitGraphContainer" style={{marginTop: "10.8%"}}>
        <Gitgraph  options={{ 
          template: this.myTemplateConfig, 
          orientation: Orientation.Vertical }} >
      {(gitgraph) => {
        // Simulate git commands with Gitgraph API.
        gitgraph.import(this.props.commitsArray);
        
      }}
    </Gitgraph>
        </div>
      <Table stickyHeader aria-label="a dense table" size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{padding:16}}>Graph</TableCell>
            <TableCell align="center"style={{padding:16}}>Branch</TableCell>
            <TableCell align="center"style={{padding:16}}>Author</TableCell>
            <TableCell align="center"style={{padding:16}}>SHA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow style={{height:"5px"}} id={'row-' + this.importedData[0].short_id}>
            {this.getCommitMessage(this.myTemplateConfig, this.importedData[0])}
            </TableRow>
            {this.createRows(this.myTemplateConfig)}
        </TableBody>
      </Table>
      </TableContainer>
    )
  }

  createRows = (myTemplateConfig) => {
    let table = []
    for (let i = 1; i < this.importedData.length; i++) {
      table.push(<tr key={i} style={{height:"7px", padding: "0", align: "right"}} id={'row-' + this.importedData[i].short_id}>{this.getCommitMessage(this.myTemplateConfig, this.importedData[i], i)}</tr>)
    }
    return table
  }

  getCommitMessage = (myTemplateConfig, commit, i) => {
    return [
      <td></td>,
      <td align="center"style={{fontSize:"13px", height:40, padding:0}}>{commit ? '[' + commit.branch + ']' : undefined}</td>,
      <td align="center"style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.author_name : undefined}</td>,
      //<td align="center"style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.created_at : undefined}</td>,
      <td align="center"style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.short_id: undefined}</td>,
    ]
  }

  import(gitgraph) {
    var commits = this.importedData;
      
    for (var i = 0; i<commits.length;i++){
        var commit = commits[i];
        this.nodesStore.push({
            'branch': commit.refs,
            'id': commit.hashAbbrev,
            'full_id': commit.hash,
            'message': commit.message,
            'author': commit.author.name,
            'placed':false,
            'childrenPlaced':[]
        });
    }

    var firstNode = _.find(this.nodesStore, { 'parentIds': [] });

    this.branches[0] = gitgraph.branch(firstNode.branch);
    this.branchesBucket[0]= [];
    this.branchesBucket[0].push(firstNode.full_id);
    
    // for each node in the node set to place
    this.nodesStore.forEach((node,index) => {
        // we find the branch the node is belongig to 
        var actualBranchIndex = this.findBranchFromCommit(this.branchesBucket, node.full_id);

        // check if this is a merge
        if (node.parentIds.length <2){
            // commit the node
            if (index === 0){
              this.branches[actualBranchIndex].commit(this.commitAttributes(node, this.myTemplateConfig.colors[actualBranchIndex]));
            } else {
                if (this.branches[actualBranchIndex].name !== node.branch) {

                  let b = -1
                  this.branches.forEach((branch, index) => {
                    if (branch.name === node.branch) {
                      b = index;
                    }
                  })
                  if (-1 === b) {
                    // prepare branch info
                    let branchCnt = this.branches.length;
                    this.branchesBucket[branchCnt] = [];
                    this.branchesBucket[branchCnt].push(node.full_id);
                    // create branch
                    this.branches[branchCnt] = this.branches[actualBranchIndex].branch(node.branch);
                    actualBranchIndex = branchCnt
                  } else {
                    actualBranchIndex = b
                  }
                }
                this.branches[actualBranchIndex].commit(this.commitAttributes(node, this.myTemplateConfig.colors[actualBranchIndex]));
            }
        } else {
            // find the other branch to merge to
            var otherBranch = this.findTheOtherBranchIndex(node.full_id,actualBranchIndex,this.branchesBucket);
            
            console.log(node.full_id);
            // merge
            console.log("merge : "+actualBranchIndex);
            console.log("in : "+otherBranch);
            this.branches[actualBranchIndex].merge(this.branches[otherBranch], this.commitAttributes(node, this.myTemplateConfig.colors[actualBranchIndex]));
            actualBranchIndex = otherBranch
            
            // make sure the resulting commit is in the actualBranch (resulting banch of the merge)
            var pos = this.branchesBucket[otherBranch].indexOf(node.full_id);
            if (pos>-1){
              this.branchesBucket[otherBranch].splice(pos,1);
            }
        }
        
        // check children count
        node.children = this.findChildren(node.full_id,this.nodesStore);
        
        // if more than one child = we need to branch for child after the first one
        if (node.children.length>1){
            // we branch for each child following the first one
            for (var i=1;i<node.children.length;i++ ) {
              var branch = _.find(this.branches, { 'name': node.children[i].branch });
              if (undefined === branch){
                // prepare branch info
                let branchCnt = this.branches.length;
                this.branchesBucket[branchCnt] = [];
                this.branchesBucket[branchCnt].push(node.children[i].full_id);

                // create branch
                this.branches[branchCnt] = this.branches[actualBranchIndex].branch(node.children[i].branch);
              } else {
                let branchCnt = this.branches.map((e) => { return e.name; }).indexOf(branch.name);
                this.branchesBucket[branchCnt].push(node.children[i].full_id);
              }
            }
        }
        if (node.children.length > 0) {
            // we add the child to the actual branch
            this.branchesBucket[actualBranchIndex].push(node.children[0].full_id);
        }
    })
  }

  findChildren(commitId,nodesStore) {
      var children = [];
       nodesStore.forEach((node) => {
           if (node.parentIds.indexOf(commitId)>-1){
               children.push(node);
           }
       });
      return children;
  }   
  
  findBranchFromCommit(branchesBucket, commitId) {
      var branchIndex = 0;
      if (branchesBucket.length === 1) return 0;
      branchesBucket.forEach((branchBucket, index) => {
          if (branchBucket.indexOf(commitId) > -1) {
              branchIndex = index;
          }
      })
      return branchIndex;
  }   

  findTheOtherBranchIndex(commitId,actualBranch,branchesBucket){
      var otherBranchIndex = 0;
      branchesBucket.forEach((brancheBucket,index) => {
          if ((brancheBucket.indexOf(commitId)>-1)&&(index!==actualBranch)){
              otherBranchIndex = index;
          }
      })
      return otherBranchIndex;
  }
}

export default GitGraphWidget;
