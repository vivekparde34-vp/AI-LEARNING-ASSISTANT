import { GoogleGenerativeAI } from '@google/generative-ai';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';

const getGemini = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

const truncateText = (text, maxChars = 15000) =>
  text.length > maxChars ? text.substring(0, maxChars) + '...' : text;

export const generateFlashcards = async (req, res) => {
  try {
    const { count = 10 } = req.body;
    const document = await Document.findOne({ _id: req.params.docId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const model = getGemini();
    const prompt = `Based on this document content, generate ${count} educational flashcards.
Return ONLY a valid JSON array with no markdown, no explanation:
[{"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}]

Document: ${truncateText(document.extractedText)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const cardsData = JSON.parse(jsonMatch[0]);
    const flashcards = await Flashcard.insertMany(
      cardsData.map((card) => ({
        user: req.user._id,
        document: document._id,
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || 'medium',
      }))
    );

    res.status(201).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateQuiz = async (req, res) => {
  try {
    const { count = 5 } = req.body;
    const document = await Document.findOne({ _id: req.params.docId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const model = getGemini();
    const prompt = `Based on this document, generate ${count} multiple-choice quiz questions.
Return ONLY a valid JSON array with no markdown:
[{"question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..."}]
correctAnswer is the index (0-3) of the correct option.

Document: ${truncateText(document.extractedText)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const questionsData = JSON.parse(jsonMatch[0]);
    const quiz = await Quiz.create({
      user: req.user._id,
      document: document._id,
      title: `Quiz: ${document.title}`,
      questions: questionsData,
      totalQuestions: questionsData.length,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateSummary = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.docId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const model = getGemini();
    const prompt = `Provide a comprehensive summary of this document. Include:
- Main topic and purpose
- Key concepts and findings
- Important conclusions
Keep it concise but informative (300-500 words).

Document: ${truncateText(document.extractedText)}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    await Document.findByIdAndUpdate(document._id, { summary });
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const explainConcept = async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept) return res.status(400).json({ message: 'Concept is required' });

    const document = await Document.findOne({ _id: req.params.docId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const model = getGemini();
    const prompt = `Based on this document, explain the concept: "${concept}"
Provide:
1. Clear definition
2. How it's used/discussed in the document
3. Key examples or applications
4. Why it matters

Document: ${truncateText(document.extractedText)}`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chatWithDocument = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const document = await Document.findOne({ _id: req.params.docId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    let chatHistory = await ChatHistory.findOne({
      user: req.user._id,
      document: document._id,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        user: req.user._id,
        document: document._id,
        messages: [],
      });
    }

    const model = getGemini();
    const recentMessages = chatHistory.messages.slice(-6);
    const historyContext = recentMessages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `You are an AI tutor helping a student understand a document.
Answer questions based ONLY on the document content. Be helpful, clear, and educational.

Document: ${truncateText(document.extractedText, 10000)}

${historyContext ? `Conversation History:\n${historyContext}\n` : ''}
User Question: ${message}

Provide a helpful, accurate answer based on the document.`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    chatHistory.messages.push({ role: 'user', content: message });
    chatHistory.messages.push({ role: 'assistant', content: reply });
    await chatHistory.save();

    res.json({
      message: reply,
      chatHistory: chatHistory.messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      user: req.user._id,
      document: req.params.docId,
    });
    res.json(chatHistory?.messages || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
