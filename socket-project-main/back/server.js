// server.js
import 'dotenv/config'
import { app } from './src/app.js'
import { createSocket } from './src/socket.js';

const port = process.env.PORT || 3333
const httpServer = app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`))

createSocket(httpServer);

