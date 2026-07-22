import { Router } from 'express';
import { getPapers, getPaperQuestions, submitExam } from '../controllers/exam.controller';
import { authenticateToken } from '../middleware/security';

const router = Router();

// Public / Protected Routes
router.get('/papers', getPapers);
router.get('/papers/:paperId/questions', authenticateToken, getPaperQuestions);
router.post('/submit', authenticateToken, submitExam);

export default router;