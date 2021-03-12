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

const getRepoDir = exports.getRepoDir = (currentWindow) => {
  //print();
    const folderPath = dialog.showOpenDialogSync(currentWindow, {
        properties: ["openDirectory"]
    });
    
    let repo = simpleGit(folderPath[0]);
    repo.checkIsRepo().then(isRepo => {
      console.log(isRepo)
      if(isRepo){
        openFile(folderPath[0], currentWindow); 
      }else{
        const responseOptions = {
          type: 'question',
          buttons: ['Cancel', 'Yes, please', 'No, thanks'],
          defaultId: 2,
          title: 'Question',
          message: 'This is not a repository. Do you want to try again?'
        };
        const response = dialog.showMessageBox(responseOptions);
      }
    })
};

const openFile = (folderPath, currentWindow) =>{
  currentWindow.webContents.send('repo-opened', folderPath);
  console.log(folderPath)
};

