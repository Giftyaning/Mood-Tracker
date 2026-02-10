# 🌿 Mood Tracker — Mood & Weekly Analytics Web App (React + AWS Deployment)

A thoughtfully designed React mood tracking web app that helps users reflect daily, visualise emotional patterns, and gain gentle, data-driven insights over time. This project demonstrates a clean front-end development, UX thinking, user data handling, cloud deployment with AWS Amplify, and a full automated testing and CI pipeline using GitHub Actions.

A live version of the app is deployed on AWS Amplify.


## 🌍 Live Demo

🔗 Live app:(https://main.d19glismie7h9p.amplifyapp.com/)
🔗 GitHub repo: (https://github.com/Giftyaning/Mood-Tracker)


## ✨ Key Features

### 📝 **Daily Reflections**

Users can:

Add a reflection with:

  A title.

  A selected mood (emoji + label).

  A free-text journal reflection.

All data is stored in localStorage, keeping the app fully client-side.


### 🌙 **Dark Mode**

* Toggle between light and dark themes.
* Consistent styling using CSS variables

### 🧠 **Mood History**

* Displays the 7 most recent entries in a clean card layout.
* Clicking a card opens a detailed modal view.


### 🔍 **View, Edit & Delete Entries**

From the modal, users can:

  View full reflection

  Edit an entry (form pre-fills)

  Delete an entry (updates UI and storage)


### 📊 **Insights Dashboard**

Includes:

  Total number of entries

  Most common mood 

  Current streak


### 📅 **Weekly Mood Analytics (Key Feature)**

A custom analytics panel showing:

Monday–Sunday navigation (average mood, top mood, low‑mood days, trend vs last week)

A 7‑day visual chart with emoji indicators

Adaptive insight messages (“good week”, “mixed week”, “tough week”)

---

## 🧠 How the Analytics work

### Mood scoring 

Each mood maps to a numeric score:

| Mood        | Score |
| ----------- | ----- |
| 😣 Stressed | 1     |
| 😴 Tired    | 2     |
| 😌 Calm     | 3     |
| 🤩 Excited  | 4     |
| 😊 Happy    | 5     |

### Weekly logic

* Weeks start on Monday

* If multiple entries exist for a day, the latest one is used

* Weekly stats are calculated from these daily values

---

## 🛠️ Tech Stack

### Frontend

  React (Vite)

  JavaScript (ES6+)

  HTML5

  Modern CSS (variables, flexbox, grid)

### Storage

  localStorage (client-side persistence)

### Cloud Deployment

  AWS Amplify Hosting
    * Builds directly from GitHub
    * Automatic HTTPS
    * Global CDN
    * Continous deployment on every push.


---

## Why cloud deployment matters

  * Global accessibility

  * Reliable hosting

  * Automatic builds on Git pushes

  * A workflow similar to real industry deployments


AWS Amplify allowed me to focus on building a high-quality front-end application while still gaining practical cloud experience.

## 🧪 Automated Testing & CI/CD (Engineering Highlight)

To ensure reliability and prevent regressions, I implemented automated UI tests and a full CI pipeline.

### ✔️ Testing Stack
Vitest — test runner

React Testing Library — user‑interaction testing

jsdom — browser simulation

jest‑dom — readable assertions

user‑event — simulates real clicks/typing

### ✔️ GitHub Actions CI Pipeline
On every push or pull request:

Install Node

Install dependencies

Run tests

Fail the build if any test fails

This ensures:

No broken code is merged

UI behaviour stays consistent

The codebase remains stable over time

I also intentionally broke a test to confirm CI catches failures — and it did.


## 📁 Project Structure

```
mood-tracker/
│── react/
│   └── mood-tracker-react/
│       ├── src/
│       ├── public/
│       ├── package.json
│       ├── vite.config.js
│       └── 
```
---

## 🚀 How to Run Locally

## Clone the repo git clone https://github.com/giftyaning/mood-tracker.git 
## Navigate to React app cd mood-tracker/react/mood-tracker-react 
## Install dependencies npm install 
## Run in development mode npm run dev # Build for production npm run build

---

## 🧪 What You Can Test

Try the following to see the full experience:

  Add entries across different days

  Switch light/dark mode

  Open, edit, and delete entries

  Navigate weekly analytics (← / →)

  Observe how trend and suggestions change

---
## 💬 Contact / Feedback

If you have suggestions or would like to collaborate, feel free to open an issue or reach out.
