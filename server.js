import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({port: 8080 });

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
  ws.on('message', data => {
    // console.log('received: %s', data);
    console.log(`socket is connected from the client side with ip: ${ip} and port: ${port}`);
    console.log(data);

  });

  ws.on('close', () => {
    console.log(`socket is closed from the client side with ip: ${ip} and port: ${port}`);
  });


  const str = 'something from server!';
  const array = new Uint8Array(Buffer.from(str, 'utf8'));

  ws.send(array);
});
