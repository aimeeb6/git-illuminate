/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import ScrollableTabsButtonAuto from './react-componets/NavigationTabs'
import AppTheme from './react-componets/AppTheme';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

const { Gitgraph } = require('@gitgraph/react');

function App() {
  return (
    
    <div>
    <ThemeProvider theme={AppTheme}>
    <CssBaseline />
      <ScrollableTabsButtonAuto />
    </ThemeProvider>
  </div>
  );
}

export default App;
