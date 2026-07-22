import { Router } from 'express';
import { saveTestResult, getUserTestAnalytics } from '../controllers/analyticsController'; // 👈 नवीन फंक्शन इम्पोर्ट केले

const router = Router();

// १. रिझल्ट सबमिट करण्यासाठी (POST)
router.post('/submit-test', saveTestResult);

// २. रिझल्टचे प्रगत विश्लेषण मिळवण्यासाठी (GET) - user_id आणि test_id नुसार
router.get('/report/:user_id/:test_id', getUserTestAnalytics); 

export default router;