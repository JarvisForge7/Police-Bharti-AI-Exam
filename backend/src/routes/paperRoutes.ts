import { Router } from 'express';
// 💡 इथे इम्पोर्ट करताना 'getPaperSolutionWithAI' समाविष्ट केले आहे याची खात्री करा
import { 
  startOrResumeTest, 
  saveQuestionProgress, 
  submitTest, 
  getFilteredPapers,
  getPaperSolutionWithAI // 👈 हा नवीन फंक्शन इथे इम्पोर्ट केला
} from '../controllers/paperController';

const router = Router();

// १. टेस्ट सुरू किंवा रिझ्युम करणे
router.post('/start-resume', startOrResumeTest);

// २. प्रोग्रेस सेव्ह करणे
router.post('/save-progress', saveQuestionProgress);

// ३. टेस्ट सबमिट करणे
router.post('/submit', submitTest);

// ४. पेपर्स फिल्टर करून लिस्ट मिळवणे
router.get('/list', getFilteredPapers);

// 🤖 ५. AI Teacher स्पष्टीकरणासह पेपरचे सोल्यूशन मिळवणे
router.get('/solution/:paperId', getPaperSolutionWithAI);

export default router;