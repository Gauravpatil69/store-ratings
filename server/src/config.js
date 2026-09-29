import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  devRole: process.env.DEV_ROLE || 'ADMIN',
};
