import express from 'express';
import { getQuizzes, getQuizById, submitQuiz, deleteQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', getQuizzes);
router.get('/document/:docId', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);
router.delete('/:id', deleteQuiz);

export default router;
