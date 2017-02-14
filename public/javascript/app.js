var socket = io();

socket.on('connect', function () {
    console.log('Successfully connected to socket.io server!');
});

socket.on('message', function (message) {
    console.log('New message:');
    console.log(message.text);

    jQuery('.messages').append('<p>' + message.text +'</p>');
});

//handle submitting of new message
var $form = jQuery('#message-form');
$form.on('submit', function (event) {
    event.preventDefault();

    socket.emit('message', {
        text: $form.find('input[name=message]').val()
    });
    $form.find('input[name=message]').val('');
});

