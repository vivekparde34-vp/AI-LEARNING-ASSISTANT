import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
  userAnswer: { type: Number, default: null },
});

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
  score: { type: Number, default: null },
  totalQuestions: { type: Number },
  completedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
