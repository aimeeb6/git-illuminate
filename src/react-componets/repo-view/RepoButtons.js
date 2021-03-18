import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

function RepoButtons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row'}}>
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: "warp" }} >
        <IconButton aria-label="import-export-icon">
          <ImportExportIcon fontSize="large" />
        </IconButton>
        <h4>Fetch</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: "warp" }} >
      <IconButton>
        <ArrowDownwardIcon fontSize="large" />
      </IconButton>
      <h4 >Fetch</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: "warp" }} >
      <IconButton>
        <ArrowUpwardIcon fontSize="large" />
      </IconButton>
      <h4>Fetch</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: "warp" }} >
      <IconButton>
        <MoveToInboxIcon fontSize="large" />
      </IconButton>
      <h4>Fetch</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: "warp" }} >
      <IconButton>
        <OpenInBrowserIcon fontSize="large" />
      </IconButton>
      <h4>Fetch</h4>
      </div>
    </div>
  );
}

export default RepoButtons;
