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

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const entryCount = entries.length;

  const topMood = useMemo(() => {
    if (entries.length === 0) return "—";
    const counts = new Map();
    for (const e of entries) {
      const key = e.mood?.name ?? "Unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let best = { name: "—", n: 0 };
    for (const [name, n] of counts.entries()) {
      if (n > best.n) best = { name, n };
    }
    return best.name === "Unknown" ? "—" : best.name;
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
    // Reset edit mode when opening
    setIsEditing(false);
    setEditTitle("");
    setEditText("");
  }

  function closeEntry() {
    setActiveEntry(null);
    // Reset edit mode when closing
    setIsEditing(false);
    setEditTitle("");
    setEditText("");
  }

  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    closeEntry();
  }

  // Start editing 
  function startEdit() {
    if (!activeEntry) return;
    setIsEditing(true);
    setEditTitle(activeEntry.title ?? "");
    setEditText(activeEntry.text ?? "");
  }

  // Cancel editing
  function cancelEdit() {
    setIsEditing(false);
    setEditTitle("");
    setEditText("");
  }

  // Save edited entry
  function saveEdit() {
    if (!activeEntry) return;

    const nextTitle = (editTitle || "").trim() || "(Untitled)";
    const nextText = (editText || "").trim();

    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeEntry.id ? { ...e, title: nextTitle, text: nextText } : e
      )
    );

    // Keep modal open but show updated view mode
    setActiveEntry((prev) =>
      prev ? { ...prev, title: nextTitle, text: nextText } : prev
    );

    setIsEditing(false);
  }

  return (
    <main className="app">
      <header>
        <h1>🌿 Daily Reflection</h1>
        <div className="toggle" id="toggle" aria-label="Toggle dark mode">
          🌙
        </div>
      </header>

      {/* New Entry */}
      <div className="card">
        <h2>How are you feeling today?</h2>

        <input
          id="titleInput"
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
          id="textInput"
          placeholder="Write what you feel today. No pressure. No judgment."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          type="button"
          className="save"
          id="saveBtn"
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
            <strong>{topMood}</strong>
            Top Mood
          </div>
          <div className="stat">
            <strong>-</strong>
            Day Streak
          </div>
        </div>
      </div>

      {/* Weekly Analytics */}
      <div className="card" id="weeklyAnalytics"></div>

      {/* Mood History */}
      <div className="card" id="moodSection">
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

      {/* Entry Modal */}
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
