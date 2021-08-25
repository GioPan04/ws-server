import { Server } from 'ws';

const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New user connected')

    ws.on('message', (msg) => {
        ws.send(msg.toString());
    });
});