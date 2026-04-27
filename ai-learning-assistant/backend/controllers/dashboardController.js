import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalDocuments, totalFlashcards, totalQuizzes, recentDocuments, recentQuizzes, completedQuizzes] =
      await Promise.all([
        Document.countDocuments({ user: userId }),
        Flashcard.countDocuments({ user: userId }),
        Quiz.countDocuments({ user: userId }),
        Document.find({ user: userId }).select('-extractedText').sort({ createdAt: -1 }).limit(5),
        Quiz.find({ user: userId }).populate('document', 'title').sort({ createdAt: -1 }).limit(5),
        Quiz.find({ user: userId, isCompleted: true }).select('score'),
      ]);

    const avgScore = completedQuizzes.length
      ? Math.round(completedQuizzes.reduce((s, q) => s + q.score, 0) / completedQuizzes.length)
      : 0;

    res.json({
      stats: { totalDocuments, totalFlashcards, totalQuizzes, avgScore },
      recentDocuments,
      recentQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
