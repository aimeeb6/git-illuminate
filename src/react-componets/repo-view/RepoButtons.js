import React from 'react';
import Button from '@material-ui/core/Button';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import { makeStyles } from '@material-ui/core/styles';

const buttonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 3,
  margin: 0,
  fontSize: 11.5,
  textTransform: 'capitalize',
};

function RepoButtons({RepoButtonPress}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: "5%"
      }}
    >
      <Button onClick={() => RepoButtonPress('fetch')} variant="outlined" style={{ padding: 0, width: '10%' }}>
        <div style={buttonStyle}>
          <ImportExportIcon fontSize="default" />
          Fetch
        </div>
      </Button>
      <Button onClick={() => RepoButtonPress('pull')} variant="outlined" style={{ padding: 0, width: '10%' }}>
        <div style={buttonStyle}>
          <ArrowDownwardIcon fontSize="default" />
          Pull
        </div>
      </Button>
      <Button onClick={() => RepoButtonPress('push')} variant="outlined" style={{ padding: 0, width: '10%' }}>
        <div style={buttonStyle}>
          <ArrowUpwardIcon fontSize="default" />
          Push
        </div>
      </Button>
      <Button onClick={() => RepoButtonPress('stash')} variant="outlined" style={{ padding: 0, width: '10%' }}>
        <div style={buttonStyle}>
          <MoveToInboxIcon fontSize="default" />
          Stash
        </div>
      </Button>
      <Button variant="outlined" style={{ padding: 0, width: '10%'}}>
        <div style={buttonStyle}>
          <OpenInBrowserIcon fontSize="default" />
          Pop
        </div>
      </Button>
    </div>
  );
}

export default RepoButtons;
