import React, { useState } from 'react';
import { analyzePitch } from './analyzer';
import './App.css';

const PITCH_TYPES = ["Investor Pitch", "Sales Call", "Product Demo", "Interview"];
const AUDIENCES   = ["Investors", "Enterprise", "SMB", "General"];

function ScoreCircle({ score }) {
  const r = 38, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? 'var(--accent)' : score >= 50 ? '#ffc400' : '#ff4757';
  return (
    <div className="score-circle">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="4"/>
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '48px 48px' }}/>
      </svg>
      <div className="score-number">
        <span className="score-num" style={{ color }}>{score}</span>
        <span className="score-den">/100</span>
      </div>
    </div>
  );
}

function MetricBar({ name, score }) {
  const color = score >= 70 ? 'var(--accent)' : score >= 50 ? '#ffc400' : '#ff4757';
  return (
    <div className="metric-card">
      <div className="metric-name">{name}</div>
      <div className="metric-bar-bg">
        <div className="metric-bar-fill" style={{ width: `${score}%`, background: color }}/>
      </div>
      <div className="metric-score" style={{ color }}>{score}</div>
    </div>
  );
}

export default function App() {
  const [pitch, setPitch]       = useState('');
  const [pitchType, setPType]   = useState('Investor Pitch');
  const [audience, setAudience] = useState('Investors');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const handleAnalyze = () => {
    if (pitch.trim().length < 30) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyzePitch(pitch, pitchType, audience));
      setLoading(false);
    }, 1600);
  };

  const handleReset = () => { setResult(null); setPitch(''); };

  return (
    <div className="app">
      <div className="grid-bg"/>
      <div className="glow-orb"/>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo-mark">IQ</div>
          <div className="logo-text">Pitch<span>IQ</span></div>
          <span className="beta-tag">BETA</span>
        </header>

        {/* Hero */}
        <section className="hero">
          <p className="eyebrow">AI-Powered Pitch Coach</p>
          <h1 className="hero-title">
            Stop Losing Deals.<br/>
            <span className="accent">Fix Your Pitch.</span>
          </h1>
          <p className="hero-sub">
            Paste your pitch and get instant feedback — mistakes, scores, and a stronger opening.
          </p>
        </section>

        {/* Input Section */}
        {!result && !loading && (
          <section className="input-section">
            <div className="selector-group">
              <p className="selector-label">Pitch Type</p>
              {PITCH_TYPES.map(t => (
                <div key={t} className={`option-chip ${pitchType === t ? 'active' : ''}`} onClick={() => setPType(t)}>
                  {t}
                </div>
              ))}
            </div>

            <div className="selector-group">
              <p className="selector-label">Target Audience</p>
              {AUDIENCES.map(a => (
                <div key={a} className={`option-chip ${audience === a ? 'active' : ''}`} onClick={() => setAudience(a)}>
                  {a}
                </div>
              ))}
            </div>

            <div className="pitch-input-card">
              <p className="input-label"><span className="dot"/> Your Pitch Script</p>
              <textarea
                placeholder={"Paste your pitch script here...\n\nExample: Hi, I'm Parth, founder of King Water. We bring pure Himalayan spring water infused with natural gold dust..."}
                value={pitch}
                onChange={e => setPitch(e.target.value)}
              />
              <p className="char-count">{pitch.length} characters</p>
            </div>

            <button className="analyze-btn" onClick={handleAnalyze} disabled={pitch.trim().length < 30}>
              ⚡ Analyze My Pitch
            </button>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="loader-ring"/>
            <p className="loading-text">Analyzing your pitch...</p>
            <p className="loading-sub">Checking clarity, structure & persuasion</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <section className="results">
            <div className="results-header">
              <h2 className="results-title">Pitch Analysis</h2>
              <button className="reset-btn" onClick={handleReset}>↩ New Pitch</button>
            </div>

            {/* Overall Score */}
            <div className="score-card">
              <ScoreCircle score={result.overall_score}/>
              <div className="score-info">
                <h3>Score: {result.overall_score}/100</h3>
                <p>{result.verdict}</p>
                <div className="tags">
                  {result.winning_tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}
                  {result.danger_tags.map(t => <span key={t} className="tag tag-red">{t}</span>)}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="metrics-grid">
              {Object.entries(result.metrics).map(([n, s]) => <MetricBar key={n} name={n} score={s}/>)}
            </div>

            {/* Mistakes */}
            <div className="feedback-card">
              <div className="feedback-header">
                <span className="feedback-icon">🚫</span>
                <h3>Critical Mistakes</h3>
              </div>
              {result.mistakes.map((m, i) => <div key={i} className="mistake-item">{m}</div>)}
            </div>

            {/* Improvements */}
            <div className="feedback-card">
              <div className="feedback-header">
                <span className="feedback-icon">💡</span>
                <h3>How To Improve</h3>
              </div>
              {result.improvements.map((m, i) => <div key={i} className="improvement-item">{m}</div>)}
            </div>

            {/* Rewrite */}
            <div className="feedback-card">
              <div className="feedback-header">
                <span className="feedback-icon">✍️</span>
                <h3>AI-Rewritten Opening</h3>
              </div>
              <div className="rewrite-box">{result.rewritten_opening}</div>
            </div>

            <button className="analyze-btn" style={{ marginTop: '8px' }} onClick={handleReset}>
              Analyze Another Pitch
            </button>
          </section>
        )}

        <footer className="footer">PITCHIQ · AI PITCH COACH · BUILT BY PARTH</footer>
      </div>
    </div>
  );
}
