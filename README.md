# 🌤️ WeatherWise – Advanced DevOps & Cloud Computing Assignment
---
![Project Preview](public/gif/preview.gif)

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

---

## 🔐 Admin Panel Access

### 📍 Admin Panel URL
**Local:** http://localhost:3000/admin  
**Live:** https://weather-wise-devops-assignment.vercel.app/admin

### 👤 Demo Admin Credentials
For evaluation and testing purposes:
- **Email:** `admin@gmail.com`
- **Password:** `admin1234`

### 🚀 Quick Setup Guide

#### Method 1: Create Demo Admin (Recommended for Testing)
```bash
npm run admin:create
```
This automatically creates the demo admin account with the credentials above.

#### Method 2: Promote Your Own Account
```bash
# 1. Register a user account through the website
# 2. Run this command with your email:
npm run admin:promote your-email@example.com
```

### ✨ Admin Panel Features
- **📊 Analytics Dashboard** - User growth charts, top cities, key metrics
- **👥 User Management** - Bulk operations, role management, CSV export
- **💬 Message Moderation** - Reply to messages, status tracking, internal notes
- **📍 Location Management** - Featured cities, popular rankings
- **🔔 Notification System** - Broadcast messages with targeting options
- **📈 API Monitoring** - Performance metrics, endpoint statistics
- **📋 Activity Logs** - Complete audit trail of system events
- **⚙️ System Settings** - Rate limits, maintenance mode, data backup

---

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
- **Containerization:** Docker & Docker Compose
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
- **Docker Containerization:** Multi-stage Dockerfile for optimized production builds, with Docker Compose orchestration for local development.
- **Security:** Secret keys (API keys, DB passwords) are managed via GitHub Secrets and environment variables, never exposed in the code.

### 🔐 Admin Access Control
The application includes a comprehensive role-based access control (RBAC) system with JWT-based authentication and middleware protection. Admins have access to an exclusive admin panel with 8 feature categories including analytics dashboard, user management, message moderation, location management, notification system, API monitoring, activity logs, and system settings.

> 📖 **See the [Admin Panel Access](#-admin-panel-access) section above for login credentials and setup instructions**

> 📖 **For detailed Docker architecture and deployment instructions, see [DOCKER_INSTRUCTIONS.md](DOCKER_INSTRUCTIONS.md)**

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

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed (includes Docker Engine & Docker Compose)
- Git (for cloning the repository)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/chamod1000/weather-wise-devops-assignment.git
   cd weather-wise-devops-assignment
   ```

2. **Create environment configuration**
   
   Create a `.env.local` file in the project root with the following variables:
   ```env
   # OpenWeatherMap API Key (Get from https://openweathermap.org/api)
   OPENWEATHER_API_KEY=your_api_key_here
   
   # MongoDB Connection (pre-configured for Docker)
   MONGODB_URI=mongodb://mongodb:27017/weather-dashboard
   
   # JWT Secret for Authentication (generate with: openssl rand -base64 32)
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Build and run the application**
   ```bash
   docker-compose up --build
   ```
   
   The `--build` flag ensures images are rebuilt with latest code changes.
   Initial build takes 3-5 minutes as it downloads dependencies.

4. **Access the application**
   
   Once you see "Ready in [x]ms" in the terminal:
   - **Application:** http://localhost:3000
   - **Database:** MongoDB running on port 27017 (internal)

### Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services (use cached images) |
| `docker-compose up --build` | Rebuild images and start services |
| `docker-compose up -d` | Start services in detached mode (background) |
| `docker-compose down` | Stop and remove containers |
| `docker-compose down -v` | Stop containers and delete volumes (⚠️ deletes data) |
| `docker-compose logs -f` | View real-time logs from all services |
| `docker-compose ps` | List running containers |
| `docker-compose exec weather-app sh` | Access application container shell |

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENWEATHER_API_KEY` | ✅ Yes | API key from OpenWeatherMap | None |
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb://mongodb:27017/weather-dashboard` |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT authentication | None |
| `NODE_ENV` | No | Environment mode | `production` (in Docker) |

### Troubleshooting Docker Issues

**Problem:** "Connection refused" when connecting to MongoDB
- **Solution:** MongoDB health check ensures it's ready. Wait 10-15 seconds after startup.

**Problem:** Changes not reflected after rebuild
- **Solution:** Clear Docker cache: `docker-compose build --no-cache`

**Problem:** Port 3000 or 27017 already in use
- **Solution:** Stop conflicting services or change ports in `docker-compose.yml`

**Problem:** Out of disk space
- **Solution:** Clean unused Docker resources: `docker system prune -a --volumes`

---

## 💻 Local Development (Without Docker)

### Prerequisites
- Node.js (v20 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/chamod1000/weather-wise-devops-assignment.git
   cd weather-wise-devops-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` with:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   MONGODB_URI=mongodb://localhost:27017/weather-dashboard  # or your MongoDB Atlas URI
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open http://localhost:3000 in your browser

6. **Setup Admin Access (Optional)**
   
   See the [Admin Panel Access](#-admin-panel-access) section above for detailed setup instructions.

---

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
├── .env.local                   <-- 🔐 Environment Variables (git-ignored)
├── .gitignore                   <-- Git Ignore Rules
├── .dockerignore                <-- 🐳 Docker Build Exclusions
├── docker-compose.yml           <-- 🐳 Multi-Container Orchestration
├── Dockerfile                   <-- 🐳 Container Image Definition
├── DOCKER_INSTRUCTIONS.md       <-- 📖 Docker Architecture Documentation
├── package.json                 <-- Project Dependencies
└── README.md                    <-- Project Documentation