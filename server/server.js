const express = require('express');
const socket = require('socket.io');
const PORT = 5000;
const app = express();
app.use(express)
// server = app.listen(5000, function(){
//     console.log('server is running on port 5000')
// });
const io = socket(app.listen(PORT, () => console.log(`listening on port ${PORT}`)));
// io = socket(server);

io.on('connection', (socket) => {
    // GENERAL SOCKETS
    // socket.on('SEND_MESSAGE', function(data){
    //     // io.emit('RECEIVE_MESSAGE', data);
    //     io.to(data.room).emit('RECEIVE_MESSAGE', data);
    // })
    // socket.on('emit message to general', data => {
    //     console.log('general socket hit: emit')
    //     socket.emit('generate general response', data)
    // })
    // socket.on('broadcast message to general', data => {
    //     console.log('general socket hit: broadcast')
    //     socket.broadcast.emit('generate general response', data);
    //   });
    // socket.on('blast message to general', data => {
    //     console.log('general socket hit: blast')
    //     io.sockets.emit('generate general response', data);
    // });
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
    socket.on("leave room", data => {
        socket.leave(data.room)

    })

    socket.on('emit message to room', data => {
        console.log('room socket hit: emit ', data.room)
        socket.emit('generate room response', data)
    })

    socket.on('broadcast message to room', data => {
        // console.log('room socket hit: broadcast ', data.room)
        socket.to(data.room).broadcast.emit('generate room response', data)
    })
    socket.on('blast message to room', data => {
        // console.log('room socket hit: blast', data.room)
        io.to(data.room).emit('generate room response', data)
    })
});

