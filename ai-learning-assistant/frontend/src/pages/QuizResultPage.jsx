import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { Trophy, CheckCircle, XCircle, ChevronLeft, Brain, RotateCcw, Loader2 } from 'lucide-react';

export default function QuizResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizAPI.getOne(id)
      .then(res => setQuiz(res.data))
      .catch(() => navigate('/documents'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-500" size={28} /></div>;
  if (!quiz) return null;

  const score = quiz.score;
  const isPassing = score >= 70;
  const correctCount = quiz.questions.filter(q => q.userAnswer === q.correctAnswer).length;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Score card */}
      <div className={`card p-8 text-center border ${isPassing ? 'border-primary-500/30 bg-primary-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isPassing ? 'bg-primary-500/20' : 'bg-red-500/20'
        }`}>
          <Trophy size={36} className={isPassing ? 'text-primary-400' : 'text-red-400'} />
        </div>
        <h1 className="font-display text-5xl text-slate-100 mb-2">{score}%</h1>
        <p className={`text-lg font-medium ${isPassing ? 'text-primary-400' : 'text-red-400'}`}>
          {isPassing ? '🎉 Great job!' : '📚 Keep practicing!'}
        </p>
        <p className="text-slate-400 mt-2">
          You got {correctCount} out of {quiz.questions.length} questions correct
        </p>
      </div>

      {/* Question review */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-slate-100">Question Review</h2>
        {quiz.questions.map((q, i) => {
          const isCorrect = q.userAnswer === q.correctAnswer;
          return (
            <div key={i} className={`card p-5 border ${isCorrect ? 'border-primary-500/20' : 'border-red-500/20'}`}>
              <div className="flex items-start gap-3 mb-3">
                {isCorrect
                  ? <CheckCircle size={20} className="text-primary-400 flex-shrink-0 mt-0.5" />
                  : <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                }
                <p className="text-slate-200 font-medium text-sm">{q.question}</p>
              </div>
              <div className="ml-8 space-y-2">
                {q.options.map((opt, j) => {
                  const isUserAnswer = q.userAnswer === j;
                  const isCorrectAnswer = q.correctAnswer === j;
                  let cls = 'bg-slate-800/50 text-slate-400';
                  if (isCorrectAnswer) cls = 'bg-primary-500/15 text-primary-300 border border-primary-500/30';
                  else if (isUserAnswer && !isCorrect) cls = 'bg-red-500/15 text-red-300 border border-red-500/30';
                  return (
                    <div key={j} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${cls}`}>
                      <span className="font-mono text-xs">{String.fromCharCode(65 + j)}</span>
                      {opt}
                      {isCorrectAnswer && <CheckCircle size={13} className="ml-auto text-primary-400" />}
                      {isUserAnswer && !isCorrect && <XCircle size={13} className="ml-auto text-red-400" />}
                    </div>
                  );
                })}
                {q.explanation && (
                  <div className="mt-2 p-3 bg-surface-800 rounded-lg">
                    <p className="text-xs text-slate-400"><span className="text-primary-400 font-medium">Explanation:</span> {q.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/documents" className="btn-ghost flex-1 flex items-center justify-center gap-2">
          <ChevronLeft size={16} /> Documents
        </Link>
        <Link to={`/documents/${quiz.document?._id || quiz.document}`} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Brain size={16} /> Back to Document
        </Link>
      </div>
    </div>
  );
}
