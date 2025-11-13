import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 8080,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://coder:codercoder@maxpower.t5iqm.mongodb.net/?retryWrites=true&w=majority&appName=MaxPower',
  DB_NAME: process.env.DB_NAME || 'coder_backend_I',
  JWT_SECRET: process.env.JWT_SECRET || 'CoderCoder123',
};
