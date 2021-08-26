import WebSocket, { Server } from 'ws';
import EventEmitter from 'events';

interface ChatServerEvents<U> {
  'connection': (user: U) => void;
  'message': (message: string, user: U) => void;
  'logout': (user: U) => void;
}

export declare interface ChatServer<U> {
  on<T extends keyof ChatServerEvents<U>>(event: T, listener: ChatServerEvents<U>[T]): this;
  emit<T extends keyof ChatServerEvents<U>>(event: T, ...args: Parameters<ChatServerEvents<U>[T]>): boolean;
}

export class ChatServer<U> extends EventEmitter {

  private server: Server;
  readonly users: U[] = [];

  authMiddleware: (data: any) => U;
  
  constructor({ authMiddleware }: IChatServer<U>) {
    super();

    this.authMiddleware = authMiddleware;

    this.server = new Server({ port: 8080 });
    this.server.on('connection', this.onConnection);
  }

  private onConnection(ws: WebSocket) {
    const user = this.authMiddleware(ws);
    this.users.push(user);
    this.emit('connection', user);
    ws.on('message', (data) => this.onMessage(data, user));
    ws.on('close', () => this.logout(user));
  }

  private onMessage(data: WebSocket.Data, user: U) {
    this.emit('message', data.toString(), user);
  }

  private logout(user: U) {
    const i = this.users.indexOf(user);
    if(i === -1) return;
    this.users.splice(i, 1);
    this.emit('logout', user);
  }
}

interface IChatServer<U> {
  authMiddleware: (data: any) => U;
}

