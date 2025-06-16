import express from 'express';
import cors from 'cors';
import contentRoutes from './routes/contentRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', contentRoutes);

export default app;