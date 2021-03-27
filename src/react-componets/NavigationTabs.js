import React, { useState, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import NewTab from "./main_window/NewTabPage";
import MainRepoView from "./repo-view/MainRepoView";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
}));

export default function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [openTabs, setTabs] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    //on load get previously opened tabs
    if (localStorage.getItem("openTabs") !== null) {
      setTabs(JSON.parse(localStorage.getItem("openTabs")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("openTabs", JSON.stringify(openTabs));
  }, [openTabs]);

  ipcRenderer.on("repo-opened", (event, folderPath) => {
    if(openTabs.forEach((tab) => { tab.path == folderPath})){
      alert("You already have that repo open!");
      return;
    }else{
      createNewTab(folderPath);
    }
  });

  useLayoutEffect(() => {
    setValue(0);
  }, [openTabs]);

  let createNewTab = (folderPath) => {
    let newRepo = {
      name: folderPath.substring(folderPath.lastIndexOf("/") + 1),
      path: folderPath,
      index: openTabs.length + 1,
    };

    if (!openTabs.some((repo) => repo.path == newRepo.path)) {
      setTabs([...openTabs, newRepo]);
    }
  };

  let closeTabs = (e) => {
    let repoName = e.target.parentElement.parentElement.parentElement.innerText.toLowerCase();
    let newarray  = openTabs.filter(function(tab){ return tab.name != repoName});
    setTabs(newarray);
    console.log(e.target.parentElement.parentElement.parentElement.innerText.toLowerCase());
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
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
          {openTabs.map((tab) => (
            <Tab id={tab.name} label={
              <span>
                {tab.name}
              <IconButton size="small" onClick={closeTabs}>
              <CloseIcon />
            </IconButton>
            </span>} key={tab.index} {...a11yProps(tab.index)}  />
          ))}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <h1>Open or create a repo from here</h1>
        <div id="graph-container"></div>
        <NewTab/>
      </TabPanel>
      {openTabs.map((tabpanel) => (
        <TabPanel key={tabpanel.index} value={value} index={tabpanel.index}>
          <h3>{tabpanel.name}</h3>
          <MainRepoView repoPath={tabpanel.path} />
        </TabPanel>
      ))}
    </div>
  );
}
