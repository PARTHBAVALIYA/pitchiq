import React, { useState } from 'react';
import { analyzePitch, PRESET_PITCHES } from './analyzer';
import { SHARK_TANK_CORPUS } from './data/sharkTankCorpus';
import './App.css';

const PITCH_TYPES = ["Investor Pitch", "Shark Tank Pitch", "Sales Demo", "Interview"];
const AUDIENCES   = ["Investors", "Enterprise", "SMB", "General"];

function ScoreRing({ score, label = "Shark Investability" }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#00FF9D' : score >= 60 ? '#FFB800' : '#FF4757';
  
  return (
    <div className="score-ring-wrap">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
        <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '56px 56px', transition: 'stroke-dasharray 1s ease' }}/>
      </svg>
      <div className="score-center">
        <span className="score-val" style={{ color }}>{score}</span>
        <span className="score-scale">/100</span>
      </div>
      <p className="score-caption">{label}</p>
    </div>
  );
}

function MetricProgressBar({ name, score }) {
  const color = score >= 80 ? '#00FF9D' : score >= 60 ? '#FFB800' : '#FF4757';
  return (
    <div className="metric-box">
      <div className="metric-head">
        <span className="metric-title">{name}</span>
        <span className="metric-num" style={{ color }}>{score}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function App() {
  const [pitch, setPitch]             = useState('');
  const [pitchType, setPType]         = useState('Shark Tank Pitch');
  const [audience, setAudience]       = useState('Investors');
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState(null);
  const [activeTab, setActiveTab]     = useState('scorecard');
  const [showCorpusModal, setShowModal] = useState(false);
  const [copied, setCopied]           = useState(false);

  const wordCount = pitch.trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((wordCount / 140) * 60);

  const handleAnalyze = () => {
    if (pitch.trim().length < 25) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyzePitch(pitch, pitchType, audience));
      setLoading(false);
      setActiveTab('scorecard');
    }, 1200);
  };

  const handleLoadPreset = (preset) => {
    setPitch(preset.text);
    setPType(preset.type);
    setAudience(preset.audience);
    setResult(null);
  };

  const handleCopyRewrite = () => {
    if (!result?.rewritten_opening) return;
    navigator.clipboard.writeText(result.rewritten_opening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setPitch('');
  };

  return (
    <div className="app-root">
      {/* Background glow effects */}
      <div className="ambient-grid" />
      <div className="glow-sphere glow-left" />
      <div className="glow-sphere glow-right" />

      {/* Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo">IQ</div>
            <div className="brand-title">
              Pitch<span>IQ</span>
              <span className="rag-badge">RAG v2.0</span>
            </div>
          </div>
          <div className="nav-center-badge">
            <span className="dot-live" /> Silver Oak University • Project ID: M2_CSE_027
          </div>
          <div className="nav-actions">
            <button className="nav-ghost-btn" onClick={() => setShowModal(true)}>
              📚 Shark Tank Corpus ({SHARK_TANK_CORPUS.length})
            </button>
            <a 
              href="https://github.com/PARTHBAVALIYA/pitchiq" 
              target="_blank" 
              rel="noreferrer" 
              className="nav-github-link"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <header className="hero-banner">
          <div className="hero-pill">
            <span className="pill-spark">⚡</span> Case-Based Retrieval & Real-Time Pitch Intelligence
          </div>
          <h1 className="hero-headline">
            Stop Getting Rejected.<br />
            <span className="gradient-text">Pitch Like A Funded Founder.</span>
          </h1>
          <p className="hero-lead">
            Evaluates your pitch script against <strong>200+ real Shark Tank & YC deals</strong>. 
            Detect fatal weak points, benchmark against funded peers, and dynamic-rewrite your opening for maximum persuasion.
          </p>

          <div className="stat-strip">
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Shark Tank Deals Indexed</span>
            </div>
            <div className="stat-sep">•</div>
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Communication Metrics</span>
            </div>
            <div className="stat-sep">•</div>
            <div className="stat-item">
              <span className="stat-number">&lt; 1.6s</span>
              <span className="stat-label">Client-Side RAG Latency</span>
            </div>
            <div className="stat-sep">•</div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Zero-Cloud Privacy</span>
            </div>
          </div>
        </header>

        {/* Input Mode */}
        {!result && !loading && (
          <section className="input-panel">
            {/* 1-Click Presets */}
            <div className="presets-bar">
              <span className="presets-label">⚡ 1-Click Test Scenarios:</span>
              <div className="presets-chips">
                {PRESET_PITCHES.map((preset, idx) => (
                  <button 
                    key={idx} 
                    className="preset-btn" 
                    onClick={() => handleLoadPreset(preset)}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectors */}
            <div className="config-grid">
              <div className="config-card">
                <label className="config-label">Presentation Scenario</label>
                <div className="chips-row">
                  {PITCH_TYPES.map(t => (
                    <button
                      key={t}
                      className={`chip-opt ${pitchType === t ? 'active' : ''}`}
                      onClick={() => setPType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-card">
                <label className="config-label">Target Evaluation Mode</label>
                <div className="chips-row">
                  {AUDIENCES.map(a => (
                    <button
                      key={a}
                      className={`chip-opt ${audience === a ? 'active' : ''}`}
                      onClick={() => setAudience(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="editor-card">
              <div className="editor-toolbar">
                <span className="editor-title">
                  <span className="editor-dot" /> Pitch Script Input
                </span>
                <div className="editor-meta">
                  <span>{wordCount} words</span>
                  <span className="meta-sep">|</span>
                  <span>{pitch.length} chars</span>
                  <span className="meta-sep">|</span>
                  <span>~{estimatedSeconds}s spoken @ 140 WPM</span>
                </div>
              </div>

              <textarea
                className="pitch-textarea"
                rows={7}
                placeholder="Paste or draft your pitch script here...&#10;&#10;Tip: Click any 1-Click Scenario above to test with pre-built Shark Tank level pitches!"
                value={pitch}
                onChange={e => setPitch(e.target.value)}
              />

              <div className="editor-footer">
                <span className="min-char-hint">
                  {pitch.trim().length < 25 ? "⚠️ Min 25 characters required to run RAG evaluation" : "✅ Script ready for Shark Tank evaluation"}
                </span>
                <button
                  className="analyze-cta-btn"
                  onClick={handleAnalyze}
                  disabled={pitch.trim().length < 25}
                >
                  ⚡ Run Shark Tank RAG Analysis
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="loading-card">
            <div className="radar-spinner">
              <div className="radar-circle" />
              <div className="radar-sweep" />
            </div>
            <h3 className="loading-title">Retrieving Shark Tank Knowledge Base...</h3>
            <p className="loading-desc">
              Matching your script against 200+ funded and rejected deals • Calculating metric indices • Synthesizing Shark feedback
            </p>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <section className="results-dashboard">
            {/* Top Overview Card */}
            <div className="hero-scorecard">
              <div className="scorecard-left">
                <ScoreRing score={result.overall_score} label="Investability Score" />
              </div>

              <div className="scorecard-center">
                <div className="verdict-tag-row">
                  <span className={`verdict-pill ${result.overall_score >= 80 ? 'green' : result.overall_score >= 60 ? 'yellow' : 'red'}`}>
                    {result.verdict.split(':')[0]}
                  </span>
                  <span className="match-pill">
                    🎯 RAG Top Match: {result.retrieved_case_studies.primary.name} ({result.retrieved_case_studies.primary.industry})
                  </span>
                </div>
                <h2 className="verdict-headline">{result.verdict}</h2>
                <div className="tags-cluster">
                  {result.winning_tags.map(t => (
                    <span key={t} className="feature-tag positive">✓ {t}</span>
                  ))}
                  {result.danger_tags.map(t => (
                    <span key={t} className="feature-tag warning">⚠️ {t}</span>
                  ))}
                </div>
              </div>

              <div className="scorecard-right">
                <button className="new-pitch-btn" onClick={handleReset}>
                  ↩ Analyze New Pitch
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-nav">
              <button 
                className={`tab-btn ${activeTab === 'scorecard' ? 'active' : ''}`}
                onClick={() => setActiveTab('scorecard')}
              >
                📊 Score Breakdown
              </button>
              <button 
                className={`tab-btn ${activeTab === 'rag_cases' ? 'active' : ''}`}
                onClick={() => setActiveTab('rag_cases')}
              >
                🦈 Shark Tank Benchmarks (RAG)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'sharks' ? 'active' : ''}`}
                onClick={() => setActiveTab('sharks')}
              >
                💬 The Shark Panel
              </button>
              <button 
                className={`tab-btn ${activeTab === 'rewrite' ? 'active' : ''}`}
                onClick={() => setActiveTab('rewrite')}
              >
                ✍️ Shark-Grade Rewrite
              </button>
              <button 
                className={`tab-btn ${activeTab === 'flaws' ? 'active' : ''}`}
                onClick={() => setActiveTab('flaws')}
              >
                🚫 Fatal Weaknesses
              </button>
            </div>

            {/* Tab 1: Score Breakdown */}
            {activeTab === 'scorecard' && (
              <div className="tab-pane metrics-pane">
                <div className="metrics-grid">
                  {Object.entries(result.metrics).map(([name, score]) => (
                    <MetricProgressBar key={name} name={name} score={score} />
                  ))}
                </div>
                <div className="quick-recap-box">
                  <h4>💡 Immediate Action Item</h4>
                  <p>{result.improvements[0]}</p>
                </div>
              </div>
            )}

            {/* Tab 2: RAG Shark Tank Case Studies */}
            {activeTab === 'rag_cases' && (
              <div className="tab-pane cases-pane">
                <div className="cases-split-grid">
                  {/* Funded Case */}
                  <div className="case-card funded">
                    <div className="case-header">
                      <span className="case-outcome-badge funded">✅ FUNDED DEAL BENCHMARK</span>
                      <span className="case-season">{result.retrieved_case_studies.funded_benchmark.season}</span>
                    </div>
                    <h3 className="case-name">{result.retrieved_case_studies.funded_benchmark.name}</h3>
                    <p className="case-valuation">
                      Deal: <strong>{result.retrieved_case_studies.funded_benchmark.ask}</strong> • Investor: <strong>{result.retrieved_case_studies.funded_benchmark.investor}</strong>
                    </p>
                    <p className="case-summary">{result.retrieved_case_studies.funded_benchmark.summary}</p>

                    <div className="case-hook-box">
                      <span className="subhead">Winning Hook Formula:</span>
                      <p>"{result.retrieved_case_studies.funded_benchmark.hook}"</p>
                    </div>

                    <div className="case-strengths">
                      <span className="subhead">Why The Sharks Invested:</span>
                      <ul>
                        {result.retrieved_case_studies.funded_benchmark.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rejected Case */}
                  <div className="case-card rejected">
                    <div className="case-header">
                      <span className="case-outcome-badge rejected">❌ REJECTED DEAL COMPARISON</span>
                      <span className="case-season">{result.retrieved_case_studies.rejected_benchmark.season}</span>
                    </div>
                    <h3 className="case-name">{result.retrieved_case_studies.rejected_benchmark.name}</h3>
                    <p className="case-valuation">
                      Asked: <strong>{result.retrieved_case_studies.rejected_benchmark.ask}</strong> • Outcome: <strong>All Sharks Passed</strong>
                    </p>
                    <p className="case-summary">{result.retrieved_case_studies.rejected_benchmark.summary}</p>

                    <div className="case-hook-box rejected-hook">
                      <span className="subhead">Why Sharks Said "I'm Out":</span>
                      <p>{result.retrieved_case_studies.rejected_benchmark.sharkFeedback}</p>
                    </div>

                    <div className="case-strengths">
                      <span className="subhead">Fatal Pitch Flaws To Avoid:</span>
                      <ul>
                        {result.retrieved_case_studies.rejected_benchmark.weaknessesFlagged.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Shark Panel Personas */}
            {activeTab === 'sharks' && (
              <div className="tab-pane sharks-pane">
                <div className="sharks-grid">
                  {result.shark_reactions.map((shark, idx) => (
                    <div key={idx} className="shark-card">
                      <div className="shark-avatar-wrap">
                        <span className="shark-icon">{shark.avatar}</span>
                        <div>
                          <h4 className="shark-name">{shark.name}</h4>
                          <span className="shark-sub">{shark.archetype} • Focus: {shark.focus}</span>
                        </div>
                      </div>
                      <blockquote className="shark-quote">
                        "{shark.feedback}"
                      </blockquote>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Shark-Grade Rewrite */}
            {activeTab === 'rewrite' && (
              <div className="tab-pane rewrite-pane">
                <div className="rewrite-banner">
                  <div className="rewrite-header">
                    <h3>✍️ Shark-Grade 5-Part Script Rewrite</h3>
                    <button className="copy-btn" onClick={handleCopyRewrite}>
                      {copied ? "✓ Copied to Clipboard!" : "📋 Copy Full Script"}
                    </button>
                  </div>
                  <p className="rewrite-sub">
                    Re-engineered using the 5-part Shark Tank conversion framework: 
                    <em> [Hook Question] ➔ [Universal Problem] ➔ [Proprietary Solution] ➔ [Unit Economics] ➔ [Clear Ask]</em>
                  </p>
                  <div className="rewrite-script-box">
                    {result.rewritten_opening}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Fatal Weaknesses & Roadmap */}
            {activeTab === 'flaws' && (
              <div className="tab-pane flaws-pane">
                <div className="flaws-grid">
                  <div className="flaw-box critical">
                    <h4>🚫 Fatal Mistakes (Why Sharks Say "I'm Out")</h4>
                    {result.mistakes.map((m, i) => (
                      <div key={i} className="flaw-item error">
                        <span className="flaw-bullet">•</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flaw-box improvement">
                    <h4>💡 Actionable Roadmap to Get Funded</h4>
                    {result.improvements.map((imp, i) => (
                      <div key={i} className="flaw-item success">
                        <span className="flaw-bullet">✓</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bottom-bar-actions">
              <button className="analyze-cta-btn secondary" onClick={handleReset}>
                Analyze Another Script
              </button>
            </div>
          </section>
        )}

        {/* Modal: Knowledge Base Explorer */}
        {showCorpusModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div className="modal-window" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">📚 PitchIQ Shark Tank Knowledge Base</h3>
                  <p className="modal-sub">Indexed deal corpus used by the RAG retrieval engine</p>
                </div>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className="corpus-list">
                {SHARK_TANK_CORPUS.map(c => (
                  <div key={c.id} className="corpus-row">
                    <div className="corpus-col-left">
                      <span className={`badge-pill ${c.outcome === 'Funded' ? 'funded' : 'rejected'}`}>
                        {c.outcome}
                      </span>
                      <h4 className="corpus-name">{c.name}</h4>
                      <span className="corpus-meta">{c.season} • {c.industry}</span>
                    </div>
                    <div className="corpus-col-mid">
                      <p className="corpus-desc">{c.summary}</p>
                      <span className="corpus-hook"><strong>Hook:</strong> "{c.hook}"</span>
                    </div>
                    <div className="corpus-col-right">
                      <span className="corpus-ask">Ask: {c.ask}</span>
                      <span className="corpus-investor">Partner: {c.investor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer-bar">
        <div className="footer-content">
          <span>PitchIQ v2.0 • AI Pitch & Communication Intelligence</span>
          <span>Silver Oak University • Department of Computer Engineering • Project ID: M2_CSE_027</span>
          <span>Engineered by Parth Bavalliya, Harsh Varatiya, Akshat Solanki</span>
        </div>
      </footer>
    </div>
  );
}
