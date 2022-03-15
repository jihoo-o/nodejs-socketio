const socket = io('http://localhost:3000');

const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

if (messageForm != null) {
    const name = prompt('What is your name?');
    appendMessage('You joined');
    socket.emit('new-user', roomName, name);

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        appendMessage(`You: ${message}`);
        socket.emit('send-chat-message', roomName, message);
        messageInput.value = '';
    });
}

// 생성된 채팅방을 모든 사용자들의 화면에 동적으로 보여주기
socket.on('room-created', (room) => {
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'join';
    roomContainer.appendChild(roomElement);
    roomContainer.appendChild(roomLink);
});

socket.on('chat-message', ({ message, name }) => {
    appendMessage(`${name}: ${message}`);
});

socket.on('user-connected', (name) => {
    appendMessage(`${name} connected`);
});

socket.on('user-disconnected', (name) => {
    appendMessage(`${name} disconnected`);
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
