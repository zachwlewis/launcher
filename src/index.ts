import { app, BrowserWindow, ipcMain, shell, Menu, MenuItem } from 'electron';
import { spawn, spawnSync, execSync, execFileSync } from 'child_process';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 400,
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

ipcMain.on('spawn', (event, args: string[]) => {
  if (process.platform === "darwin") {
    // Not designed for Mac, but want to build and test.
    console.log(`Launch => ${args.join(' ')}`);
    return;
  }
  
  let path = args[0];
  let parameters = args.slice(1);
  
  console.log("Launching process:", path, parameters);

  const subprocess = spawn(path, parameters, {
    detached: true,
    stdio: 'inherit'
  });


});

ipcMain.on('updateTitle', (event, arg) => {
  BrowserWindow.getAllWindows()[0].setTitle(`${arg} | Launcher`);
})
