import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flashcardAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Heart, Trash2, ChevronRight, Filter } from 'lucide-react';

const difficultyColor = { easy: 'bg-primary-500/15 text-primary-400', medium: 'bg-yellow-500/15 text-yellow-400', hard: 'bg-red-500/15 text-red-400' };

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [flipped, setFlipped] = useState({});

  useEffect(() => {
    flashcardAPI.getAll()
      .then(res => setFlashcards(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (id) => {
    try {
      const res = await flashcardAPI.toggleFavorite(id);
      setFlashcards(prev => prev.map(f => f._id === id ? res.data : f));
    } catch { toast.error('Failed to update'); }
  };

  const deleteCard = async (id) => {
    try {
      await flashcardAPI.delete(id);
      setFlashcards(prev => prev.filter(f => f._id !== id));
      toast.success('Flashcard deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'favorites' ? flashcards.filter(f => f.isFavorite) : flashcards;

  if (loading) return (
    <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[...Array(6)].map((_, i) => <div key={i} className="card h-40" />)}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-slate-100">Flashcards</h1>
          <p className="text-slate-400 mt-1">{flashcards.length} total · {flashcards.filter(f => f.isFavorite).length} favorites</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')}
            className={`badge cursor-pointer ${filter === 'all' ? 'bg-primary-500/15 text-primary-400' : 'bg-slate-800 text-slate-400'}`}>
            All
          </button>
          <button onClick={() => setFilter('favorites')}
            className={`badge cursor-pointer flex items-center gap-1 ${filter === 'favorites' ? 'bg-red-500/15 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
            <Heart size={12} /> Favorites
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <CreditCard size={48} className="text-slate-700 mx-auto mb-4" />
          <h3 className="font-display text-xl text-slate-300 mb-2">
            {filter === 'favorites' ? 'No favorite flashcards' : 'No flashcards yet'}
          </h3>
          <p className="text-slate-500 mb-6">
            {filter === 'favorites' ? 'Heart cards you want to review later' : 'Open a document and generate flashcards to get started'}
          </p>
          <Link to="/documents" className="btn-primary inline-flex items-center gap-2">
            <CreditCard size={16} /> Go to Documents
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(card => (
            <div key={card._id}
              className="card p-5 cursor-pointer hover:border-slate-700 transition-all group relative"
              onClick={() => setFlipped(prev => ({ ...prev, [card._id]: !prev[card._id] }))}>
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${difficultyColor[card.difficulty] || difficultyColor.medium}`}>
                  {card.difficulty}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleFavorite(card._id)}
                    className={`p-1.5 rounded-lg transition-colors ${card.isFavorite ? 'text-red-400' : 'text-slate-500 hover:text-red-400'}`}>
                    <Heart size={14} fill={card.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => deleteCard(card._id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="min-h-[80px] flex items-center">
                <p className="text-slate-200 text-sm leading-relaxed">
                  {flipped[card._id] ? (
                    <span className="text-primary-300">{card.answer}</span>
                  ) : (
                    card.question
                  )}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 truncate">{card.document?.title}</p>
                <span className="text-xs text-slate-600">{flipped[card._id] ? 'Answer' : 'Question — click to flip'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
