import { io } from 'socket.io-client';
import chalk from 'chalk';

const jwtAdminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC//I6OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc4MjM5ODcxLCJleHAiOjE3NzgzMjYyNzF9.KW3b5xkSo4j2zZ5dHxPXCT13Nwrrcwq9GuoQy7GQ_5w';

const socket = io('http://localhost:3000/chat', {
  transports: ['websocket'],
  auth: {
    token: jwtAdminToken,
  },
});

socket.on('connect', () => {
  setTimeout(() => {
    socket.emit('message:send', {
      message: 'Hello, this is a test message from the client!',
    });
  }, 1000);
});

socket.on('server:error', (data) => {
  console.error(chalk.red(data));
});

socket.on('server:log', (data) => {
  console.log(chalk.yellow(data));
});

socket.on('server:success', (data) => {
  console.log(chalk.green(data));
});

socket.on('message:send', (data) => {
  console.log(chalk.blue(`<${data.sender}> ${data.message}`));
});

socket.on('connect_error', console.error);
