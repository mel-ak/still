import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('STILL ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (_) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-canvas, #0d0f12)',
          color: 'var(--text-main, #e2e8f0)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '440px',
            background: 'var(--bg-surface, #15181e)',
            border: '1px solid var(--border-hairline, rgba(255,255,255,0.08))',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.85rem' }}>◉</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Stillness Paused
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              The application encountered a brief moment of strain. Take a gentle breath.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'var(--accent, #3ecf8e)',
                  color: '#0d0f12',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.65rem 1.4rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Reload Sanctuary
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted, #94a3b8)',
                  border: '1px solid var(--border-hairline, rgba(255,255,255,0.1))',
                  borderRadius: '9999px',
                  padding: '0.65rem 1.2rem',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Reset Storage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
