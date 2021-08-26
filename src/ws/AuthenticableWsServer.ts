import WebSocket, { Server } from 'ws';
import http from 'http';
import { Socket } from 'net';

export type AuthMiddlewareFunc<U> = (token: string) => U | undefined; 

/**
 * A WebSocket server with a custom connection upgrade handler 
 */
export default class AuthenticableWsServer<U> extends Server {
  readonly httpServer: http.Server;
  private middleware: AuthMiddlewareFunc<U>;

  constructor (options: WebSocket.ServerOptions, authMiddleware: AuthMiddlewareFunc<U>) {
    super({...options, port: undefined, noServer: true});
    
    this.middleware = authMiddleware;
    
    this.httpServer = http.createServer();
    this.httpServer.on('upgrade', this.onUpgrade);
    this.httpServer.listen(options.port);
  }

  private onUpgrade(req: http.IncomingMessage, socket: Socket, head: Buffer) {
    // TODO: Check if authorization token not exists
    const user = this.middleware(req.headers['Authorization']![0]);

    if(!user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    this.handleUpgrade(req, socket, head, (ws) => {
      ws.emit('connection', ws, req, user);
    });
  }
}