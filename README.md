# 🌿 Mood Tracker — Mood & Weekly Analytics Web App (React + AWS Deployment)

A thoughtfully designed React-based mood journaling web app that helps users reflect daily, visualise their mood patterns, and gain gentle, data-driven insights over time. Demonstrating a clean front-end development, client-side data handling, UX thinking, and a practical introduction to cloud deployment with AWS.

A live version of this app is hosted on AWS Amplify.


## 🌍 Live Demo

🔗 Live app:(https://main.d19glismie7h9p.amplifyapp.com/)
🔗 GitHub repo: (https://github.com/Giftyaning/Mood-Tracker)


## ✨ Key Features

### 📝 **Daily Reflections**

Users can:

Add a reflection with:

  Title

  Mood (emoji + label)

  Free-text journal entry

All data is stored in localStorage, keeping the app fully client-side with no backend.


### 🌙 **Dark Mode**

* Toggle between light and dark themes.
* Consistent theming using CSS variables

### 🧠 **Mood History**

* Displays your **7 most recent entries** in a clean card grid.
* Clicking a card opens a detailed modal view.


### 🔍 **View, Edit & Delete Entries**

From the modal, users can:

  View full reflection

  Edit an entry (pre-fills the form)

  Delete an entry (updates UI and storage)


### 📊 **Insights Dashboard**

Shows:

  Total number of entries

  Most common mood (emoji)

  Current day streak


### 📅 **Weekly Mood Analytics (Key Feature)**

A custom-built analytics panel that includes:

Monday–Sunday week navigation

Weekly summary:

  Average mood score

  Top mood of the week

  Number of “low-mood” days

  Trend vs last week

7-day visual chart with:

  One column per day

  Same-colour bars for a clean, calm UI

  Emoji above each bar

Gentle, adaptive insight message based on:

  Good week

  Mixed week

  Tough week

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

* The app uses **Monday as the start of the week**.
* If you make multiple entries in one day, **only the latest one counts** for that day’s analytics.
* Weekly stats are calculated from these daily values.

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

---

## What AWS service I used

  I deployed this project using AWS Amplify Hosting, which:

  Builds the React app directly from GitHub

  Automatically serves it over HTTPS

  Provides a globally accessible cloud URL

  Supports continuous deployment (new builds on every Git push)

## Why cloud deployment matters

  Makes applications accessible from anywhere in the world

  Removes the need for users to install anything locally

  Provides reliable hosting instead of relying on a local machine

  Enables scalability and professional infrastructure management

  Mirrors real-world industry workflows for modern web applications

AWS Amplify simplified this process by automating the build pipeline and hosting, allowing me to focus on building a high-quality front-end application while still gaining practical cloud experience.

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

## Clone the repo git clone https://github.com/your-username/mood-tracker.git 
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
