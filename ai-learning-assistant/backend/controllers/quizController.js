import Quiz from '../models/Quiz.js';

export const getQuizzes = async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.params.docId) query.document = req.params.docId;

    const quizzes = await Quiz.find(query)
      .populate('document', 'title')
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id })
      .populate('document', 'title');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Hide correct answers if not completed
    if (!quiz.isCompleted) {
      const safeQuiz = quiz.toObject();
      safeQuiz.questions = safeQuiz.questions.map(({ correctAnswer, explanation, ...q }) => q);
      return res.json(safeQuiz);
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of selected option indices
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.isCompleted) return res.status(400).json({ message: 'Quiz already completed' });

    let correctCount = 0;
    quiz.questions = quiz.questions.map((q, idx) => {
      const userAnswer = answers[idx] ?? null;
      q.userAnswer = userAnswer;
      if (userAnswer === q.correctAnswer) correctCount++;
      return q;
    });

    quiz.score = Math.round((correctCount / quiz.questions.length) * 100);
    quiz.isCompleted = true;
    quiz.completedAt = new Date();
    await quiz.save();

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
