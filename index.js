var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const WebSocket = require('ws');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


const socket = new WebSocket('wss://ws.finnhub.io?token=bptcr57rh5r8muvsi9cg');
// const socket = io('wss://ws.finnhub.io?token=bptcr57rh5r8muvsi9cg')
// Connection opened -> Subscribe
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
    socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
    socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
});

// Listen for messages
let newMessage;
socket.addEventListener('message', function (event) {
  io.on('connection', function(socket2){
    socket2.on('chat message', function(msg){
      io.emit('chat message', newMessage);
    });
  });
    console.log('Message from server ', event.data);
    newMessage = event.data;
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
