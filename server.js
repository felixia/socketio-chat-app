var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express'),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//send current users to provided sockets
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if(typeof info === 'undefined'){
        return;
    }
    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];

        if(info.room === userInfo.room){
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name:'System',
        text: 'Current Users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function (socket) {
    console.log('User connected via socket.io!!!');

    socket.on('disconnect', function () {
        if(typeof clientInfo[socket.id] !== 'undefined'){
            socket.leave(clientInfo[socket.id].room);
            io.to(clientInfo[socket.id].room).emit('message', {
                name: 'System',
                text: clientInfo[socket.id].name + ' has left!',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] =req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined the Room',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message', function (message) {
        console.log('Message Received: ' + message.text);

        if(message.text === '@currentUsers'){
            sendCurrentUsers(socket);
        }else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message);
            //socket.broadcast.emit('message', message)
        }
    });

    socket.emit('message', {
        name:'System',
        text: ' Welcome to Olondea chat App',
        timestamp: moment().valueOf()
    });
});


http.listen(PORT, function () {
    console.log('Sever running on port ' + PORT);
});



