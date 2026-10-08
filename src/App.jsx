import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SoundBar from './components/SoundBar';
import FocusCanvas from './components/FocusCanvas';
import DailyChecklist from './components/DailyChecklist';
import TransitionScreen from './components/TransitionScreen';
import BrainDumpModal from './components/BrainDumpModal';
import WorryWindowModal from './components/WorryWindowModal';
import GuideModal from './components/GuideModal';
import SleepWindDown from './components/SleepWindDown';
import RevisionsModal from './components/RevisionsModal';

export default function App() {
  const [currentView, setCurrentView] = useState('focus'); // 'focus' | 'sleep'
  const getTodayDateKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayKey = getTodayDateKey();

  // Theme Management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gentle_focus_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gentle_focus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Task Intention State
  const [taskIntention, setTaskIntention] = useState(() => {
    return localStorage.getItem('gentle_focus_intention') || '';
  });

  useEffect(() => {
    localStorage.setItem('gentle_focus_intention', taskIntention);
  }, [taskIntention]);

  // Daily Checklist State
  const defaultChecklist = {
    water: false,
    focusBlock: false,
    brainDump: false,
    sleepWindDown: false,
    nutrition: false
  };

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`gentle_focus_checklist_${todayKey}`);
      return saved ? JSON.parse(saved) : defaultChecklist;
    } catch (_) {
      return defaultChecklist;
    }
  });

  useEffect(() => {
    localStorage.setItem(`gentle_focus_checklist_${todayKey}`, JSON.stringify(checklist));
  }, [checklist, todayKey]);

  // Hydration Rhythm State (Phase 2)
  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem(`still_water_${todayKey}`);
      return saved ? parseInt(saved, 10) : (checklist.water ? 1 : 0);
    } catch (_) {
      return checklist.water ? 1 : 0;
    }
  });

  useEffect(() => {
    localStorage.setItem(`still_water_${todayKey}`, waterGlasses.toString());
  }, [waterGlasses, todayKey]);

  // Brain Fuel State (Pillar 5 of Guide)
  const defaultBrainFuel = {
    multivitamin: false,
    foods: []
  };

  const [brainFuel, setBrainFuel] = useState(() => {
    try {
      const saved = localStorage.getItem(`still_brain_fuel_${todayKey}`);
      return saved ? JSON.parse(saved) : defaultBrainFuel;
    } catch (_) {
      return defaultBrainFuel;
    }
  });

  useEffect(() => {
    localStorage.setItem(`still_brain_fuel_${todayKey}`, JSON.stringify(brainFuel));
  }, [brainFuel, todayKey]);

  // Notes & Revisions State
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(`gentle_focus_notes_${todayKey}`) || '';
  });

  useEffect(() => {
    localStorage.setItem(`gentle_focus_notes_${todayKey}`, notes);
  }, [notes, todayKey]);

  // Worries Parking Lot State
  const [worries, setWorries] = useState(() => {
    try {
      const saved = localStorage.getItem('gentle_focus_worries');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gentle_focus_worries', JSON.stringify(worries));
  }, [worries]);

  // Modals & Screen States
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);
  const [isWorryWindowOpen, setIsWorryWindowOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(() => {
    try {
      const saved = localStorage.getItem('still_current_week');
      return saved ? parseInt(saved, 10) : 1;
    } catch (_) {
      return 1;
    }
  });

  useEffect(() => {
    localStorage.setItem('still_current_week', currentWeek.toString());
  }, [currentWeek]);

  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [completedTaskName, setCompletedTaskName] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Checklist Actions
  const handleToggleCheckItem = (itemId) => {
    setChecklist(prev => {
      const nextVal = !prev[itemId];
      if (itemId === 'water') {
        setWaterGlasses(nextVal ? 1 : 0);
      }
      if (itemId === 'nutrition') {
        if (!nextVal) {
          setBrainFuel(defaultBrainFuel);
        } else if (!brainFuel.multivitamin && (!brainFuel.foods || brainFuel.foods.length === 0)) {
          setBrainFuel({ multivitamin: true, foods: [] });
        }
      }
      return {
        ...prev,
        [itemId]: nextVal
      };
    });
  };

  const handleUpdateWater = (count) => {
    setWaterGlasses(count);
    if (count >= 1 && !checklist.water) {
      setChecklist(prev => ({ ...prev, water: true }));
      showToast("Morning water anchor recorded.");
    } else if (count === 0 && checklist.water) {
      setChecklist(prev => ({ ...prev, water: false }));
    }
  };

  const handleUpdateBrainFuel = (nextFuel) => {
    setBrainFuel(nextFuel);
    const hasFuel = nextFuel.multivitamin || (nextFuel.foods && nextFuel.foods.length > 0);
    if (hasFuel && !checklist.nutrition) {
      setChecklist(prev => ({ ...prev, nutrition: true }));
      showToast("Brain fuel logged: steady cognitive clarity.");
    } else if (!hasFuel && checklist.nutrition) {
      setChecklist(prev => ({ ...prev, nutrition: false }));
    }
  };

  const handleResetDay = () => {
    if (window.confirm("Reset today's anchors? (Your notes will be kept)")) {
      setChecklist(defaultChecklist);
      setWaterGlasses(0);
      setBrainFuel(defaultBrainFuel);
      showToast("Today's anchors reset.");
    }
  };

  // Focus Session Completed
  const handleSessionComplete = (taskName, durationMinutes) => {
    setCompletedTaskName(taskName);
    setIsTransitionActive(true);

    // Auto-mark the focus block in today's checklist!
    setChecklist(prev => ({
      ...prev,
      focusBlock: true
    }));

    // Record total sessions
    const totalSessions = parseInt(localStorage.getItem('gentle_focus_total_sessions') || '0', 10) + 1;
    localStorage.setItem('gentle_focus_total_sessions', totalSessions.toString());
  };

  const handleFinishTransition = () => {
    setIsTransitionActive(false);
    showToast("Great job. Low-stimulation block checked off for today!");
  };

  // Worry Management
  const handleSaveToWorryWindow = (text) => {
    const newWorry = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString()
    };
    setWorries(prev => [newWorry, ...prev]);
  };

  const handleDeleteWorry = (id) => {
    setWorries(prev => prev.filter(w => w.id !== id));
  };

  const handleClearAllWorries = () => {
    if (window.confirm("Clear all parked thoughts?")) {
      setWorries([]);
      showToast("Worry list cleared. Rest your mind.");
    }
  };

  const handleLogBrainDumpWin = () => {
    setChecklist(prev => ({
      ...prev,
      brainDump: true
    }));
  };

  const handleLogSleepWin = () => {
    setChecklist(prev => ({
      ...prev,
      sleepWindDown: true
    }));
  };

  // Global Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsBrainDumpOpen(false);
        setIsWorryWindowOpen(false);
        setIsGuideOpen(false);
        setIsRevisionsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExportData = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      dateKey: todayKey,
      currentWeek,
      planRevisions: localStorage.getItem('still_plan_revisions') || '',
      checklist,
      waterGlasses,
      brainFuel,
      notes,
      worries,
      totalSessions: localStorage.getItem('gentle_focus_total_sessions') || 0
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `still-backup-${todayKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data backup saved.");
  };

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenWorryWindow={() => setIsWorryWindowOpen(true)}
        onOpenRevisions={() => setIsRevisionsOpen(true)}
        worryCount={worries.length}
        currentView={currentView}
        onSelectView={setCurrentView}
        onExportData={handleExportData}
      />

      {currentView === 'focus' && <SoundBar />}

      <main className="main-layout" role="main">
        {currentView === 'focus' ? (
          <FocusCanvas
            taskIntention={taskIntention}
            setTaskIntention={setTaskIntention}
            onSessionComplete={handleSessionComplete}
            onOpenBrainDump={() => setIsBrainDumpOpen(true)}
          />
        ) : (
          <SleepWindDown
            onSaveBedtimeThought={handleSaveToWorryWindow}
            onLogSleepWin={handleLogSleepWin}
            onShowToast={showToast}
          />
        )}

        <DailyChecklist
          checklist={checklist}
          onToggleCheckItem={handleToggleCheckItem}
          waterGlasses={waterGlasses}
          onUpdateWater={handleUpdateWater}
          brainFuel={brainFuel}
          onUpdateBrainFuel={handleUpdateBrainFuel}
          currentWeek={currentWeek}
          notes={notes}
          onUpdateNotes={setNotes}
          onOpenRevisions={() => setIsRevisionsOpen(true)}
          onResetDay={handleResetDay}
        />
      </main>

      {/* Quiet Footer */}
      <footer style={{
        marginTop: '3.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <span>Stillness over strain. Small, kind steps compound.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            id="btn-export-data"
            className="nav-link-btn"
            style={{ fontSize: '0.78rem' }}
            onClick={handleExportData}
            title="Download JSON backup"
          >
            Export Backup
          </button>
        </div>
      </footer>

      {/* 45-Second Transition Screen */}
      {isTransitionActive && (
        <TransitionScreen
          onFinish={handleFinishTransition}
        />
      )}

      {/* Mind Dump Drawer / Modal */}
      <BrainDumpModal
        isOpen={isBrainDumpOpen}
        onClose={() => setIsBrainDumpOpen(false)}
        onSaveToWorryWindow={handleSaveToWorryWindow}
        onSetFocusTask={(txt) => setTaskIntention(txt)}
        onLogBrainDumpWin={handleLogBrainDumpWin}
        onShowToast={showToast}
      />

      {/* Worry Window Review Drawer / Modal */}
      <WorryWindowModal
        isOpen={isWorryWindowOpen}
        onClose={() => setIsWorryWindowOpen(false)}
        worries={worries}
        onDeleteWorry={handleDeleteWorry}
        onClearAllWorries={handleClearAllWorries}
      />

      {/* Guide Reference Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Living Notebook & Revisions Modal */}
      <RevisionsModal
        isOpen={isRevisionsOpen}
        onClose={() => setIsRevisionsOpen(false)}
        currentWeek={currentWeek}
        onSetCurrentWeek={setCurrentWeek}
        onShowToast={showToast}
      />

      {/* Quiet Toast */}
      {toastMessage && (
        <div className="still-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
