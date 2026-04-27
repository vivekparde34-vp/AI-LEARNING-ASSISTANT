import express from 'express';
import { getFlashcards, reviewFlashcard, toggleFavorite, deleteFlashcard, deleteDocumentFlashcards } from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', getFlashcards);
router.get('/document/:docId', getFlashcards);
router.patch('/:id/review', reviewFlashcard);
router.patch('/:id/favorite', toggleFavorite);
router.delete('/:id', deleteFlashcard);
router.delete('/document/:docId/all', deleteDocumentFlashcards);

export default router;
