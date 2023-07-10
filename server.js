import express from 'express';
import next from 'next';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Database from '@replit/database';

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// @replit/database setup
const db = new Database();
const docKey = 'examples';

const d = new Date();

const defaultState = {
  cells: [
    {
      type: 'basic.Rect',
      position: { x: 100, y: 100 },
      size: { width: 80, height: 40 },
      attrs: {
        rect: { fill: 'blue' },
        text: { text: d.toISOString(), fill: 'white' },
      },
    },
    {
      type: 'basic.Rect',
      position: { x: 200, y: 100 },
      size: { width: 80, height: 40 },
      attrs: {
        rect: { fill: 'yellow' },
        text: { text: 'getUserInfo()', fill: 'white' },
      },
    },
  ],
};

nextApp.prepare().then(async () => {
  const server = http.createServer(app);
  const io = new SocketIOServer(server);

  const initState = await db.get(docKey, { raw: true });

  io.on('connection', async (socket) => {
    socket.emit('paper', JSON.stringify(defaultState));

    socket.on('change', async (change) => {
      const currentState = await db.get(docKey);
      const newState = applyChange(currentState, change);
      await db.set(docKey, newState);
      socket.broadcast.emit('update', JSON.stringify(newState));
    });

    socket.on('message', (message) => {
      console.log(message);
    });
  });

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on port ${port}`);
  });
});

function applyChange(currentState, change) {
  return { ...currentState, ...change };
}
