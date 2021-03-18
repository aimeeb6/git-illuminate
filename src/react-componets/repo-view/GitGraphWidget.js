import React from 'react';
import {
  Gitgraph,
  templateExtend,
  Orientation,
  TemplateName,
} from '@gitgraph/react';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RepoButtons from './RepoButtons';

class GitGraphWidget extends React.Component {
  constructor(props) {
    super(props);
    this.commitsArray = this.props.commitsArray;
    this.myTemplateConfig = templateExtend(TemplateName.Metro, {
      // inherited from 'metro' template
      colors: ['#34b4eb', '#F85BB5', '#008fb5', '#f1c109', '#8fb500'],
      branch: {
        lineWidth: 1,
        spacing: 17,
        labelRotation: 0,
        label: {
          display: true,
          borderRadius: 0,
          bgColor:'#4f4e4c',
          color: 'white',
          font: '9pt roboto',
        },
      },
      tooltip: {
        display: false,
      },
      commit: {
        subject: '',
        spacing: 39.9,
        message: {
          displayAuthor: false,
          displayHash: false,
          display: false,
          font: '.00000000001px sans-serif',
        },
        onClick: (commit) => this.onCommitSelection(commit),
        shouldDisplayTooltipsInCompactMode: false,
        tooltipHTMLFormatter: function (commit) {
          return '[' + commit.sha1 + ']: ' + commit.message;
        },
        dot: {
          size: 5,
          strokeWidth: 6,
        },
        tag: {
          borderRadius: 0,
          pointerWidth: 6,
        },
      },
    });
  }

  componentDidMount() {}

  render() {

    if(this.commitsArray.length > 0){

    return (
      <TableContainer style={{ maxHeight: 550, maxWidth: 680, position:"relative" }} component={Paper}>
        <RepoButtons/>
        <div id="gitGraphContainer" style={{marginTop: "9.5%"}}>
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
            <TableCell style={{padding:16}}>Graph</TableCell>
            <TableCell style={{padding:16}}>Commit Message</TableCell>
            <TableCell style={{padding:16}}>Author</TableCell>
            <TableCell style={{padding:16}}>SHA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow style={{height:"5px"}} id={'row-' + this.commitsArray[0].hashAbbrev}>
            {this.getCommitMessage(this.myTemplateConfig, this.commitsArray[0])}
            </TableRow>
            {this.createRows(this.myTemplateConfig)}
        </TableBody>
      </Table>
      </TableContainer>
    )
  }
}

  createRows = (myTemplateConfig) => {
    let table = []
    for (let i = 1; i < this.commitsArray.length; i++) {
      table.push(<tr key={i} style={{height:"7px", padding: "0", align: "right"}} id={'row-' + this.commitsArray[i].hashAbbrev}>{this.getCommitMessage(this.myTemplateConfig, this.commitsArray[i], i)}</tr>)
    }
    return table
  }

  getCommitMessage = (myTemplateConfig, commit, i) => {
    return [
      <td style={{paddingRight: 200}}></td>,
      <td style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.subject: undefined}</td>,
      <td style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.author.name : undefined}</td>,
      //<td align="center"style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.created_at : undefined}</td>,
      <td style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.hashAbbrev: undefined}</td>,
    ]
  }

};

export default GitGraphWidget;
