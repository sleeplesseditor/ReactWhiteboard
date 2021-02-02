const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket)=> {
    console.log('User Connected');

    socket.on('canvas-data', (data)=> {
        socket.broadcast.emit('canvas-data', data);
    });
})

const server_port = process.env.YOUR_PORT || process.env.PORT || 5000;

http.listen(server_port, () => {
    console.log("Server active on Port "+ server_port);
});