const electron = require('electron');
const {app, BrowserWindow} = electron;
const {ipcMain} = require('electron');
const Boards = require('./models/db.js');

let win

function createWindow() {
  win = new BrowserWindow({
    show: false,
    width:1024,
    height: 600,
  });
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();

  win.webContents.on('did-finish-load', () => {
    win.show();
    win.focus();
  });

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
  //addWindow.webContents.openDevTools();
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
    addWindow.close();
    win.reload();
  });
})

//edit-window
let editWindow = null;
ipcMain.on('open-edit-window', (event, arg) => {
  //find board
  Boards.findOne({_id:arg}, (err, board) => {
    if (err) {
      return;
    }

    if (editWindow) {
      return;
    }
    editWindow = new BrowserWindow({
      width: 800,
      height: 600,
      //parent: win,
      //modal: true
    });

    editWindow.loadURL(`file://${__dirname}/edit_window.html`);
    editWindow.webContents.openDevTools();
    editWindow.webContents.on('did-finish-load', () => {
      editWindow.webContents.send('open-edit-window-reply', board);
    });

    editWindow.on('closed', () => {
      editWindow = null;
    });
  });
});
