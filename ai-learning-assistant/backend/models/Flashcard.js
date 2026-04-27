import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  reviewCount: { type: Number, default: 0 },
  lastReviewed: { type: Date },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
}, { timestamps: true });

export default mongoose.model('Flashcard', flashcardSchema);
