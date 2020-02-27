const express = require('express');
const path = require('path');
const socket = require('socket.io');


const app = express();


const messages = [];
const users = [];

app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
  });

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const deletedUser = users.find(user => user.id == socket.id);
    users.splice(users.indexOf(deletedUser), 1);
    console.log('I deleted ' + deletedUser.login);
    socket.broadcast.emit('message', ({author: 'Chat Bot', content: deletedUser.login + ' has left the conversation!'}));
  });
  console.log('I\'ve added a listener on message event \n');
  socket.on('join', (user) => {
    user.id = socket.id;
    console.log('I added user ' + user.login);
    users.push(user);
    socket.broadcast.emit('message', ({author: 'Chat Bot', content: user.login + ' has joined the conversation!'}));
  });
});

