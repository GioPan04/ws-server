"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServer = void 0;
const events_1 = __importDefault(require("events"));
const AuthenticableWsServer_1 = __importDefault(require("./AuthenticableWsServer"));
const messageParser_1 = __importDefault(require("../utils/messageParser"));
class ChatServer extends events_1.default {
    constructor(authMiddleware) {
        super();
        this.users = [];
        this.wss = new AuthenticableWsServer_1.default({ port: 8080 }, authMiddleware);
        this.wss.on('connection', this.onConnection.bind(this));
    }
    onConnection(ws, req, user) {
        this.users.push(user);
        this.emit('connection', user);
        ws.on('message', (data) => this.onMessage(data, user));
        ws.on('close', () => this.logout(user));
    }
    onMessage(data, user) {
        const event = messageParser_1.default(data.toString());
        switch (event.eventName) {
            case 'message':
                this.emit('message', event.payload, user);
                break;
        }
    }
    logout(user) {
        const i = this.users.indexOf(user);
        if (i === -1)
            return;
        this.users.splice(i, 1);
        this.emit('logout', user);
    }
}
exports.ChatServer = ChatServer;
