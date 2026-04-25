import React from 'react';
import { motion } from 'framer-motion';
import { DIFFICULTY_LEVELS } from '../../engine/adaptive';

const DifficultyMeter = ({ proficiency, difficulty, streak, engagement, isIRT = false }) => {
  const level = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.medium;

  // For IRT: theta is -2..+2, map to 0..100 for bar display
  // For legacy EMA: proficiency is 0..1
  const pct = isIRT
    ? Math.round(((proficiency + 2) / 4) * 100)
    : Math.round(proficiency * 100);

  const getStreakDisplay = () => {
    if (streak >= 3) return { text: `🔥 ${streak} streak!`, cls: 'streak-hot' };
    if (streak <= -3) return { text: `❄️ ${Math.abs(streak)} miss streak`, cls: 'streak-cold' };
    if (streak > 0) return { text: `✅ ${streak} correct`, cls: 'streak-pos' };
    if (streak < 0) return { text: `❌ ${Math.abs(streak)} wrong`, cls: 'streak-neg' };
    return { text: 'Ready', cls: '' };
  };

  const streakInfo = getStreakDisplay();
  const engPct = Math.round((engagement || 0) * 100);

  return (
    <div className="difficulty-meter">
      <div className="meter-header">
        <span className="meter-label">Current Level</span>
        <motion.span
          className="meter-difficulty"
          style={{ color: level.color }}
          key={difficulty}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {level.emoji} {level.label}
        </motion.span>
      </div>

      <div className="meter-bar-container">
        <div className="meter-bar-bg">
          <motion.div
            className="meter-bar-fill"
            style={{ background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)' }}
            initial={{ width: '50%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.div
            className="meter-bar-indicator"
            animate={{ left: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="meter-bar-labels">
          <span>Easy</span>
          <span>Medium</span>
          <span>Hard</span>
        </div>
      </div>

      {isIRT && (
        <div className="meter-theta">
          <span className="theta-label">θ (ability)</span>
          <span className="theta-value">{typeof proficiency === 'number' ? proficiency.toFixed(2) : '0.00'}</span>
        </div>
      )}

      <div className="meter-footer">
        <span className={`meter-streak ${streakInfo.cls}`}>{streakInfo.text}</span>
        <div className="meter-engagement">
          <span className="engagement-label">Flow</span>
          <div className="engagement-bar">
            <motion.div
              className="engagement-fill"
              animate={{ width: `${engPct}%` }}
              style={{
                background: engPct > 60 ? '#10b981' : engPct > 30 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
          <span className="engagement-value">{engPct}%</span>
        </div>
      </div>
    </div>
  );
};

export default DifficultyMeter;
