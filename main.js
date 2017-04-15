const electron = require('electron');
const {app, BrowserWindow} = electron;
const {ipcMain} = require('electron');
const Boards = require('./models/db.js');

let win

function createWindow() {
  win = new BrowserWindow({width:800, height:600});
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if(win === null) {
    createWindow
  }
})

ipcMain.on('get-all-boards-message', (event, arg) => {
  console.log(arg);

  event.sender.send('get-all-boards-reply', arg)
})

//create add-window
let addWindow = null;
ipcMain.on('open-add-window', () => {
  if (addWindow) {
    return;
  }
  addWindow = new BrowserWindow({
    parent: win,
    modal: true,
    frame: false,
    width: 600,
    height: 400,
    resizable: true
  });

  addWindow.loadURL(`file://${__dirname}/add_window.html`);
  addWindow.webContents.openDevTools();
  addWindow.on('closed', () => {
    addWindow = null;
  });
});

ipcMain.on('close-add-window', () => {
  addWindow.close();
})

//save data
ipcMain.on('save-data', (event, arg) => {
  console.log(arg);
  Boards.insert(arg, (err, newDoc) => {
    if (err) {
      return console.log(err);
    }
    event.sender.send('save-data-reply', newDoc);
  });
})
