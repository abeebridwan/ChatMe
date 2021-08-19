const socket = io('http://localhost:3000');
const form = document.getElementById("send-container");
const input = document.getElementById("message-input");
const messageContainer = document.getElementById('message-container');
const roomToJoin = document.getElementById('room');

/* sending emitters */
if (messageContainer != null) {
  const yourName = prompt('What is your name?');
  appendMessage('You joined');
  socket.emit('new-user', roomName, yourName)

  //on form submitted, value emitted to the server
  form.addEventListener('submit', e => {
    e.preventDefault();
    const message = input.value;
    socket.emit('send-chat-message', roomName, message);
    input.value = '';
  })
}

/* receiving sockets */
//embed new room created to the index page
if (roomToJoin != null) {
  socket.on('room-created', room => {
    const roomEle = document.createElement('div');
    roomEle.innerText = room;
    const roomLink = document.createElement("a");
    roomLink.href = `/${room}`;
    roomLink.innerText = 'Join';
    roomToJoin.append(roomEle);
    roomToJoin.append(roomLink);
  })
}

//for new user connection
socket.on('user-connected', data => {
  appendMessage(`${data} connected`)
})

// on user disconnected
socket.on('user-disconnected', data => {
  if (data !== null) {
    appendMessage(`${data} disconnected`)
  }
})

//chat message
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})


// to append any data or message in to the user interface
function appendMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.innerText = message;
  messageContainer.append(messageDiv)
}


