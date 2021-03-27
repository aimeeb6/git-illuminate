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
    this.state = {
      commitsArray: this.props.commitsArray,
    }
    console.log(this.state.commitsArray.length )
    this.myTemplateConfig = templateExtend(TemplateName.Metro, {
      // inherited from 'metro' template
      colors: ['#34b4eb', '#F85BB5', '#008fb5', '#f1c109', '#8fb500'],
      branch: {
        lineWidth: 1,
        spacing: 15,
        labelRotation: 0,
        label: {
          display: true,
          borderRadius: 0,
          bgColor:'#4f4e4c',
          color: 'white',
          font: '9pt roboto',
        }
      },
      tooltip: {
        display: false,
      },
      commit: {
        subject: '',
        spacing: 40,
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

  shouldComponentUpdate(){
    console.log(this.props.commitsArray.length)
    console.log(this.props.commitsArray.length != this.state.commitsArray.length)
    return (this.props.commitsArray.length != this.state.commitsArray.length)
  }

  componentDidUpdate(){
    this.setState({commitsArray: this.props.commitsArray})
    console.log('thos')
  }

  render() {

    if(this.state.commitsArray.length > 0){

    return (
      <TableContainer style={{ maxHeight: 550, maxWidth: 700, minWidth:700, minHeight:550, position:"relative", paddingRight:50 }} component={Paper}>
        <div id="gitGraphContainer" style={this.props.status.length > 0 ? {marginTop: "12%", paddingLeft:0} : {marginTop: "8%", paddingLeft:0}}>

        <Gitgraph style={{}}  options={{ 
          template: this.myTemplateConfig, 
          orientation: Orientation.Vertical,
          }} >
      {(gitgraph) => {
        // Simulate git commands with Gitgraph API.
        gitgraph.import(this.state.commitsArray);
      }}
    </Gitgraph>
        </div>
      <Table stickyHeader aria-label="a dense table" size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{padding:10}}>Graph</TableCell>
            <TableCell style={{padding:10}}>Commit Message</TableCell>
            <TableCell style={{padding:10}}>Author</TableCell>
            <TableCell style={{padding:10}}>SHA</TableCell>
            <TableCell style={{padding:10}}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { this.addUncommitedChanges(this.props.status)}
          <TableRow className="gitGraphRow" style={{height:"5px"}} id={'row-' + this.state.commitsArray[0].hashAbbrev}>
            {this.getCommitMessage(this.myTemplateConfig, this.state.commitsArray[0])}
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
    for (let i = 1; i < this.state.commitsArray.length; i++) {
      table.push(<tr className="gitGraphRow" key={i + this.state.commitsArray[i].hashAbbrev} style={{height:"7px", padding: "0", align: "right"}} id={'row-' + this.state.commitsArray[i].hashAbbrev}>{this.getCommitMessage(this.myTemplateConfig, this.state.commitsArray[i], i)}</tr>)
    }
    return table
  }

  addUncommitedChanges(status){
    if(status.length > 0){ 
      return [
      <TableRow className="gitGraphRow" id="uncommited" style={{textAlign:"center", backgroundColor: `rgba(${199}, ${199}, ${199}, ${.5})`}}>
        <td colSpan={5}>
        Uncommited Changes  
        </td>  
      </TableRow>
      ]
  }
}

  getCommitMessage = (myTemplateConfig, commit, i) => {
    return [
      <td style={{paddingRight: 250}}></td>,
      <td style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.subject: undefined}</td>,
      <td style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.author.name : undefined}</td>,
      //<td align="center"style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.created_at : undefined}</td>,
      <td style={{fontSize:"13px", height:40, padding:0}}>{commit ? commit.hashAbbrev: undefined}</td>,
      <td></td>
    ]
  }

};

export default GitGraphWidget;
