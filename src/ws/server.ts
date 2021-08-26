import WebSocket from 'ws';
import EventEmitter from 'events';
import http from 'http';
import AuthenticableWsServer, { AuthMiddlewareFunc } from './AuthenticableWsServer';

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

  private wss: AuthenticableWsServer<U>;
  readonly users: U[] = [];
  
  constructor(authMiddleware: AuthMiddlewareFunc<U>) {
    super();

    this.wss = new AuthenticableWsServer({ port: 8080 }, authMiddleware);
    this.wss.on('connection', this.onConnection.bind(this));
  }

  private onConnection(ws: WebSocket, req: http.IncomingMessage, user: U) {
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

