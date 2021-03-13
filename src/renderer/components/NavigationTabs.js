import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GitViewer from "./repo-view/gitview";
import NewTab from "./main_window/NewTabPage";
const { ipcRenderer } = require("electron");
const path = require("path");
const simpleGit = require("simple-git");

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
  let Tabs = [];
  let TabPanes = [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let createNewTab = (folderPath) => {
    var newRepo = {
      path: folderPath,
      index: 1,
      repoName: "repoName",
    };
    setTabs({
      path: folderPath,
      index: 1,
      repoName: "repoName",
    });
    setTabs([...openTabs, newRepo]);
  };

  useEffect(() => {
    //on load get previously opened tabs
    if (localStorage.getItem("openTabs") !== null) {
      setTabs(JSON.parse(localStorage.getItem("openTabs")));
    }
    var newRepo = {
      path: "aimmee",
      index: 3,
      repoName: "repoName",
    };
    setTabs([newRepo]);

    createTabBar();
  }, []);

  useEffect(() => {
    localStorage.setItem("openTabs", JSON.stringify(openTabs));
    createTabBar();
  }, [openTabs]);

  ipcRenderer.on("repo-opened", (event, folderPath) => {
    createNewTab(folderPath);
  });

  let createTabBar = () => {
    Tabs = [];
    TabPanes = [];
    console.log("reached");
    for (var i = 0; i < openTabs.length; i++) {
      Tabs.push(
        <Tab
          label={openTabs[0].repoName}
          key={openTabs[0].index}
          {...a11yProps(i)}
        />
      );
      TabPanes.push(
        <TabPanel value={openTabs[0].repoName} index={i}>
          <NewTab />
        </TabPanel>
      );
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        {openTabs.map((item) => (
          <Tab key={item.index} label={item.repoName} />
        ))}
        <Tab label="th" {...a11yProps(5)} />
      </AppBar>
      <TabPanel value={value} index={0}>
        <NewTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GitViewer />
      </TabPanel>
      {openTabs.map((item) => (
        <TabPanel key={item.index} value={item.repoName} index={item.index}>
          <NewTab />
          <h1>You've swtiched</h1>
        </TabPanel>
      ))}
    </div>
  );
}
