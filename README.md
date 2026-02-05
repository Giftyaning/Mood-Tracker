# 🌿 Daily Reflection — Mood & Weekly Analytics Web App

A clean, thoughtful web app for tracking daily reflections, visualising mood patterns, and gaining gentle, data-driven insights over time.

This project is designed to feel simple and human-first while still demonstrating solid front-end engineering, data modelling, and UX thinking.

## ✨ Features

### 📝 **Daily Reflections**

* Add a reflection with:

  * Title
  * Mood (emoji + label)
  * Free-text journal entry
* Entries are stored **locally in the browser using `localStorage`**.

### 🌙 **Dark Mode**

* Toggle between light and dark themes.
* All components inherit theme styles consistently.

### 🧠 **Mood History**

* Displays your **7 most recent entries** in a clean card grid.
* Clicking a card opens a detailed modal view.

### 🔍 **View, Edit & Delete (via Modal)**

* Click any entry card to open a modal showing:

  * Title
  * Date
  * Mood (emoji + name)
  * Full reflection text
* From the modal you can:

  * **Edit** → loads the entry back into the form for updating
  * **Delete** → removes the entry from storage

### 📊 **Insights Dashboard**

Shows high-level stats across all your entries:

* Total number of entries
* Most common mood (emoji)
* Current day streak

### 📅 **Weekly Mood Analytics (Key Feature)**

A dedicated analytics panel that helps you understand patterns over time.

**Includes:**

* **Week navigation** (Monday → Sunday)
* **Weekly summary:**

  * Average mood score (1–5)
  * Top mood of the week (emoji)
  * Number of “low-mood” days
  * Trend vs last week (↑ / ↓)
* **7-day visual chart:**

  * One column per day (Mon–Sun)
  * Same-colour bars for clarity
  * Emoji above each bar
* **Gentle, adaptive insight message:**

  * Changes based on whether the week was *Good, Mixed, or Tough*
  * Supportive, non-judgmental, and practical

---

## 🧠 How the Data Works (in simple terms)

### Mood scoring (used for analytics)

Each mood maps to a numeric score:

| Mood        | Score |
| ----------- | ----- |
| 😣 Stressed | 1     |
| 😴 Tired    | 2     |
| 😌 Calm     | 3     |
| 🤩 Excited  | 4     |
| 😊 Happy    | 5     |

### Weekly logic

* The app uses **Monday as the start of the week**.
* If you make multiple entries in one day, **only the latest one counts** for that day’s analytics.
* Weekly stats are calculated from these daily values.

---

## 🛠️ Tech Stack

* **HTML** — Structure
* **CSS** — Modern, minimal UI with CSS variables and dark mode
* **JavaScript (Vanilla)** —

  * State management
  * localStorage persistence
  * Weekly analytics calculations
  * DOM rendering
  * Modal interactions
* **No backend / no frameworks**

---

## 📁 Project Structure

```
daily-reflection/
│── index.html
│── style.css
│── script.js
│── assets/
│   └── icons/
```

---

## 🚀 How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/your-username/daily-reflection.git
```

2. Open the project folder:

```bash
cd daily-reflection
```

3. Open `index.html` in your browser **or** use a local server (recommended):

With VS Code Live Server:

* Right click `index.html` → Open with Live Server

Or using Python:

```bash
python -m http.server
```

Then visit: `http://localhost:8000`

---

## 🧪 What You Can Test

Try the following to see the full experience:

1. Add entries across different days
2. Switch between light and dark mode
3. Click a mood history card → open modal
4. Edit an entry → see it update instantly
5. Delete an entry → watch insights update
6. Navigate weekly analytics (← / →)
7. Observe how trend and suggestions change

---

## 🎯 Why This Is a Strong Portfolio Project

This project demonstrates:

* Clean front-end engineering
* Thoughtful UI/UX design
* Real data persistence (localStorage)
* Non-trivial data transformations (daily → weekly aggregation)
* Time-based reasoning (weeks, streaks, trends)
* Human-centred, responsible design for wellbeing tools

---

## 🌱 Future Improvements (Optional)

Some ideas if you want to extend this further:

* Word cloud from reflections
* Export entries as CSV
* Search or filter past entries
* Mobile-first responsive tweaks
* Tags for reflections
* Calendar view
* Cloud sync option

---

## 💬 Feedback & Contributions

Feel free to open an issue or submit a pull request if you have ideas or improvements.

If you’d like, I can also provide:

* A LinkedIn post to showcase this project
* A GitHub Issues template
* Or a demo video script

Happy coding 🌿
