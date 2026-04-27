import Flashcard from '../models/Flashcard.js';

export const getFlashcards = async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.params.docId) query.document = req.params.docId;
    if (req.query.favorites === 'true') query.isFavorite = true;

    const flashcards = await Flashcard.find(query)
      .populate('document', 'title')
      .sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { reviewCount: 1 }, lastReviewed: new Date() },
      { new: true }
    );
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });

    flashcard.isFavorite = !flashcard.isFavorite;
    await flashcard.save();
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    res.json({ message: 'Flashcard deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocumentFlashcards = async (req, res) => {
  try {
    await Flashcard.deleteMany({ document: req.params.docId, user: req.user._id });
    res.json({ message: 'All flashcards deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
