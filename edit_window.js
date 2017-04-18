const {ipcRenderer} = require('electron');

ipcRenderer.on('open-edit-window-reply', (event, arg) => {
  console.log(arg);

  $('#content').html(`
      <h1>${arg.numero}</h1>
      <ul>
        <li></li>
      </ul>
    `);
});
