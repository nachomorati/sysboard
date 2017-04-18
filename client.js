const {ipcRenderer} = require('electron');
const Board = require('./models/db.js');

$(document).ready(function() {
  $('#cuadro').html('hola');
})

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
  if (content == true || content == false) {
    let chkbox = document.createElement('input');
    chkbox.type = 'checkbox';
    chkbox.checked = content == true ? true : false;
    chkbox.disabled = true;
    td.appendChild(chkbox);
  } else {
    td.appendChild(document.createTextNode(content));
  }
  el.appendChild(td);
  return el;
}

module.exports.getAllBoards = function () {
  Board.find({}, (err, boards) => {
    if (err) {
      return console.log(err);
    }
    boards = boards.sort((a, b) => {
      let uno = a.numero;
      let dos = b.numero;
      if (uno < dos) {
        return -1;
      }
      if (uno > dos) {
        return 1;
      }
      return 0;
    });
    console.log(boards);
    boards.forEach(board => {
      //console.log(board);
      var tr = document.createElement('tr');
      addChild(tr, board.numero)
      addChild(tr, board.alimentaA)
      addChild(tr, board.alimentadoPor)
      addChild(tr, board.archflash)
      addChild(tr, board.cortocircuito)
      var editLink = document.createElement('button');
      editLink.appendChild(document.createTextNode('Editar'))
      editLink.id = board._id;
      editLink.className = 'edit-link';
      tr.appendChild(editLink);
      document.getElementById('tbody').appendChild(tr)
    })

    //event listener for edit-window
    //open the "edit-window"
    var editLinkBtn = document.getElementsByClassName('edit-link');
    console.log(editLinkBtn);
    Array.from(editLinkBtn).forEach(element => {
      element.addEventListener('click', () => {
        ipcRenderer.send('open-edit-window', element.id);
    });
    }, false);

  })
}

//open the "add-board-window"
var btn_open_add_win = document.getElementById('agregar');
btn_open_add_win.addEventListener('click', () => {
  ipcRenderer.send('open-add-window');
}, false);
