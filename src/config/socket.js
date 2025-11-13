import { Server } from 'socket.io';
import { ProductsMongoManager } from '../dao/ProductMongoManager.js';

export const configurarSocket = (server) => {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    console.log('Cliente conectado:', socket.id);

    // lista actual de productos al cliente que se conecta
    try {
      const { docs: productos } = await ProductsMongoManager.getProducts();
      socket.emit('productos-actualizados', productos);
    } catch (error) {
      console.error('Error al cargar productos iniciales:', error);
    }

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  setInterval(() => {
    let fecha = new Date().toISOString();
    io.emit('fecha', fecha);
  }, 1000);

  return io;
};
