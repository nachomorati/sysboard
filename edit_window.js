const {ipcRenderer} = require('electron');

ipcRenderer.on('open-edit-window-reply', (event, arg) => {
  console.log('Desde Renderer');
  console.log(arg);
});
