const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// configuration
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get('/', (req, res) => {
    res.render('index', { rooms });
});

app.post('/room', (req, res) => {
    console.log(req.body);
    if (rooms[req.body.room] != null) {
        return res.redirect('/');
    }
    rooms[req.body.room] = { users: {} };
    res.redirect(req.body.room);
    // Send message new room was created
    io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/');
    }
    res.render('room', { roomName: req.params.room });
});

server.listen(3000);

const users = {};

io.on('connection', (socket) => {
    console.log(`connection: ${socket.id}`);

    socket.on('new-user', (room, name) => {
        socket.join(room);
        rooms[room].users[socket.id] = name;
        socket.to(room).broadcast.emit('user-connected', name);
    });

    socket.on('send-chat-message', (room, message) => {
        socket.to(room).broadcast.emit('chat-message', {
            message,
            name: rooms[room].users[socket.id],
        });
    });

    socket.on('disconnect', (name) => {
        // 아래의 socket argument는 뭐지?
        console.log(`users: ${users}`);
        console.log(`disconnection: ${socket.id}`);
        getUserRooms(socket).forEach((room) => {
            socket
                .to(room)
                .broadcast.emit(
                    'user-disconnected',
                    rooms[room].users[socket.id]
                );
            delete rooms[room].users[socket.id];
        });
    });
});

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name);
        return names;
    }, []);
}
