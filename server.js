const io = require('socket.io')(3000, {
  cors: {
    origin: "*",
  },
});
const users = {};

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