/// <reference types="node" />
import EventEmitter from 'events';
import { AuthMiddlewareFunc } from './AuthenticableWsServer';
interface ChatServerEvents<U> {
    'connection': (user: U) => void;
    'message': (message: string, user: U) => void;
    'logout': (user: U) => void;
}
export declare interface ChatServer<U> {
    on<T extends keyof ChatServerEvents<U>>(event: T, listener: ChatServerEvents<U>[T]): this;
    emit<T extends keyof ChatServerEvents<U>>(event: T, ...args: Parameters<ChatServerEvents<U>[T]>): boolean;
}
export declare class ChatServer<U> extends EventEmitter {
    private wss;
    readonly users: U[];
    authMiddleware: AuthMiddlewareFunc<U>;
    constructor({ authMiddleware }: IChatServer<U>);
    private onConnection;
    private onMessage;
    private logout;
}
interface IChatServer<U> {
    authMiddleware: AuthMiddlewareFunc<U>;
}
export {};
