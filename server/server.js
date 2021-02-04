const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

io.on('connection', (socket) => {
    console.log('User Connected');

    socket.on('canvas-data', (data) => {
        socket.broadcast.emit('canvas-data', data);
    });

    socket.on('canvas-clear', (data) => {
        socket.broadcast.emit('canvas-clear', data)
    });

    socket.on('canvas-eraser', (data) => {
        socket.broadcast.emit('canvas-eraser', data)
    });
})

const server_port = process.env.YOUR_PORT || process.env.PORT || 5000;

http.listen(server_port, () => {
    console.log("Server Active on Port "+ server_port);
});