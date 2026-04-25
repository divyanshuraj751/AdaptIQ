import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createSession, processAnswer, pickNextQuestion,
  fetchGeminiQuestion, getEngagementScore, saveSessionToHistory,
  DIFFICULTY_LEVELS,
} from '../engine/adaptive';
import questions, { TOPICS } from '../data/questions';
import QuestionCard from '../components/quiz/QuestionCard';
import DifficultyMeter from '../components/quiz/DifficultyMeter';
import PerformanceChart from '../components/quiz/PerformanceChart';
import { Bot, AlertTriangle, ChevronLeft, BarChart3, Calculator, FlaskConical, Code, Globe, PenTool } from 'lucide-react';

const TOTAL_QUESTIONS = 15;
const marksMap = { easy: 2, medium: 5, hard: 10 };

const topicIcons = {
  mathematics: <Calculator size={20} />,
  science: <FlaskConical size={20} />,
  programming: <Code size={20} />,
  general: <Globe size={20} />
};

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // User-chosen starting difficulty (from Home selector). Defaults to 'adaptive'.
  const rawDifficulty = (searchParams.get('difficulty') || 'adaptive').toLowerCase();
  const startDifficulty = ['easy', 'medium', 'hard', 'adaptive'].includes(rawDifficulty)
    ? rawDifficulty
    : 'adaptive';

  // Determine topic — preset vs custom
  const topicData = TOPICS.find(t => t.id === topicId);
  const isCustom = !topicData;
  const effectiveTopic = topicId ? decodeURIComponent(topicId) : null;

  const [session, setSession] = useState(() =>
    createSession(effectiveTopic, { startDifficulty })
  );
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [geminiStats, setGeminiStats] = useState({ generated: 0, fallbacks: 0 });
  const [geminiError, setGeminiError] = useState(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Load the first question
  useEffect(() => {
    loadNextQuestion(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextQuestion = useCallback(async (updatedSession) => {
    setIsLoading(true);
    setGeminiError(null);

    // Always try AI first — forward both engine difficulty and user-requested difficulty
    const geminiQ = await fetchGeminiQuestion(
      updatedSession.topic,
      updatedSession.difficulty,
      updatedSession.startDifficulty
    );

    if (geminiQ) {
      geminiQ.source = 'gemini';
      if (!geminiQ.marks) geminiQ.marks = marksMap[geminiQ.difficulty] || 5;
      setCurrentQuestion(geminiQ);
      setGeminiStats(prev => ({ ...prev, generated: prev.generated + 1 }));
      setIsLoading(false);
      return;
    }

    // Fallback to static bank ONLY for preset topics
    if (!isCustom) {
      const staticQ = pickNextQuestion(updatedSession, questions);
      if (staticQ) {
        staticQ.source = 'bank';
        staticQ.marks = marksMap[staticQ.difficulty] || 5;
        setCurrentQuestion(staticQ);
        setGeminiStats(prev => ({ ...prev, fallbacks: prev.fallbacks + 1 }));
        setIsLoading(false);
        return;
      }
    }

    // For custom topics with no AI — show error
    setGeminiError(
      'AI API rate limit reached. Please wait a few minutes and try again, or use a preset topic which has a static fallback.'
    );
    setIsLoading(false);
  }, [isCustom]);

  const handleAnswer = useCallback((questionId, isCorrect, timeSpentMs, difficulty) => {
    const marks = currentQuestion?.marks || marksMap[difficulty] || 5;
    setSession(prev => {
      const updated = processAnswer(prev, questionId, isCorrect, timeSpentMs, difficulty, marks);
      sessionRef.current = updated;

      if (updated.questionsAnswered >= TOTAL_QUESTIONS) {
        setTimeout(() => {
          const saved = saveSessionToHistory(updated);
          navigate('/analytics', { state: { session: updated, savedEntry: saved } });
        }, 500);
        return updated;
      }

      // Load next question after feedback delay
      setTimeout(() => loadNextQuestion(updated), 1600);
      return updated;
    });
  }, [navigate, loadNextQuestion, currentQuestion]);

  if (!effectiveTopic) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <h2>No topic specified</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    );
  }

  const progress = (session.questionsAnswered / TOTAL_QUESTIONS) * 100;
  const engagement = getEngagementScore(session);
  const displayName = isCustom ? effectiveTopic : (topicData?.label || topicId);
  const displayIcon = isCustom ? <PenTool size={20} /> : (topicIcons[topicData.id] || <PenTool size={20} />);
  const displayColor = isCustom ? '#818cf8' : (topicData?.color || '#818cf8');

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
            style={{ '--topic-color': displayColor }}
          >
            <span>{displayIcon}</span>
            <span>{displayName}</span>
          </motion.div>

          {isCustom && (
            <div className="gemini-powered-badge">
              🤖 AI-Generated Questions
            </div>
          )}

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
              <span>{session.questionsAnswered}/{TOTAL_QUESTIONS}</span>
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

          <div className="gemini-status">
            <span className="gemini-badge">
              AI: {geminiStats.generated} · Bank: {geminiStats.fallbacks}
            </span>
          </div>

          <button className="btn-toggle-chart" onClick={() => setShowChart(!showChart)}>
            {showChart ? 'Chart: Hide' : 'Chart: Show'} Live Chart
          </button>

          {showChart && session.history.length >= 2 && (
            <div className="quiz-live-chart">
              <PerformanceChart history={session.history} title="Live Performance" isIRT={true} />
            </div>
          )}

          <button className="btn-quit" onClick={() => {
            if (window.confirm('End quiz early? Your progress will be saved.')) {
              const saved = saveSessionToHistory(session);
              navigate('/analytics', { state: { session, savedEntry: saved } });
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
                <p>Generating question with AI...</p>
                <p className="loading-sub">Topic: {displayName} · Difficulty: {session.difficulty}</p>
              </motion.div>
            ) : geminiError ? (
              <motion.div
                key="error"
                className="quiz-gemini-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="error-icon">!</div>
                <h3>API Unavailable</h3>
                <p>{geminiError}</p>
                <div className="error-actions">
                  <button className="btn-primary" onClick={() => loadNextQuestion(session)}>
                    Retry
                  </button>
                  <button className="btn-secondary" onClick={() => navigate('/')}>
                    ← Back to Home
                  </button>
                </div>
              </motion.div>
            ) : currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={session.questionsAnswered + 1}
                totalAnswered={session.questionsAnswered}
                onAnswer={handleAnswer}
                timeLimit={30}
                source={currentQuestion.source}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
