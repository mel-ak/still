import React from 'react';

export default function DailyChecklist({ 
  checklist, 
  onToggleCheckItem, 
  waterGlasses = 0,
  onUpdateWater,
  brainFuel = { multivitamin: false, foods: [] },
  onUpdateBrainFuel,
  notes, 
  onUpdateNotes,
  onResetDay
}) {
  const ANCHORS = [
    {
      id: 'water',
      title: 'Glass of water upon waking',
      hint: 'Hydrates brain tissue before stimulation'
    },
    {
      id: 'focusBlock',
      title: 'One 15-minute low-stimulation block',
      hint: 'Single task, phone aside, 45s cooldown'
    },
    {
      id: 'brainDump',
      title: 'Offload overthinking (dump or walk)',
      hint: 'Interrupts background mental loops'
    },
    {
      id: 'sleepWindDown',
      title: 'Quiet sleep wind-down window',
      hint: 'Dim light, screens away 30–45 min before bed'
    },
    {
      id: 'nutrition',
      title: 'Nutrient-rich fuel or multivitamin',
      hint: 'B-vitamins, D, magnesium, or simple good food'
    }
  ];

  const count = Object.values(checklist).filter(Boolean).length;
  const isMet = count >= 2;

  const handleBeadClick = (num) => {
    const nextCount = num === waterGlasses ? num - 1 : num;
    if (onUpdateWater) onUpdateWater(nextCount);
  };

  const safeFuel = brainFuel || { multivitamin: false, foods: [] };

  const handleToggleMulti = () => {
    if (!onUpdateBrainFuel) return;
    onUpdateBrainFuel({
      ...safeFuel,
      multivitamin: !safeFuel.multivitamin
    });
  };

  const handleToggleFood = (food) => {
    if (!onUpdateBrainFuel) return;
    const currentFoods = safeFuel.foods || [];
    const nextFoods = currentFoods.includes(food)
      ? currentFoods.filter(f => f !== food)
      : [...currentFoods, food];
    onUpdateBrainFuel({
      ...safeFuel,
      foods: nextFoods
    });
  };

  const hasFuel = safeFuel.multivitamin || (safeFuel.foods && safeFuel.foods.length > 0);
  const fuelCount = (safeFuel.multivitamin ? 1 : 0) + (safeFuel.foods?.length || 0);
  const FOOD_OPTIONS = ['Eggs', 'Banana', 'Nuts', 'Yogurt', 'Greens', 'Citrus'];

  return (
    <aside className="panel anchors-panel" aria-label="Daily Anchors">
      <div className="anchors-header">
        <h2 className="anchors-title">Daily Anchors</h2>
        <span className={`anchors-count ${isMet ? 'met' : ''}`}>
          {count} of 5 {isMet ? '· Anchor Met' : '· Aim for 2–3'}
        </span>
      </div>

      <div role="list">
        {ANCHORS.map((item) => {
          const isDone = !!checklist[item.id];
          return (
            <div
              key={item.id}
              id={`anchor-${item.id}`}
              className={`anchor-row ${isDone ? 'completed' : ''}`}
              onClick={() => onToggleCheckItem(item.id)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleCheckItem(item.id);
                }
              }}
            >
              <div className="anchor-ring" aria-checked={isDone} role="checkbox">
                {isDone && <div className="anchor-ring-inner" />}
              </div>
              <div className="anchor-body">
                <div className="anchor-text">{item.title}</div>
                <div className="anchor-hint">{item.hint}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hydration Rhythm (Pillar 2 of the Guide) */}
      <div className="hydration-section">
        <div className="hydration-header">
          <div className="hydration-label">
            <span>Hydration Rhythm</span>
            <span className="hydration-count">{waterGlasses} of 6</span>
          </div>
          <span className="hydration-hint-text">
            {waterGlasses === 0 ? "First glass upon waking" : waterGlasses >= 4 ? "Well hydrated" : "Hourly small sips"}
          </span>
        </div>

        <div className="hydration-beads-row" role="group" aria-label="Water glasses">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isFilled = num <= waterGlasses;
            return (
              <button
                key={num}
                type="button"
                id={`btn-water-${num}`}
                className={`hydration-bead ${isFilled ? 'filled' : ''}`}
                onClick={() => handleBeadClick(num)}
                title={num === 1 ? "Glass 1: First thing upon waking" : `Glass ${num}: Hourly sip`}
              >
                {isFilled ? '💧' : num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brain Fuel & Micronutrients (Pillar 5 of the Guide) */}
      <div className="brain-fuel-section">
        <div className="brain-fuel-header">
          <div className="brain-fuel-label">
            <span>Brain Fuel</span>
            <span className="brain-fuel-count">
              {hasFuel ? `${fuelCount} logged` : '0 logged'}
            </span>
          </div>
          <span className="brain-fuel-hint-text">
            {hasFuel ? "Nourishing clear thinking" : "Multivitamin or 1 nutrient food"}
          </span>
        </div>

        <div className="fuel-chips-row" role="group" aria-label="Brain fuel selections">
          <button
            type="button"
            id="btn-fuel-multivitamin"
            className={`fuel-chip ${safeFuel.multivitamin ? 'active' : ''}`}
            onClick={handleToggleMulti}
            title="Basic multivitamin (taken with morning food)"
          >
            <span className="fuel-chip-icon">💊</span>
            <span>Multivitamin</span>
          </button>

          {FOOD_OPTIONS.map((food) => {
            const isSelected = safeFuel.foods?.includes(food);
            return (
              <button
                key={food}
                type="button"
                id={`btn-fuel-${food.toLowerCase()}`}
                className={`fuel-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleToggleFood(food)}
                title={`Brain fuel: ${food}`}
              >
                <span>{food}</span>
              </button>
            );
          })}
        </div>

        <div className="fuel-subnote">
          <span>Key nutrients: B-Complex · Vitamin D · Magnesium · Iron (no diet overhaul)</span>
        </div>
      </div>

      {/* Journal Section */}
      <div className="journal-section">
        <label htmlFor="daily-journal-textarea" className="journal-label">
          Notes &amp; Adjustments
        </label>
        <textarea
          id="daily-journal-textarea"
          className="journal-textarea"
          placeholder="What felt easiest today? What needs adjusting?"
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        <button
          id="btn-reset-anchors"
          className="nav-link-btn"
          style={{ fontSize: '0.75rem' }}
          onClick={onResetDay}
        >
          Reset today
        </button>
      </div>
    </aside>
  );
}
