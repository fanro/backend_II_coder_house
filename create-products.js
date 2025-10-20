import { productsModel } from './src/dao/models/productsModel.js';
import { conectarDB } from './src/config/db.js';
import { config } from './src/config/config.js';

const createProducts = async () => {
  try {
    await conectarDB(config.MONGO_URL, config.DB_NAME);

    let products = [
      {
        title: 'Smartphone Galaxy S24',
        description: 'Smartphone de alta gama con pantalla AMOLED',
        code: 'PHONE001',
        price: 899.99,
        stock: 25,
        descrip: 'Último modelo Samsung Galaxy',
      },
      {
        title: 'Laptop MacBook Pro',
        description: 'Laptop profesional para diseño y desarrollo',
        code: 'LAPTOP001',
        price: 2499.99,
        stock: 15,
        descrip: 'MacBook Pro 16 pulgadas M3',
      },
      {
        title: 'Auriculares Bluetooth',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        code: 'AUDIO001',
        price: 299.99,
        stock: 50,
        descrip: 'Sony WH-1000XM5',
      },
      {
        title: 'Tablet iPad Air',
        description: 'Tablet de alta resolución para trabajo y entretenimiento',
        code: 'TABLET001',
        price: 749.99,
        stock: 30,
        descrip: 'iPad Air 10.9 pulgadas',
      },
      {
        title: 'Monitor 4K',
        description: 'Monitor ultra HD para gaming y diseño',
        code: 'MONITOR001',
        price: 549.99,
        stock: 20,
        descrip: '27 pulgadas LG UltraFine',
      },
      {
        title: 'Teclado Mecánico',
        description: 'Teclado gaming con switches Cherry MX',
        code: 'KEYB001',
        price: 159.99,
        stock: 40,
        descrip: 'Corsair K95 RGB Platinum',
      },
      {
        title: 'Mouse Gaming',
        description: 'Mouse inalámbrico de alta precisión',
        code: 'MOUSE001',
        price: 89.99,
        stock: 60,
        descrip: 'Logitech G Pro X Superlight',
      },
      {
        title: 'SSD 1TB',
        description: 'Disco sólido de alta velocidad',
        code: 'STORAGE001',
        price: 199.99,
        stock: 35,
        descrip: 'Samsung 980 PRO NVMe',
      },
      {
        title: 'Webcam HD',
        description: 'Cámara web para videoconferencias',
        code: 'CAM001',
        price: 129.99,
        stock: 45,
        descrip: 'Logitech Brio 4K',
      },
      {
        title: 'Router WiFi 6',
        description: 'Router de alta velocidad con WiFi 6',
        code: 'NET001',
        price: 279.99,
        stock: 25,
        descrip: 'ASUS AX6000 WiFi 6',
      },
      {
        title: 'Smartwatch',
        description: 'Reloj inteligente con GPS y monitor de salud',
        code: 'WATCH001',
        price: 399.99,
        stock: 30,
        descrip: 'Apple Watch Series 9',
      },
      {
        title: 'Altavoz Bluetooth',
        description: 'Altavoz portátil resistente al agua',
        code: 'SPEAKER001',
        price: 149.99,
        stock: 55,
        descrip: 'JBL Charge 5',
      },
      {
        title: 'Cargador Inalámbrico',
        description: 'Base de carga inalámbrica rápida',
        code: 'CHARGER001',
        price: 49.99,
        stock: 70,
        descrip: 'Anker PowerWave 15',
      },
      {
        title: 'Cable USB-C',
        description: 'Cable de carga y datos USB-C de alta velocidad',
        code: 'CABLE001',
        price: 19.99,
        stock: 100,
        descrip: 'Cable 2 metros Thunderbolt 4',
      },
      {
        title: 'Funda Laptop',
        description: 'Funda protectora para laptop de 15 pulgadas',
        code: 'CASE001',
        price: 39.99,
        stock: 80,
        descrip: 'Funda acolchada resistente',
      },
      {
        title: 'Power Bank',
        description: 'Batería externa de alta capacidad',
        code: 'BATTERY001',
        price: 79.99,
        stock: 65,
        descrip: '20000mAh con carga rápida',
      },
      {
        title: 'Drone DJI Mini',
        description: 'Drone compacto para fotografía aérea',
        code: 'DRONE001',
        price: 699.99,
        stock: 15,
        descrip: 'DJI Mini 3 con cámara 4K',
      },
      {
        title: 'Console PlayStation 5',
        description: 'Consola de videojuegos de última generación',
        code: 'CONSOLE001',
        price: 499.99,
        stock: 10,
        descrip: 'PlayStation 5 Digital Edition',
      },
      {
        title: 'Smart TV 65"',
        description: 'Televisor inteligente Ultra HD',
        code: 'TV001',
        price: 1299.99,
        stock: 8,
        descrip: 'Samsung QLED 65 pulgadas',
      },
      {
        title: 'Impresora Láser',
        description: 'Impresora láser multifunción',
        code: 'PRINTER001',
        price: 249.99,
        stock: 20,
        descrip: 'Brother HL-L2350DW WiFi',
      },
    ];

    // Limpiar productos existentes
    await productsModel.deleteMany();
    console.log('Productos existentes eliminados');

    // Insertar nuevos productos
    const productosCreados = await productsModel.insertMany(products);
    console.log(`${productosCreados.length} productos creados exitosamente`);

    process.exit(0);
  } catch (err) {
    console.log(`Error al crear productos: ${err.message}`);
    process.exit(1);
  }
};

createProducts();
