/// <reference types="node" />
import EventEmitter from 'events';
import { AuthMiddlewareFunc } from './AuthenticableWsServer';
import { IMessage } from '../models/IData';
interface ChatServerEvents<U> {
    'connection': (user: U) => void;
    'message': (message: IMessage, user: U) => void;
    'logout': (user: U) => void;
}
export declare interface ChatServer<U> {
    on<T extends keyof ChatServerEvents<U>>(event: T, listener: ChatServerEvents<U>[T]): this;
    emit<T extends keyof ChatServerEvents<U>>(event: T, ...args: Parameters<ChatServerEvents<U>[T]>): boolean;
}
export declare class ChatServer<U> extends EventEmitter {
    private wss;
    readonly users: U[];
    constructor(authMiddleware: AuthMiddlewareFunc<U>);
    private onConnection;
    private onMessage;
    private logout;
}
export {};
