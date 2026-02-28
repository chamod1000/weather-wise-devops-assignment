# 🌤️ WeatherWise - Advanced DevOps & Cloud Computing Assignment

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

### � How to Access Admin Panel

The admin panel has a separate login interface. When you access the admin URL, you'll be directed to a dedicated admin login page.

**Admin Credentials:**
- **Email:** `admin@gmail.com`
- **Password:** `admin1234`

**Steps to Access:**
1. Navigate to `/admin` URL (local or live)
2. Enter admin credentials in the login form
3. You'll be automatically redirected to the admin dashboard

**Note:** Admin users have separate authentication and are automatically redirected to the admin panel upon login, not the regular user dashboard.

### 👨‍💻 Creating Admin Accounts

If you need to create additional admin accounts or promote existing users to admin:

```bash
# Promote any existing user to admin role
npm run admin:promote your-email@example.com

# Or create a new admin account
npm run admin:create
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
- **Deployment Platform:** Vercel
- **Version Control:** Git & GitHub

## 🌟 Features
- **Real-time Weather:** Fetches live weather data using OpenWeatherMap API.
- **5-Day Forecast:** Displays weather trends for the upcoming days.
- **Favorites System:** Allows users to save favorite cities to a persistent MongoDB database.
- **City Search:** Search functionality for cities worldwide.
- **Responsive Design:** Fully responsive UI with Glassmorphism effects.

## 🌿 Branch Strategy
We implemented a professional Git branching strategy:
- `main` - **Production Branch**: Protected branch. Only deploys to Vercel after passing CI checks.
- `develop` - **Integration Branch**: All feature branches are merged here first for testing.
- `branches/*` - **Feature Branches**: Used for individual development (e.g., `shani/ui-design`, `chamod/ci-setup`).

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

### 2. K.A. Shani Randika - ITBIN-2313-0089
**Role:** FullStack Developer
- **UI/UX Development:** Designed and built the responsive interface using Tailwind CSS and Next.js.
- **Backend Integration:** Connected the application to MongoDB Atlas for storing user data.
- **Feature Implementation:** Developed the City Search, Current Weather display, and Forecast components.
- **API Handling:** Managed integration with OpenWeatherMap API.

---

## 📥 Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git
- Docker Desktop (for containerized deployment)

---

## 🐳 Docker Deployment (Recommended)

The easiest way to run WeatherWise is using Docker. This method handles all dependencies and database setup automatically.

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/chamod1000/weather-wise-devops-assignment.git
   cd weather-wise-devops-assignment
   ```

2. **Create environment file**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   MONGODB_URI=mongodb://mongodb:27017/weather-dashboard
   JWT_SECRET=your_jwt_secret_key_change_in_production
   ```

3. **Build and start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - **Application:** http://localhost:3000
   - **Admin Panel:** http://localhost:3000/admin

### Docker Architecture

The Docker setup includes:
- **weather-app**: Next.js application (Node.js 20 Alpine)
- **mongodb**: Database server with persistent data storage
- **Custom network**: Allows seamless container communication
- **Health checks**: Ensures proper startup sequence

### Stopping the Application

```bash
# Stop containers (keeps data)
docker-compose down

# Stop containers and remove data
docker-compose down -v
```

### 📖 Full Docker Documentation

For detailed information including:
- Multi-stage build architecture
- Resource management and limits
- Security considerations
- Troubleshooting guide
- Network architecture details

**See:** [DOCKER_INSTRUCTIONS.md](DOCKER_INSTRUCTIONS.md)

---

## 💻 Manual Installation (Without Docker)

If you prefer to run the application without Docker:

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
   
   Create a `.env.local` file:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production** (optional)
   ```bash
   npm run build
   npm start
   ```

---

