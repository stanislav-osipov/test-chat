var wss = new require('ws');

var clients = {};

var webSocketServer = new wss.Server({
  port: 3000
});

webSocketServer.on('connection', function(webSocket) {
  var id = (+new Date()).toString(36);
  clients[id] = webSocket;

  console.log('+1: ' + id);

  webSocket.on('message', function(message) {
    for (var key in clients) {
      clients[key].send(message);
    }
  });

  webSocket.on('close', function() {
    delete clients[id];
    console.log('-1:' + id);
  });
});