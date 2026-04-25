import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DIFFICULTY_LEVELS, getSessionStats } from '../engine/adaptive';
import PerformanceChart from '../components/quiz/PerformanceChart';
import { FileText, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';

const PDFResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, pdfQuestions = [], pdfInfo, title } = location.state || {};

  if (!session) {
    return (
      <div className="analytics-page">
        <div className="analytics-empty">
          <h2>No results found</h2>
          <p>Complete a PDF quiz to see your results.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const stats = getSessionStats(session);
  const level = DIFFICULTY_LEVELS[stats.finalDifficulty];

  const getGrade = (acc) => {
    if (acc >= 90) return { letter: 'A+', color: '#10b981', msg: 'Outstanding performance!' };
    if (acc >= 80) return { letter: 'A', color: '#10b981', msg: 'Excellent work!' };
    if (acc >= 70) return { letter: 'B', color: '#06b6d4', msg: 'Great job, keep it up!' };
    if (acc >= 60) return { letter: 'C', color: '#f59e0b', msg: 'Good effort, room to improve.' };
    if (acc >= 50) return { letter: 'D', color: '#f97316', msg: 'Keep practicing!' };
    return { letter: 'F', color: '#ef4444', msg: "Don't give up, try again!" };
  };

  const grade = getGrade(stats.accuracy);

  // Per-topic mastery from the quiz
  const topicStats = {};
  session.history.forEach((h, idx) => {
    const q = pdfQuestions.find(pq => pq.id === h.questionId);
    const topic = q?.topic || 'General';
    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0, sourceChunks: [] };
    topicStats[topic].total++;
    if (h.correct) topicStats[topic].correct++;
    if (q?.sourceChunk) topicStats[topic].sourceChunks.push(q.sourceChunk);
  });

  // Sort topics by mastery (worst first for weak areas)
  const sortedTopics = Object.entries(topicStats)
    .map(([topic, data]) => ({
      topic,
      ...data,
      accuracy: data.total > 0 ? Math.round(data.correct / data.total * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakAreas = sortedTopics.filter(t => t.accuracy < 70).slice(0, 3);

  return (
    <div className="analytics-page">
      <div className="analytics-bg-effects">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <motion.div
        className="analytics-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="analytics-header">
          <h1>Quiz Complete!</h1>
          <p className="analytics-topic">
            <FileText size={18} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            {title || pdfInfo?.filename || 'PDF Quiz'}
          </p>
          {pdfInfo && (
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
              {pdfInfo.pageCount} pages · {pdfInfo.wordCount?.toLocaleString()} words
            </p>
          )}
        </header>

        {/* Grade Card */}
        <motion.div className="grade-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
          <div className="grade-circle" style={{ borderColor: grade.color }}>
            <span className="grade-letter" style={{ color: grade.color }}>{grade.letter}</span>
          </div>
          <div className="grade-info">
            <h2>{stats.accuracy}% Accuracy</h2>
            <p style={{ color: grade.color }}>{grade.msg}</p>
            <div className="grade-detail">
              <span>{stats.correctCount}/{stats.totalQuestions} correct</span>
              <span>·</span>
              <span>{stats.earnedMarks}/{stats.totalMarks} marks ({stats.marksPct}%)</span>
              <span>·</span>
              <span>{stats.duration} min</span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="analytics-stats-grid">
          {[
            { icon: <CheckCircle size={18} />, label: 'Final Level', value: `${level?.label}`, color: level?.color, why: 'Where the adaptive engine placed you' },
            { icon: <BookOpen size={18} />, label: 'Ability (θ)', value: stats.finalTheta.toFixed(2), color: '#818cf8', why: 'IRT ability score (-2 to +2)' },
            { icon: <FileText size={18} />, label: 'Topics Covered', value: `${Object.keys(topicStats).length}`, color: '#06b6d4', why: 'Distinct topics from your PDF' },
            { icon: <AlertTriangle size={18} />, label: 'Weak Areas', value: `${weakAreas.length}`, color: weakAreas.length > 0 ? '#f59e0b' : '#10b981', why: 'Topics below 70% accuracy' },
          ].map((s, i) => (
            <motion.div key={i} className="stat-card-analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
              <span className="stat-icon-a">{s.icon}</span>
              <span className="stat-value-a" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-label-a">{s.label}</span>
              <span className="stat-why">{s.why}</span>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <motion.div className="analytics-chart-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <PerformanceChart history={session.history} title="Difficulty Progression" isIRT={true} />
        </motion.div>

        {/* Topic Mastery Grid */}
        {sortedTopics.length > 0 && (
          <motion.div className="analytics-mastery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <h3>Topic Mastery</h3>
            <div className="mastery-grid">
              {sortedTopics.map(t => {
                const status = t.accuracy >= 80 ? 'mastered' : t.accuracy < 50 ? 'revisit' : 'learning';
                const barColor = t.accuracy >= 80 ? '#10b981' : t.accuracy >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={t.topic} className={`mastery-card mastery-${status}`}>
                    <div className="mastery-header">
                      <span>{t.topic}</span>
                      <span className={`mastery-status status-${status}`}>
                        {status === 'mastered' ? 'Mastered' : status === 'revisit' ? 'Needs Review' : 'Learning'}
                      </span>
                    </div>
                    <div className="mastery-bar-wrap">
                      <div className="mastery-bar">
                        <motion.div
                          className="mastery-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${t.accuracy}%` }}
                          style={{ background: barColor }}
                        />
                      </div>
                      <span className="mastery-pct">{t.accuracy}%</span>
                    </div>
                    <div className="mastery-detail">
                      <span>{t.correct}/{t.total} correct</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Weak Areas — PDF Excerpts to Re-read */}
        {weakAreas.length > 0 && (
          <motion.div className="pdf-weak-areas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <h3>Areas to Review</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>
              Re-read these sections from your PDF to strengthen your understanding.
            </p>
            {weakAreas.map((area, i) => (
              <div key={i} className="pdf-weak-card">
                <div className="pdf-weak-header">
                  <span className="pdf-weak-topic">{area.topic}</span>
                  <span className="pdf-weak-acc" style={{ color: '#ef4444' }}>{area.accuracy}%</span>
                </div>
                {area.sourceChunks.slice(0, 2).map((chunk, ci) => (
                  <blockquote key={ci} className="pdf-source-quote">
                    "{chunk}"
                  </blockquote>
                ))}
              </div>
            ))}
          </motion.div>
        )}

        {/* Difficulty Breakdown */}
        <motion.div className="analytics-breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <h3>Difficulty Breakdown</h3>
          <div className="breakdown-grid">
            {['easy', 'medium', 'hard'].map(d => {
              const info = DIFFICULTY_LEVELS[d];
              let c = 0, t = 0;
              session.history.forEach(h => {
                if (h.difficulty === d) { t++; if (h.correct) c++; }
              });
              const pct = t > 0 ? Math.round(c / t * 100) : 0;
              return (
                <div key={d} className="breakdown-card">
                  <div className="breakdown-header" style={{ color: info.color }}>{info.label}</div>
                  <div className="breakdown-body">
                    <div className="breakdown-stat">
                      <span className="breakdown-big">{c}/{t}</span>
                      <span className="breakdown-small">correct</span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: `${pct}%`, background: info.color }} />
                    </div>
                    <span className="breakdown-pct">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="analytics-actions">
          <motion.button className="btn-primary" onClick={() => navigate('/')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PDFResults;
