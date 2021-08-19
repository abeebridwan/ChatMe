const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

//ejs view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

//home route
app.get('/', (_, res) => {
  res.render('index', { rooms: rooms })
})

//room route
app.get('/:room', (req, res) => {
  //if room doesn't exist, go to home page
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

//room creation route with post and redirecting 
app.post('/room', (req, res) => {
  //if room already exist, go to home page
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  //send message that new room was created to update their index pages
  io.emit('room-created', req.body.room)
})

/* socket.io connection */
io.on('connection', socket => {
  //new user's name broadcast to all other users (broadcast) but the sender(server)
  socket.on('new-user', (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.broadcast.to(room).emit('user-connected', name)
  })
  //chat message broadcast to all other users (broadcast) but the sender(server)
  socket.on('send-chat-message', (room, message) => {
    socket.broadcast.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  //on user disconnected 
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.broadcast.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id]
    });;
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names
  }, [])
}

server.listen(port, () => console.log(`> Read on http://localhost:${port}`))