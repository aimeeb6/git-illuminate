import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GitViewer from './repo-view/gitview';
import NewTab from './main_window/NewTabPage'
const { ipcRenderer } = require("electron");
const path = require("path");
const simpleGit = require('simple-git');




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
        <Typography component={'span'}>{children}</Typography>
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
}
)
);

export default function ScrollableTabsButtonAuto() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [openTabs, setTabs] = useState([]);

    const handleChange = (event, newValue) => {
    setValue(newValue);
};

    useEffect(() => {
        //on load get previously opened tabs
        if (localStorage.getItem('openTabs') !== null){
            setTabs(JSON.parse(localStorage.getItem('openTabs')))
        }
    }, [])

    useEffect(() =>  {
        localStorage.setItem('openTabs', JSON.stringify(openTabs));
    }, [openTabs])

    ipcRenderer.on("repo-opened", (event, folderPath) => {
        const options = {
            baseDir: folderPath,
            binary: 'git',
            maxConcurrentProcesses: 6,
        };
        //contact with mainprocess open repo 
        let repo = simpleGit(options);
        console.log(repo.checkIsRepo().then(isRepo => {
            console.log(isRepo)
        }));
        if(repo.checkIsRepo()){
            console.log('i got');
            var newRepo = {
                path: folderPath, 
                index: 1,
                repoName: 'repoName'
            }
            setTabs(newRepo)
    
        }else{
            alert('This is not a repository please try again');
        }
    });

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
        aria-label="scrollable auto tabs example">

        <Tab label="New Tab" {...a11yProps(0)} />
        <Tab label={"Repo {closebtn}"} {...a11yProps(1)} />
    </Tabs>
    </AppBar>
    <TabPanel value={value} index={0}>
        <NewTab />
    </TabPanel>
    <TabPanel value={value} index={1}>
        <GitViewer/>
    </TabPanel>
</div>
);
}


