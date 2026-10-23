import React, { useState } from 'react';
import { analyzePitch, PRESET_PITCHES } from './analyzer';
import { SHARK_TANK_CORPUS } from './data/sharkTankCorpus';
import './App.css';

const PITCH_TYPES = ["Investor Meeting", "Shark Tank Format", "Product Demo", "Interview"];
const AUDIENCES   = ["Venture Capital", "Enterprise B2B", "Direct Consumer", "General"];

function ScoreRing({ score, label = "Investability Score" }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  
  return (
    <div className="score-ring-wrap">
      <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden="true">
        <circle cx="54" cy="54" r={r} fill="none" stroke="#1E293B" strokeWidth="6"/>
        <circle 
          cx="54" cy="54" r={r} fill="none" stroke="#2563EB" strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '54px 54px', transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="score-center">
        <span className="score-val">{score}</span>
        <span className="score-scale">/100</span>
      </div>
      <p className="score-caption">{label}</p>
    </div>
  );
}

function MetricBar({ name, score }) {
  return (
    <div className="metric-row">
      <div className="metric-head">
        <span className="metric-name">{name}</span>
        <span className="metric-value">{score}%</span>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [pitch, setPitch]               = useState('');
  const [pitchType, setPType]           = useState('Shark Tank Format');
  const [audience, setAudience]         = useState('Venture Capital');
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [activeTab, setActiveTab]       = useState('scorecard');
  const [showCorpusModal, setShowModal] = useState(false);
  const [copied, setCopied]             = useState(false);

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
    }, 800);
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
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="site-header">
        <div className="header-inner">
          <div className="brand-group">
            <span className="brand-name">PitchIQ</span>
            <span className="brand-badge">v2.0</span>
          </div>

          <div className="university-pill">
            Silver Oak University &bull; Project ID: M2_CSE_027
          </div>

          <div className="header-links">
            <button className="text-btn" onClick={() => setShowModal(true)}>
              Deal Database ({SHARK_TANK_CORPUS.length})
            </button>
            <a 
              href="https://github.com/PARTHBAVALIYA/pitchiq" 
              target="_blank" 
              rel="noreferrer" 
              className="text-btn external"
            >
              GitHub &rarr;
            </a>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="content-wrap">
        {/* Hero Section */}
        <header className="hero-section">
          <span className="section-kicker">Case-Based Retrieval & Deal Benchmarking Engine</span>
          <h1 className="hero-title">Empirical Pitch Analysis & Deal Benchmarking</h1>
          <p className="hero-desc">
            Evaluate your pitch against real-world venture capital precedents. PitchIQ identifies 
            structural deficiencies, assesses investor investability, and generates an executive-grade revised script.
          </p>

          <div className="metrics-strip">
            <div className="strip-item">
              <strong>200+</strong> <span>Historical Deals Indexed</span>
            </div>
            <div className="strip-dot">&bull;</div>
            <div className="strip-item">
              <strong>6-Factor</strong> <span>Deterministic Scoring</span>
            </div>
            <div className="strip-dot">&bull;</div>
            <div className="strip-item">
              <strong>&lt; 1.2s</strong> <span>Client-Side RAG Latency</span>
            </div>
          </div>
        </header>

        {/* Input Form Panel */}
        {!result && !loading && (
          <section className="input-section">
            {/* 1-Click Presets */}
            <div className="preset-bar">
              <span className="preset-label">Test Scenarios:</span>
              <div className="preset-pills">
                {PRESET_PITCHES.map((preset, idx) => (
                  <button 
                    key={idx} 
                    className="preset-pill-btn" 
                    onClick={() => handleLoadPreset(preset)}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectors */}
            <div className="config-row">
              <div className="config-block">
                <label className="config-heading">Presentation Context</label>
                <div className="segmented-control">
                  {PITCH_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`segment-btn ${pitchType === t ? 'active' : ''}`}
                      onClick={() => setPType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-block">
                <label className="config-heading">Evaluation Audience</label>
                <div className="segmented-control">
                  {AUDIENCES.map(a => (
                    <button
                      key={a}
                      type="button"
                      className={`segment-btn ${audience === a ? 'active' : ''}`}
                      onClick={() => setAudience(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="editor-container">
              <div className="editor-header">
                <span className="editor-label">Pitch Script Input</span>
                <div className="editor-stats">
                  <span>{wordCount} words</span>
                  <span className="stat-divider">&bull;</span>
                  <span>{pitch.length} chars</span>
                  <span className="stat-divider">&bull;</span>
                  <span>~{estimatedSeconds}s spoken (@ 140 WPM)</span>
                </div>
              </div>

              <textarea
                className="script-input"
                rows={7}
                placeholder="Paste or write your pitch script here to analyze it against historical venture capital deals..."
                value={pitch}
                onChange={e => setPitch(e.target.value)}
              />

              <div className="editor-actions">
                <span className="validation-note">
                  {pitch.trim().length < 25 
                    ? "Minimum 25 characters required for analysis." 
                    : "Script ready for evaluation."}
                </span>
                <button
                  className="primary-btn"
                  onClick={handleAnalyze}
                  disabled={pitch.trim().length < 25}
                >
                  Analyze Pitch Script
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <h3 className="loading-heading">Benchmarking Script Against Venture Capital Corpus</h3>
            <p className="loading-subtext">
              Matching script against historical funded and rejected deals &bull; Computing 6-factor investability metrics...
            </p>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <section className="results-section">
            {/* Overview Card */}
            <div className="summary-card">
              <div className="summary-ring">
                <ScoreRing score={result.overall_score} label="Investability Score" />
              </div>

              <div className="summary-details">
                <div className="verdict-line">
                  <span className="verdict-tag">
                    {result.verdict.split(':')[0]}
                  </span>
                  <span className="benchmark-matched">
                    Matched Precedent: {result.retrieved_case_studies.primary.name} ({result.retrieved_case_studies.primary.industry})
                  </span>
                </div>

                <h2 className="verdict-title">{result.verdict}</h2>

                <div className="tag-list">
                  {result.winning_tags.map(t => (
                    <span key={t} className="tag-item positive">{t}</span>
                  ))}
                  {result.danger_tags.map(t => (
                    <span key={t} className="tag-item cautionary">{t}</span>
                  ))}
                </div>
              </div>

              <div className="summary-action">
                <button className="secondary-btn" onClick={handleReset}>
                  Analyze Another Pitch
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tab-bar">
              <button 
                className={`tab-item ${activeTab === 'scorecard' ? 'active' : ''}`}
                onClick={() => setActiveTab('scorecard')}
              >
                Score Breakdown
              </button>
              <button 
                className={`tab-item ${activeTab === 'rag_cases' ? 'active' : ''}`}
                onClick={() => setActiveTab('rag_cases')}
              >
                Deal Benchmarks (RAG)
              </button>
              <button 
                className={`tab-item ${activeTab === 'sharks' ? 'active' : ''}`}
                onClick={() => setActiveTab('sharks')}
              >
                Investor Panel
              </button>
              <button 
                className={`tab-item ${activeTab === 'rewrite' ? 'active' : ''}`}
                onClick={() => setActiveTab('rewrite')}
              >
                Revised Script
              </button>
              <button 
                className={`tab-item ${activeTab === 'flaws' ? 'active' : ''}`}
                onClick={() => setActiveTab('flaws')}
              >
                Identified Deficiencies
              </button>
            </div>

            {/* Tab 1: Score Breakdown */}
            {activeTab === 'scorecard' && (
              <div className="tab-content">
                <div className="metrics-grid">
                  {Object.entries(result.metrics).map(([name, score]) => (
                    <MetricBar key={name} name={name} score={score} />
                  ))}
                </div>
                <div className="callout-card">
                  <h4 className="callout-heading">Primary Recommendation</h4>
                  <p className="callout-text">{result.improvements[0]}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Deal Benchmarks */}
            {activeTab === 'rag_cases' && (
              <div className="tab-content">
                <div className="dual-deal-grid">
                  {/* Funded Case */}
                  <div className="deal-card funded">
                    <div className="deal-status-bar">
                      <span className="deal-status-label funded">Funded Deal Benchmark</span>
                      <span className="deal-season">{result.retrieved_case_studies.funded_benchmark.season}</span>
                    </div>
                    <h3 className="deal-title">{result.retrieved_case_studies.funded_benchmark.name}</h3>
                    <p className="deal-meta">
                      Deal: <strong>{result.retrieved_case_studies.funded_benchmark.ask}</strong> &bull; Investor: <strong>{result.retrieved_case_studies.funded_benchmark.investor}</strong>
                    </p>
                    <p className="deal-desc">{result.retrieved_case_studies.funded_benchmark.summary}</p>

                    <div className="deal-section-block">
                      <span className="block-label">Winning Hook Formula:</span>
                      <p className="block-quote">&ldquo;{result.retrieved_case_studies.funded_benchmark.hook}&rdquo;</p>
                    </div>

                    <div className="deal-section-block">
                      <span className="block-label">Key Drivers for Funding:</span>
                      <ul className="bullet-list">
                        {result.retrieved_case_studies.funded_benchmark.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rejected Case */}
                  <div className="deal-card rejected">
                    <div className="deal-status-bar">
                      <span className="deal-status-label rejected">Rejected Deal Precedent</span>
                      <span className="deal-season">{result.retrieved_case_studies.rejected_benchmark.season}</span>
                    </div>
                    <h3 className="deal-title">{result.retrieved_case_studies.rejected_benchmark.name}</h3>
                    <p className="deal-meta">
                      Ask: <strong>{result.retrieved_case_studies.rejected_benchmark.ask}</strong> &bull; Result: <strong>All Investors Passed</strong>
                    </p>
                    <p className="deal-desc">{result.retrieved_case_studies.rejected_benchmark.summary}</p>

                    <div className="deal-section-block">
                      <span className="block-label">Investor Post-Mortem:</span>
                      <p className="block-quote">&ldquo;{result.retrieved_case_studies.rejected_benchmark.sharkFeedback}&rdquo;</p>
                    </div>

                    <div className="deal-section-block">
                      <span className="block-label">Fatal Flaws Flagged:</span>
                      <ul className="bullet-list">
                        {result.retrieved_case_studies.rejected_benchmark.weaknessesFlagged.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Investor Panel */}
            {activeTab === 'sharks' && (
              <div className="tab-content">
                <div className="panel-grid">
                  {result.shark_reactions.map((shark, idx) => (
                    <div key={idx} className="panel-card">
                      <div className="panel-header">
                        <span className="panel-badge">{shark.archetype.split(' ')[0]}</span>
                        <div>
                          <h4 className="panel-title">{shark.name}</h4>
                          <span className="panel-subtitle">{shark.archetype} &bull; {shark.focus}</span>
                        </div>
                      </div>
                      <div className="panel-critique">
                        &ldquo;{shark.critique}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Rewritten Script */}
            {activeTab === 'rewrite' && (
              <div className="tab-content">
                <div className="rewrite-card">
                  <div className="rewrite-header">
                    <div>
                      <h3 className="rewrite-title">5-Stage Executive Script Synthesis</h3>
                      <p className="rewrite-subtitle">
                        Structured according to venture capital standards, drawing from top-performing deal formulas.
                      </p>
                    </div>
                    <button className="primary-btn sm" onClick={handleCopyRewrite}>
                      {copied ? "Copied" : "Copy Script"}
                    </button>
                  </div>

                  <div className="script-box">
                    <pre className="script-text">{result.rewritten_opening}</pre>
                  </div>

                  <div className="stages-grid">
                    <div className="stage-item">
                      <span className="stage-num">01</span>
                      <div>
                        <strong>5-Second Hook</strong>
                        <p>Opens with a clear, quantified pain point or provocative question.</p>
                      </div>
                    </div>
                    <div className="stage-item">
                      <span className="stage-num">02</span>
                      <div>
                        <strong>Problem Quantification</strong>
                        <p>Articulates the market inefficiency in tangible metrics.</p>
                      </div>
                    </div>
                    <div className="stage-item">
                      <span className="stage-num">03</span>
                      <div>
                        <strong>Engineered Solution</strong>
                        <p>States the exact mechanism of action without excessive jargon.</p>
                      </div>
                    </div>
                    <div className="stage-item">
                      <span className="stage-num">04</span>
                      <div>
                        <strong>Traction &amp; Unit Economics</strong>
                        <p>Validates unit margins, customer demand, and growth momentum.</p>
                      </div>
                    </div>
                    <div className="stage-item">
                      <span className="stage-num">05</span>
                      <div>
                        <strong>Unambiguous Ask</strong>
                        <p>Concludes with a definitive capital ask or pilot trial close.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Identified Deficiencies */}
            {activeTab === 'flaws' && (
              <div className="tab-content">
                <div className="deficiency-grid">
                  <div className="deficiency-card">
                    <h4 className="deficiency-title">Identified Vulnerabilities</h4>
                    <ul className="deficiency-list">
                      {result.mistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="deficiency-card">
                    <h4 className="deficiency-title">Prescribed Action Steps</h4>
                    <ul className="deficiency-list action">
                      {result.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal: Deal Database */}
      {showCorpusModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Venture Capital &amp; Shark Tank Corpus</h3>
                <p className="modal-subtitle">Curated deal precedents indexed for Case-Based Retrieval (RAG)</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="table-responsive">
                <table className="corpus-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Industry</th>
                      <th>Deal Terms</th>
                      <th>Outcome</th>
                      <th>Key Lesson</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHARK_TANK_CORPUS.map(c => (
                      <tr key={c.id}>
                        <td className="bold">{c.name}</td>
                        <td>{c.industry}</td>
                        <td>{c.ask}</td>
                        <td>
                          <span className={`status-pill ${c.outcome === 'Funded' ? 'funded' : 'rejected'}`}>
                            {c.outcome}
                          </span>
                        </td>
                        <td className="small-text">
                          {c.outcome === 'Funded' ? c.strengths[0] : c.weaknessesFlagged[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <span>PitchIQ v2.0 &bull; Project ID: M2_CSE_027 &bull; Department of Computer Engineering, Silver Oak University</span>
          <span>Deployed on Vercel Edge Serverless</span>
        </div>
      </footer>
    </div>
  );
}
