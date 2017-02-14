var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function () {
    console.log('Successfully connected to socket.io server!');
    socket.emit('joinRoom', {
        name:name,
        room:room
    });
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);
    console.log('New message:');
    console.log(message.text);

    jQuery('.messages').append('<p><strong> '+message.name +' '+ momentTimestamp.local().format('h:mm a')+': </strong>'+' ' + message.text +'</p>');
});

//handle submitting of new message
var $form = jQuery('#message-form');
$form.on('submit', function (event) {
    event.preventDefault();

    socket.emit('message', {
        name:name,
        text: $form.find('input[name=message]').val()
    });
    $form.find('input[name=message]').val('');
});

