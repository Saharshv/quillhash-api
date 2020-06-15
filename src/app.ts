import express from 'express';
import { EventEmitter } from 'events';
const userRoute = require('./routes/user');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
export const emitter = new EventEmitter();

app.use(express.json());

// USER ROUTE
app.use('/user', userRoute);

// Socket io connection
io.on('connection', (socket: any) => {
    console.log('a user connected');
    emitter.on('like', (data) => {
        socket.emit('imageLiked', data)
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

http.listen(process.env.PORT, () => {
    console.log('Server is running...');
  });

