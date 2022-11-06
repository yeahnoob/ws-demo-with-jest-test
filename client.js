import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

async function connectServer(wsURL) {
  return new Promise((resolve, reject) => {
    try {
      const wsClient = new WebSocket(wsURL);

      const sessionId = uuidv4();
      wsClient.on('open', () => {
        const str = `something from client with sessionId: ${sessionId}!`;
        const array = new Uint8Array(Buffer.from(str, 'utf8'));

        wsClient.send(array);
      });

      wsClient.on('message', data => {
        console.log('received: %s', data);

        setTimeout(() => {
          wsClient.send(Date.now());
        }, 500);
      });

      wsClient.on('close', () => {
        console.log('disconnected');
      });

      const timer = setInterval(() => {
        if(wsClient.readyState === 1) {
          clearInterval(timer);
          resolve(wsClient);
        }
      }, 100);
    } catch (err) {
      reject(err);
    }
  });
}


export {
  connectServer
};
