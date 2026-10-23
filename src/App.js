import React, { useState, useRef, useEffect } from 'react';
import { analyzePitch, PRESET_PITCHES } from './analyzer';
import { extractTextFromPDF, analyzePitchDeck } from './pdfDeckAnalyzer';
import {
  openDatabase,
  dbRegisterUser,
  dbAuthenticateUser,
  dbGetSavedPitches,
  dbSavePitch,
  dbDeletePitch,
  dbGetHistory,
  dbSaveHistoryAttempt
} from './userDatabase';
import './App.css';

// Initial seed history for immediate demonstration
const INITIAL_HISTORY = [
  {
    id: 'rev-1',
    attemptNumber: 1,
    timestamp: '10:14 AM',
    date: 'Yesterday',
    pitchTitle: 'Early Concept Draft',
    pitchText: 'Our product is really amazing and has incredible goodness. We are the best team out there and our solution is completely unique and special in the market. Everyone who has seen it really likes it and we know you will love it too.',
    score: 48,
    verdict: 'High Rejection Risk: Institutional investors would pass due to lack of problem framing and missing traction.',
    metrics: {
      'Clarity & Logic': 40,
      'Opening Hook': 25,
      'Rhetorical Structure': 35,
      'Persuasion & Proof': 30,
      'Call-to-Action': 20,
      'Investor Confidence': 35
    }
  },
  {
    id: 'rev-2',
    attemptNumber: 2,
    timestamp: '02:30 PM',
    date: 'Yesterday',
    pitchTitle: 'Revised with Problem Framing',
    pitchText: 'Hi, I\'m Parth, founder of King Water company. We bring pure Himalayan spring water infused with natural gold dust to help athletes and busy professionals feel refreshed and maintain lasting energy throughout the day. Our water is naturally mineral-rich, providing unmatched purity and better health without any artificial chemicals. Try our first batch today and feel the difference.',
    score: 68,
    verdict: 'Promising Concept: Strong foundational value, but needs harder unit economics and a more decisive closing ask.',
    metrics: {
      'Clarity & Logic': 70,
      'Opening Hook': 55,
      'Rhetorical Structure': 70,
      'Persuasion & Proof': 50,
      'Call-to-Action': 65,
      'Investor Confidence': 65
    }
  },
  {
    id: 'rev-3',
    attemptNumber: 3,
    timestamp: '06:45 PM',
    date: 'Today',
    pitchTitle: 'Investment-Ready B2B SaaS',
    pitchText: 'Did you know enterprise sales teams waste 15 hours a week manually prepping discovery pitches? Hi, I\'m Parth, founder of PitchIQ. We build an automated speech coaching platform that analyzes sales scripts against 200+ funded venture deals. We already have 1,400 active sales reps, $24,000 in monthly recurring revenue, and 78% gross margins. We are raising $250,000 for 10% equity to scale our enterprise pipeline. Join us today.',
    score: 84,
    verdict: 'Investment-Ready: Exceptional balance of hook, quantifiable proof, and commercial viability.',
    metrics: {
      'Clarity & Logic': 85,
      'Opening Hook': 85,
      'Rhetorical Structure': 85,
      'Persuasion & Proof': 85,
      'Call-to-Action': 90,
      'Investor Confidence': 90
    }
  }
];

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'results' | 'deck_results' | 'history' | 'saved'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pitchiq_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // starts with sign up page
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Input Mode: 'text' or 'pdf'
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'pdf'
  const [pitch, setPitch] = useState(PRESET_PITCHES[0].text);
  const [selectedPreset, setSelectedPreset] = useState(0);

  // PDF Deck Upload State
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [deckAnalysis, setDeckAnalysis] = useState(null);

  // Analysis Result & History
  const [result, setResult] = useState(() => analyzePitch(PRESET_PITCHES[0].text, 'Investor Pitch', 'Investors'));
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // History State
  const [pitchHistory, setPitchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('pitchiq_history');
      return stored ? JSON.parse(stored) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  // History Comparison Selectors (index of Revision A and B)
  const [compareRevA, setCompareRevA] = useState(0);
  const [compareRevB, setCompareRevB] = useState(pitchHistory.length - 1);

  // Saved Pitches State (starts completely empty for every new user)
  const [savedPitches, setSavedPitches] = useState([]);
  const [savedFilter, setSavedFilter] = useState('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const fileInputRef = useRef(null);

  // 1. Initialize IndexedDB working database on mount
  useEffect(() => {
    openDatabase().catch(console.warn);
  }, []);

  // 2. Sync user-specific history and saved pitches from working database
  useEffect(() => {
    if (!currentUser?.email) {
      setSavedPitches([]);
      return;
    }

    dbGetHistory(currentUser.email).then(history => {
      if (history && history.length > 0) {
        setPitchHistory(history);
        setCompareRevA(Math.max(0, history.length - 2));
        setCompareRevB(history.length - 1);
      }
    }).catch(console.warn);

    dbGetSavedPitches(currentUser.email).then(saved => {
      setSavedPitches(saved || []);
    }).catch(console.warn);
  }, [currentUser?.email]);

  // Save history to localStorage fast cache
  useEffect(() => {
    try {
      localStorage.setItem('pitchiq_history', JSON.stringify(pitchHistory));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [pitchHistory]);

  // Lock background scroll when any modal is open
  useEffect(() => {
    if (showReportModal || showAuthModal || showHowItWorks) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showReportModal, showAuthModal, showHowItWorks]);

  const wordCount = pitch.trim().split(/\s+/).filter(Boolean).length;

  // ── Working Database Authentication Handlers ──
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthLoading(true);
    try {
      let user;
      if (authMode === 'signup') {
        if (!authName.trim()) {
          setAuthError('Please enter your full name.');
          setAuthLoading(false);
          return;
        }
        user = await dbRegisterUser(authName, authEmail, authPassword);
      } else {
        user = await dbAuthenticateUser(authEmail, authPassword);
      }

      setCurrentUser(user);
      localStorage.setItem('pitchiq_auth_user', JSON.stringify(user));
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthError('');
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSavedPitches([]);
    localStorage.removeItem('pitchiq_auth_user');
    setUserDropdownOpen(false);
  };

  // ── PDF Deck Upload Handler ──
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF presentation deck file.');
      return;
    }

    setPdfFile(file);
    setPdfParsing(true);

    try {
      const extracted = await extractTextFromPDF(file);
      const deckAnalysisResult = analyzePitchDeck(extracted.pages, extracted.fullText);
      setDeckAnalysis(deckAnalysisResult);

      // Populate text editor with extracted presentation transcript
      setPitch(extracted.fullText);
      setPdfParsing(false);
    } catch (err) {
      console.error('PDF parsing error:', err);
      setPdfParsing(false);
      alert('Could not parse PDF. Please ensure the file is an uncorrupted presentation PDF.');
    }
  };

  // ── Run Analysis & Record in History ──
  const executeAnalysis = () => {
    if (pitch.trim().length < 25 || loading) return;
    setLoading(true);

    setTimeout(() => {
      const analysisResult = analyzePitch(pitch, 'Investor Pitch', 'Investors');
      setResult(analysisResult);

      // Record this attempt dynamically in pitch history
      const newAttempt = {
        id: `rev-${Date.now()}`,
        attemptNumber: pitchHistory.length + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        pitchTitle: pitch.slice(0, 36).trim() + '...',
        pitchText: pitch,
        score: analysisResult.overall_score,
        verdict: analysisResult.verdict,
        metrics: analysisResult.metrics
      };

      const updatedHistory = [...pitchHistory, newAttempt];
      setPitchHistory(updatedHistory);
      setCompareRevA(Math.max(0, updatedHistory.length - 2));
      setCompareRevB(updatedHistory.length - 1);

      // Save to working database
      if (currentUser?.email) {
        dbSaveHistoryAttempt(currentUser.email, newAttempt).catch(console.warn);
      }

      setLoading(false);
      setActiveTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  const handlePresetSelect = (preset, index) => {
    setSelectedPreset(index);
    setPitch(preset.text);
    setInputMode('text');
    setDeckAnalysis(null);
    setPdfFile(null);
  };

  const handleCopyRewrite = () => {
    if (!result?.rewritten_opening) return;
    navigator.clipboard.writeText(result.rewritten_opening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCurrentPitch = async () => {
    const newPitch = {
      id: `p-${Date.now()}`,
      title: pitch.slice(0, 32).trim() + '...',
      snippet: pitch.slice(0, 110),
      score: result?.overall_score || 75,
      status: 'Analysed',
      lastUpdated: 'Just now'
    };
    setSavedPitches([newPitch, ...savedPitches]);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);

    // Save to working database
    if (currentUser?.email) {
      await dbSavePitch(currentUser.email, newPitch);
    }
  };

  const handleDeletePitch = async (pitchId) => {
    setSavedPitches(savedPitches.filter(p => p.id !== pitchId));
    if (currentUser?.email) {
      await dbDeletePitch(currentUser.email, pitchId);
    }
  };

  // Restore earlier revision to editor
  const handleRestoreRevision = (rev) => {
    setPitch(rev.pitchText);
    const r = analyzePitch(rev.pitchText, 'Investor Pitch', 'Investors');
    setResult(r);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Saved Pitches
  const filteredSavedPitches = savedPitches.filter(p => {
    if (savedFilter === 'drafts') return p.status === 'Draft';
    if (savedFilter === 'analysed') return p.status === 'Analysed';
    return true;
  });

  const score = result?.overall_score ?? 79;
  const verdictTitle = result?.verdict?.split(':')[0] || 'Promising Concept';

  // Compare Revision A & Revision B for History view
  const revA = pitchHistory[compareRevA] || pitchHistory[0];
  const revB = pitchHistory[compareRevB] || pitchHistory[pitchHistory.length - 1];
  const scoreDelta = revB && revA ? revB.score - revA.score : 0;

  // ── START WITH SIGN UP PAGE IF NOT LOGGED IN ──
  if (!currentUser) {
    return (
      <div className="auth-fullscreen-page">
        <div className="floating-shape shape-left" aria-hidden="true" />
        <div className="floating-shape shape-right" aria-hidden="true" />

        <div className="auth-fullscreen-container">
          <div className="auth-brand-lockup">
            <span className="brand-logo">PitchIQ</span>
            <span className="brand-dot" />
          </div>
          <p className="auth-brand-tagline">
            AI-Powered Pitch Intelligence &bull; Venture Benchmark Engine
          </p>

          <div className="auth-card-modal standalone">
            <div className="auth-mode-toggle">
              <button
                className={`auth-toggle-tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
              <button
                className={`auth-toggle-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
            </div>

            <h3 className="auth-title">
              {authMode === 'signup' ? 'Create Your PitchIQ Account' : 'Welcome Back to PitchIQ'}
            </h3>
            <p className="auth-sub">
              {authMode === 'signup'
                ? 'Get instant, AI-powered pitch script & slide deck evaluations backed by 200+ venture deals.'
                : 'Sign in to access your saved pitches, revision progression, and venture benchmarks.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Parth Bavalliya"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
              </div>

              {authError && (
                <div className="auth-error-banner">
                  ⚠️ {authError}
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                {authLoading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </div>

          <footer className="auth-page-footer">
            <span>PitchIQ &bull; Backed by real venture capital criteria & startup case studies</span>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">

      {/* ── Top Navigation Bar ── */}
      {activeTab === 'home' && (
        <header className="top-nav">
          <div className="nav-inner">
            <div className="nav-brand" onClick={() => setActiveTab('home')}>
              <span className="brand-logo">PitchIQ</span>
              <span className="brand-dot" />
            </div>

            <nav className="nav-menu">
              {activeTab !== 'home' && (
                <button
                  className="nav-item nav-back-btn"
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  title="Back to Pitch Input"
                >
                  ← Back to Pitch
                </button>
              )}
              <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                Home
              </button>
              <button className={`nav-item ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
                Pitch Analysis
              </button>
              <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                Score Comparison
              </button>
              <button className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
                Saved Pitches
              </button>
              <button className="nav-item" onClick={() => setShowHowItWorks(true)}>
                How It Works
              </button>
            </nav>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="nav-profile-container">
                <div className="nav-profile" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <span className="avatar-circle">{currentUser.name.charAt(0).toUpperCase()}</span>
                  <span className="profile-name">{currentUser.name.split(' ')[0]}</span>
                  <span className="profile-chevron">▾</span>
                </div>

                {userDropdownOpen && (
                  <div className="profile-dropdown-card">
                    <div className="dropdown-user-info">
                      <strong>{currentUser.name}</strong>
                      <span className="dropdown-email">{currentUser.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" onClick={() => { setActiveTab('history'); setUserDropdownOpen(false); }}>
                      📈 Score Comparison History
                    </button>
                    <button className="dropdown-item" onClick={() => { setActiveTab('saved'); setUserDropdownOpen(false); }}>
                      💾 Saved Pitches
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="nav-signin-btn" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>
                Sign In
              </button>
            )}
          </div>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 1: HERO & PITCH INPUT VIEW (With PDF Upload & Tabs)
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'home' && (
        <main className="hero-page">
          <div className="floating-shape shape-left" aria-hidden="true" />
          <div className="floating-shape shape-right" aria-hidden="true" />

          <div className="hero-content">
            <div className="hero-pill-badge">
              AI-POWERED PITCH ANALYSIS &bull; V2.0
            </div>

            <h1 className="hero-headline">
              Turn Your Idea Into<br />
              An <span className="gradient-text">Investment-Ready Pitch</span>
            </h1>

            <p className="hero-description">
              Get instant, AI-powered feedback on your startup pitch or pitch deck presentation backed by real venture deals and proven frameworks.
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

            {/* Main Input Card with Text vs PDF Toggle */}
            <div className="editor-card">
              {/* Input Mode Selector Bar */}
              <div className="input-mode-switcher">
                <button
                  className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
                  onClick={() => setInputMode('text')}
                >
                  📝 Pitch Script (Text)
                </button>
                <button
                  className={`mode-btn ${inputMode === 'pdf' ? 'active' : ''}`}
                  onClick={() => setInputMode('pdf')}
                >
                  📄 Pitch Deck (PDF Upload)
                </button>
              </div>

              {/* Mode 1: Text Script */}
              {inputMode === 'text' && (
                <>
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

                  <div className="textarea-container">
                    <textarea
                      className="hero-textarea"
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      placeholder="Paste your pitch here (e.g. problem, solution, unit economics, traction, and funding ask)..."
                      rows={6}
                    />
                  </div>
                </>
              )}

              {/* Mode 2: PDF Pitch Deck Upload */}
              {inputMode === 'pdf' && (
                <div className="pdf-upload-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  <div
                    className={`pdf-dropzone ${pdfFile ? 'has-file' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="pdf-icon-badge">📄</div>
                    {pdfParsing ? (
                      <div className="pdf-parsing-state">
                        <span className="spinner-circle-blue" />
                        <strong>Extracting Slide Deck Content...</strong>
                        <p>Analyzing slide text density and structural sections</p>
                      </div>
                    ) : pdfFile ? (
                      <div className="pdf-uploaded-state">
                        <strong className="pdf-filename">{pdfFile.name}</strong>
                        <p className="pdf-meta-badge">
                          ✓ {(pdfFile.size / 1024).toFixed(1)} KB &bull; {deckAnalysis?.totalSlides || 'Multiple'} Slides Extracted
                        </p>
                        <span className="click-to-change">Click to replace PDF deck</span>
                      </div>
                    ) : (
                      <div className="pdf-prompt-state">
                        <strong>Click or Drag & Drop Pitch Deck (PDF)</strong>
                        <p>Upload your presentation slides (10–15 slides recommended)</p>
                        <span className="pdf-types-hint">Supported format: PDF (.pdf) up to 25MB</span>
                      </div>
                    )}
                  </div>

                  {deckAnalysis && (
                    <div className="deck-summary-strip">
                      <div className="strip-item">
                        <span className="strip-label">Slides Detected</span>
                        <strong>{deckAnalysis.totalSlides} slides</strong>
                      </div>
                      <div className="strip-item">
                        <span className="strip-label">Word Density</span>
                        <strong>~{deckAnalysis.avgWordsPerSlide} words/slide</strong>
                      </div>
                      <div className="strip-item">
                        <span className="strip-label">Key Sections</span>
                        <strong>{deckAnalysis.detectedSections.length}/8 Covered</strong>
                      </div>
                      <div className="strip-item">
                        <span className="strip-label">Deck Structural Score</span>
                        <strong className="green-accent">{deckAnalysis.structuralScore}/100</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Editor Card Footer */}
              <div className="editor-card-footer">
                <span className="word-count-badge">
                  {wordCount} words {deckAnalysis ? `(${deckAnalysis.totalSlides} slides)` : ''}
                </span>

                <button
                  className="analyze-cta-btn"
                  onClick={executeAnalysis}
                  disabled={pitch.trim().length < 25 || loading || pdfParsing}
                >
                  {loading ? (
                    <><span className="spinner-circle" /> Analyzing Pitch...</>
                  ) : (
                    <>✨ Analyze {inputMode === 'pdf' ? 'Pitch Deck' : 'Pitch'} →</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════
          DASHBOARD SHELL: RESULTS, HISTORY, DATABASE, SAVED PITCHES
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
                className="sidebar-link sidebar-back-link"
                onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                title="Back to Pitch Input"
              >
                <span className="sidebar-icon">←</span>
                Back to Pitch
              </button>

              <button
                className={`sidebar-link ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                <span className="sidebar-icon">📊</span>
                Pitch Analysis
              </button>

              <button
                className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <span className="sidebar-icon">📈</span>
                Score Comparison
              </button>

              <button
                className={`sidebar-link ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <span className="sidebar-icon">💾</span>
                Saved Pitches
              </button>
            </nav>

            {/* Upgrade to Pro Card */}
            <div className="sidebar-pro-card">
              <div className="pro-card-header">
                <span className="pro-crown">👑</span>
                <strong className="pro-title">Upgrade to Pro</strong>
              </div>
              <ul className="pro-features">
                <li>✓ Unlimited analyses</li>
                <li>✓ Advanced insights</li>
                <li>✓ Export reports</li>
              </ul>
              <button className="pro-upgrade-btn" onClick={() => setShowAuthModal(true)}>
                Upgrade
              </button>
            </div>
          </aside>

          {/* ── Main Dashboard Workspace ── */}
          <div className="dashboard-main">

            {/* Top Workspace Header */}
            <header className="dashboard-header">
              <div className="header-left-cluster">
                <button
                  className="dashboard-back-btn"
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  title="Back to Pitch Input"
                  aria-label="Back to Pitch Input"
                >
                  <span className="back-arrow">←</span>
                  <span className="back-text">Back to Pitch</span>
                </button>

                <div className="header-titles">
                  {activeTab === 'results' && (
                    <>
                      <h2 className="page-heading">Pitch Analysis Results</h2>
                      <p className="page-subheading">AI-powered evaluation based on investor criteria and real venture data.</p>
                    </>
                  )}
                  {activeTab === 'history' && (
                    <>
                      <h2 className="page-heading">Pitch History & Score Comparison</h2>
                      <p className="page-subheading">Track your progress across iterations and compare exact criteria deltas.</p>
                    </>
                  )}
                  {activeTab === 'saved' && (
                    <>
                      <h2 className="page-heading">Saved Pitches</h2>
                      <p className="page-subheading">Manage and revisit your previous pitch analyses.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="header-actions">
                {activeTab === 'results' && (
                  <>
                    <button className="secondary-action-btn" onClick={() => setShowReportModal(true)}>
                      📥 Download PDF Report
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

                {currentUser ? (
                  <div className="nav-profile-badge" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                    <span className="avatar-circle">{currentUser.name.charAt(0).toUpperCase()}</span>
                    <span className="profile-name">{currentUser.name.split(' ')[0]}</span>
                    <span className="profile-chevron">▾</span>
                  </div>
                ) : (
                  <button className="secondary-action-btn" onClick={() => setShowAuthModal(true)}>
                    Sign In
                  </button>
                )}
              </div>
            </header>

            {/* ══════════════════════════════════════════════════════════════
                RESULTS VIEW (Pitch Analysis + Deck Structural Diagnostics)
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'results' && result && (
              <div className="results-content-stack">

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

                  {/* Progress Indicator Banner */}
                  {pitchHistory.length > 1 && (
                    <div className="revision-progress-banner">
                      <span>
                        <strong>Revision #{pitchHistory.length}</strong>: Scored {score}/100
                        {scoreDelta !== 0 && (
                          <span className={scoreDelta > 0 ? 'green-delta' : 'red-delta'}>
                            {' '}({scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts vs previous)
                          </span>
                        )}
                      </span>
                      <button className="view-history-link" onClick={() => setActiveTab('history')}>
                        View Full Score Progression →
                      </button>
                    </div>
                  )}
                </div>

                {/* Pitch Deck Diagnostic Card (Rendered if a PDF was analyzed) */}
                {deckAnalysis && (
                  <div className="card-panel deck-structure-card">
                    <div className="panel-header">
                      <span className="panel-icon">📑</span>
                      <h3 className="panel-title">Pitch Deck Structural Breakdown ({deckAnalysis.totalSlides} Slides)</h3>
                      <span className="deck-score-badge">Structural Score: {deckAnalysis.structuralScore}/100</span>
                    </div>

                    <p className="deck-diagnostic-sub">
                      Analysis of slide coverage, narrative progression, and text density for presentation.
                    </p>

                    {/* 8 Required Slides Checklist */}
                    <div className="deck-sections-grid">
                      {deckAnalysis.sectionStatus.map(sec => (
                        <div key={sec.id} className={`deck-sec-pill ${sec.detected ? 'detected' : 'missing'}`}>
                          <span className="sec-check">{sec.detected ? '✔' : '✖'}</span>
                          <span className="sec-name">{sec.name}</span>
                          {sec.slide && <span className="sec-slide-num">Slide {sec.slide}</span>}
                        </div>
                      ))}
                    </div>

                    {/* Deck Specific Flags */}
                    {deckAnalysis.deckFlags.length > 0 && (
                      <div className="deck-flags-subpanel">
                        <strong>Presentation Slide Warnings:</strong>
                        <ul>
                          {deckAnalysis.deckFlags.map((flag, i) => (
                            <li key={i}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 3 Bento Cards Row */}
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
                      <div className="deal-entry">
                        <span className="deal-indicator funded-dot" />
                        <div className="deal-info">
                          <div className="deal-title">{result.retrieved_case_studies.funded_benchmark.name}</div>
                          <div className="deal-meta-line">
                            Funded &bull; {result.retrieved_case_studies.funded_benchmark.stage || 'Seed'} &bull; {result.retrieved_case_studies.funded_benchmark.ask}
                          </div>
                        </div>
                      </div>

                      <div className="deal-entry">
                        <span className="deal-indicator cautionary-dot" />
                        <div className="deal-info">
                          <div className="deal-title">{result.retrieved_case_studies.rejected_benchmark.name}</div>
                          <div className="deal-meta-line">
                            Cautionary &bull; {result.retrieved_case_studies.rejected_benchmark.stage || 'Series A'} &bull; {result.retrieved_case_studies.rejected_benchmark.ask}
                          </div>
                        </div>
                      </div>

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

                {/* Detailed Feedback: Suggested Rewrite + Critical Flags */}
                <div className="detailed-feedback-row">
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
                </div>

                {/* Results Bottom Actions */}
                <div className="results-bottom-actions">
                  <button
                    className="edit-pitch-btn"
                    onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    ← Back to Pitch Input
                  </button>

                  <div className="actions-right-cluster">
                    <button
                      className="secondary-action-btn"
                      onClick={handleSaveCurrentPitch}
                    >
                      💾 {saveSuccessMsg ? 'Saved! ✓' : 'Save Pitch'}
                    </button>
                    <button
                      className="download-pdf-cta"
                      onClick={() => setShowReportModal(true)}
                    >
                      📥 Download Full Report (PDF)
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                FEATURE 1 & 2: PITCH HISTORY & SCORE COMPARISON VIEW
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'history' && (
              <div className="history-view-panel">

                {/* Score Progression Stepper Banner */}
                <div className="card-panel progression-stepper-card">
                  <div className="panel-header">
                    <span className="panel-icon">📈</span>
                    <h3 className="panel-title">Score Progression Across Revisions</h3>
                  </div>

                  <div className="stepper-horizontal-track">
                    {pitchHistory.map((rev, idx) => {
                      const prevScore = idx > 0 ? pitchHistory[idx - 1].score : null;
                      const delta = prevScore !== null ? rev.score - prevScore : null;

                      return (
                        <div key={rev.id} className="stepper-step-node">
                          <div className="step-circle" onClick={() => handleRestoreRevision(rev)}>
                            <span className="step-number">Attempt #{rev.attemptNumber}</span>
                            <span className="step-score">{rev.score}</span>
                            {delta !== null && (
                              <span className={`step-delta ${delta >= 0 ? 'positive' : 'negative'}`}>
                                {delta >= 0 ? `+${delta}` : delta}
                              </span>
                            )}
                          </div>
                          <span className="step-meta">{rev.date} &bull; {rev.timestamp}</span>
                          {idx < pitchHistory.length - 1 && <div className="step-connector-line" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Side-by-Side Comparison Selector */}
                <div className="card-panel comparison-tool-card">
                  <div className="panel-header-split">
                    <div className="panel-header">
                      <span className="panel-icon">⚖️</span>
                      <h3 className="panel-title">Criteria-by-Criteria Revision Comparison</h3>
                    </div>

                    <div className="compare-selectors">
                      <span>Compare: </span>
                      <select
                        className="compare-dropdown"
                        value={compareRevA}
                        onChange={(e) => setCompareRevA(Number(e.target.value))}
                      >
                        {pitchHistory.map((h, i) => (
                          <option key={h.id} value={i}>Revision #{h.attemptNumber} ({h.score} pts)</option>
                        ))}
                      </select>
                      <span> vs. </span>
                      <select
                        className="compare-dropdown"
                        value={compareRevB}
                        onChange={(e) => setCompareRevB(Number(e.target.value))}
                      >
                        {pitchHistory.map((h, i) => (
                          <option key={h.id} value={i}>Revision #{h.attemptNumber} ({h.score} pts)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary Delta Banner */}
                  <div className="delta-summary-box">
                    <div className="delta-score-big">
                      <span className="delta-num">
                        {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
                      </span>
                      <span className="delta-label">Overall Points Progress ({revA?.score || 0} → {revB?.score || 0})</span>
                    </div>
                    <p className="delta-narrative">
                      {scoreDelta > 0
                        ? `Great work! Your pitch improved by ${scoreDelta} points through sharper rhetorical structure and proof points.`
                        : scoreDelta === 0
                        ? 'No change in overall score between these revisions.'
                        : `Score decreased by ${Math.abs(scoreDelta)} points. Check missing traction numbers or opening hook length.`}
                    </p>
                  </div>

                  {/* 6-Factor Side-by-Side Delta Table */}
                  <div className="table-responsive-card">
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>Evaluation Criterion</th>
                          <th>Revision #{revA?.attemptNumber}</th>
                          <th>Revision #{revB?.attemptNumber}</th>
                          <th>Delta</th>
                          <th>Progress Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Clarity & Logic', 'Opening Hook', 'Rhetorical Structure', 'Persuasion & Proof', 'Call-to-Action', 'Investor Confidence'].map(factor => {
                          const valA = revA?.metrics?.[factor] || 0;
                          const valB = revB?.metrics?.[factor] || 0;
                          const delta = valB - valA;

                          return (
                            <tr key={factor}>
                              <td><strong>{factor}</strong></td>
                              <td>{valA}/100</td>
                              <td><strong>{valB}/100</strong></td>
                              <td>
                                <span className={`delta-pill ${delta > 0 ? 'gain' : delta < 0 ? 'drop' : 'neutral'}`}>
                                  {delta > 0 ? `+${delta}` : delta}
                                </span>
                              </td>
                              <td>
                                {delta > 0 ? (
                                  <span className="status-improved">✔ Improved (+{delta}%)</span>
                                ) : delta === 0 ? (
                                  <span className="status-unchanged">&mdash; Unchanged</span>
                                ) : (
                                  <span className="status-regressed">⚠️ Needs Review</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Past Analyses Table */}
                <div className="card-panel">
                  <div className="panel-header">
                    <span className="panel-icon">📁</span>
                    <h3 className="panel-title">All Analyzed Revisions</h3>
                  </div>

                  <div className="table-responsive-card">
                    <table className="saved-data-table">
                      <thead>
                        <tr>
                          <th>Revision</th>
                          <th>Pitch Excerpt</th>
                          <th>Investability Score</th>
                          <th>Date & Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pitchHistory.slice().reverse().map(rev => (
                          <tr key={rev.id}>
                            <td><strong>Attempt #{rev.attemptNumber}</strong></td>
                            <td className="saved-title-cell">
                              <p className="saved-snippet">{rev.pitchText.slice(0, 95)}...</p>
                            </td>
                            <td>
                              <span className={`table-score-pill ${rev.score >= 75 ? 'green' : rev.score >= 60 ? 'amber' : 'gray'}`}>
                                {rev.score}/100
                              </span>
                            </td>
                            <td>{rev.date} at {rev.timestamp}</td>
                            <td>
                              <button
                                className="secondary-action-btn"
                                onClick={() => handleRestoreRevision(rev)}
                              >
                                Restore in Editor →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* History Bottom Action */}
                <div className="results-bottom-actions">
                  <button
                    className="edit-pitch-btn"
                    onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    ← Back to Pitch Input
                  </button>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                SAVED PITCHES VIEW
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'saved' && (
              <div className="saved-pitches-view-panel">
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

                  <button
                    className="dashboard-back-btn"
                    onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    ← Back to Pitch
                  </button>
                </div>

                {filteredSavedPitches.length === 0 ? (
                  <div className="empty-saved-state">
                    <div className="empty-icon-circle">📂</div>
                    <h3 className="empty-title">No Saved Pitches Yet</h3>
                    <p className="empty-desc">
                      Your saved pitch analyses and drafts will appear here. Score your pitch in the analyzer and click &quot;Save Pitch&quot; to archive and compare your revisions over time.
                    </p>
                    <button
                      className="empty-cta-btn"
                      onClick={() => setActiveTab('home')}
                    >
                      + Start New Pitch Analysis
                    </button>
                  </div>
                ) : (
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
                              <span className={`table-score-pill ${saved.score >= 75 ? 'green' : saved.score >= 60 ? 'amber' : 'gray'}`}>
                                {saved.score}
                              </span>
                            </td>
                            <td className="date-cell">{saved.lastUpdated}</td>
                            <td>
                              <span className={`status-tag ${saved.status.toLowerCase()}`}>
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
                                title="Share Pitch Link"
                                onClick={() => {
                                  navigator.clipboard?.writeText?.(window.location.href);
                                  alert('Pitch link copied to clipboard!');
                                }}
                              >
                                🔗
                              </button>
                              <button
                                className="action-icon-btn"
                                title="Delete"
                                onClick={() => handleDeletePitch(saved.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FEATURE 2: DOWNLOADABLE PITCH ANALYSIS REPORT MODAL (PDF)
      ══════════════════════════════════════════════════════════════ */}
      {showReportModal && (
        <div className="overlay-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="report-modal-card" onClick={e => e.stopPropagation()}>
            <div className="report-modal-header no-print">
              <div className="modal-title-lockup">
                <h3>Executive Pitch Evaluation Report</h3>
                <p>Official diagnostic dossier generated for university viva presentation and investor readiness.</p>
              </div>
              <div className="report-modal-actions">
                <button className="print-btn" onClick={() => window.print()}>
                  🖨️ Print / Save as PDF
                </button>
                <button className="modal-close-cross" onClick={() => setShowReportModal(false)}>
                  &times;
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="printable-report-body" id="printable-pitch-report">
              {/* Document Header */}
              <div className="doc-report-header">
                <div className="doc-brand">
                  <h2>PitchIQ Executive Analysis Report</h2>
                  <span className="doc-sub">Knowledge-Grounded Pitch Optimization & Case Precedent Benchmark</span>
                </div>
                <div className="doc-meta">
                  <p><strong>Institution:</strong> Silver Oak University</p>
                  <p><strong>Department:</strong> Computer Engineering</p>
                  <p><strong>Project ID:</strong> M2_CSE_027</p>
                  <p><strong>Faculty Guide:</strong> Prof. Hemali Patel</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Executive Scorecard */}
              <div className="doc-section scorecard-box">
                <div className="score-badge-col">
                  <span className="score-caption">INVESTABILITY SCORE</span>
                  <div className="score-big-display">{score}<span>/100</span></div>
                  <span className="verdict-tag">{verdictTitle}</span>
                </div>
                <div className="verdict-summary-col">
                  <h4>Diagnostic Verdict</h4>
                  <p>{result?.verdict}</p>
                  <div className="doc-tags">
                    {result?.winning_tags?.map(t => (
                      <span key={t} className="doc-tag-pill">✓ {t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6-Factor Criterion Breakdown Table */}
              <div className="doc-section">
                <h4 className="doc-section-title">1. Criterion-Level Rhetorical Breakdown</h4>
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Rhetorical Axis</th>
                      <th>Score</th>
                      <th>Investor Benchmark Standard</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result?.metrics || {}).map(([metric, val]) => (
                      <tr key={metric}>
                        <td><strong>{metric}</strong></td>
                        <td>{val}/100</td>
                        <td>
                          {metric === 'Clarity & Logic' && 'Explicit problem-solution sequence without technical jargon'}
                          {metric === 'Opening Hook' && 'Grabs listener attention within first 14 spoken words'}
                          {metric === 'Rhetorical Structure' && 'Classic 5-stage setup: Hook → Pain → Solution → Traction → Ask'}
                          {metric === 'Persuasion & Proof' && 'Verifiable unit economics (COGS, gross margin, customer metrics)'}
                          {metric === 'Call-to-Action' && 'Unambiguous financing ask and specific use of capital'}
                          {metric === 'Investor Confidence' && 'Defensible positioning against incumbent alternatives'}
                        </td>
                        <td>
                          <span className={`doc-rating ${val >= 75 ? 'optimal' : val >= 50 ? 'acceptable' : 'critical'}`}>
                            {val >= 75 ? 'Optimal' : val >= 50 ? 'Acceptable' : 'Critical'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Critical Flags */}
              <div className="doc-section">
                <h4 className="doc-section-title">2. Critical Flags & Identified Pitfalls</h4>
                <div className="doc-flags-list">
                  {result?.mistakes?.map((m, i) => (
                    <div key={i} className="doc-flag-row">
                      <span className="flag-cross">✖</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Opening Rewrite */}
              <div className="doc-section">
                <h4 className="doc-section-title">3. Reconstructed 5-Stage Elevator Pitch</h4>
                <div className="doc-rewrite-box">
                  <p>{result?.rewritten_opening}</p>
                </div>
              </div>

              {/* Investor Reactions Q&A */}
              <div className="doc-section">
                <h4 className="doc-section-title">4. Institutional Investor Panel Assessment</h4>
                <div className="doc-investor-grid">
                  {(result?.investor_reactions || result?.shark_reactions || []).map((r, i) => (
                    <div key={i} className="doc-investor-card">
                      <strong>{r.name} <em>({r.archetype})</em></strong>
                      <p>"{r.feedback}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Next Steps Checklist */}
              <div className="doc-section">
                <h4 className="doc-section-title">5. Viva & Investor Pitch Readiness Checklist</h4>
                <ul className="doc-checklist">
                  <li><input type="checkbox" defaultChecked /> Memorize the 10-second opening hook statement</li>
                  <li><input type="checkbox" defaultChecked={result?.winning_tags?.includes('Traction Verified')} /> Verify unit economics (COGS, wholesale, gross margin) with audited figures</li>
                  <li><input type="checkbox" defaultChecked /> Rehearse closing ask without hesitation (Equity percentage & dollar amount)</li>
                  <li><input type="checkbox" /> Prepare response slide addressing the cautionary venture precedent</li>
                  <li><input type="checkbox" /> Run 3 timed oral rehearsals with peer evaluators before viva review</li>
                </ul>
              </div>

              {/* Signatures */}
              <div className="doc-signatures">
                <div className="sig-block">
                  <div className="sig-line" />
                  <span>Student Presenter Signature</span>
                </div>
                <div className="sig-block">
                  <div className="sig-line" />
                  <span>Faculty Guide (Prof. Hemali Patel)</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FEATURE 1: LOGIN & SIGN UP MODAL (Replacing Newsletter)
      ══════════════════════════════════════════════════════════════ */}
      {showAuthModal && (
        <div className="overlay-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="auth-card-modal" onClick={e => e.stopPropagation()}>
            <div className="auth-modal-header">
              <span className="modal-brand">PitchIQ</span>
              <button className="modal-close-cross" onClick={() => setShowAuthModal(false)}>
                &times;
              </button>
            </div>

            <div className="auth-mode-toggle">
              <button
                className={`auth-toggle-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                className={`auth-toggle-tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Create Account
              </button>
            </div>

            <h3 className="auth-title">
              {authMode === 'login' ? 'Welcome Back to PitchIQ' : 'Create Your PitchIQ Account'}
            </h3>
            <p className="auth-sub">
              Access your saved pitches, revision history, and case-grounded venture analytics.
            </p>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Parth Bavalliya"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
              </div>

              {authError && (
                <div className="auth-error-banner">
                  ⚠️ {authError}
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                {authLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS MODAL
      ══════════════════════════════════════════════════════════════ */}
      {showHowItWorks && (
        <div className="overlay-backdrop" onClick={() => setShowHowItWorks(false)}>
          <div className="how-it-works-modal" onClick={e => e.stopPropagation()}>
            <div className="how-modal-header">
              <div className="how-title-lockup">
                <span className="how-icon">💡</span>
                <h3>How PitchIQ Evaluates Your Pitch</h3>
              </div>
              <button className="modal-close-cross" onClick={() => setShowHowItWorks(false)}>
                &times;
              </button>
            </div>

            <p className="how-intro">
              PitchIQ uses a Retrieval-Augmented Pitch Evaluation model grounded in 200+ actual venture capital deals and institutional VC decision frameworks.
            </p>

            <div className="how-steps-grid">
              <div className="how-step-card">
                <span className="how-step-num">01</span>
                <strong>10-Second Hook</strong>
                <p>Listeners decide in the first 10 seconds. Your opening sentence must capture attention and frame an urgent problem in under 14 words.</p>
              </div>

              <div className="how-step-card">
                <span className="how-step-num">02</span>
                <strong>Problem Definition</strong>
                <p>Quantify customer agony. Investors fund painkillers, not vitamins. Explicitly highlight wasted money, lost time, or manual friction.</p>
              </div>

              <div className="how-step-card">
                <span className="how-step-num">03</span>
                <strong>Proprietary Solution</strong>
                <p>Present a clear, demonstrable product value proposition that solves the customer pain without technical fluff.</p>
              </div>

              <div className="how-step-card">
                <span className="how-step-num">04</span>
                <strong>Unit Economics & Traction</strong>
                <p>Ground your story in numbers: verified users, revenue, gross margins (60%+), and low customer acquisition costs (CAC).</p>
              </div>

              <div className="how-step-card">
                <span className="how-step-num">05</span>
                <strong>Decisive Funding Ask</strong>
                <p>Never conclude without an explicit Call-to-Action. State your exact equity ask, dollar amount, and specific capital runway.</p>
              </div>

              <div className="how-step-card">
                <span className="how-step-num">06</span>
                <strong>Case Precedent Matching</strong>
                <p>PitchIQ matches your pitch to both funded winners and cautionary precedents to alert you of fatal blindspots early.</p>
              </div>
            </div>

            <div className="how-modal-footer">
              <button className="primary-gradient-btn" onClick={() => setShowHowItWorks(false)}>
                Got It — Let's Analyze!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="simple-app-footer no-print">
        <span>PitchIQ &bull; AI-Powered Pitch Analysis & Investor Benchmark</span>
        <span>Transform your startup scripts & slide decks into investment-ready pitches</span>
      </footer>

    </div>
  );
}
