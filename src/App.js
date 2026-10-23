import React, { useState, useRef } from 'react';
import { analyzePitch, PRESET_PITCHES } from './analyzer';
import { VENTURE_DEAL_CORPUS } from './data/sharkTankCorpus';
import { saveSubscriberEmail } from './supabaseClient';
import './App.css';

const INITIAL_SAVED_PITCHES = [
  {
    id: 'p-1',
    title: 'PitchIQ - Main Pitch',
    snippet: 'Did you know enterprise sales teams waste 15 hours a week manually prepping discovery pitches?...',
    score: 79,
    status: 'Analysed',
    lastUpdated: '2 days ago',
    scoreType: 'high'
  },
  {
    id: 'p-2',
    title: 'Consumer Beverage Brand',
    snippet: 'Hi, I\'m Parth, founder of King Water company. We bring pure Himalayan spring water infused with natural gold dust...',
    score: 64,
    status: 'Analysed',
    lastUpdated: '5 days ago',
    scoreType: 'mid'
  },
  {
    id: 'p-3',
    title: 'Hardware IoT Pitch',
    snippet: 'How many times have you lost your keys or phone right when you are running late for an important meeting?...',
    score: 72,
    status: 'Analysed',
    lastUpdated: '1 week ago',
    scoreType: 'high'
  },
  {
    id: 'p-4',
    title: 'Early Draft - AI Platform',
    snippet: 'We are building a next-generation neural copilot for automated sales calls and customer insights...',
    score: null,
    status: 'Draft',
    lastUpdated: '1 week ago',
    scoreType: 'draft'
  },
  {
    id: 'p-5',
    title: 'Revised Pitch - Series A',
    snippet: 'With $480k in ARR and 140% net dollar retention, we are raising $1.5M to dominate the enterprise sales intelligence market...',
    score: 81,
    status: 'Analysed',
    lastUpdated: '2 weeks ago',
    scoreType: 'high'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'results' | 'database' | 'saved'
  const [pitch, setPitch] = useState(PRESET_PITCHES[0].text);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [result, setResult] = useState(() => analyzePitch(PRESET_PITCHES[0].text, 'Investor Pitch', 'Investors'));
  const [loading, setLoading] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [hasSubscribed, setHasSubscribed] = useState(() => Boolean(localStorage.getItem('pitchiq_newsletter_joined')));
  const [copied, setCopied] = useState(false);
  const [savedPitches, setSavedPitches] = useState(INITIAL_SAVED_PITCHES);
  const [savedFilter, setSavedFilter] = useState('all'); // 'all' | 'drafts' | 'analysed'
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Deal Database search & filters
  const [dbSearch, setDbSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const textareaRef = useRef(null);

  const wordCount = pitch.trim().split(/\s+/).filter(Boolean).length;

  const executeAnalysis = () => {
    if (pitch.trim().length < 25 || loading) return;
    setLoading(true);
    setTimeout(() => {
      const r = analyzePitch(pitch, 'Investor Pitch', 'Investors');
      setResult(r);
      setLoading(false);
      setActiveTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleAnalyzeClick = () => {
    if (pitch.trim().length < 25 || loading) return;
    if (!hasSubscribed) {
      setShowNewsletter(true);
    } else {
      executeAnalysis();
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    await saveSubscriberEmail(cleanEmail, pitch);
    setHasSubscribed(true);
    setShowNewsletter(false);
    setEmailError('');
    executeAnalysis();
  };

  const handleNewsletterSkip = () => {
    setShowNewsletter(false);
    setEmailError('');
    executeAnalysis();
  };

  const handlePresetSelect = (preset, index) => {
    setSelectedPreset(index);
    setPitch(preset.text);
  };

  const handleCopyRewrite = () => {
    if (!result?.rewritten_opening) return;
    navigator.clipboard.writeText(result.rewritten_opening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCurrentPitch = () => {
    const newPitch = {
      id: `p-${Date.now()}`,
      title: pitch.slice(0, 32).trim() + '...',
      snippet: pitch.slice(0, 100),
      score: result?.overall_score || 75,
      status: 'Analysed',
      lastUpdated: 'Just now',
      scoreType: (result?.overall_score || 75) >= 75 ? 'high' : 'mid'
    };
    setSavedPitches([newPitch, ...savedPitches]);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  // Filtered Deal Database
  const filteredDeals = VENTURE_DEAL_CORPUS.filter(deal => {
    const matchesSearch = dbSearch === '' ||
      deal.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
      deal.industry.toLowerCase().includes(dbSearch.toLowerCase()) ||
      deal.summary.toLowerCase().includes(dbSearch.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || deal.industry === selectedIndustry;
    const matchesStage = selectedStage === 'All' || deal.stage.includes(selectedStage);
    return matchesSearch && matchesIndustry && matchesStage;
  });

  // Filtered Saved Pitches
  const filteredSavedPitches = savedPitches.filter(item => {
    if (savedFilter === 'drafts') return item.status === 'Draft';
    if (savedFilter === 'analysed') return item.status === 'Analysed';
    return true;
  });

  const industriesList = ['All', ...new Set(VENTURE_DEAL_CORPUS.map(d => d.industry))];
  const stagesList = ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Angel'];

  // Score metrics
  const score = result?.overall_score ?? 79;
  const verdictTitle = result?.verdict?.split(':')[0] || 'Promising Concept';

  return (
    <div className="app-container">

      {/* ── Top Navigation Bar (Shown on Home / Landing View) ── */}
      {activeTab === 'home' && (
        <header className="top-nav">
          <div className="nav-inner">
            <div className="nav-brand" onClick={() => setActiveTab('home')}>
              <span className="brand-logo">PitchIQ</span>
              <span className="brand-dot" />
            </div>

            <nav className="nav-menu">
              <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                Home
              </button>
              <button className="nav-item" onClick={() => setActiveTab('database')}>
                Deal Database
              </button>
              <button className="nav-item" onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                How It Works
              </button>
              <button className="nav-item" onClick={() => setActiveTab('saved')}>
                Templates
              </button>
              <button className="nav-item" onClick={() => setActiveTab('saved')}>
                Saved Pitches
              </button>
            </nav>

            <div className="nav-profile">
              <span className="avatar-circle">A</span>
              <span className="profile-name">Akshat</span>
              <span className="profile-chevron">▾</span>
            </div>
          </div>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 1: HERO & PITCH INPUT VIEW (Top Left of image)
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'home' && (
        <main className="hero-page">
          {/* Decorative floating crystal/graph widgets */}
          <div className="floating-shape shape-left" aria-hidden="true" />
          <div className="floating-shape shape-right" aria-hidden="true" />
          <div className="floating-graph-widget" aria-hidden="true">
            <div className="graph-badge">
              <span className="graph-dot" /> Stronger Pitches
            </div>
            <div className="graph-sub">Higher Chances</div>
          </div>

          <div className="hero-content">
            <div className="hero-pill-badge">
              AI-POWERED PITCH ANALYSIS
            </div>

            <h1 className="hero-headline">
              Turn Your Idea Into<br />
              An <span className="gradient-text">Investment-Ready Pitch</span>
            </h1>

            <p className="hero-description">
              Get instant, AI-powered feedback on your startup pitch backed by real venture deals, investor insights, and proven frameworks.
            </p>

            {/* 3 Feature Pills Row */}
            <div className="feature-cards-row">
              <div className="feature-card">
                <div className="feature-icon icon-purple">🛡️</div>
                <div className="feature-text">
                  <strong>Investor-Grade Feedback</strong>
                  <span>Based on real VC criteria</span>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon icon-blue">📊</div>
                <div className="feature-text">
                  <strong>Real Venture Comparisons</strong>
                  <span>Learn from similar deals</span>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon icon-cyan">⚡</div>
                <div className="feature-text">
                  <strong>Actionable Suggestions</strong>
                  <span>Improve and iterate faster</span>
                </div>
              </div>
            </div>

            {/* Main Editor Card */}
            <div className="editor-card">
              {/* Presets Row */}
              <div className="sample-chips-row">
                <span className="sample-label">Try a sample:</span>
                <div className="chips-group">
                  {PRESET_PITCHES.map((preset, idx) => (
                    <button
                      key={preset.title}
                      className={`sample-chip ${selectedPreset === idx ? 'selected' : ''}`}
                      onClick={() => handlePresetSelect(preset, idx)}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="textarea-container">
                <textarea
                  ref={textareaRef}
                  className="hero-textarea"
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Paste your pitch here (e.g. problem, solution, unit economics, traction, and funding ask)..."
                  rows={6}
                />
              </div>

              {/* Editor Card Footer */}
              <div className="editor-card-footer">
                <span className="word-count-badge">{wordCount} words</span>

                <button
                  className="analyze-cta-btn"
                  onClick={handleAnalyzeClick}
                  disabled={pitch.trim().length < 25 || loading}
                >
                  {loading ? (
                    <><span className="spinner-circle" /> Analyzing Pitch...</>
                  ) : (
                    <>✨ Analyze Pitch &rarr;</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════
          DASHBOARD WRAPPER: SCREENS 3, 4, 5, 6 (With Left Sidebar)
      ══════════════════════════════════════════════════════════════ */}
      {activeTab !== 'home' && (
        <div className="dashboard-layout">
          {/* ── Left Sidebar Navigation ── */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-brand" onClick={() => setActiveTab('home')}>
              <span className="brand-logo">PitchIQ</span>
              <span className="brand-dot" />
            </div>

            <nav className="sidebar-menu">
              <button
                className={`sidebar-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <span className="sidebar-icon">📝</span>
                New Analysis
              </button>

              <button
                className={`sidebar-link ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                <span className="sidebar-icon">📊</span>
                Pitch Analysis
              </button>

              <button
                className={`sidebar-link ${activeTab === 'database' ? 'active' : ''}`}
                onClick={() => setActiveTab('database')}
              >
                <span className="sidebar-icon">🏛️</span>
                Deal Database
              </button>

              <button
                className={`sidebar-link ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <span className="sidebar-icon">💾</span>
                Saved Pitches
              </button>

              <button
                className="sidebar-link"
                onClick={() => { setActiveTab('home'); setSelectedPreset(1); setPitch(PRESET_PITCHES[1].text); }}
              >
                <span className="sidebar-icon">📄</span>
                Templates
              </button>

              <button
                className="sidebar-link"
                onClick={() => setActiveTab('saved')}
              >
                <span className="sidebar-icon">⏱️</span>
                History
              </button>

              <button
                className="sidebar-link"
                onClick={() => alert('PitchIQ v2.0 Settings: Client-side RAG active. Supabase connection ready.')}
              >
                <span className="sidebar-icon">⚙️</span>
                Settings
              </button>
            </nav>

            {/* Bottom Upgrade to Pro Card */}
            <div className="upgrade-card">
              <div className="upgrade-title">
                <span className="crown-icon">👑</span> Upgrade to Pro
              </div>
              <ul className="upgrade-benefits">
                <li>✔ Unlimited analyses</li>
                <li>✔ Advanced insights</li>
                <li>✔ Export reports</li>
              </ul>
              <button
                className="upgrade-btn"
                onClick={() => alert('PitchIQ Pro: Unlimited analyses and PDF exports included for university demo!')}
              >
                Upgrade
              </button>
            </div>
          </aside>

          {/* ── Main Dashboard Workspace ── */}
          <div className="dashboard-main">

            {/* Top Workspace Header */}
            <header className="dashboard-header">
              <div className="header-titles">
                {activeTab === 'results' && (
                  <>
                    <h2 className="page-heading">Pitch Analysis Results</h2>
                    <p className="page-subheading">AI-powered evaluation based on investor criteria and real venture data.</p>
                  </>
                )}
                {activeTab === 'database' && (
                  <>
                    <h2 className="page-heading">Deal Database</h2>
                    <p className="page-subheading">Explore real venture deals and find similar companies to your pitch.</p>
                  </>
                )}
                {activeTab === 'saved' && (
                  <>
                    <h2 className="page-heading">Saved Pitches</h2>
                    <p className="page-subheading">Manage and revisit your previous pitch analyses.</p>
                  </>
                )}
              </div>

              <div className="header-actions">
                {activeTab === 'results' && (
                  <>
                    <button className="secondary-action-btn" onClick={handleDownloadReport}>
                      📥 Download Report
                    </button>
                    <button className="primary-gradient-btn" onClick={handleSaveCurrentPitch}>
                      💾 {saveSuccessMsg ? 'Saved! ✓' : 'Save Pitch'}
                    </button>
                  </>
                )}

                {activeTab === 'saved' && (
                  <button className="primary-gradient-btn" onClick={() => setActiveTab('home')}>
                    + New Analysis
                  </button>
                )}

                <div className="nav-profile-badge">
                  <span className="avatar-circle">A</span>
                  <span className="profile-name">Akshat</span>
                  <span className="profile-chevron">▾</span>
                </div>
              </div>
            </header>

            {/* ══════════════════════════════════════════════════════════════
                SCREENS 3 & 4: RESULTS & DETAILED FEEDBACK VIEW
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'results' && result && (
              <div className="results-grid-layout">

                {/* Left Column: Score + 3 Bento Cards (Screen 3) */}
                <div className="results-primary-col">

                  {/* Investability Score Banner Card */}
                  <div className="card-panel score-banner-card">
                    <div className="score-main-row">
                      <div className="score-badge-circle">
                        <span className="key-icon">🔑</span>
                      </div>
                      <div className="score-details">
                        <span className="score-sub-label">INVESTABILITY SCORE</span>
                        <div className="score-value-row">
                          <span className="score-big-number">{score}</span>
                          <span className="score-fraction">/100</span>
                        </div>
                        <div className="score-horizontal-bar">
                          <div className="score-fill" style={{ width: `${score}%` }} />
                        </div>
                      </div>

                      <div className="score-verdict-col">
                        <div className="promising-concept-pill">
                          <span className="leaf-icon">🌱</span> {verdictTitle}
                        </div>
                        <div className="tags-row">
                          {result.winning_tags?.map(tag => (
                            <span key={tag} className="gray-pill-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Cards Row */}
                  <div className="bento-row">

                    {/* Card 1: 6-Factor Analysis */}
                    <div className="card-panel factor-analysis-card">
                      <div className="panel-header">
                        <span className="panel-icon">📊</span>
                        <h3 className="panel-title">Pitch Analysis</h3>
                      </div>

                      <div className="factors-list">
                        {Object.entries(result.metrics).map(([factorName, factorVal]) => (
                          <div key={factorName} className="factor-row">
                            <span className="factor-name">{factorName}</span>
                            <div className="factor-progress-track">
                              <div
                                className="factor-progress-fill"
                                style={{ width: `${factorVal}%` }}
                              />
                            </div>
                            <span className="factor-number">{factorVal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 2: Similar Venture Deals */}
                    <div className="card-panel deals-benchmark-card">
                      <div className="panel-header">
                        <span className="panel-icon">🏛️</span>
                        <h3 className="panel-title">Similar Venture Deals</h3>
                      </div>

                      <div className="deals-items-stack">
                        {/* Funded Benchmark */}
                        <div className="deal-entry">
                          <span className="deal-indicator funded-dot" />
                          <div className="deal-info">
                            <div className="deal-title">{result.retrieved_case_studies.funded_benchmark.name}</div>
                            <div className="deal-meta-line">
                              Funded &bull; {result.retrieved_case_studies.funded_benchmark.stage || result.retrieved_case_studies.funded_benchmark.season} &bull; {result.retrieved_case_studies.funded_benchmark.ask}
                            </div>
                          </div>
                        </div>

                        {/* Cautionary Benchmark */}
                        <div className="deal-entry">
                          <span className="deal-indicator cautionary-dot" />
                          <div className="deal-info">
                            <div className="deal-title">{result.retrieved_case_studies.rejected_benchmark.name}</div>
                            <div className="deal-meta-line">
                              Cautionary &bull; {result.retrieved_case_studies.rejected_benchmark.stage || result.retrieved_case_studies.rejected_benchmark.season} &bull; {result.retrieved_case_studies.rejected_benchmark.ask}
                            </div>
                          </div>
                        </div>

                        {/* Winning Hook Quote Box */}
                        <div className="deal-hook-quote-box">
                          <p className="hook-quote-text">
                            "{result.retrieved_case_studies.funded_benchmark.hook}"
                          </p>
                          <span className="hook-attribution">
                            Winning hook &mdash; {result.retrieved_case_studies.funded_benchmark.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Investor Reactions */}
                    <div className="card-panel investor-panel-card">
                      <div className="panel-header">
                        <span className="panel-icon">👔</span>
                        <h3 className="panel-title">Investor Reactions</h3>
                      </div>

                      <div className="investor-quotes-list">
                        {(result.investor_reactions || result.shark_reactions || []).map((reaction, i) => (
                          <div key={i} className="investor-reaction-block">
                            <div className="investor-head">
                              <span className="investor-role">{reaction.name}</span>
                              <span className="investor-badge">{reaction.archetype}</span>
                            </div>
                            <p className="investor-comment">
                              "{reaction.feedback}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column: Detailed Feedback (Screen 4) */}
                <div className="results-secondary-col">
                  <div className="detailed-feedback-wrapper">

                    {/* Suggested Opening Rewrite Card */}
                    <div className="card-panel rewrite-panel">
                      <div className="panel-header-split">
                        <div className="panel-header">
                          <span className="panel-icon-bulb">💡</span>
                          <h3 className="panel-title">Suggested Opening Rewrite</h3>
                        </div>
                        <button className="copy-action-btn" onClick={handleCopyRewrite}>
                          {copied ? 'Copied ✓' : '📋 Copy'}
                        </button>
                      </div>

                      <p className="rewrite-content-text">
                        {result.rewritten_opening}
                      </p>
                    </div>

                    {/* Critical Flags Card */}
                    <div className="card-panel flags-panel">
                      <div className="flags-header">
                        <span className="alert-triangle">⚠️</span>
                        <h3 className="flags-title">Critical Flags</h3>
                      </div>

                      <ul className="flags-bullet-list">
                        {result.mistakes?.map((flag, idx) => (
                          <li key={idx} className="flag-bullet-item">
                            <span className="bullet-point">&bull;</span>
                            <span className="flag-text">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Edit Pitch CTA Button */}
                    <button
                      className="edit-pitch-btn"
                      onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      &larr; Edit Pitch
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                SCREEN 5: DEAL DATABASE VIEW (Bottom Left of image)
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'database' && (
              <div className="database-view-panel">
                {/* Search & Filters Bar */}
                <div className="database-controls-bar">
                  <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      className="db-search-input"
                      placeholder="Search companies, industries or keywords..."
                      value={dbSearch}
                      onChange={(e) => setDbSearch(e.target.value)}
                    />
                  </div>

                  <div className="filter-dropdowns">
                    <select
                      className="filter-select"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                      {industriesList.map(ind => (
                        <option key={ind} value={ind}>{ind === 'All' ? 'All Industries ▾' : ind}</option>
                      ))}
                    </select>

                    <select
                      className="filter-select"
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                    >
                      {stagesList.map(st => (
                        <option key={st} value={st}>{st === 'All' ? 'All Stages ▾' : st}</option>
                      ))}
                    </select>

                    <button
                      className="clear-filter-btn"
                      onClick={() => { setDbSearch(''); setSelectedIndustry('All'); setSelectedStage('All'); }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Deals Table */}
                <div className="table-responsive-card">
                  <table className="deal-data-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Industry</th>
                        <th>Stage</th>
                        <th>Amount</th>
                        <th>Equity</th>
                        <th>Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeals.map(deal => (
                        <tr key={deal.id}>
                          <td className="company-cell">
                            <span className="company-logo-dot" />
                            <strong>{deal.name}</strong>
                          </td>
                          <td>
                            <span className="table-industry-pill">{deal.industry}</span>
                          </td>
                          <td>
                            <span className="table-stage-pill">{deal.stage}</span>
                          </td>
                          <td className="amount-cell">{deal.amount}</td>
                          <td className="equity-cell">{deal.equity}</td>
                          <td className="year-cell">{deal.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                SCREEN 6: SAVED PITCHES VIEW (Bottom Right of image)
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'saved' && (
              <div className="saved-pitches-view-panel">
                {/* Tabs filter */}
                <div className="saved-tabs-row">
                  <div className="saved-filter-tabs">
                    <button
                      className={`saved-tab ${savedFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setSavedFilter('all')}
                    >
                      All ({savedPitches.length})
                    </button>
                    <button
                      className={`saved-tab ${savedFilter === 'drafts' ? 'active' : ''}`}
                      onClick={() => setSavedFilter('drafts')}
                    >
                      Drafts ({savedPitches.filter(p => p.status === 'Draft').length})
                    </button>
                    <button
                      className={`saved-tab ${savedFilter === 'analysed' ? 'active' : ''}`}
                      onClick={() => setSavedFilter('analysed')}
                    >
                      Analysed ({savedPitches.filter(p => p.status === 'Analysed').length})
                    </button>
                  </div>
                </div>

                {/* Saved Pitches Table */}
                <div className="table-responsive-card">
                  <table className="saved-data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Score</th>
                        <th>Last Updated</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSavedPitches.map((saved) => (
                        <tr key={saved.id}>
                          <td className="saved-title-cell">
                            <strong>{saved.title}</strong>
                            <p className="saved-snippet">{saved.snippet}</p>
                          </td>
                          <td>
                            {saved.score !== null ? (
                              <span className={`table-score-pill ${saved.score >= 75 ? 'green' : 'amber'}`}>
                                {saved.score}
                              </span>
                            ) : (
                              <span className="table-score-pill gray">Draft</span>
                            )}
                          </td>
                          <td className="date-cell">{saved.lastUpdated}</td>
                          <td>
                            <span className={`status-tag ${saved.status === 'Analysed' ? 'analysed' : 'draft'}`}>
                              {saved.status}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="action-icon-btn"
                              title="Edit & Re-analyze"
                              onClick={() => { setPitch(saved.snippet); setActiveTab('home'); }}
                            >
                              ✏️
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Delete"
                              onClick={() => setSavedPitches(savedPitches.filter(p => p.id !== saved.id))}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 2: NEWSLETTER MODAL (Top Right of image)
      ══════════════════════════════════════════════════════════════ */}
      {showNewsletter && (
        <div className="overlay-backdrop" onClick={() => setShowNewsletter(false)}>
          <div className="newsletter-card-modal" onClick={e => e.stopPropagation()}>
            <div className="newsletter-modal-header">
              <span className="modal-brand">PitchIQ</span>
              <button
                className="modal-close-cross"
                onClick={() => setShowNewsletter(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Envelope Illustration Icon */}
            <div className="newsletter-envelope-visual">
              <div className="envelope-graphic">
                <span className="letter-icon">✉️</span>
                <span className="sparkle-deco">✨</span>
              </div>
            </div>

            <div className="newsletter-tag-badge">
              FOUNDER NEWSLETTER
            </div>

            <h3 className="newsletter-card-title">
              Unlock Your Pitch Rating
            </h3>

            <p className="newsletter-card-sub">
              Join 4,200+ founders receiving weekly pitch breakdowns, fundraising templates, and venture teardowns directly in their inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="newsletter-modal-form">
              <div className="input-with-icon">
                <span className="mail-icon">✉</span>
                <input
                  type="email"
                  className={`modal-email-input ${emailError ? 'has-error' : ''}`}
                  placeholder="Enter your email (e.g. founder@company.com)"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  autoFocus
                />
              </div>
              {emailError && <div className="modal-error-message">{emailError}</div>}

              <button type="submit" className="unlock-pitch-score-btn">
                Unlock Pitch Score &rarr;
              </button>

              <div className="benefits-checklist">
                <div className="check-item">
                  <span className="blue-check">✔</span> Weekly pitch breakdowns
                </div>
                <div className="check-item">
                  <span className="blue-check">✔</span> Proven fundraising templates
                </div>
                <div className="check-item">
                  <span className="blue-check">✔</span> Real venture deal examples
                </div>
              </div>

              <div className="modal-bottom-links">
                <span className="privacy-reassurance">Zero spam. Unsubscribe with 1 click anytime.</span>
                <button type="button" className="skip-link-btn" onClick={handleNewsletterSkip}>
                  Skip for now &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="simple-app-footer">
        <span>PitchIQ &bull; AI-Powered Pitch Analysis & Venture Intelligence</span>
        <span>Silver Oak University &bull; Dept. of Computer Engineering</span>
      </footer>

    </div>
  );
}
