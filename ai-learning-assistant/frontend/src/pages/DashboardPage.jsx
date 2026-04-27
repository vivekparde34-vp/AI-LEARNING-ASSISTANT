import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { FileText, CreditCard, Brain, Trophy, ArrowRight, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-display text-slate-100">{value ?? '—'}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </div>
);

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="p-8 animate-pulse space-y-6">
      <div className="h-8 bg-slate-800 rounded-lg w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="card p-6 h-24" />)}
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-slate-100">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Here's your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Documents" value={data?.stats.totalDocuments} color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={CreditCard} label="Flashcards" value={data?.stats.totalFlashcards} color="bg-purple-500/15 text-purple-400" />
        <StatCard icon={Brain} label="Quizzes" value={data?.stats.totalQuizzes} color="bg-orange-500/15 text-orange-400" />
        <StatCard icon={Trophy} label="Avg Score" value={data?.stats.avgScore ? `${data.stats.avgScore}%` : '—'} color="bg-primary-500/15 text-primary-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-slate-100">Recent Documents</h2>
            <Link to="/documents" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {data?.recentDocuments?.length ? (
            <div className="space-y-3">
              {data.recentDocuments.map(doc => (
                <Link key={doc._id} to={`/documents/${doc._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                  <div className="w-9 h-9 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-primary-400 transition-colors">{doc.title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {formatDate(doc.createdAt)} · {(doc.fileSize / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No documents yet</p>
              <Link to="/documents" className="btn-primary inline-flex mt-3 text-sm py-1.5 px-3">Upload PDF</Link>
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-slate-100">Recent Quizzes</h2>
          </div>
          {data?.recentQuizzes?.length ? (
            <div className="space-y-3">
              {data.recentQuizzes.map(quiz => (
                <div key={quiz._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
                  <div className="w-9 h-9 bg-orange-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain size={16} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{quiz.title}</p>
                    <p className="text-xs text-slate-500">{quiz.document?.title}</p>
                  </div>
                  {quiz.isCompleted ? (
                    <span className={`badge ${quiz.score >= 70 ? 'bg-primary-500/15 text-primary-400' : 'bg-red-500/15 text-red-400'}`}>
                      {quiz.score}%
                    </span>
                  ) : (
                    <Link to={`/quiz/${quiz._id}`} className="badge bg-orange-500/15 text-orange-400">
                      Take <ArrowRight size={10} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No quizzes taken yet</p>
              <p className="text-slate-500 text-xs mt-1">Open a document to generate a quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
