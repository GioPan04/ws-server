import WebSocket, { Server } from 'ws';
import EventEmitter from 'events';

interface ChatServerEvents<U> {
  'connection': (user: U) => void;
  'message': (data: any) => void;
}

export declare interface ChatServer<U> {
  on<T extends keyof ChatServerEvents<U>>(event: T, listener: ChatServerEvents<U>[T]): this;
  emit<T extends keyof ChatServerEvents<U>>(event: T, ...args: Parameters<ChatServerEvents<U>[T]>): boolean;
}

export class ChatServer<U> extends EventEmitter {

  private server: Server;
  readonly users: U[] = [];
  
  constructor() {
    super();
    this.server = new Server({ port: 8080 });
    this.server.on('connection', this.onConnection);
  }

  private onConnection(ws: WebSocket) {
    // this.emit('connection')
  }
}