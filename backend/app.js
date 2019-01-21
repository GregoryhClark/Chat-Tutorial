var express = require('express');
var socket = require('socket.io');

var app = express();


server = app.listen(5000, function(){
    console.log('server is running on port 5000')
});
io = socket(server);

io.on('connection', (socket) => {
    // GENERAL SOCKETS
    socket.on('SEND_MESSAGE', function(data){
        // io.emit('RECEIVE_MESSAGE', data);
        io.to(data.room).emit('RECEIVE_MESSAGE', data);

    })


    //Start added from other project
    socket.on('user is typing', data => {
        socket.broadcast.emit('user is typing', data)
    })
    socket.on('user not typing', data => {
        socket.broadcast.emit('user not typing', data)
    })

    //ROOMS SOCKETS
    socket.on('join room', data => {
        
        socket.join(data.room)
        // console.log('joined room ', data.room)
        io.to(data.room).emit('room joined', data)
    })
    socket.on('blast message to room', data => {
        // console.log('room socket hit: blast', data.room)
        io.to(data.room).emit('generate room response', data)
    })


     //End added from other project
});

