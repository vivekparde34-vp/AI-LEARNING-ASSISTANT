import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { documentAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  FileText, Upload, Trash2, ChevronRight, Plus,
  Search, X, File, AlertTriangle
} from 'lucide-react';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const UploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f?.type !== 'application/pdf') return toast.error('Only PDF files are supported');
    setFile(f);
    if (!title) setTitle(f.name.replace('.pdf', ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a PDF file');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title || file.name.replace('.pdf', ''));
      const res = await documentAPI.upload(formData);
      toast.success('Document uploaded successfully!');
      onSuccess(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-slate-100">Upload Document</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={18} /></button>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragging ? 'border-primary-500 bg-primary-500/5' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf" onChange={e => handleFile(e.target.files[0])} className="hidden" />
            {file ? (
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
                  <File size={20} className="text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-200 truncate max-w-48">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 text-slate-500 hover:text-slate-300">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={28} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">Drop PDF here or click to browse</p>
                <p className="text-slate-500 text-sm mt-1">Max 50MB</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Document Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="input" placeholder="Enter a title for this document" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={uploading || !file} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    documentAPI.getAll()
      .then(res => setDocuments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? This will also delete all associated flashcards and quizzes.')) return;
    setDeleting(id);
    try {
      await documentAPI.delete(id);
      setDocuments(prev => prev.filter(d => d._id !== id));
      toast.success('Document deleted');
    } catch {
      toast.error('Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 bg-slate-800 rounded-lg w-40" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="card p-6 h-40" />)}
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={doc => setDocuments(prev => [doc, ...prev])} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-slate-100">Documents</h1>
          <p className="text-slate-400 mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Upload PDF
        </button>
      </div>

      {documents.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-10 max-w-sm" placeholder="Search documents..." />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText size={48} className="text-slate-700 mx-auto mb-4" />
          <h3 className="font-display text-xl text-slate-300 mb-2">
            {search ? 'No results found' : 'Upload your first document'}
          </h3>
          <p className="text-slate-500 mb-6">
            {search ? 'Try a different search term' : 'Upload a PDF to get started with AI-powered learning'}
          </p>
          {!search && (
            <button onClick={() => setShowUpload(true)} className="btn-primary inline-flex items-center gap-2">
              <Upload size={16} /> Upload PDF
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => (
            <div key={doc._id} className="card p-5 flex flex-col hover:border-slate-700 transition-colors group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-200 leading-snug line-clamp-2">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(doc.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <span className="badge bg-slate-800 text-slate-400">{formatSize(doc.fileSize)}</span>
                {doc.pageCount > 0 && <span className="badge bg-slate-800 text-slate-400">{doc.pageCount} pages</span>}
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <Link to={`/documents/${doc._id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-primary-600/10 text-primary-400 hover:bg-primary-600/20 transition-colors">
                  Open <ChevronRight size={14} />
                </Link>
                <button onClick={() => handleDelete(doc._id)} disabled={deleting === doc._id}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-colors">
                  {deleting === doc._id
                    ? <div className="w-4 h-4 border border-slate-500 border-t-transparent rounded-full animate-spin" />
                    : <Trash2 size={16} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
