import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createSession, processAnswer, getEngagementScore, saveSessionToHistory,
  DIFFICULTY_LEVELS,
} from '../engine/adaptive';
import QuestionCard from '../components/quiz/QuestionCard';
import DifficultyMeter from '../components/quiz/DifficultyMeter';
import PerformanceChart from '../components/quiz/PerformanceChart';
import { FileText, Bot } from 'lucide-react';

const marksMap = { easy: 2, medium: 5, hard: 10 };

// Pick next question from PDF bank using IRT difficulty matching
function pickNextPDFQuestion(session, pdfQuestions) {
  const answered = new Set(session.history.map(h => h.questionId));
  const remaining = pdfQuestions.filter(q => !answered.has(q.id));
  if (remaining.length === 0) return null;

  // Prefer questions matching current difficulty band
  const matching = remaining.filter(q => q.difficulty === session.difficulty);
  if (matching.length > 0) {
    return matching[Math.floor(Math.random() * matching.length)];
  }
  // Fallback: closest difficulty
  const order = session.difficulty === 'easy'
    ? ['medium', 'hard'] : session.difficulty === 'hard'
    ? ['medium', 'easy'] : ['easy', 'hard'];
  for (const d of order) {
    const cands = remaining.filter(q => q.difficulty === d);
    if (cands.length > 0) return cands[Math.floor(Math.random() * cands.length)];
  }
  return remaining[0];
}

const PDFQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state;

  // If no quiz data, redirect home
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <h2>No quiz data found</h2>
          <p>Please upload a PDF and generate questions first.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const { questions: pdfQuestions, title, timePerQuestion, pdfInfo } = quizData;
  const totalQuestions = pdfQuestions.length;
  const timeLimit = timePerQuestion || 30;

  const [session, setSession] = useState(() =>
    createSession(pdfInfo?.filename || 'PDF Quiz')
  );
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Save to localStorage for mid-quiz recovery
  useEffect(() => {
    try {
      localStorage.setItem('pdf_quiz_state', JSON.stringify({
        session, pdfQuestions, title, timePerQuestion, pdfInfo,
        currentQuestionId: currentQuestion?.id,
      }));
    } catch { /* ignore */ }
  }, [session, currentQuestion]);

  // Load first question
  useEffect(() => {
    const q = pickNextPDFQuestion(session, pdfQuestions);
    setCurrentQuestion(q);
    setIsLoading(false);
  }, []);

  const handleAnswer = useCallback((questionId, isCorrect, timeSpentMs, difficulty) => {
    const marks = currentQuestion?.marks || marksMap[difficulty] || 5;
    setSession(prev => {
      const updated = processAnswer(prev, questionId, isCorrect, timeSpentMs, difficulty, marks);
      sessionRef.current = updated;

      if (updated.questionsAnswered >= totalQuestions) {
        // Quiz complete
        setTimeout(() => {
          localStorage.removeItem('pdf_quiz_state');
          const saved = saveSessionToHistory(updated);
          navigate('/pdf-results', {
            state: {
              session: updated,
              savedEntry: saved,
              pdfQuestions,
              pdfInfo,
              title,
            },
          });
        }, 500);
        return updated;
      }

      // Load next question
      setIsLoading(true);
      setTimeout(() => {
        const next = pickNextPDFQuestion(updated, pdfQuestions);
        setCurrentQuestion(next);
        setIsLoading(false);
      }, 300);

      return updated;
    });
  }, [navigate, totalQuestions, pdfQuestions, pdfInfo, title, currentQuestion]);

  const progress = (session.questionsAnswered / totalQuestions) * 100;
  const engagement = getEngagementScore(session);

  return (
    <div className="quiz-page">
      <div className="quiz-bg-effects">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="quiz-layout">
        <div className="quiz-sidebar">
          <motion.div
            className="quiz-topic-badge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ '--topic-color': '#8b5cf6' }}
          >
            <span><FileText size={20} /></span>
            <span>{title || 'PDF Quiz'}</span>
          </motion.div>

          <div className="gemini-powered-badge">
            <FileText size={14} style={{ marginRight: '6px' }} />
            PDF-Generated Quiz · {pdfInfo?.pageCount} pages
          </div>

          <DifficultyMeter
            proficiency={session.theta}
            difficulty={session.difficulty}
            streak={session.currentStreak}
            engagement={engagement}
            isIRT={true}
          />

          <div className="quiz-progress-section">
            <div className="progress-info">
              <span>Progress</span>
              <span>{session.questionsAnswered}/{totalQuestions}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="quiz-stats-mini">
            <div className="stat-mini">
              <span className="stat-mini-value">
                {session.questionsAnswered > 0
                  ? Math.round(session.correctCount / session.questionsAnswered * 100) : 0}%
              </span>
              <span className="stat-mini-label">Accuracy</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value">{session.earnedMarks}/{session.totalMarks}</span>
              <span className="stat-mini-label">Marks</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value">
                {session.questionsAnswered > 0
                  ? (session.totalTimeSpent / session.questionsAnswered / 1000).toFixed(1) + 's'
                  : '—'}
              </span>
              <span className="stat-mini-label">Avg Time</span>
            </div>
          </div>

          <button className="btn-toggle-chart" onClick={() => setShowChart(!showChart)}>
            {showChart ? 'Hide' : 'Show'} Live Chart
          </button>

          {showChart && session.history.length >= 2 && (
            <div className="quiz-live-chart">
              <PerformanceChart history={session.history} title="Live Performance" isIRT={true} />
            </div>
          )}

          <button className="btn-quit" onClick={() => {
            if (window.confirm('End quiz early? Your progress will be saved.')) {
              localStorage.removeItem('pdf_quiz_state');
              const saved = saveSessionToHistory(session);
              navigate('/pdf-results', {
                state: { session, savedEntry: saved, pdfQuestions, pdfInfo, title },
              });
            }
          }}>
            End Quiz Early
          </button>
        </div>

        <div className="quiz-main">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="quiz-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Bot size={32} />
                </motion.div>
                <p>Loading next question...</p>
              </motion.div>
            ) : currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={session.questionsAnswered + 1}
                totalAnswered={session.questionsAnswered}
                onAnswer={handleAnswer}
                timeLimit={timeLimit}
                source="pdf"
              />
            ) : (
              <motion.div key="done" className="quiz-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>Quiz complete! Redirecting...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PDFQuiz;
