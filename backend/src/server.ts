import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { globalLimiter } from './middleware/security';
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';
import featureRoutes from './routes/features.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(globalLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Maharashtra Police Bharti AI API Engine', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api', featureRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});