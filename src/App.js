import React, { useState, useRef } from 'react';
import { analyzePitch, PRESET_PITCHES } from './analyzer';
import { SHARK_TANK_CORPUS } from './data/sharkTankCorpus';
import './App.css';

export default function App() {
  const [pitch, setPitch]       = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [showCorpus, setShowCorpus] = useState(false);
  const [copied, setCopied]     = useState(false);
  const resultsRef              = useRef(null);

  const handleAnalyze = () => {
    if (pitch.trim().length < 25 || loading) return;
    setLoading(true);
    setTimeout(() => {
      const r = analyzePitch(pitch, 'Shark Tank Pitch', 'Investors');
      setResult(r);
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 800);
  };

  const handlePreset = (preset) => {
    setPitch(preset.text);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (!result?.rewritten_opening) return;
    navigator.clipboard.writeText(result.rewritten_opening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const score = result?.overall_score ?? null;
  const scoreColor =
    score === null ? 'var(--blue)'
    : score >= 75  ? 'var(--blue)'
    : score >= 50  ? '#D97706'
    :                '#DC2626';

  const wordCount = pitch.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="page">

      {/* ── Nav ── */}
      <nav className="nav">
        <span className="brand">PitchIQ</span>
        <div className="nav-right">
          <button className="nav-link" onClick={() => setShowCorpus(true)}>
            Deal Database
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">AI-Powered Pitch Analysis</p>
          <h1 className="hero-title">How strong is your pitch?</h1>
          <p className="hero-sub">
            Paste your pitch script below and get instant feedback grounded in real Shark Tank deals.
          </p>
        </div>
      </section>

      {/* ── Input Area ── */}
      <section className="input-section">
        <div className="input-wrap">

          {/* Preset chips */}
          <div className="chip-row">
            <span className="chip-label">Try a sample:</span>
            {PRESET_PITCHES.map((p, i) => (
              <button key={i} className="chip" onClick={() => handlePreset(p)}>
                {p.title}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            className="pitch-ta"
            value={pitch}
            onChange={e => { setPitch(e.target.value); setResult(null); }}
            placeholder="Start typing your pitch here...&#10;&#10;e.g. &quot;Hi, I'm Parth. We built PitchIQ to help founders craft investor-ready pitches.&#10;We're raising $250k for 10% equity, with $24k MRR and 78% gross margins...&quot;"
            spellCheck={false}
          />

          {/* Stat + button row */}
          <div className="input-footer">
            <span className="word-count">{wordCount > 0 ? `${wordCount} words` : ''}</span>
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={pitch.trim().length < 25 || loading}
            >
              {loading
                ? <><span className="spinner" /> Analyzing...</>
                : 'Analyze Pitch →'
              }
            </button>
          </div>

          {pitch.length > 0 && pitch.trim().length < 25 && (
            <p className="hint">Need at least 25 characters to analyze.</p>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      {result && (
        <section className="results" ref={resultsRef}>
          <div className="results-inner">

            {/* Score banner */}
            <div className="score-banner">
              <div className="score-left">
                <p className="section-label">Investability Score</p>
                <div className="score-num" style={{ color: scoreColor }}>
                  {score}<span className="score-denom">/100</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill" style={{ width: `${score}%`, background: scoreColor }} />
                </div>
              </div>
              <div className="score-right">
                <span className="verdict-badge" style={{ borderColor: scoreColor, color: scoreColor }}>
                  {result.verdict.split(':')[0]}
                </span>
                <div className="tag-row">
                  {result.winning_tags.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Three result cards */}
            <div className="cards-grid">

              {/* Card: 6-Factor */}
              <div className="rcard">
                <p className="rcard-title">Pitch Analysis</p>
                <div className="metric-list">
                  {Object.entries(result.metrics).map(([name, val]) => (
                    <div key={name} className="metric-row">
                      <span className="metric-name">{name}</span>
                      <div className="metric-track">
                        <div
                          className="metric-fill"
                          style={{
                            width: `${val}%`,
                            background: val >= 75 ? 'var(--blue)' : val >= 50 ? '#D97706' : '#DC2626'
                          }}
                        />
                      </div>
                      <span className="metric-val" style={{ color: val >= 75 ? 'var(--blue)' : val >= 50 ? '#D97706' : '#DC2626' }}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card: Venture Match */}
              <div className="rcard">
                <p className="rcard-title">Similar Deals</p>
                <div className="deal-item">
                  <span className="deal-dot funded" />
                  <div>
                    <p className="deal-name">{result.retrieved_case_studies.funded_benchmark.name}</p>
                    <p className="deal-meta">Funded · {result.retrieved_case_studies.funded_benchmark.season} · {result.retrieved_case_studies.funded_benchmark.ask}</p>
                  </div>
                </div>
                <div className="deal-divider" />
                <div className="deal-item">
                  <span className="deal-dot cautionary" />
                  <div>
                    <p className="deal-name">{result.retrieved_case_studies.rejected_benchmark.name}</p>
                    <p className="deal-meta">Cautionary · {result.retrieved_case_studies.rejected_benchmark.season} · {result.retrieved_case_studies.rejected_benchmark.ask}</p>
                  </div>
                </div>
                <div className="quote-block">
                  <p className="quote-text">"{result.retrieved_case_studies.funded_benchmark.hook}"</p>
                  <p className="quote-attr">Winning hook — {result.retrieved_case_studies.funded_benchmark.name}</p>
                </div>
              </div>

              {/* Card: Investor Reactions */}
              <div className="rcard">
                <p className="rcard-title">Investor Reactions</p>
                {result.shark_reactions.map((r, i) => (
                  <div key={i} className="reaction">
                    <div className="reaction-head">
                      <span className="reaction-name">{r.name}</span>
                      <span className="reaction-arch">{r.archetype}</span>
                    </div>
                    <p className="reaction-text">"{r.feedback}"</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Revised script */}
            {result.rewritten_opening && (
              <div className="rewrite-block">
                <div className="rewrite-head">
                  <p className="section-label">Suggested Opening Rewrite</p>
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <p className="rewrite-text">{result.rewritten_opening}</p>
              </div>
            )}

            {/* Critical flags */}
            {result.mistakes.length > 0 && (
              <div className="flags-block">
                <p className="flags-label">Critical Flags</p>
                <div className="flags-list">
                  {result.mistakes.map((m, i) => (
                    <div key={i} className="flag-item">
                      <span className="flag-dot" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Re-analyze CTA */}
            <div className="re-analyze">
              <button className="ghost-btn" onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                ← Edit Pitch
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ── Corpus Modal ── */}
      {showCorpus && (
        <div className="overlay" onClick={() => setShowCorpus(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">Deal Database</h3>
                <p className="modal-sub">{SHARK_TANK_CORPUS.length} Shark Tank deals used for analysis</p>
              </div>
              <button className="modal-close" onClick={() => setShowCorpus(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <table className="corpus-tbl">
                <thead>
                  <tr><th>Company</th><th>Industry</th><th>Ask</th><th>Outcome</th><th>Key Lesson</th></tr>
                </thead>
                <tbody>
                  {SHARK_TANK_CORPUS.map(c => (
                    <tr key={c.id}>
                      <td className="bold">{c.name}</td>
                      <td>{c.industry}</td>
                      <td className="mono">{c.ask}</td>
                      <td>
                        <span className={`pill ${c.outcome === 'Funded' ? 'funded' : 'rejected'}`}>
                          {c.outcome}
                        </span>
                      </td>
                      <td className="small">{c.outcome === 'Funded' ? c.strengths[0] : c.weaknessesFlagged[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-foot">
              <button className="ghost-btn" onClick={() => setShowCorpus(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <span>PitchIQ v2.0</span>
        <span>AI-Powered Pitch Analysis</span>
      </footer>
    </div>
  );
}
