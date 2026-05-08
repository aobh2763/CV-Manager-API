import { io } from 'socket.io-client';
import chalk from 'chalk';
import * as readline from 'readline';
import { handleCommand } from './test.commandhandler';

const tokenIndex = process.argv.indexOf('--token');
const token = tokenIndex !== -1 ? process.argv[tokenIndex + 1] : null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

function print(message: string) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  console.log(message);
  rl.prompt(true);
}

const socket = io('http://localhost:3000/chat', {
  transports: ['websocket'],
  auth: {
    token: token,
  },
});

socket.on('connect', () => {
  setTimeout(() => rl.prompt(), 100);

  console.clear();
});

socket.on('server:error', (data) => {
  print(chalk.redBright(`Error: ${data}`));
});

socket.on('server:log', (data) => {
  print(chalk.yellowBright(data));
});

socket.on('server:response', (data) => {
  print(chalk.white(data));
});

socket.on('server:success', (data) => {
  print(chalk.greenBright(data));
});

socket.on('message:receive', (data) => {
  print(`[${data.id}] <${chalk[data.color](data.sender)}> ${data.message}`);
});

socket.on('message:history', (history) => {
  history.forEach((msg) => {
    print(`[${msg.id}] <${chalk[msg.color](msg.sender)}> ${msg.message}`);
  });
});

socket.on('message:private:received', (data) => {
  print(
    chalk.yellowBright(
      `[${chalk[data.color](data.sender)} -> ${chalk.redBright('me')}] ${chalk.gray(data.message)}`,
    ),
  );
});

socket.on('message:private:sent', (data) => {
  print(
    chalk.yellowBright(
      `[${chalk.redBright('me')} -> ${chalk[data.color](data.sender)}] ${chalk.gray(data.message)}`,
    ),
  );
});

socket.on('message:quote', (data) => {
  print(
    chalk.white(
      chalk.blueBright(
        `> ${data.quotedMsg.message} (by ${data.quotedMsg.sender})`,
      ) + `\n<${chalk[data.color](data.sender)}> ${chalk.gray(data.message)}`,
    ),
  );
});

socket.on('terminate', (data) => {
  readline.clearLine(process.stdout, 0);

  console.error(chalk.redBright('You have been kicked from the server!'));
  console.error(chalk.redBright(`Reason: ${data.reason}`));

  socket.disconnect();
  process.exit(0);
});

rl.on('line', (input) => {
  process.stdout.write('\x1b[1A\x1b[2K');
  setTimeout(() => rl.prompt(), 100);

  const trimmedInput = input.trim();

  if (trimmedInput.length == 0) {
    return;
  }

  if (trimmedInput.startsWith('/')) {
    const [command, ...args] = trimmedInput.substring(1).split(' ');

    const payload = handleCommand(command, args);

    if (payload) {
      socket.emit(payload.argv, payload.args || {});
    }

    return;
  }

  socket.emit('message:send', {
    message: trimmedInput,
  });
});

rl.on('close', () => {
  readline.clearLine(process.stdout, 0);

  console.log(chalk.red('Exiting chat client...'));

  socket.disconnect();
  process.exit(0);
});
