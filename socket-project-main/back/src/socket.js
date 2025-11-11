import { Server } from 'socket.io';

export function createSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      pingTimeout: 60000,
      pingInterval: 25000
    }
  },)
  io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

     socket.on('entrarSala', (nomeSala) => {
     
      Array.from(socket.rooms)
        .filter(r => r !== socket.id) 
        .forEach(r => socket.leave(r));

      socket.join(nomeSala);
      console.log(`${socket.id} entrou na sala ${nomeSala}`);
    });

    socket.on('mensagem', (msgObj) => {
      console.log('Mensagem recebida:', msgObj);
      console.log('Na sala:', msgObj.sala);
      io.to(msgObj.sala).emit('mensagem', msgObj);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
  return io;
}
