import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filePath: { type: String, required: true },
  extractedText: { type: String, default: '' },
  summary: { type: String, default: '' },
  pageCount: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
