const {ipcRenderer} = require('electron');

var addBoardForm = document.getElementById('add-board-form');
addBoardForm.addEventListener('submit', (event) => {
  event.preventDefault();
  var data = {
    numero: document.getElementById('numero').value,
    alimentaA: document.getElementById('alimentaA').value.replace(/ /g, "").split(','),
    alimentadoPor: document.getElementById('alimentadoPor').value.replace(/ /g, "").split(':'),
    archflash: document.getElementById('archflash').checked ? true : false,
    cortocircuito: document.getElementById('cortocircuito').checked ? true : false,
    contrafrente: document.getElementById('contrafrente').checked ? true : false,
    necesitacontrafrente: document.getElementById('necesitacontrafrente').checked ? true : false,
    candado: document.getElementById('candado').checked ? true : false,
    necesitacandado: document.getElementById('necesitacandado').checked ? true : false,
    comentarios: document.getElementById('comentarios').value,
  }
  ipcRenderer.send('save-data', data);
  ipcRenderer.on('save-data-reply', (event, arg) => {
    console.log(arg);
  })
}, false);

let cancelBtn = document.getElementById('cancel');
cancelBtn.addEventListener('click', (event) => {
  ipcRenderer.send('close-add-window');
}, false);
