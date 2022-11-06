import { connectServer } from './client';

(async () => await connectServer('ws://127.0.0.1:8080'))();
