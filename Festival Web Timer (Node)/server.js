const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let timerDuration = 0;
let timerStartTime = null;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New Connection');

  if (timerStartTime !== null) {
    socket.emit('timer_state', {
      duration: timerDuration,
      startTime: timerStartTime
    });
  }

  socket.on('start_timer', (data) => {
    timerDuration = data.duration;
    timerStartTime = Date.now();
    io.emit('timer_state', {
      duration: timerDuration,
      startTime: timerStartTime
    });
  });

  socket.on('stop_timer', () => {
    timerDuration = 0;
    timerStartTime = null;
    io.emit('timer_state', {
      duration: 0,
      startTime: null
    });
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
