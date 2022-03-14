const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const name = prompt('What is your name?');
appendMessage('You joined');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    messageInput.value = '';
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
