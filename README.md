# 🌤️ WeatherWise - Advanced DevOps & Cloud Computing Assignment

WeatherWise is a modern, responsive weather dashboard built with Next.js and MongoDB. This project demonstrates a complete DevOps lifecycle, including automated CI/CD pipelines, cloud deployment, and advanced Git collaboration workflows.

## 👥 Group Information

| Student Name | Student ID | Role |
|--------------|------------|------|
| **O.P.C Akalanka** | ITBIN-2313-0007 | **DevOps Engineer** |
| **K.A. Shani Randika** | ITBIN-2313-0089 | **Full Stack Developer** |

## 🚀 Live Deployment
🔗 **Live Application URL:** https://weather-wise-devops-assignment.vercel.app/

## ⚙️ Build Status
![CI Pipeline](https://github.com/chamod1000/weather-wise-devops-assignment/workflows/CI%20Pipeline/badge.svg)
![Deploy to Production](https://github.com/chamod1000/weather-wise-devops-assignment/workflows/Deploy%20to%20Production/badge.svg)

## 🛠️ Technologies Used
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB (Mongoose)
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
- `feature/*` - **Feature Branches**: Used for individual development (e.g., `feature/ui-design`, `feature/ci-setup`).

## 👨‍💻 Individual Contributions

### 1. O.P.C Akalanka (DevOps Engineer)
- **Repository Setup:** Initialized the Git repository and configured `.gitignore` to secure sensitive files.
- **CI/CD Pipelines:** Created `.github/workflows/ci.yml` for automated testing and `deploy.yml` for production deployment.
- **Vercel Configuration:** Connected the repository to Vercel and managed Environment Variables (`MONGODB_URI`, `VERCEL_TOKEN`).
- **Documentation:** Structured and updated the `README.md` with project details.

### 2. K.A. Shani Randika (Full Stack Developer)
- **UI/UX Development:** Designed and built the responsive interface using Tailwind CSS and Next.js.
- **Backend Integration:** Connected the application to MongoDB Atlas for storing user data.
- **Feature Implementation:** Developed the City Search, Current Weather display, and Forecast components.
- **API Handling:** Managed integration with OpenWeatherMap API.

## 📥 Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [https://github.com/chamod1000/weather-wise-devops-assignment.git](https://github.com/chamod1000/weather-wise-devops-assignment.git)