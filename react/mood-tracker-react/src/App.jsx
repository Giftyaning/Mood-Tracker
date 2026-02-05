import { useState } from "react";
import "./App.css";

const MOODS = [
  { emoji: "😊", name: "Happy" },
  { emoji: "😌", name: "Calm" },
  { emoji: "😣", name: "Stressed" },
  { emoji: "😴", name: "Tired" },
  { emoji: "🤩", name: "Excited" },
];

export default function App() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

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
          onClick={() => {
            console.log({ title, text, selectedMood });
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
            <strong id="entryCount">-</strong>
            Entries
          </div>
          <div className="stat">
            <strong id="topMood">—</strong>
            Top Mood
          </div>
          <div className="stat">
            <strong id="streak">-</strong>
            Day Streak
          </div>
        </div>
      </div>

      {/* Weekly Analytics */}
      <div className="card" id="weeklyAnalytics"></div>

      {/* Mood History */}
      <div className="card" id="moodSection"></div>

      {/* Entry Modal */}
      <div
        className="modal hidden"
        id="entryModal"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-content">
          <button
            className="close-btn"
            id="closeModal"
            aria-label="Close modal"
          >
            ✕
          </button>

          <h3 id="modalTitle"></h3>
          <p className="modal-date" id="modalDate"></p>
          <div className="modal-mood" id="modalMood"></div>
          <p className="modal-text" id="modalText"></p>

          <div className="modal-actions">
            <button type="button" className="modal-edit" id="modalEditBtn">
              Edit
            </button>
            <button type="button" className="modal-delete" id="modalDeleteBtn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
