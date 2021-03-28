import React, {useState, useLayoutEffect} from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';
import {GitIntro} from './GitDocs';
import {ConfigureGit} from './GitDocs'

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

export default function ClippedDrawer() {
    const classes = useStyles();
    const [currentDocument, setCurrentDocument] = useState('What is Git?');

    useLayoutEffect(() => {
      currentDoc();
    }, [currentDocument]);

    let currentDoc = () => {
        if(currentDocument == 'What is Git?'){
            return <GitIntro/>
        }

        if(currentDocument == 'Configure Git'){
          return <ConfigureGit/>
      }


    }
  
    return (
      <div className={classes.root} style={{ height:"100%", maxHeight:"100%", overflow:"auto",}}>>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              {['What is Git?', 'Configure Git', 'Git Repository', 'Staging vs Index'].map((text, index) => (
                <ListItem button key={text} onClick={() => setCurrentDocument(text)}>
                  <ListItemIcon  color="secondary"><DescriptionIcon/></ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <div style={{overflow:"auto",}}>
        <main className={classes.content}>
        <Toolbar />
        {currentDoc()}
      </main>
        </div>
      </div>
    );
  }