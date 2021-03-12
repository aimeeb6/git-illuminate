import React from 'react';
import ReactDOM from 'react-dom';
import NavigationTabs from '../renderer/components/NavigationTabs'
import theme from '../renderer/components/theme'
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
    
export class App extends React.PureComponent {
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
        <CssBaseline />
          <NavigationTabs />
        </ThemeProvider>
      </div>
    );
  }
}
