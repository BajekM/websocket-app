const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput= document.getElementById('message-content');

const socket = io();
let userName;

socket.on('message', ({ author, content }) => addMessage(author, content))

const login = (e) => {
    e.preventDefault();
    if(userNameInput.value) {
        userName = userNameInput.value
        socket.emit('join', ({login: userName}))
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    }else {
        alert('Something went wrong');
    }
}

const sendMessage = (e) => {
    e.preventDefault();
    if(messageContentInput.value) {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContentInput.value })
        messageContentInput.value = '';
    }else {
        alert('Something went wrong');
    }
}

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    if(author === 'Chat Bot') message.classList.add('message_bot');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  }

loginForm.addEventListener('submit', (e) => login(e));
addMessageForm.addEventListener('submit', (e) => sendMessage(e));
