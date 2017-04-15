const {ipcRenderer} = require('electron');
const Board = require('./models/db.js');

//having at least one doc in DB
Board.findOne({}, (err, doc) => {
  if (err) {
    return console.log(err);
  }
  if (doc == null) {
    Board.insert({nombre: 'test'}, (err, newDoc) => {
      if (err) {
        return console.log(err);
      }
      console.log('inserting test document...');
      console.log(newDoc);
    })
  }
})

function addChild(el, content) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(content));
  el.appendChild(td);
  return el;
}

module.exports.getAllBoards = function () {
  Board.find({}, (err, boards) => {
    if (err) {
      return console.log(err);
    }
    boards.forEach(board => {
      //console.log(board);
      var tr = document.createElement('tr');
      addChild(tr, board.numero)
      addChild(tr, board.alimentaA)
      addChild(tr, board.alimentadoPor)
      addChild(tr, board.archflash)
      addChild(tr, board.cortocircuito)
      document.getElementById('tbody').appendChild(tr)
    })
  })
}

//open the "add-board-window"
var btn_open_add_win = document.getElementById('agregar');
btn_open_add_win.addEventListener('click', () => {
  ipcRenderer.send('open-add-window');
}, false);
