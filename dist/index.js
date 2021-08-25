"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.Server({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('New user connected');
    ws.on('message', (msg) => {
        ws.send(msg.toString());
    });
});