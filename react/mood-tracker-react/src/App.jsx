import { useEffect, useMemo, useState } from "react";
import "./App.css";

const MOODS = [
  { emoji: "😊", name: "Happy" },
  { emoji: "😌", name: "Calm" },
  { emoji: "😣", name: "Stressed" },
  { emoji: "😴", name: "Tired" },
  { emoji: "🤩", name: "Excited" },
];

const STORAGE_KEY = "moodtracker.entries.v1";
const THEME_KEY = "moodtracker.theme.v1";

// Scoring for “Avg” + “Trend”
const MOOD_SCORE = {
  Happy: 4,
  Calm: 4,
  Excited: 5,
  Tired: 2,
  Stressed: 1,
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, delta) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); 
  const diffToMonday = (day + 6) % 7; 
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function endOfWeekSunday(monday) {
  return addDays(monday, 6);
}

function formatWeekRange(monday, sunday) {
  const fmt = (d) =>
    d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export default function App() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [activeEntry, setActiveEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  // Dark mode state
  const [isDark, setIsDark] = useState(() => {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === "dark";
  });

  // Weekly navigation
  const [weekOffset, setWeekOffset] = useState(0);

  // Persist entries
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Theme application to body
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const entryCount = entries.length;

  const topMood = useMemo(() => {
    if (entries.length === 0) return null;

    const counts = new Map(); 
    for (const e of entries) {
      const mood = e.mood;
      const name = mood?.name;
      if (!name) continue;

      const prev = counts.get(name);
      counts.set(name, {
        count: (prev?.count ?? 0) + 1,
        mood: prev?.mood ?? mood,
      });
    }

    let best = null;
    for (const v of counts.values()) {
      if (!best || v.count > best.count) best = v;
    }
    return best?.mood ?? null;
  }, [entries]);

  const dayStreak = useMemo(() => {
    if (entries.length === 0) return 0;

    const days = new Set(
      entries
        .map((e) => new Date(e.createdAt))
        .filter((d) => !Number.isNaN(d.getTime()))
        .map(toDayKey)
    );

    const today = new Date();
    let cursor = days.has(toDayKey(today)) ? today : addDays(today, -1);

    let streak = 0;
    while (days.has(toDayKey(cursor))) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }, [entries]);

  function canSave() {
    return selectedMood && (title.trim() || text.trim());
  }

  function handleSave() {
    if (!canSave()) return;

    const now = new Date().toISOString();

    const newEntry = {
      id: crypto.randomUUID(),
      title: title.trim() || "(Untitled)",
      text: text.trim(),
      mood: selectedMood,
      createdAt: now,
      dateLabel: formatDate(now),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setTitle("");
    setText("");
    setSelectedMood(null);
  }

  function openEntry(entry) {
    setActiveEntry(entry);
    setIsEditing(false);
    setEditTitle("");
    setEditText("");
  }

  function closeEntry() {
    setActiveEntry(null);
    setIsEditing(false);
    setEditTitle("");
    setEditText("");
  }

  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    closeEntry();
  }

  function startEdit() {
    if (!activeEntry) return;
    setIsEditing(true);
    setEditTitle(activeEntry.title ?? "");
    setEditText(activeEntry.text ?? "");
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditTitle("");
    setEditText("");
  }

  function saveEdit() {
    if (!activeEntry) return;

    const nextTitle = (editTitle || "").trim() || "(Untitled)";
    const nextText = (editText || "").trim();

    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeEntry.id ? { ...e, title: nextTitle, text: nextText } : e
      )
    );

    setActiveEntry((prev) =>
      prev ? { ...prev, title: nextTitle, text: nextText } : prev
    );
    setIsEditing(false);
  }

  // Weekly Mood 
  const weekly = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeekMonday(addDays(today, -7 * weekOffset));
    const weekEnd = endOfWeekSunday(weekStart);

    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const byDay = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      const key = toDayKey(d);

      const dayEntries = entries.filter((e) => {
        const dt = new Date(e.createdAt);
        return !Number.isNaN(dt.getTime()) && toDayKey(dt) === key;
      });

      const count = dayEntries.length;

      let top = null;
      if (count > 0) {
        const map = new Map(); 
        for (const e of dayEntries) {
          const mood = e.mood;
          const name = mood?.name;
          if (!name) continue;
          const prev = map.get(name);
          map.set(name, {
            count: (prev?.count ?? 0) + 1,
            mood: prev?.mood ?? mood,
          });
        }
        let best = null;
        for (const v of map.values())
          if (!best || v.count > best.count) best = v;
        top = best?.mood ?? null;
      }

      // Average score for the day
      const scores = dayEntries
        .map((e) => MOOD_SCORE[e.mood?.name] ?? null)
        .filter((v) => typeof v === "number");

      const avgScore = scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;

      return {
        key,
        label: dayLabels[i],
        date: d,
        count,
        topMood: top,
        avgScore,
      };
    });

    const daysWithEntries = byDay.filter((d) => d.count > 0).length;

    const weekScores = byDay
      .map((d) => d.avgScore)
      .filter((v) => typeof v === "number");

    const avg =
      weekScores.length > 0
        ? weekScores.reduce((a, b) => a + b, 0) / weekScores.length
        : null;

    // Weekly top mood
    let weekTopMood = null;
    if (entries.length > 0) {
      const weekEntries = entries.filter((e) => {
        const dt = new Date(e.createdAt);
        if (Number.isNaN(dt.getTime())) return false;
        return dt >= weekStart && dt <= addDays(weekEnd, 1);
      });

      const map = new Map();
      for (const e of weekEntries) {
        const mood = e.mood;
        const name = mood?.name;
        if (!name) continue;
        const prev = map.get(name);
        map.set(name, {
          count: (prev?.count ?? 0) + 1,
          mood: prev?.mood ?? mood,
        });
      }
      let best = null;
      for (const v of map.values()) if (!best || v.count > best.count) best = v;
      weekTopMood = best?.mood ?? null;
    }

    // Low days
    const lowDays = byDay.filter(
      (d) => typeof d.avgScore === "number" && d.avgScore <= 2
    ).length;

    return {
      weekStart,
      weekEnd,
      rangeLabel: formatWeekRange(weekStart, weekEnd),
      byDay,
      daysWithEntries,
      avg,
      weekTopMood,
      lowDays,
    };
  }, [entries, weekOffset]);

  // Trend 
  const trend = useMemo(() => {
    // previous week
    const today = new Date();
    const prevStart = startOfWeekMonday(addDays(today, -7 * (weekOffset + 1)));
    const prevEnd = endOfWeekSunday(prevStart);

    const prevScores = entries
      .filter((e) => {
        const dt = new Date(e.createdAt);
        if (Number.isNaN(dt.getTime())) return false;
        return dt >= prevStart && dt <= addDays(prevEnd, 1);
      })
      .map((e) => MOOD_SCORE[e.mood?.name] ?? null)
      .filter((v) => typeof v === "number");

    const prevAvg = prevScores.length
      ? prevScores.reduce((a, b) => a + b, 0) / prevScores.length
      : null;

    if (typeof weekly.avg !== "number" || typeof prevAvg !== "number") {
      return { delta: null, direction: "none" };
    }

    const delta = weekly.avg - prevAvg;
    const direction = delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat";

    return { delta, direction };
  }, [entries, weekOffset, weekly.avg]);

  return (
    <main className="app">
      <header>
        <h1>🌿 Daily Reflection</h1>

        {/* Toggle */}
        <button
          type="button"
          className="toggle"
          aria-label="Toggle dark mode"
          onClick={() => setIsDark((v) => !v)}
          style={{ background: "transparent", border: "none" }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </header>

      {/* New Entry */}
      <div className="card">
        <h2>How are you feeling today?</h2>

        <input
          type="text"
          placeholder="Today's reflection title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="moods" aria-label="Mood selector">
          {MOODS.map((mood) => {
            const isSelected = selectedMood?.name === mood.name;

            return (
              <button
                key={mood.name}
                className={`mood ${isSelected ? "active" : ""}`}
                type="button"
                onClick={() => setSelectedMood(mood)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-name">{mood.name}</span>
              </button>
            );
          })}
        </div>

        <textarea
          placeholder="Write what you feel today. No pressure. No judgment."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          type="button"
          className="save"
          onClick={handleSave}
          disabled={!canSave()}
          style={{
            opacity: canSave() ? 1 : 0.6,
            cursor: canSave() ? "pointer" : "not-allowed",
          }}
        >
          Save Entry
        </button>
      </div>

      {/* Insights */}
      <div className="card">
        <h2>📊 Your Insights</h2>
        <div className="stats">
          <div className="stat">
            <strong>{entryCount}</strong>
            Entries
          </div>

          <div className="stat">
            <strong>{topMood ? topMood.emoji : "—"}</strong>
            Top Mood
          </div>

          <div className="stat">
            <strong>{dayStreak}</strong>
            Day Streak
          </div>
        </div>
      </div>

      {/* Full Weekly Mood */}
      <div className="card" id="weeklyAnalytics">
        <div className="weekly-header">
          <h2>📅 Weekly Mood</h2>

          <div className="week-nav">
            <button
              type="button"
              onClick={() => setWeekOffset((v) => v + 1)}
              aria-label="Previous week"
            >
              ←
            </button>

            <div className="week-range">{weekly.rangeLabel}</div>

            <button
              type="button"
              onClick={() => setWeekOffset((v) => Math.max(0, v - 1))}
              aria-label="Next week"
              disabled={weekOffset === 0}
            >
              →
            </button>
          </div>
        </div>

        <div className="weekly-summary">
          <div className="mini">
            <strong>
              {typeof weekly.avg === "number"
                ? `${weekly.avg.toFixed(1)}/5`
                : "—"}
            </strong>
            Avg
          </div>

          <div className="mini">
            <strong>
              {weekly.weekTopMood ? weekly.weekTopMood.emoji : "—"}
            </strong>
            Top mood
          </div>

          <div className="mini">
            <strong>{weekly.lowDays}</strong>
            Low days
          </div>

          <div className="mini">
            <strong>
              {trend.delta === null
                ? "—"
                : `${
                    trend.direction === "up"
                      ? "↑"
                      : trend.direction === "down"
                      ? "↓"
                      : "→"
                  } ${trend.delta > 0 ? "+" : ""}${trend.delta.toFixed(1)}`}
            </strong>
            Trend
          </div>
        </div>

        <div className="weekly-chart">
          {weekly.byDay.map((d) => (
            <div key={d.key} className="day-col">
              <div className="day-emoji">
                {d.topMood ? d.topMood.emoji : "—"}
              </div>

              <div className="bar-wrap">
                <div
                  className={`bar ${d.count === 0 ? "empty" : ""}`}
                  style={{ height: `${Math.max(8, d.count * 12)}px` }}
                ></div>
              </div>

              <div className="day-label">{d.label}</div>
            </div>
          ))}
        </div>

        {weekly.daysWithEntries < 2 && (
          <div className="weekly-insight">
            <div className="weekly-insight-title">A little more data 💡</div>
            <p className="weekly-insight-text">
              Log at least 2 days this week to unlock meaningful weekly
              insights.
            </p>
          </div>
        )}
      </div>

      {/* Mood History */}
      <div className="card" id="moodSection">
        <h2>🧠 Mood History</h2>

        {entries.length === 0 ? (
          <p className="placeholder">
            No entries yet. Save your first reflection ✨
          </p>
        ) : (
          <div className="mood-card-grid">
            {entries.slice(0, 6).map((e) => (
              <div
                key={e.id}
                className="mood-card"
                role="button"
                tabIndex={0}
                onClick={() => openEntry(e)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") openEntry(e);
                }}
              >
                <div className="mood-card-emoji">{e.mood?.emoji}</div>
                <div className="mood-card-moodname">{e.mood?.name}</div>
                <div className="mood-card-title">{e.title}</div>
                <div className="mood-card-date">{e.dateLabel}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {activeEntry && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          onClick={closeEntry}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              aria-label="Close modal"
              onClick={closeEntry}
            >
              ✕
            </button>

            {!isEditing ? (
              <>
                <h3>{activeEntry.title}</h3>
                <p className="modal-date">{activeEntry.dateLabel}</p>
                <div className="modal-mood">
                  {activeEntry.mood?.emoji} {activeEntry.mood?.name}
                </div>
                <p className="modal-text">{activeEntry.text || "(No text)"}</p>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-edit"
                    onClick={startEdit}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="modal-delete"
                    onClick={() => {
                      const ok = window.confirm(
                        "Delete this entry? This cannot be undone."
                      );
                      if (ok) handleDelete(activeEntry.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Edit Entry</h3>
                <p className="modal-date">{activeEntry.dateLabel}</p>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit title…"
                />

                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit your reflection…"
                ></textarea>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-edit"
                    onClick={saveEdit}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="modal-delete"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
