import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/security';

const router = Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route (टोकन आवश्यक)
router.get('/profile', authenticateToken, getProfile);

export default router;