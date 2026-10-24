import React from 'react';

export default function AuthCard({
  authMode,
  setAuthMode,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authConfirmPassword,
  setAuthConfirmPassword,
  authFieldErrors,
  setAuthFieldErrors,
  authError,
  setAuthError,
  authSuccess,
  authLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  getPasswordStrength,
  handleAuthSubmit,
  onClose = null,
  isStandalone = false,
}) {
  const switchMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    if (setAuthFieldErrors) setAuthFieldErrors({});
  };

  const clearFieldError = (field) => {
    if (authFieldErrors && authFieldErrors[field]) {
      setAuthFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (authError) setAuthError('');
  };

  const pwStrength = authMode === 'signup' && authPassword ? getPasswordStrength(authPassword) : null;

  return (
    <div
      className={`auth-card-modal ${isStandalone ? 'standalone' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header with Close Button if inside Modal */}
      {onClose && (
        <div className="auth-modal-header">
          <span className="modal-brand">PitchIQ</span>
          <button
            type="button"
            className="modal-close-cross"
            onClick={onClose}
            aria-label="Close authentication modal"
          >
            &times;
          </button>
        </div>
      )}

      {/* Mode Switch Tabs */}
      <div className="auth-mode-toggle" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={authMode === 'signup'}
          className={`auth-toggle-tab ${authMode === 'signup' ? 'active' : ''}`}
          onClick={() => switchMode('signup')}
        >
          Sign Up
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={authMode === 'login'}
          className={`auth-toggle-tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => switchMode('login')}
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

      {/* Global Error Banner */}
      {authError && (
        <div className="auth-error-banner" role="alert">
          <span>⚠️</span>
          <span>{authError}</span>
        </div>
      )}

      {/* Global Success Banner */}
      {authSuccess && (
        <div className="auth-success-banner" role="status">
          <span>✅</span>
          <span>{authSuccess}</span>
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="auth-form" noValidate>
        {/* Full Name (Sign Up only) */}
        {authMode === 'signup' && (
          <div className="form-group">
            <label htmlFor="auth-name">Full Name *</label>
            <input
              id="auth-name"
              type="text"
              className={`auth-input ${authFieldErrors?.name ? 'has-error' : ''}`}
              placeholder="e.g. Parth Bavalliya"
              value={authName}
              onChange={(e) => {
                setAuthName(e.target.value);
                clearFieldError('name');
              }}
              autoComplete="name"
              required
            />
            {authFieldErrors?.name && (
              <span className="field-error-msg">⚠️ {authFieldErrors.name}</span>
            )}
          </div>
        )}

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="auth-email">Email Address *</label>
          <input
            id="auth-email"
            type="email"
            className={`auth-input ${authFieldErrors?.email ? 'has-error' : ''}`}
            placeholder="name@company.com"
            value={authEmail}
            onChange={(e) => {
              setAuthEmail(e.target.value);
              clearFieldError('email');
            }}
            autoComplete="email"
            required
          />
          {authFieldErrors?.email && (
            <span className="field-error-msg">⚠️ {authFieldErrors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="auth-password">Password *</label>
          <div className="password-input-wrapper">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              className={`auth-input ${authFieldErrors?.password ? 'has-error' : ''}`}
              placeholder={authMode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={authPassword}
              onChange={(e) => {
                setAuthPassword(e.target.value);
                clearFieldError('password');
              }}
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {authFieldErrors?.password && (
            <span className="field-error-msg">⚠️ {authFieldErrors.password}</span>
          )}

          {/* Password Strength Meter (Sign Up only) */}
          {pwStrength && pwStrength.label && (
            <div className="password-strength-container">
              <div className="password-strength-bar">
                <div
                  className="password-strength-fill"
                  style={{
                    width: `${(pwStrength.score / 4) * 100}%`,
                    backgroundColor: pwStrength.color,
                  }}
                />
              </div>
              <div className="password-strength-text">
                <span>Strength:</span>
                <span style={{ color: pwStrength.color, fontWeight: 700 }}>
                  {pwStrength.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password (Sign Up only) */}
        {authMode === 'signup' && (
          <div className="form-group">
            <label htmlFor="auth-confirm-password">Confirm Password *</label>
            <div className="password-input-wrapper">
              <input
                id="auth-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`auth-input ${authFieldErrors?.confirm ? 'has-error' : ''}`}
                placeholder="Re-enter your password"
                value={authConfirmPassword}
                onChange={(e) => {
                  setAuthConfirmPassword(e.target.value);
                  clearFieldError('confirm');
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {authFieldErrors?.confirm && (
              <span className="field-error-msg">⚠️ {authFieldErrors.confirm}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={authLoading}
          style={{ opacity: authLoading ? 0.7 : 1, cursor: authLoading ? 'not-allowed' : 'pointer' }}
        >
          {authLoading
            ? authMode === 'signup'
              ? 'Creating Account...'
              : 'Signing In...'
            : authMode === 'signup'
            ? 'Create Account'
            : 'Sign In'}
        </button>

        {/* Quick Mode Toggle Link */}
        <div className="auth-mode-switch-prompt">
          {authMode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-mode-switch-link"
                onClick={() => switchMode('login')}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-mode-switch-link"
                onClick={() => switchMode('signup')}
              >
                Create one
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
