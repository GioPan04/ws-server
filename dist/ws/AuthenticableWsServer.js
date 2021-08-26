"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
/**
 * A WebSocket server with a custom connection upgrade handler
 */
class AuthenticableWsServer extends ws_1.Server {
    constructor(options, authMiddleware) {
        super(Object.assign(Object.assign({}, options), { port: undefined, noServer: true }));
        this.middleware = authMiddleware;
        this.httpServer = http_1.default.createServer();
        this.httpServer.on('upgrade', this.onUpgrade);
        this.httpServer.listen(options.port);
    }
    onUpgrade(req, socket, head) {
        // TODO: Check if authorization token not exists
        const user = this.middleware(req.headers['Authorization'][0]);
        if (!user) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        this.handleUpgrade(req, socket, head, (ws) => {
            ws.emit('connection', ws, req, user);
        });
    }
}
exports.default = AuthenticableWsServer;
