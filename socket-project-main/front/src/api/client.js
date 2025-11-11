import axios from 'axios';
import { io } from 'socket.io-client';

const Client = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  
})

const Socket = io('http://localhost:3333', { autoConnect: false }, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity, // número de tentativas
  reconnectionDelay: 1000,        // delay inicial
  reconnectionDelayMax: 5000,     // delay máximo
});

export { Client, Socket }