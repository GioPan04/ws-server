/// <reference types="node" />
import WebSocket, { Server } from 'ws';
import http from 'http';
export declare type AuthMiddlewareFunc<U> = (token: string) => U | undefined;
/**
 * A WebSocket server with a custom connection upgrade handler
 */
export default class AuthenticableWsServer<U> extends Server {
    readonly httpServer: http.Server;
    private middleware;
    constructor(options: WebSocket.ServerOptions, authMiddleware: AuthMiddlewareFunc<U>);
    private onUpgrade;
}
