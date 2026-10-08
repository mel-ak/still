import React, { useState, useEffect } from 'react';
import { Sun, Moon, Download, BookOpen, Archive, Menu, X, Sparkles, MoonStar } from 'lucide-react';

export default function Navbar({ 
  theme, 
  onToggleTheme, 
  onOpenGuide, 
  onOpenWorryWindow, 
  worryCount,
  currentView = 'focus',
  onSelectView,
  onExportData
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      <header className="navbar" role="banner">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-zen-mark" aria-hidden="true">
            <div className="brand-zen-dot" />
          </div>
          <span className="brand-title">Still</span>
        </div>

        {/* Desktop Mode Switcher (Hidden on Mobile) */}
        <div className="mode-segmented-control desktop-only" role="tablist" aria-label="Mode selection">
          <button
            id="btn-mode-focus-desktop"
            role="tab"
            aria-selected={currentView === 'focus'}
            className={`mode-btn ${currentView === 'focus' ? 'active' : ''}`}
            onClick={() => onSelectView('focus')}
          >
            Focus
          </button>
          <button
            id="btn-mode-sleep-desktop"
            role="tab"
            aria-selected={currentView === 'sleep'}
            className={`mode-btn ${currentView === 'sleep' ? 'active' : ''}`}
            onClick={() => onSelectView('sleep')}
          >
            Sleep
          </button>
        </div>

        {/* Desktop Actions */}
        <nav className="nav-actions desktop-only" aria-label="Desktop Navigation">
          {isInstallable && (
            <button 
              id="btn-install-desktop"
              className="nav-link-btn"
              onClick={handleInstallClick}
              title="Install Still on your device"
            >
              <Download size={13} />
              <span>Install</span>
            </button>
          )}

          <button 
            id="btn-open-guide-desktop"
            className="nav-link-btn" 
            onClick={onOpenGuide}
            title="Open Focus Reset Guide"
          >
            <BookOpen size={13} />
            <span>Guide</span>
          </button>

          <button 
            id="btn-worry-window-desktop"
            className="nav-link-btn"
            onClick={onOpenWorryWindow}
            title="Review Worry Window"
          >
            <Archive size={13} />
            <span>Worry Log</span>
            {worryCount > 0 && (
              <span className="nav-badge-count">{worryCount}</span>
            )}
          </button>

          <button 
            id="btn-toggle-theme-desktop"
            className="nav-icon-btn" 
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === 'dark' ? "Warm daylight" : "Obsidian dark"}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>

        {/* Mobile Header Actions (Clean, 1 Line) */}
        <div className="mobile-header-actions mobile-only">
          <button
            id="btn-worry-mobile-quick"
            className="nav-icon-btn"
            style={{ position: 'relative' }}
            onClick={onOpenWorryWindow}
            title="Worry Window"
            aria-label="Worry Window"
          >
            <Archive size={15} />
            {worryCount > 0 && (
              <span className="mobile-badge-dot" />
            )}
          </button>

          <button 
            id="btn-toggle-theme-mobile"
            className="nav-icon-btn" 
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            id="btn-open-mobile-menu"
            className="nav-icon-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            title="Menu"
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* Floating Bottom Dock on Mobile (Thumb Reachable) */}
      <nav className="mobile-bottom-dock mobile-only" role="tablist" aria-label="Mobile mode dock">
        <button
          id="btn-dock-focus"
          role="tab"
          aria-selected={currentView === 'focus'}
          className={`dock-tab ${currentView === 'focus' ? 'active' : ''}`}
          onClick={() => onSelectView('focus')}
        >
          <Sparkles size={15} />
          <span>Focus</span>
        </button>

        <button
          id="btn-dock-sleep"
          role="tab"
          aria-selected={currentView === 'sleep'}
          className={`dock-tab ${currentView === 'sleep' ? 'active' : ''}`}
          onClick={() => onSelectView('sleep')}
        >
          <MoonStar size={15} />
          <span>Sleep</span>
        </button>
      </nav>

      {/* Mobile Slide-Up Menu Sheet */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-sheet-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="mobile-sheet-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle-bar" />
            
            <div className="sheet-header">
              <span className="sheet-title">Still Menu</span>
              <button 
                className="nav-icon-btn"
                style={{ width: '28px', height: '28px' }}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={15} />
              </button>
            </div>

            <div className="sheet-menu-list">
              <button 
                className="sheet-menu-item"
                onClick={() => { setIsMobileMenuOpen(false); onOpenGuide(); }}
              >
                <div className="sheet-item-icon"><BookOpen size={16} /></div>
                <div className="sheet-item-text">
                  <span className="sheet-item-title">The Reset Guide</span>
                  <span className="sheet-item-sub">5 pillars for clear thinking</span>
                </div>
              </button>

              <button 
                className="sheet-menu-item"
                onClick={() => { setIsMobileMenuOpen(false); onOpenWorryWindow(); }}
              >
                <div className="sheet-item-icon"><Archive size={16} /></div>
                <div className="sheet-item-text">
                  <span className="sheet-item-title">Worry Log</span>
                  <span className="sheet-item-sub">{worryCount} parked thoughts</span>
                </div>
              </button>

              <button 
                className="sheet-menu-item"
                onClick={() => { setIsMobileMenuOpen(false); onExportData(); }}
              >
                <div className="sheet-item-icon"><Download size={16} /></div>
                <div className="sheet-item-text">
                  <span className="sheet-item-title">Export Backup</span>
                  <span className="sheet-item-sub">Download JSON of your progress</span>
                </div>
              </button>

              {isInstallable && (
                <button 
                  className="sheet-menu-item"
                  onClick={() => { setIsMobileMenuOpen(false); handleInstallClick(); }}
                >
                  <div className="sheet-item-icon" style={{ color: 'var(--accent)' }}><Download size={16} /></div>
                  <div className="sheet-item-text">
                    <span className="sheet-item-title" style={{ color: 'var(--accent)' }}>Install Still</span>
                    <span className="sheet-item-sub">Add to home screen as native PWA</span>
                  </div>
                </button>
              )}
            </div>

            <div className="sheet-footer">
              <span>"Stillness over strain. Small, kind steps compound."</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
