const { formatUrl } = require('url');
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== "production";
const simpleGit = require('simple-git');
//import { print } from "./repo.js";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow(
    {
      show: false,
      webPreferences: 
      {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      title: 'Git Illumniate'
    }
  )

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
    
  }

  window.once('ready-to-show', () => {
    window.show();
  });

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})
// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

const getRepoDir = exports.getRepoDir = (currentWindow, isCurrentlyARepo) => {
  //print();
    const folderPath = dialog.showOpenDialogSync(currentWindow, {
        properties: ["openDirectory"]
    });
    let repo = simpleGit(folderPath[0]);
    repo.log((err, log) => console.log(JSON.stringify(log)))
    console.log('woo');
    repo.checkIsRepo().then(isRepo => {
      if(isRepo && isCurrentlyARepo){
        //is a repo and you want it to be
        openFile(folderPath[0], currentWindow) 
      }else if(isRepo && !isCurrentlyARepo){
        //its a repo and you don't want it to be
       tryAgainDialogBox('This direactory is already a repo. Would you like to try again?', currentWindow, isCurrentlyARepo)
      }else if(!isRepo && isCurrentlyARepo){
        //not a repo and you want it to be
      tryAgainDialogBox('This direactory is already not a repo. Would you like to try again?', currentWindow, isCurrentlyARepo)
        if(response == 'yes'){
          getRepoDir(currentWindow, isCurrentlyARepo);
        }

      }else if(!isRepo && !isCurrentlyARepo){
        //it's not a repo and you don't want it to be
          openFile(folderPath[0], currentWindow)
      }

    });
};

const openFile = (folderPath, currentWindow) =>{
  currentWindow.webContents.send('repo-opened', folderPath);
};

const tryAgainDialogBox = (message, currentWindow, isCurrentlyARepo) => {
  const responseOptions = {
    type: 'question',
    buttons: ['No', 'Yes'],
    defaultId: 1,
    title: 'Question',
    message: message,
  };
  const response = dialog.showMessageBox(responseOptions).then(response => {
    if(response.response == 1){
      getRepoDir(currentWindow, isCurrentlyARepo);
    }
  })


}