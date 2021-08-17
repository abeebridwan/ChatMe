const socket = io('http://localhost:3000');
const form = document.getElementById("send-container");
const input = document.getElementById("message-input");
const messageContainer = document.getElementById('message-container');
const roomToJoin = document.getElementById('room');


if (messageContainer != null) {
  const yourName = prompt('What is your name?');
  appendMessage('You joined');
  socket.emit('new-user', yourName)

  //on form submitted, value emitted to the server
  form.addEventListener('submit', e => {
    e.preventDefault();
    const message = input.value;
    socket.emit('send-chat-message', message);
    input.value = '';
  })

}

socket.on('room-created', room => {
  const roomEle = document.createElement('div');
  roomEle.innerText = room;
  const roomLink = document.createElement("a");
  roomLink.href = `/${room}`;
  roomLink.innerText = 'Join';
  roomToJoin.append(roomEle);
  roomToJoin.append(roomLink);
})

//for new user connection
socket.on('user-connected', data => {
  appendMessage(`${data} connected`)
})

// on user disconnected
socket.on('user-disconnected', data => {
  appendMessage(`${data} disconnected`)
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


