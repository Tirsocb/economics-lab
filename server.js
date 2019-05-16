// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

const game = require('./Gamelogic/Company');
let playerMoves = 0

app.set('port', 5000);
app.use('/', express.static(__dirname + '/'));

// Starts the server.
server.listen(5000, () => {
  console.log('Starting server on port 5000 \n');
});

io.on('connect', (socket) => {
  if (game.default.players.length < 2) {
    console.log(`Nuevo jugador, ${socket.id}`);
    socket.emit('playerInfo', {'player': game.default.addNewPlayer(socket.id)});

    if (game.default.players.length === 2) {
      io.emit('play', {'start': true, 'wait': false})
    }
  } else {
    console.log(`Lobby está lleno, ${socket.id} se quedó afuera.`);
    socket.emit('fullLobby', 'Juego está lleno.');
  }
  
  updateInfo();

  socket.on('disconnect', () => {
    removePlayer(socket.id);
  })

  socket.on('submit', (data) => {
    playerMoves = (playerMoves + 1) % 2    
    let player = game.default.sellShares(data.sell, data.id, data.sellTot);
    player = game.default.buyShares(data.buy, data.id, data.total);

    socket.emit('playerInfo', {'player': player});
    updateInfo();
    
    if (playerMoves === 1) {
      socket.emit('play', {'start': false, 'wait': true})
    }else {
      io.emit('play', {'start': true, 'wait': false})
    }
  })
});

function updateInfo(){
  io.emit('updateInfo', {
    'companies': game.default.companies
  });
}

function removePlayer (id) {
  console.log(`Jugador desconectado, ${id}`);
  game.default.removePlayer(id)
}
