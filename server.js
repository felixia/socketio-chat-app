var PORT = process.env.PORT || 3000;
var express = require('express'),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('User connected via socket.io!!!');

    socket.on('message', function (message) {
        console.log('Message Received: ' + message.text);
       // io.emit();
        socket.broadcast.emit('message', message)
    });

    socket.emit('message', {
        text: 'Welcome to chat App'
    });
});


http.listen(PORT, function () {
    console.log('Sever running on port ' + PORT);
});



