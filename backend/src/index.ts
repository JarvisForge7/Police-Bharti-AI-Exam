import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

// 🛣️ राऊट्स इम्पोर्ट्स
import paperRoutes from './routes/paperRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import studentRoutes from './routes/studentRoutes';
import quizRoutes from './routes/quizRoutes'; 
import adminRoutes from './routes/adminRoutes';
import gamificationRoutes from './routes/gamificationRoutes';

// ⚙️ पर्यावरण व्हेरिएबल्स लोड करणे (सर्वप्रथम)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 💡 मिडलवेअर्स (सर्व राऊट्सच्या आधी येणे बंधनकारक आहे ✅)
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// 🛣️ राऊट्स मॅपिंग

app.use('/api/student', studentRoutes);
app.use('/api/quiz', quizRoutes); 
app.use('/api/paper', paperRoutes);
app.use('/api/analytics', analyticsRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/gamification', gamificationRoutes);
import quizRoutes from './routes/quizRoutes';

// हे असणे आवश्यक आहे
app.use('/api', quizRoutes);
// 🏠 बेस राऊट
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Police Bharti AI API" });
});

// 🏛️ डेटाबेस कनेक्शन
pool.connect()
  .then(() => console.log('🛡️ PostgreSQL Database Connected!'))
  .catch((err) => console.error('❌ Database Connection Error:', err));

// 🚀 सर्व्हर स्टार्ट
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});