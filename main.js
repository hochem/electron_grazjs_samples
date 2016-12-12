const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Module for auto updating
const {autoUpdater} = electron;
const {dialog} = electron;

const os = require('os');
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const isDevelopment = process.env.NODE_ENV === 'development';
const initUpdater = () => {

let updateFeed = 'http://electron.hochenwarter.com/updates/latest';
const UPDATE_SERVER_HOST = 'electron.hochenwarter.com';
const platform = os.platform();
const version = app.getVersion()

  // Don't use auto-updater if we are in development 
  if (!isDevelopment) {

    if (os.platform() === 'darwin') {
        updateFeed = 'http://electron.hochenwarter.com/update/darwin'; 
    } else if (os.platform() === 'win32') {
        updateFeed = 'http://electron.hochenwarter.com/update/win' + (os.arch() === 'x64' ? '64' : '32');
    }

    autoUpdater.setFeedURL(`http://${UPDATE_SERVER_HOST}/update/${platform}_${os.arch()}/${version}`);

    autoUpdater.addListener("update-available", (event) => {
      dialog.showMessageBox({ message: "A new update is available", buttons: ["OK"] });
    });

    autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
      dialog.showMessageBox({ message: `Version ${releaseName} is downloaded and will be automatically installed on Quit`, buttons: ["OK"] });
      autoUpdater.quitAndInstall();
      return true;
    });

    autoUpdater.addListener("error", (error) => {
      dialog.showMessageBox({ message: error.toString(), buttons: ["OK"] });
    });

    autoUpdater.addListener("checking-for-update", (event) => {
      dialog.showMessageBox({ message: "Checking for update", buttons: ["OK"] });
    });

    autoUpdater.addListener("update-not-available", function() {
      dialog.showMessageBox({ message: "Update not available", buttons: ["OK"] });
    });

    // const appVersion = require('./package.json').version;
    // const feedURL = updateFeed + '?v=' + appVersion;
    dialog.showMessageBox({ message: `http://${UPDATE_SERVER_HOST}/update/${platform}_${os.arch()}/${version}`, buttons: ["OK"] });
  }
};





function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  if (!isDevelopment) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      initUpdater();
      autoUpdater.checkForUpdates();
    });
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
