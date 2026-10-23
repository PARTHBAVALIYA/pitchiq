import React, { useState, useRef, useCallback } from 'react';
import { analyzePitch, PRESET_PITCHES } from './analyzer';
import { SHARK_TANK_CORPUS } from './data/sharkTankCorpus';
import './App.css';

export default function App() {
  const [pitch, setPitch]         = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [showCorpus, setShowCorpus] = useState(false);
  const [copied, setCopied]       = useState(false);
  const textareaRef               = useRef(null);
  const gutterRef                 = useRef(null);

  const lineCount = Math.max((pitch.match(/\n/g) || []).length + 1, 10);

  const syncScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleAnalyze = () => {
    if (pitch.trim().length < 25 || loading) return;
    setLoading(true);
    setTimeout(() => {
      setResult(analyzePitch(pitch, 'Shark Tank Pitch', 'Investors'));
      setLoading(false);
    }, 700);
  };

  const handlePreset = (preset) => {
    setPitch(preset.text);
    setResult(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleCopy = () => {
    if (!result?.rewritten_opening) return;
    navigator.clipboard.writeText(result.rewritten_opening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const score = result?.overall_score ?? null;
  const scoreAccent =
    score === null ? '#2563EB'
    : score >= 75  ? '#2563EB'
    : score >= 50  ? '#D97706'
    :                '#DC2626';

  const verdictShort = result
    ? result.verdict.split(':')[0]
    : null;

  const wordCount = pitch.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="root">

      {/* ── Navigation ── */}
      <nav className="nav">
        <span className="brand">PitchIQ</span>
        <span className="nav-center">
          Silver Oak University &bull; M2_CSE_027 &bull; Guide: Prof. Hemali Patel
        </span>
        <button className="nav-ghost" onClick={() => setShowCorpus(true)}>
          Deal Database ({SHARK_TANK_CORPUS.length})
        </button>
      </nav>

      {/* ── Workspace ── */}
      <div className="workspace">

        {/* ── Left: Editor Column ── */}
        <aside className="editor-col">
          <p className="col-heading">PITCH SCRIPT</p>

          {/* Code-editor style textarea */}
          <div className="editor-box">
            <div className="line-gutter" ref={gutterRef} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i} className="line-num">{i + 1}</span>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="pitch-ta"
              value={pitch}
              onChange={e => { setPitch(e.target.value); setResult(null); }}
              onScroll={syncScroll}
              placeholder={"Enter your pitch script here...\n\nExample:\n\"Hi, I'm Parth, founder of PitchIQ.\nWe eliminate the $40B problem of...\nOur MRR is $24k with 78% gross margins.\nWe're raising $250k for 10% equity.\""}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Stat line */}
          <div className="stat-line">
            <span>{wordCount} words</span>
            <span className="dot-sep">&bull;</span>
            <span>{pitch.length} chars</span>
            <span className="dot-sep">&bull;</span>
            <span>~{Math.round((wordCount / 140) * 60)}s spoken</span>
          </div>

          {/* Preset Scenarios */}
          <div className="preset-section">
            <p className="preset-heading">TEST SCENARIOS</p>
            <div className="preset-grid">
              {PRESET_PITCHES.map((p, i) => (
                <button key={i} className="preset-btn" onClick={() => handlePreset(p)}>
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={pitch.trim().length < 25 || loading}
          >
            {loading
              ? <><span className="btn-spinner" /> Analyzing...</>
              : 'Analyze Script \u2192'
            }
          </button>

          {pitch.trim().length < 25 && pitch.length > 0 && (
            <p className="min-hint">Minimum 25 characters required</p>
          )}
        </aside>

        {/* ── Right: Bento Grid ── */}
        <main className="bento">

          {/* Card 1 — Investability Score */}
          <div className="card score-card">
            <p className="card-label">INVESTABILITY SCORE</p>
            {score !== null ? (
              <>
                <div className="big-num" style={{ color: scoreAccent }}>
                  {score}
                  <span className="big-denom">/100</span>
                </div>
                <div className="gauge-track">
                  <div
                    className="gauge-fill"
                    style={{ width: `${score}%`, backgroundColor: scoreAccent }}
                  />
                </div>
                <div className="score-sub-row">
                  <span className="verdict-badge" style={{ color: scoreAccent, borderColor: scoreAccent }}>
                    {verdictShort}
                  </span>
                  <div className="tag-row">
                    {result.winning_tags.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="big-num empty">&mdash;</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: 0 }} /></div>
                <p className="empty-hint">Submit a script to generate your score</p>
              </>
            )}
          </div>

          {/* Card 2 — Venture Precedent Match */}
          <div className="card match-card">
            <p className="card-label">VENTURE PRECEDENT MATCH (RAG)</p>
            {result ? (
              <>
                <table className="match-table">
                  <thead>
                    <tr>
                      <th>Classification</th>
                      <th>Matched Deal</th>
                      <th>Period</th>
                      <th>Terms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="indicator funded" />
                        <span className="indicator-label">FUNDED</span>
                      </td>
                      <td className="deal-name">{result.retrieved_case_studies.funded_benchmark.name}</td>
                      <td className="deal-meta">{result.retrieved_case_studies.funded_benchmark.season}</td>
                      <td className="deal-meta">{result.retrieved_case_studies.funded_benchmark.ask}</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="indicator rejected" />
                        <span className="indicator-label">CAUTIONARY</span>
                      </td>
                      <td className="deal-name">{result.retrieved_case_studies.rejected_benchmark.name}</td>
                      <td className="deal-meta">{result.retrieved_case_studies.rejected_benchmark.season}</td>
                      <td className="deal-meta">{result.retrieved_case_studies.rejected_benchmark.ask}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="match-quote-block">
                  <p className="match-quote">
                    &ldquo;{result.retrieved_case_studies.funded_benchmark.hook}&rdquo;
                  </p>
                  <span className="match-quote-attr">
                    Winning hook — {result.retrieved_case_studies.funded_benchmark.name}
                  </span>
                </div>
              </>
            ) : (
              <div className="empty-table-state">
                <table className="match-table muted">
                  <thead>
                    <tr><th>Classification</th><th>Matched Deal</th><th>Period</th><th>Terms</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="indicator empty-ind" /><span className="indicator-label muted">FUNDED</span></td>
                      <td className="deal-name muted">&mdash;</td>
                      <td className="deal-meta muted">&mdash;</td>
                      <td className="deal-meta muted">&mdash;</td>
                    </tr>
                    <tr>
                      <td><span className="indicator empty-ind" /><span className="indicator-label muted">CAUTIONARY</span></td>
                      <td className="deal-name muted">&mdash;</td>
                      <td className="deal-meta muted">&mdash;</td>
                      <td className="deal-meta muted">&mdash;</td>
                    </tr>
                  </tbody>
                </table>
                <p className="empty-hint">Venture deals will be retrieved after analysis</p>
              </div>
            )}
          </div>

          {/* Card 3 — 6-Factor Analysis */}
          <div className="card metrics-card">
            <p className="card-label">6-FACTOR ANALYSIS</p>
            <div className="metric-list">
              {result
                ? Object.entries(result.metrics).map(([name, val]) => (
                    <div key={name} className="metric-row">
                      <span className="metric-name">{name}</span>
                      <div className="metric-track">
                        <div
                          className="metric-fill"
                          style={{ width: `${val}%`, backgroundColor: val >= 75 ? '#2563EB' : val >= 50 ? '#D97706' : '#DC2626' }}
                        />
                      </div>
                      <span className="metric-val" style={{ color: val >= 75 ? '#2563EB' : val >= 50 ? '#D97706' : '#DC2626' }}>
                        {val}
                      </span>
                    </div>
                  ))
                : ['Clarity & Logic', 'Opening Hook', 'Rhetorical Structure', 'Persuasion & Proof', 'Call-to-Action', 'Investor Confidence']
                    .map(name => (
                      <div key={name} className="metric-row">
                        <span className="metric-name muted">{name}</span>
                        <div className="metric-track">
                          <div className="metric-fill" style={{ width: '0%', backgroundColor: '#1E293B' }} />
                        </div>
                        <span className="metric-val muted">&mdash;</span>
                      </div>
                    ))
              }
            </div>
          </div>

          {/* Card 4 — Investor Panel & Revised Script */}
          <div className="card reactions-card">
            <div className="card-label-row">
              <p className="card-label">INVESTOR PANEL REACTIONS</p>
              {result && (
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? 'Copied \u2713' : 'Copy Revised Script'}
                </button>
              )}
            </div>

            {result ? (
              <>
                <div className="reactions-list">
                  {result.shark_reactions.map((r, i) => (
                    <div key={i} className="reaction-item">
                      <div className="reaction-head">
                        <span className="reaction-persona">{r.name}</span>
                        <span className="reaction-archetype">{r.archetype}</span>
                      </div>
                      <p className="reaction-text">&ldquo;{r.feedback}&rdquo;</p>
                    </div>
                  ))}
                </div>

                {result.mistakes.length > 0 && (
                  <div className="flaws-bar">
                    <span className="flaws-label">CRITICAL FLAGS</span>
                    <div className="flaw-chips">
                      {result.mistakes.slice(0, 2).map((m, i) => (
                        <span key={i} className="flaw-chip">
                          {m.split('—')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="reactions-placeholder">
                {['Tech & Scalability', 'Unit Economics & Margins', 'Consumer & Demonstration'].map(name => (
                  <div key={name} className="reaction-item empty">
                    <div className="reaction-head">
                      <span className="reaction-persona muted">{name}</span>
                    </div>
                    <p className="reaction-text muted">Awaiting script analysis...</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* ── Corpus Modal ── */}
      {showCorpus && (
        <div className="overlay" onClick={() => setShowCorpus(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">Venture Capital Deal Corpus</h3>
                <p className="modal-sub">
                  {SHARK_TANK_CORPUS.length} deals indexed for Case-Based Retrieval (Jaccard Similarity)
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowCorpus(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <table className="corpus-tbl">
                <thead>
                  <tr>
                    <th>Company</th><th>Industry</th><th>Ask</th>
                    <th>Outcome</th><th>Critical Lesson</th>
                  </tr>
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
                      <td className="small">
                        {c.outcome === 'Funded' ? c.strengths[0] : c.weaknessesFlagged[0]}
                      </td>
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
        <span>PitchIQ v2.0 &bull; Project ID: M2_CSE_027 &bull; Dept. of Computer Engineering, Silver Oak University</span>
        <span>Hosted on Vercel Edge Serverless</span>
      </footer>
    </div>
  );
}
