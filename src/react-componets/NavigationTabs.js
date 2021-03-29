import React, { useState, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";
import NewTab from "./main_window/NewTabPage";
import MainRepoView from "./repo-view/MainRepoView";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GitNavigation from './git-docs/GitNavigation'
const { ipcRenderer } = require("electron");
const path = require("path");
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'relative',
  },
}));

export default function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [openTabs, setTabs] = useState([]);
  const [openDocs, setOpenDocs] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    //on load get previously opened tabs
    if (localStorage.getItem("openTabs") !== null) {
      setTabs(JSON.parse(localStorage.getItem("openTabs")));
    }
  }, []);

  useLayoutEffect(() => {
    setValue(0);
  }, [openTabs]);

  useEffect(() => {
    localStorage.setItem("openTabs", JSON.stringify(openTabs));
    console.log('refresh');
  }, [openTabs, openDocs]);

  let closeTabs = (repoName) => {
    if(repoName == 'Git Documents'){
      setOpenDocs(false);
    }
    let newarray  = openTabs.filter(function(tab){ return tab.name != repoName});
    setTabs(newarray);
    setValue(0); // RESET TO NEWTAB AFTER DELETE
  }

  
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Repo Management" {...a11yProps(0)} />
          {openTabs.map((tab, index) => (
            <Tab id={tab.name} label={
              <span>
                {tab.name}
              <IconButton size="small" onClick={() => closeTabs(tab.name)}>
              <CloseIcon />
            </IconButton>
            </span>} key={index} {...a11yProps(index)}  />
          ))}
          {openDocs? <Tab id="opendocs" label={<span> Git Documents
                        <IconButton size="small" onClick={() => closeTabs('Git Documents')}>
                        <CloseIcon />
                        </IconButton>
                         </span>} 
                    {...a11yProps(openTabs.length + 1)}/>
                    : <div></div> }
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <h1>Open or create a repo from here</h1>
        <div style={{display:"flex", flex: 1, padding:10}}>
        <NewTab setTabs={setTabs} openTabs={openTabs} />
        <Button style={{marginLeft:10}} variant="contained" color="primary" onClick={() => {setOpenDocs(!openDocs)}} >
                Open git docs
        </Button>
        </div>
      </TabPanel>
      {openTabs.map((tabpanel, index) => (
        <TabPanel key={index} value={value} index={index + 1}>
          <MainRepoView repoPath={tabpanel.path} />
        </TabPanel>
      ))}
      {openDocs?
      <TabPanel value={value} index={openTabs.length + 1}>
      <GitNavigation/>
    </TabPanel>: <div></div> }
    </div>
  );
}
