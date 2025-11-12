import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://....',
  DB_NAME: process.env.DB_NAME || 'DB_NAME',
  JWT_SECRET: process.env.JWT_SECRET || 'super-clave-secreta',
};
