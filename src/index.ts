import { app, BrowserWindow, ipcMain, shell, Menu, MenuItem } from 'electron';
import { exec } from 'child_process';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });


  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('launch', (event, args: string[]) => {
  // #TODO: Do we want to support lots of spaces in arguments?
  // Probably, right?
  const launchString = args.join(' ').trim().replace(/\s{2,}/g, ' ');
  
  if (process.platform === "darwin") {
    // Not designed for Mac, but want to build and test.
    console.log(`Launch => ${launchString}`);
    return;
  }

  // #TODO: Provide support for launching scripts in a desired shell.
  console.log(`exec(${launchString})`);
  const child = exec(launchString);

  // #TODO: Consider maintaining a reference to the process to quit later if desired.
  child.unref();

});

ipcMain.on('updateTitle', (event, arg) => {
  BrowserWindow.getAllWindows()[0].setTitle(`${arg} | Launcher`);
})
