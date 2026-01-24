# 🌤️ WeatherWise – Advanced DevOps & Cloud Computing Assignment
---
![Frontend](public/file.svg)

## 👥 Group Members
| Student Name | Student ID | Role |
|--------------|------------|------|
| **O.P.C Akalanka** | ITBIN-2313-0007 | **DevOps Engineer** |
| **K.A. Shani Randika** | ITBIN-2313-0089 | **Full Stack Developer** |

## 📌 Project Description

WeatherWise is a modern, responsive weather dashboard application developed using Next.js 14 and MongoDB. It features a fully automated DevOps lifecycle, including CI/CD pipelines, cloud deployment, and secure environment management.
The platform allows users to check real-time weather, view 5-day forecasts, and save favorite cities to a persistent database.
This project simulates a real-world software engineering environment by implementing professional Git workflows, automated testing, branch protection rules, and cloud infrastructure management.

## 🌍 Live Deployment

🔗 **Live Application URL:** https://weather-wise-devops-assignment.vercel.app/

## ⚙️ Build Status
![CI Pipeline](https://github.com/chamod1000/weather-wise-devops-assignment/actions/workflows/ci.yml/badge.svg)
![Deploy to Production](https://github.com/chamod1000/weather-wise-devops-assignment/actions/workflows/deploy.yml/badge.svg)

---

## 🛠️ Technologies Used

- **Frontend:** Next.js 14 (React), Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB (Mongoose)
- **Runtime:** Node.js 20+
- **Version Control:** Git & GitHub
- **CI/CD:** GitHub Actions (Automated Testing & Deployment)
- **Cloud Platform:** Vercel
- **External APIs:** OpenWeatherMap API

---
## ✨ Features

### 🌐 Frontend & UX
The frontend is built with a glassmorphism-inspired UI using Tailwind CSS, ensuring a visually stunning and responsive experience across all devices. It includes dynamic weather visualizations, a seamless search experience, and an interactive dashboard for managing favorite locations.

### 💾 Backend & Data Management
The application connects to a MongoDB Atlas cluster to store user preferences and favorite cities. Custom API routes handle secure communication between the client and the database, ensuring data integrity and fast retrieval times.

### ⚙️ DevOps & Automation
The project features a robust DevOps implementation:
- **CI Pipeline:** Automatically installs dependencies, runs linting checks, and builds the project on every push to ensure code quality.
- **CD Pipeline:** Automatically deploys the application to Vercel only when changes are merged into the `main` branch.
- **Security:** Secret keys (API keys, DB passwords) are managed via GitHub Secrets and never exposed in the code.

---

## 🌱 Branch Strategy

We implemented a professional Git branching strategy to ensure code stability:

- `main` – **Production Branch**: Protected branch. Only deploys to Vercel after passing CI checks.
- `develop` – **Integration Branch**: All feature branches are merged here first for testing.
- `feature/*` – **Feature Branches**: Used for individual development (e.g., `feature/ui-design`, `feature/devops-setup`).

---

## 🧑‍💻 Individual Contributions & Commit Evidence

We actively contributed to the project using professional Git workflows including **feature branches, pull requests, and merge conflict resolution.** Below is a detailed breakdown of each member’s contributions.

---

### 👨‍💻 O.P.C Akalanka – ITBIN-2313-0007
**Role:** DevOps Engineer

**Key Contributions:**
- **Repository Setup:** Initialized the Git repository, configured `.gitignore`, and set up branch protection rules.
- **CI/CD Pipelines:** Created `.github/workflows/ci.yml` for automated testing and `deploy.yml` for production deployment.
- **Infrastructure Management:** Connected the repository to Vercel and managed Environment Variables (`MONGODB_URI`, `VERCEL_TOKEN`).
- **Security Enhancements:** Fixed secret scanning alerts by removing sensitive files (`.env.local`) from history and implementing GitHub Secrets.
- **Maintenance:** Upgraded Node.js runtime versions (v18 to v20) in workflows to match Next.js requirements.
- **Documentation:** Structured the project documentation and maintained the `README.md`.

**Major Commits & Pull Requests:**
- `fix: upgrade node to v20 and remove .env.local`
- `fix: add env vars to deploy pipeline`
- `ci: setup github actions workflows`
- `docs: update readme with project details`

---

### 👩‍💻 K.A. Shani Randika – ITBIN-2313-0089
**Role:** Full Stack Developer

**Key Contributions:**
- **UI/UX Design:** Designed the responsive interface using Tailwind CSS and Next.js components.
- **Backend Integration:** Developed MongoDB schemas (`User.js`, `Favorite.js`) and connected the application to MongoDB Atlas.
- **Feature Development:** Implemented the City Search, Current Weather display, and 5-Day Forecast logic.
- **API Handling:** Managed integration with OpenWeatherMap API and created internal API routes.
- **Code cleanup:** Optimized folder structure and removed unused files.

**Major Commits & Pull Requests:**
- `feat: implement weather dashboard ui`
- `feat: connect mongodb database`
- `fix: resolve api route errors`
- `chore: cleanup directory structure`

---

### ✅ Collaboration Evidence

- Multiple feature branches created and merged (`chamod`, `develop`).
- Successful execution of CI/CD pipelines visible in "Actions" tab.
- Merge conflicts intentionally handled during pipeline configuration.
- clear separation of concerns between DevOps and Development tasks.

---
# ⚙️ Setup Instructions

## Prerequisites
- Node.js (v20 or higher)
- Git

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone [https://github.com/chamod1000/weather-wise-devops-assignment.git](https://github.com/chamod1000/weather-wise-devops-assignment.git)

## 🗂️ Repository Structure

```text
weather-wise-devops-assignment/
├── .github/
│   └── workflows/               <-- ⚙️ DevOps Automation
│       ├── ci.yml               # CI Pipeline (Automated Testing)
│       └── deploy.yml           # CD Pipeline (Vercel Deployment)
├── public/                      <-- 🖼️ Static Assets (Icons/SVGs)
├── src/
│   ├── app/                     <-- 🌐 App Router (Frontend & API)
│   │   ├── admin/               # Admin Dashboard
│   │   ├── api/                 # 🔌 Backend API Routes
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── weather/
│   │   │   └── ...
│   │   ├── components/          # Page-specific components
│   │   ├── globals.css          # Global Styles
│   │   ├── layout.js            # Root Layout
│   │   └── page.js              # Home Page
│   ├── components/              <-- 🧩 Reusable UI Components
│   │   ├── Navbar.js
│   │   ├── WeatherMap.js
│   │   └── ...
│   ├── context/                 <-- 🧠 State Management
│   │   └── GlobalContext.js
│   ├── lib/                     <-- 🛠️ Utilities & Configs
│   │   ├── db.js                # MongoDB Connection
│   │   └── logger.js            # Error Logger
│   └── models/                  <-- 🗄️ Database Schemas
│       ├── User.js
│       ├── ActivityLog.js
│       └── ...
├── .env.local                   <-- 🔐 Environment Variables
├── .gitignore                   <-- Git Ignore Rules
├── package.json                 <-- Project Dependencies
└── README.md                    <-- Project Documentation