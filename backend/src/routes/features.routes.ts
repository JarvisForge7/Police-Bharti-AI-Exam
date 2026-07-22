import { Router } from 'express';
import { getAiExplanation, getLeaderboard, getUserAnalytics } from '../controllers/features.controller';
import { authenticateToken } from '../middleware/security';

const router = Router();

// Protected Routes
router.post('/ai-teacher/explain', authenticateToken, getAiExplanation);
router.get('/leaderboard', authenticateToken, getLeaderboard);
router.get('/analytics', authenticateToken, getUserAnalytics);

export default router;