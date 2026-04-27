// routes/ai.js
import express from 'express';
import { generateFlashcards, generateQuiz, generateSummary, explainConcept, chatWithDocument, getChatHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/flashcards/:docId', generateFlashcards);
router.post('/quiz/:docId', generateQuiz);
router.post('/summary/:docId', generateSummary);
router.post('/explain/:docId', explainConcept);
router.post('/chat/:docId', chatWithDocument);
router.get('/chat/:docId/history', getChatHistory);

export default router;
