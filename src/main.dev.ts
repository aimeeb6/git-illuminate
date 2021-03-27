/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { GitRepo } from "./GitRepo";
const { ipcMain } = require('electron');
const simpleGit = require('simple-git');
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      enableBlinkFeatures: "CSSColorSchemeUARendering"
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
  let git = new GitRepo("/Users/aimeeboyle/Documents/UniversityWork/3rd_Year/Project/git-illuminate");
  // git.setRepo().then(() => {git.getCommits().then((commits) => {console.log(commits)} )})
  //git.setRepo().then(() => {git.getRepoRefences().then((refdir) => {console.log(refdir['3828c25d46248d0cc8b25afb4905d26182ebf153'].length)})})
 //git.setRepo().then(() => {git.refeshRepo().then((commits) =>  {console.log(commits)})});
 git.setRepo().then(() => {git.getRepoStatus().then((status) => {console.log(status)})});
});



let getRepoDir = (currentWindow: any, isCurrentlyARepo : Boolean) => {
  //print();
    const folderPath: String[] = dialog.showOpenDialogSync(currentWindow, {
        properties: ["openDirectory"]
    });
    let repo = simpleGit(folderPath[0]);
    repo.checkIsRepo().then((isRepo: Boolean) => {
      if(isRepo && isCurrentlyARepo){
        //is a repo and you want it to be
        openFile(folderPath[0], currentWindow) 
      }else if(isRepo && !isCurrentlyARepo){
        //its a repo and you don't want it to be
       tryAgainDialogBox('This directory is already a repo. Would you like to try again?', currentWindow, isCurrentlyARepo);
       return;
      }else if(!isRepo && isCurrentlyARepo){
        //not a repo and you want it to be
      tryAgainDialogBox('This directory is already not a repo. Would you like to try again?', currentWindow, isCurrentlyARepo);
      return;
      }else if(!isRepo && !isCurrentlyARepo){
        //it's not a repo and you don't want it to be
          openFile(folderPath[0], currentWindow)
      }

    });
};

const openFile = (folderPath: String, currentWindow) =>{
  currentWindow.webContents.send('repo-opened', folderPath);
};

const tryAgainDialogBox = (message:String, currentWindow, isCurrentlyARepo: Boolean) => {
  const responseOptions = {
    type: 'question',
    buttons: ['No', 'Yes'],
    defaultId: 1,
    title: 'Question',
    message: message,
  };
  dialog.showMessageBox(responseOptions).then(response => {
    if(response.response == 1){
      getRepoDir(currentWindow, isCurrentlyARepo);
    }
  })

}

ipcMain.on('openFile', (event, arg) => {
  getRepoDir(mainWindow, arg);
});
