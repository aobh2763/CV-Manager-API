/* eslint-disable prettier/prettier */

export type CommandRequest = {
  argv: string;
  args: any;
};

export function handleCommand(
  command: string,
  args: string[],
): CommandRequest | void {
  switch (command) {
    case 'help':
      console.log('-= Available commands =-');
      console.log('/help - Show this help message');
      console.log('/msg <user> <message> - Send a private message to a user');
      console.log('/reply <message> - Send a private message to the last person who sent you a private message');
      console.log('/quote <id> <message> - Quote a message from the chat history');
      console.log('/color <color> - Change your username color (e.g., red, green, blue)');
      console.log('/list - List all connected users');
      console.log('/kick <user> <reason> - Kick a user (admin only)');
      break;
    case 'color':
      return {
        argv: 'command:color',
        args: {
          color: args[0],
        },
      };
      break;
    case 'msg': { 
      const recipient = args[0];
      const message = args.slice(1).join(' ');

      if (!recipient || !message) {
        console.log('Usage: /msg <user> <message>');
        return;
      }

      return {
        argv: 'command:message',
        args: {
          to: recipient,
          msg: message,
        },
      };
      break; 
    }
    case 'reply': {
      const message = args.join(' ');

      if (!message) {
        console.log('Usage: /reply <message>');
        return;
      }

      return {
        argv: 'command:reply',
        args: {
          msg: message,
        },
      };
      break;
    }
    case 'list':
      return {
        argv: 'command:list',
        args: {},
      };
      break;
    case 'kick': { 
      const userToKick = args[0];

      if (!userToKick) {
        console.log('Usage: /kick <user> <reason>');
        return;
      }

      return {
        argv: 'command:kick',
        args: {
          user: userToKick,
          reason: args.slice(1).join(' '),
        },
      };
      break; 
    }
    case 'quote': {
      const messageId = args[0];
      const message = args.slice(1).join(' ');

      if (!messageId || !message) {
        console.log('Usage: /quote <id> <message>');
        return;
      }

      return {
        argv: 'command:quote',
        args: {
          id: messageId,
          msg: message,
        },
      };
      break;
    }
    default:
      console.log(
        `Unknown command. Type '/help' for a list of available commands.`,
      );
  }
}
