import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import storesRoutes from './routes/stores.js';
import statsRoutes from './routes/stats.js';

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

app.listen(config.port);
