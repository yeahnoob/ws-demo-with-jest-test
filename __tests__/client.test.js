import { connectServer } from '../client';
import { WebSocketServer } from 'ws';


const socketState = {
  CONNECTION: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}

async function waitForSocketState(socket, state) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.readyState === state) {
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 5);
  });
}

async function startServer({port}) {
  return new Promise((resolve) => {
    const server = new WebSocketServer({port});
    resolve(server);
  });
}

describe('test websocket client', () => {
  const host = '127.0.0.1';
  const port = '5234';
  let wsClient, mockServer;

  jest.setTimeout(10000);

  beforeEach(() => {
  });

  afterEach(() => {
    // if(wsClient && wsClient.readyState !== socketState.CLOSED) await wsClient.close();
    // if(mockServer && mockServer.readyState !== socketState.CLOSED) await mockServer.close();
  });

  test('websocket client connect to server', async () => {
    let timestamp, message;
    mockServer = await startServer({port});

    mockServer.on('connection', (ws, req) => {
      const ip = req.socket.remoteAddress;
      const port = req.socket.remotePort;
      ws.on('message', data => {
        timestamp = Date.now().toString().substring(0,7);
        console.log(`socket is connected from the client side with ip: ${ip} and port: ${port}`);
        console.log(`received some data from the client side: "${data}"`);
        message = data;
      });

      ws.on('close', () => {
      });

      const str = 'something from server!';
      const array = new Uint8Array(Buffer.from(str, 'utf8'));

      ws.send(array);
    });

    // await waitForSocketState(mockServer, socketState.OPEN);
    wsClient = await connectServer(`ws://${host}:${port}`);

    try {
      await wsClient.close();
      if(wsClient.readyState === wsClient.CLOSING) {
        await waitForSocketState(wsClient, wsClient.CLOSED);
      }
      expect(wsClient.readyState).toBe(wsClient.CLOSED);
      mockServer.close();
    } catch (err) {
      console.log('failed to close the connection, with error message: ', err.message);
      throw new Error(err);
    }

    expect(Buffer.from(message).toString('utf8'))
          .toMatch(new RegExp(`(something from client with sessionId:|${timestamp})`));

  });
});
