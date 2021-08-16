const socket = io('http://localhost:3000');
const form = document.getElementById("send-container");
const input = document.getElementById("message-input");
const messageContainer = document.getElementById('message-container');

socket.on('chat-message', data => {
  appendMessage(data)
})

form.addEventListener('submit', e => {
  e.preventDefault();
  const message = input.value;
  socket.emit('send-chat-message', message);
  input.value = '';
})

function appendMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.innerText = message;
  messageContainer.append(messageDiv)
}