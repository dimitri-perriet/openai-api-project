import express from 'express';
import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);


import usersRouter from './routes/users.js';
import gamesControlRouter from './routes/gamescontrol.js';
import characterRouter from './routes/character.js';
import chatRouter from './routes/chatAPI.js';
import convRouter from './routes/conversation.js';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', usersRouter)
app.use('/api/games', gamesControlRouter);
app.use('/api/characters', characterRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', convRouter);

server.listen(3000, function() {
    console.log('Server started on port 3000');
});


app.use(express.urlencoded({ extended: true }));

