import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import Document from '../models/Document.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { title } = req.body;
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    let extractedText = '';
    let pageCount = 0;
    try {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
      pageCount = pdfData.numpages;
    } catch (err) {
      console.error('PDF parse error:', err.message);
    }

    const document = await Document.create({
      user: req.user._id,
      title: title || req.file.originalname.replace('.pdf', ''),
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      filePath: `/uploads/${req.file.filename}`,
      extractedText,
      pageCount,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '..', document.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
