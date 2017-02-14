var socket = io();

socket.on('connect', function () {
    console.log('Successfully connected to socket.io server!');
});

