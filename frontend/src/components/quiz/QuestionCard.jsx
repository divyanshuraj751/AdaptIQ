import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIFFICULTY_LEVELS } from '../../engine/adaptive';

const QuestionCard = ({ question, questionNumber, totalAnswered, onAnswer, timeLimit = 30, source = 'bank' }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset state when question changes
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setTimeLeft(timeLimit);
  }, [question.id, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (answered) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [question.id, answered]);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    const elapsed = Date.now() - startTime;
    setElapsedTime(elapsed);
  }, [answered, startTime]);

  const handleSelect = (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const elapsed = Date.now() - startTime;
    setElapsedTime(elapsed);
  };

  const handleNext = () => {
    const isCorrect = selected === question.correctIndex;
    onAnswer(question.id, isCorrect, elapsedTime, question.difficulty);
  };

  const getOptionClass = (index) => {
    if (!answered) return selected === index ? 'option-selected' : '';
    if (index === question.correctIndex) return 'option-correct';
    if (index === selected && selected !== question.correctIndex) return 'option-wrong';
    return 'option-disabled';
  };

  const timerPct = (timeLeft / timeLimit) * 100;
  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 7 ? '#f59e0b' : '#ef4444';
  const level = DIFFICULTY_LEVELS[question.difficulty] || DIFFICULTY_LEVELS.medium;

  return (
      <motion.div
        className="question-card"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50, transition: { duration: 0.15 } }}
        transition={{ duration: 0.3 }}
      >
        <div className="question-header">
          <div className="question-meta">
            <span className="question-number">Q{totalAnswered + 1}</span>
            <span className="question-diff" style={{ color: level.color }}>
              {level.emoji} {level.label}
            </span>
            <span className={`question-source source-${source}`}>
              {source === 'gemini' || source === 'ai' ? 'AI' : 'Bank'}
            </span>
            {question.marks && <span className="question-marks">{question.marks} pts</span>}
          </div>
          <div className="question-timer" style={{ color: timerColor }}>
            <div className="timer-ring">
              <svg viewBox="0 0 36 36">
                <path
                  className="timer-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="timer-fill"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    stroke: timerColor,
                    strokeDasharray: `${timerPct}, 100`,
                  }}
                />
              </svg>
              <span className="timer-text">{timeLeft}s</span>
            </div>
          </div>
        </div>

        <h2 className="question-text">{question.question}</h2>

        <div className="options-grid">
          {question.options.map((opt, i) => (
            <motion.button
              key={i}
              className={`option-btn ${getOptionClass(i)}`}
              onClick={() => handleSelect(i)}
              disabled={answered}
              whileHover={!answered ? { scale: 1.02 } : {}}
              whileTap={!answered ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
              {answered && i === question.correctIndex && <span className="option-icon">✓</span>}
              {answered && i === selected && i !== question.correctIndex && <span className="option-icon">✗</span>}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              className={`explanation-box ${selected === question.correctIndex ? 'correct' : 'wrong'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="explanation-icon">
                {selected === question.correctIndex ? 'Correct!' : timeLeft === 0 ? 'Time\'s up!' : 'Incorrect'}
              </span>
              <p>{question.explanation}</p>
              <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={handleNext}>
                Next Question
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
};

export default QuestionCard;
