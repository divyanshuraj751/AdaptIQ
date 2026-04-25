import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const diffColorMap = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

const PerformanceChart = ({ history, title = 'Proficiency Over Time', isIRT = false }) => {
  if (!history || history.length < 2) {
    return (
      <div className="chart-placeholder">
        <p>📊 Answer at least 2 questions to see your performance chart</p>
      </div>
    );
  }

  const labels = history.map((_, i) => `Q${i + 1}`);

  // For IRT: theta is -2..+2, scale to 0..100 for display
  // For legacy: proficiency is 0..1
  const profData = history.map(h => {
    const val = h.theta !== undefined ? h.theta : h.proficiency;
    if (isIRT || h.theta !== undefined) {
      return +((val + 2) / 4 * 100).toFixed(1);  // -2..+2 → 0..100
    }
    return +(val * 100).toFixed(1);
  });

  const pointColors = history.map(h => diffColorMap[h.newDifficulty] || '#f59e0b');
  const bgColors = history.map(h => h.correct ? 'rgba(16,185,129,0.8)' : 'rgba(239,68,68,0.8)');

  // Threshold lines for IRT: easy < -0.5 (→37.5%), hard > 0.6 (→65%)
  const easyLine = isIRT ? 37.5 : 35;
  const hardLine = isIRT ? 65 : 65;

  const data = {
    labels,
    datasets: [
      {
        label: isIRT ? 'Ability (θ scaled)' : 'Proficiency %',
        data: profData,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129,140,248,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: bgColors,
        pointBorderColor: pointColors,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Easy Threshold',
        data: Array(history.length).fill(easyLine),
        borderColor: 'rgba(16,185,129,0.3)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Hard Threshold',
        data: Array(history.length).fill(hardLine),
        borderColor: 'rgba(239,68,68,0.3)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, usePointStyle: true, padding: 16 },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(129,140,248,0.3)',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          afterBody(items) {
            const idx = items[0]?.dataIndex;
            if (idx === undefined || !history[idx]) return '';
            const h = history[idx];
            const lines = [
              `Result: ${h.correct ? '✅ Correct' : '❌ Wrong'}`,
              `Difficulty: ${h.newDifficulty}`,
              `Time: ${(h.timeSpent / 1000).toFixed(1)}s`,
            ];
            if (h.theta !== undefined) lines.push(`θ: ${h.theta.toFixed(3)}`);
            if (h.expectedP !== undefined) lines.push(`P(correct): ${(h.expectedP * 100).toFixed(0)}%`);
            return lines;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
        grid: { color: 'rgba(51,65,85,0.3)' },
      },
      y: {
        min: 0, max: 100,
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 }, callback: v => `${v}%` },
        grid: { color: 'rgba(51,65,85,0.3)' },
      },
    },
  };

  return (
    <div className="performance-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
      <div className="chart-legend-custom">
        <span className="legend-item"><span className="legend-dot" style={{background:'#10b981'}}></span>Correct</span>
        <span className="legend-item"><span className="legend-dot" style={{background:'#ef4444'}}></span>Wrong</span>
        <span className="legend-item"><span className="legend-dot" style={{background:'#10b981', opacity:0.3}}></span>Easy zone</span>
        <span className="legend-item"><span className="legend-dot" style={{background:'#ef4444', opacity:0.3}}></span>Hard zone</span>
      </div>
    </div>
  );
};

export default PerformanceChart;
