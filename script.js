// ---------- DOM ----------
const toggle = document.getElementById("toggle");
const titleInput = document.getElementById("titleInput");
const moodButtons = document.querySelectorAll(".mood");
const textInput = document.getElementById("textInput");
const moodSection = document.getElementById("moodSection");
const saveBtn = document.getElementById("saveBtn");

const weeklyAnalyticsEl = document.getElementById("weeklyAnalytics");

const modal = document.getElementById("entryModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalMood = document.getElementById("modalMood");
const modalText = document.getElementById("modalText");
const modalEditBtn = document.getElementById("modalEditBtn");
const modalDeleteBtn = document.getElementById("modalDeleteBtn");

const entryCountEl = document.getElementById("entryCount");
const topMoodEl = document.getElementById("topMood");
const streakEl = document.getElementById("streak");

//---------- STATE ----------
let selectedMood = null; // { emoji, name }
let editingEntryId = null;
let modalEntryId = null;

let currentWeekStart = getWeekStartMonday(new Date()); // for weekly analytics

//---------- THEME ----------
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

//---------- STORAGE ----------
function getEntries() {
  return JSON.parse(localStorage.getItem("journalEntries")) || [];
}
function setEntries(entries) {
  localStorage.setItem("journalEntries", JSON.stringify(entries));
}

//---------- HELPERS ----------
function formatDateLong(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeToDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Monday as start of week (UK)
function getWeekStartMonday(date) {
  const d = normalizeToDay(date);
  const day = d.getDay(); // Sun=0, Mon=1...
  const diff = day === 0 ? -6 : 1 - day; // shift back to Monday
  return addDays(d, diff);
}

function toISODate(d) {
  return new Date(d).toISOString().split("T")[0];
}

function weekRangeText(weekStart) {
  const start = new Date(weekStart);
  const end = addDays(start, 6);
  const startTxt = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const endTxt = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  return `Mon ${startTxt} – Sun ${endTxt}`;
}

//--- Mood score map ---
const MOOD_SCORE = {
  "😣": 1,
  "😴": 2,
  "😌": 3,
  "🤩": 4,
  "😊": 5,
};

//---------- MOOD SELECT ----------
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    moodButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    selectedMood = {
      emoji: btn.dataset.emoji,
      name: btn.dataset.name,
    };
  });
});

//---------- FORM ----------
function resetForm() {
  titleInput.value = "";
  textInput.value = "";
  selectedMood = null;
  editingEntryId = null;
  saveBtn.textContent = "Save Entry";
  moodButtons.forEach((b) => b.classList.remove("active"));
}

//---------- SAVE / UPDATE ----------
function saveEntry() {
  if (!titleInput.value.trim() || !textInput.value.trim() || !selectedMood) {
    alert("Please add a title, mood, and reflection ✍🏽");
    return;
  }

  const entries = getEntries();

  if (editingEntryId) {
    const idx = entries.findIndex((e) => e.id === editingEntryId);
    if (idx !== -1) {
      entries[idx] = {
        ...entries[idx],
        title: titleInput.value.trim(),
        text: textInput.value.trim(),
        mood: selectedMood.emoji,
        moodName: selectedMood.name,
      };
    }
  } else {
    entries.push({
      id: Date.now(),
      title: titleInput.value.trim(),
      text: textInput.value.trim(),
      mood: selectedMood.emoji,
      moodName: selectedMood.name,
      date: toISODate(new Date()),
    });
  }

  setEntries(entries);
  resetForm();
  renderMoodSection();
  updateInsights();
  renderWeeklyAnalytics();
}

saveBtn.addEventListener("click", saveEntry);

//---------- INSIGHTS ----------
function calculateStreak(entries) {
  if (entries.length === 0) return 0;

  const uniqueDates = [...new Set(entries.map((e) => e.date))].sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let streak = 0;
  let cursor = normalizeToDay(new Date());

  for (const dateStr of uniqueDates) {
    const entryDay = normalizeToDay(dateStr);
    const diffDays = (cursor - entryDay) / (1000 * 60 * 60 * 24);

    if (diffDays === 0 || diffDays === 1) {
      streak += 1;
      cursor = new Date(entryDay.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}

function updateInsights() {
  const entries = getEntries();
  entryCountEl.textContent = entries.length;

  if (entries.length === 0) {
    topMoodEl.textContent = "—";
    streakEl.textContent = "0";
    return;
  }

  //--- To display the top mood as an EMOJI ---
  const counts = {};
  for (const e of entries) counts[e.mood] = (counts[e.mood] || 0) + 1;

  const topEmoji = Object.keys(counts).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b
  );
  topMoodEl.textContent = topEmoji;

  streakEl.textContent = String(calculateStreak(entries));
}

//---------- MODAL ----------
function openEntryModal(entry) {
  modalEntryId = entry.id;

  modalTitle.textContent = entry.title;
  modalDate.textContent = formatDateLong(entry.date);
  modalMood.textContent = `${entry.mood} ${entry.moodName || ""}`.trim();
  modalText.textContent = entry.text;

  modal.classList.remove("hidden");
}

function closeEntryModal() {
  modal.classList.add("hidden");
  modalEntryId = null;
}

closeModal.addEventListener("click", closeEntryModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeEntryModal();
});

modalEditBtn.addEventListener("click", () => {
  const entries = getEntries();
  const entry = entries.find((e) => e.id === modalEntryId);
  if (!entry) return;

  editingEntryId = entry.id;
  titleInput.value = entry.title;
  textInput.value = entry.text;
  selectedMood = { emoji: entry.mood, name: entry.moodName };

  moodButtons.forEach((b) => {
    b.classList.toggle("active", b.dataset.emoji === entry.mood);
  });

  saveBtn.textContent = "Update Entry";
  closeEntryModal();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

modalDeleteBtn.addEventListener("click", () => {
  if (!modalEntryId) return;
  const ok = confirm("Delete this entry?");
  if (!ok) return;

  const entries = getEntries().filter((e) => e.id !== modalEntryId);
  setEntries(entries);

  if (editingEntryId === modalEntryId) resetForm();

  closeEntryModal();
  renderMoodSection();
  updateInsights();
  renderWeeklyAnalytics();
});

//---------- MOOD HISTORY To open the modal ----------
function renderMoodSection() {
  const entries = getEntries();
  moodSection.innerHTML = "";

  if (entries.length === 0) {
    moodSection.innerHTML = `
      <div class="placeholder">
        No reflections yet. Start with one small thought today 💚
      </div>
    `;
    return;
  }

  const recent = entries
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 7);

  const grid = document.createElement("div");
  grid.className = "mood-card-grid";

  recent.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "mood-card";

    card.innerHTML = `
      <div class="mood-card-emoji">${entry.mood}</div>
      <div class="mood-card-moodname">${entry.moodName || ""}</div>
      <div class="mood-card-title">${entry.title}</div>
      <div class="mood-card-date">${formatDateLong(entry.date)}</div>
    `;

    card.addEventListener("click", () => openEntryModal(entry));
    grid.appendChild(card);
  });

  moodSection.innerHTML = `<h2>🧠 Mood History</h2>`;
  moodSection.appendChild(grid);
}

//---------- WEEKLY ANALYTICS ----------

//--- Daily points: last entry of each day ---
function getDailyLastEntries(entries) {
  const map = {}; // date -> entry
  entries.forEach((e) => {
    const d = e.date;
    if (!map[d] || e.id > map[d].id) map[d] = e;
  });
  return map;
}

//--- To get the 7 days of the current selected week ---
function getWeekDays(weekStart) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    days.push({
      date: toISODate(d),
      label: d.toLocaleDateString("en-GB", { weekday: "short" }), // Mon, Tue...
    });
  }
  return days;
}

//--- Compute weekly stats ---
function computeWeeklyStats(weekStart, entries) {
  const dailyMap = getDailyLastEntries(entries);
  const days = getWeekDays(weekStart);

  const points = days.map((day) => {
    const entry = dailyMap[day.date] || null;
    if (!entry) return { ...day, entry: null, score: null };

    const score = MOOD_SCORE[entry.mood] ?? null;
    return { ...day, entry, score };
  });

  const scored = points.filter((p) => typeof p.score === "number");
  const daysLogged = scored.length;

  let avg = null;
  if (daysLogged > 0) {
    avg = scored.reduce((sum, p) => sum + p.score, 0) / daysLogged;
  }

  //--- top mood emoji within that week ---
  let topEmoji = "—";
  if (daysLogged > 0) {
    const counts = {};
    scored.forEach((p) => {
      counts[p.entry.mood] = (counts[p.entry.mood] || 0) + 1;
    });
    topEmoji = Object.keys(counts).reduce((a, b) =>
      counts[a] >= counts[b] ? a : b
    );
  }

  const lowDays = scored.filter((p) => p.score <= 2).length;

  return { points, avg, topEmoji, lowDays, daysLogged };
}

function classifyWeek(stats) {
  if (stats.daysLogged < 2) return "not_enough";
  const avg = stats.avg ?? 0;

  if (avg >= 3.8 && stats.lowDays <= 1) return "good";
  if (avg < 2.8 || stats.lowDays >= 3) return "tough";
  return "mixed";
}

function weeklyMessage(type, stats, trendDiff) {
  if (type === "not_enough") {
    return {
      title: "A little more data 💡",
      text: "Log at least 2 days this week to unlock meaningful weekly insights.",
    };
  }

  if (type === "good") {
    return {
      title: "You’re doing well 🌿",
      text: "This week looks steady overall. Keep doing what’s working—protect your sleep, keep your routines, and make space for one thing you enjoy. Small consistency is powerful.",
    };
  }

  if (type === "mixed") {
    return {
      title: "A mixed week — and you’re learning 💚",
      text: "You had a blend of days—some dips, but also recovery. Next week, try: (1) 10–15 minutes of movement, (2) start with one small ‘win’ task, (3) a simple wind-down routine before bed.",
    };
  }

  //--- tough ---
  return {
    title: "This week felt heavy 🫶🏽",
    text: "Several days were low-energy or stressed. If you can: simplify your to-do list, schedule recovery time, and talk to someone you trust. If it’s felt like this for a while or feels overwhelming, consider reaching out for extra support.",
  };
}

function formatTrend(diff) {
  if (diff === null) return { label: "—", value: "—" };
  const rounded = Math.round(diff * 10) / 10;
  if (rounded > 0) return { label: `↑ +${rounded}`, value: `↑ +${rounded}` };
  if (rounded < 0) return { label: `↓ ${rounded}`, value: `↓ ${rounded}` };
  return { label: "— 0.0", value: "— 0.0" };
}

function renderWeeklyAnalytics() {
  const entries = getEntries();

  //--- This week stats ---
  const thisStats = computeWeeklyStats(currentWeekStart, entries);

  //--- Last week stats ---
  const lastWeekStart = addDays(currentWeekStart, -7);
  const lastStats = computeWeeklyStats(lastWeekStart, entries);

  const trendDiff =
    typeof thisStats.avg === "number" && typeof lastStats.avg === "number"
      ? thisStats.avg - lastStats.avg
      : null;

  const trend = formatTrend(trendDiff);

  const type = classifyWeek(thisStats);
  const msg = weeklyMessage(type, thisStats, trendDiff);

  //--- Build UI ---
  const weekText = weekRangeText(currentWeekStart);

  const today = normalizeToDay(new Date());
  const nextWeekStart = addDays(currentWeekStart, 7);
  const isNextInFuture = nextWeekStart > getWeekStartMonday(today); // disable beyond current week

  //--- Chart ---
  const barMaxHeight = 60; // px
  const chartHTML = thisStats.points
    .map((p) => {
      const has = p.entry && typeof p.score === "number";
      const height = has ? (p.score / 5) * barMaxHeight : 8;

      const emoji = has ? p.entry.mood : "—";
      const barClass = has ? "bar" : "bar empty";

      return `
        <div class="day-col">
          <div class="day-emoji">${emoji}</div>
          <div class="bar-wrap">
            <div class="${barClass}" style="height:${height}px"></div>
          </div>
          <div class="day-label">${p.label}</div>
        </div>
      `;
    })
    .join("");

  const avgText =
    thisStats.avg === null
      ? "—"
      : `${(Math.round(thisStats.avg * 10) / 10).toFixed(1)}/5`;
  const lowDaysText = String(thisStats.lowDays);
  const topEmoji = thisStats.topEmoji;

  weeklyAnalyticsEl.innerHTML = `
    <div class="weekly-header">
      <h2 style="margin:0;">📅 Weekly Mood</h2>
      <div class="week-nav">
        <button type="button" id="prevWeekBtn" aria-label="Previous week">←</button>
        <div class="week-range">${weekText}</div>
        <button type="button" id="nextWeekBtn" aria-label="Next week" ${
          isNextInFuture ? "disabled" : ""
        }>→</button>
      </div>
    </div>

    <div class="weekly-summary">
      <div class="mini">
        <strong>${avgText}</strong>
        Avg
      </div>
      <div class="mini">
        <strong>${topEmoji}</strong>
        Top mood
      </div>
      <div class="mini">
        <strong>${lowDaysText}</strong>
        Low days
      </div>
      <div class="mini">
        <strong>${trend.value}</strong>
        Trend
      </div>
    </div>

    <div class="weekly-chart">
      ${chartHTML}
    </div>

    <div class="weekly-insight">
      <div class="weekly-insight-title">${msg.title}</div>
      <p class="weekly-insight-text">${msg.text}</p>
    </div>
  `;

  //--- Hook up buttons ---
  const prevBtn = document.getElementById("prevWeekBtn");
  const nextBtn = document.getElementById("nextWeekBtn");

  prevBtn.addEventListener("click", () => {
    currentWeekStart = addDays(currentWeekStart, -7);
    renderWeeklyAnalytics();
  });

  if (!isNextInFuture) {
    nextBtn.addEventListener("click", () => {
      currentWeekStart = addDays(currentWeekStart, 7);
      renderWeeklyAnalytics();
    });
  }
}

//--- INIT ---
renderMoodSection();
updateInsights();
renderWeeklyAnalytics();
