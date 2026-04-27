import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    quizAPI.getOne(id)
      .then(res => {
        if (res.data.isCompleted) {
          navigate(`/quiz/${id}/result`, { replace: true });
          return;
        }
        setQuiz(res.data);
      })
      .catch(() => { toast.error('Quiz not found'); navigate('/documents'); })
      .finally(() => setLoading(false));
  }, [id]);

  const selectAnswer = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submit = async () => {
    const totalAnswered = Object.keys(answers).length;
    if (totalAnswered < quiz.questions.length) {
      if (!confirm(`You've answered ${totalAnswered}/${quiz.questions.length} questions. Submit anyway?`)) return;
    }
    setSubmitting(true);
    try {
      const answersArr = quiz.questions.map((_, i) => answers[i] ?? null);
      await quizAPI.submit(id, answersArr);
      toast.success('Quiz submitted!');
      navigate(`/quiz/${id}/result`);
    } catch { toast.error('Failed to submit quiz'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary-500" size={28} /></div>
  );
  if (!quiz) return null;

  const q = quiz.questions[currentQ];
  const progress = (Object.keys(answers).length / quiz.questions.length) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Brain size={18} className="text-orange-400" />
          <span className="text-sm">{quiz.title}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl text-slate-100">Question {currentQ + 1} of {quiz.questions.length}</h1>
          <span className="text-sm text-slate-400">{Object.keys(answers).length} answered</span>
        </div>
        {/* Progress */}
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card p-6">
        <p className="text-slate-100 text-lg leading-relaxed mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => selectAnswer(currentQ, i)}
              className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                answers[currentQ] === i
                  ? 'bg-primary-600/15 border-primary-500/50 text-primary-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
              }`}>
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold mr-3 ${
                answers[currentQ] === i ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(i => i - 1)} disabled={currentQ === 0} className="btn-ghost flex items-center gap-2">
          <ChevronLeft size={18} /> Previous
        </button>
        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                i === currentQ ? 'bg-primary-600 text-white' :
                answers[i] !== undefined ? 'bg-primary-600/20 text-primary-400' :
                'bg-slate-800 text-slate-500 hover:bg-slate-700'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
        {currentQ < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrentQ(i => i + 1)} className="btn-ghost flex items-center gap-2">
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
