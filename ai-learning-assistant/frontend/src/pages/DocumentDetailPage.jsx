import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { documentAPI, aiAPI, flashcardAPI, quizAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MessageSquare, Zap, CreditCard, Brain, FileText,
  Send, Sparkles, RotateCcw, Star, Trash2, Play,
  ChevronLeft, ChevronRight, Loader2, ExternalLink, Heart
} from 'lucide-react';

const TABS = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'actions', label: 'AI Actions', icon: Zap },
  { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
  { id: 'quizzes', label: 'Quizzes', icon: Brain },
];

// --- AI Chat Tab ---
const ChatTab = ({ docId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    aiAPI.getChatHistory(docId)
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setInitializing(false));
  }, [docId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await aiAPI.chat(docId, userMsg);
      setMessages(res.data.chatHistory);
    } catch {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary-500" size={24} /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Ask anything about this document</p>
            <p className="text-slate-500 text-sm mt-1">I'll answer based on the document content</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['Summarize the key points', 'What are the main concepts?', 'Explain the most important topic'].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}>
            <p className={`text-xs font-medium mb-2 ${msg.role === 'user' ? 'text-primary-400' : 'text-slate-400'}`}>
              {msg.role === 'user' ? 'You' : '✨ StudyAI'}
            </p>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-message-ai p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400 mb-2">✨ StudyAI</p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-2 h-2 bg-slate-500 rounded-full typing-dot`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-800 p-4">
        <form onSubmit={send} className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            className="input flex-1" placeholder="Ask a question about this document..." />
          <button type="submit" disabled={!input.trim() || loading} className="btn-primary px-4">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- AI Actions Tab ---
const ActionsTab = ({ docId, document }) => {
  const [summary, setSummary] = useState(document?.summary || '');
  const [explanation, setExplanation] = useState('');
  const [concept, setConcept] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingExplain, setLoadingExplain] = useState(false);

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await aiAPI.generateSummary(docId);
      setSummary(res.data.summary);
      toast.success('Summary generated!');
    } catch { toast.error('Failed to generate summary'); }
    finally { setLoadingSummary(false); }
  };

  const explainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) return;
    setLoadingExplain(true);
    try {
      const res = await aiAPI.explainConcept(docId, concept);
      setExplanation(res.data.explanation);
    } catch { toast.error('Failed to explain concept'); }
    finally { setLoadingExplain(false); }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Summary */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-200 flex items-center gap-2"><Sparkles size={16} className="text-primary-400" /> Document Summary</h3>
          <button onClick={generateSummary} disabled={loadingSummary} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-2">
            {loadingSummary ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {summary ? 'Regenerate' : 'Generate'}
          </button>
        </div>
        {summary ? (
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
        ) : (
          <p className="text-slate-500 text-sm">Click Generate to create an AI summary of this document.</p>
        )}
      </div>

      {/* Explain Concept */}
      <div className="card p-5">
        <h3 className="font-medium text-slate-200 flex items-center gap-2 mb-4"><Brain size={16} className="text-purple-400" /> Explain a Concept</h3>
        <form onSubmit={explainConcept} className="flex gap-2 mb-4">
          <input type="text" value={concept} onChange={e => setConcept(e.target.value)}
            className="input flex-1" placeholder="Enter a concept to explain (e.g. 'neural networks')" />
          <button type="submit" disabled={!concept.trim() || loadingExplain} className="btn-primary px-4 flex items-center gap-2">
            {loadingExplain ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Explain
          </button>
        </form>
        {explanation && (
          <div className="bg-surface-800 rounded-xl p-4">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Flashcard Viewer ---
const FlashcardViewer = ({ cards, onToggleFavorite }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return null;
  const card = cards[idx];

  const next = () => { setFlipped(false); setTimeout(() => setIdx(i => (i + 1) % cards.length), 100); };
  const prev = () => { setFlipped(false); setTimeout(() => setIdx(i => (i - 1 + cards.length) % cards.length), 100); };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-slate-400">{idx + 1} / {cards.length}</div>
      <div className="flip-card w-full max-w-lg h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`flip-card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
          <div className="flip-card-front card flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">Question</p>
            <p className="text-slate-100 text-lg leading-relaxed">{card.question}</p>
            <p className="text-xs text-slate-600 mt-6">Click to reveal answer</p>
          </div>
          <div className="flip-card-back card bg-primary-600/10 border-primary-600/20 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xs text-primary-400 mb-4 uppercase tracking-wider">Answer</p>
            <p className="text-slate-100 text-lg leading-relaxed">{card.answer}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={prev} className="btn-ghost p-2 rounded-xl"><ChevronLeft size={20} /></button>
        <button onClick={() => onToggleFavorite(card._id)}
          className={`p-2 rounded-xl transition-colors ${card.isFavorite ? 'text-red-400 bg-red-900/20' : 'btn-ghost'}`}>
          <Heart size={18} fill={card.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => setFlipped(!flipped)} className="btn-ghost p-2 rounded-xl"><RotateCcw size={18} /></button>
        <button onClick={next} className="btn-ghost p-2 rounded-xl"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

// --- Flashcards Tab ---
const FlashcardsTab = ({ docId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [count, setCount] = useState(10);

  useEffect(() => {
    flashcardAPI.getByDocument(docId)
      .then(res => setFlashcards(res.data))
      .finally(() => setLoading(false));
  }, [docId]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await aiAPI.generateFlashcards(docId, count);
      setFlashcards(prev => [...res.data, ...prev]);
      toast.success(`${res.data.length} flashcards generated!`);
    } catch { toast.error('Failed to generate flashcards'); }
    finally { setGenerating(false); }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await flashcardAPI.toggleFavorite(id);
      setFlashcards(prev => prev.map(f => f._id === id ? res.data : f));
    } catch {}
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <div className="p-4 space-y-6">
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-300">Generate</span>
        <select value={count} onChange={e => setCount(+e.target.value)} className="input w-auto py-1.5 text-sm">
          {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} cards</option>)}
        </select>
        <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2">
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Generate Flashcards
        </button>
        <span className="text-sm text-slate-500 ml-auto">{flashcards.length} total</span>
      </div>

      {flashcards.length > 0 ? (
        <FlashcardViewer cards={flashcards} onToggleFavorite={toggleFavorite} />
      ) : (
        <div className="card p-12 text-center">
          <CreditCard size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400">No flashcards yet. Generate some above!</p>
        </div>
      )}
    </div>
  );
};

// --- Quizzes Tab ---
const QuizzesTab = ({ docId }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [count, setCount] = useState(5);

  useEffect(() => {
    quizAPI.getByDocument(docId)
      .then(res => setQuizzes(res.data))
      .finally(() => setLoading(false));
  }, [docId]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await aiAPI.generateQuiz(docId, count);
      setQuizzes(prev => [res.data, ...prev]);
      toast.success('Quiz generated! Ready to take?');
    } catch { toast.error('Failed to generate quiz'); }
    finally { setGenerating(false); }
  };

  const deleteQuiz = async (id) => {
    try {
      await quizAPI.delete(id);
      setQuizzes(prev => prev.filter(q => q._id !== id));
    } catch {}
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <div className="p-4 space-y-4">
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-300">Generate quiz with</span>
        <select value={count} onChange={e => setCount(+e.target.value)} className="input w-auto py-1.5 text-sm">
          {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} questions</option>)}
        </select>
        <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2">
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Generate Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="card p-12 text-center">
          <Brain size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400">No quizzes yet. Generate one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center">
                <Brain size={18} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-200">{quiz.title}</p>
                <p className="text-sm text-slate-500">{quiz.totalQuestions} questions</p>
              </div>
              {quiz.isCompleted ? (
                <div className="flex items-center gap-2">
                  <span className={`badge ${quiz.score >= 70 ? 'bg-primary-500/15 text-primary-400' : 'bg-red-500/15 text-red-400'}`}>
                    {quiz.score}%
                  </span>
                  <Link to={`/quiz/${quiz._id}/result`} className="btn-ghost py-1.5 px-3 text-sm">Results</Link>
                </div>
              ) : (
                <Link to={`/quiz/${quiz._id}`} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1.5">
                  <Play size={14} /> Take Quiz
                </Link>
              )}
              <button onClick={() => deleteQuiz(quiz._id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    documentAPI.getOne(id)
      .then(res => setDocument(res.data))
      .catch(() => { toast.error('Document not found'); navigate('/documents'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={28} />
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800 bg-surface-900 flex-shrink-0">
        <button onClick={() => navigate('/documents')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
          <FileText size={16} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-medium text-slate-100 truncate">{document?.title}</h1>
          <p className="text-xs text-slate-500">{document?.pageCount} pages</p>
        </div>
        <a href={document?.filePath} target="_blank" rel="noreferrer"
          className="btn-ghost py-1.5 px-3 text-sm flex items-center gap-1.5">
          <ExternalLink size={14} /> View PDF
        </a>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-surface-900 flex-shrink-0 overflow-x-auto">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button key={tabId} onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              activeTab === tabId
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-surface-950">
        {activeTab === 'chat' && <ChatTab docId={id} />}
        {activeTab === 'actions' && <ActionsTab docId={id} document={document} />}
        {activeTab === 'flashcards' && <FlashcardsTab docId={id} />}
        {activeTab === 'quizzes' && <QuizzesTab docId={id} />}
      </div>
    </div>
  );
}
