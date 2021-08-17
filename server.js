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

const rooms = { name: {} };
const users = {};

//home route
app.get('/', (_, res) => {
  res.render('index', { rooms: rooms })
})

//room route
app.get('/:room', (req, res) => {
  res.render('room', { roomName: req.params.room })
})

//room creation route and redirecting
app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    console.log('room existed')
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  //send message that new room was created
})

/* socket.io connection */
io.on('connection', socket => {
  //new user's name broadcast to all other users 
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name)
  })
  //chat message broadcast to all other users
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  //on user disconnected 
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id]
  })
})

server.listen(port, () => console.log(`> Read on http://localhost:${port}`))