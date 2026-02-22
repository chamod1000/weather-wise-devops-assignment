# 🐳 Docker Deployment Guide - WeatherWise

This document provides step-by-step instructions on how to build, run, and manage the WeatherWise application using Docker.

## 📋 Prerequisites

Before proceeding, ensure you have the following installed on your machine:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine & Docker Compose)
- Git (optional, for cloning)

## ⚙️ Configuration

The application requires environment variables to function correctly. 

1. Create a `.env.local` file in the root directory.
2. Add the following configuration (update with your actual keys):

```env
# OpenWeatherMap API Key (Required for weather data)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# MongoDB Connection String (Already configured for Docker)
MONGODB_URI=mongodb://mongodb:27017/weather-dashboard

# JWT Secret for Authentication (Required)
JWT_SECRET=your_jwt_secret_key_change_in_production
```

> **Note:** The `MONGODB_URI` is pre-configured in `docker-compose.yml` to connect to the internal MongoDB container relative to the docker network.

## 🚀 How to Run

### 1. Build and Start
To compile the images and start the services, run the following command in your terminal:

```bash
docker-compose up --build
```
*   `--build`: Forces a rebuild of the images to ensure you have the latest code changes.
*   The initial build might take a few minutes as it downloads dependencies and builds the optimized Node.js application.

### 2. Verify Deployment
Once the terminal shows "Ready in [x]ms", you can access the application:

*   **Application URL:** [http://localhost:3000](http://localhost:3000)
*   **Database Port:** `27017` (Internal)

## 🏗️ Architecture Overview

The containerized environment consists of two services managed by `docker-compose.yml`:

| Service | Image Base | Description |
|---------|------------|-------------|
| **weather-app** | `node:20-alpine` | The Next.js Fullstack application. Uses **Standalone mode** for reduced image size and better performance. Depends on `mongodb` health checks. |
| **mongodb** | `mongo:latest` | The database server. Persists data to a local Docker volume (`mongodb_data`). |

### Container Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Host Machine                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           weather-network (Bridge Network)              │ │
│  │                                                          │ │
│  │  ┌──────────────────────┐   ┌────────────────────────┐ │ │
│  │  │   weather-app        │   │      mongodb           │ │ │
│  │  │  (Next.js App)       │   │    (Database)          │ │ │
│  │  │                      │   │                        │ │ │
│  │  │  Port: 3000          │◄──┤  Port: 27017          │ │ │
│  │  │  Image: node:20      │   │  Image: mongo:latest   │ │ │
│  │  │  -alpine             │   │                        │ │ │
│  │  │                      │   │  Volume:               │ │ │
│  │  │  CPU: 1.0           │   │  mongodb_data          │ │ │
│  │  │  Memory: 1GB         │   │                        │ │ │
│  │  └──────────┬───────────┘   │  CPU: 0.5             │ │ │
│  │             │                │  Memory: 512MB         │ │ │
│  │             │                └───────────┬────────────┘ │ │
│  └─────────────┼────────────────────────────┼──────────────┘ │
│                │                             │                │
│         Port Mapping                  Volume Mapping         │
│         3000:3000                     mongodb_data:/data/db  │
└────────────────┼────────────────────────────┼────────────────┘
                 │                             │
           Host:3000                    Persistent Storage
```

### Multi-Stage Build Process

The `Dockerfile` implements a **three-stage build** strategy for optimal image size and security:

#### Stage 1: Dependencies (`deps`)
```dockerfile
FROM node:20-alpine AS deps
```
- **Purpose:** Install production dependencies only
- **Optimization:** Uses `npm ci` for faster, deterministic installs
- **Size:** Minimal Alpine Linux base (~5MB)

#### Stage 2: Builder (`builder`)
```dockerfile
FROM node:20-alpine AS builder
```
- **Purpose:** Build the Next.js application
- **Process:** 
  - Copies `node_modules` from deps stage
  - Builds optimized production bundle
  - Creates standalone output (self-contained)

#### Stage 3: Runner (`runner`)
```dockerfile
FROM node:20-alpine AS runner
```
- **Purpose:** Final production image
- **Features:**
  - Non-root user execution (`nextjs:nodejs`)
  - Only includes built assets (no source code)
  - Minimal attack surface
- **Size Advantage:** ~50% smaller than full build image

### Network Architecture

The application uses a **custom bridge network** (`weather-network`) for service communication:

**Internal DNS Resolution:**
- Service name `mongodb` resolves to the database container IP
- Services communicate via service names (not localhost)
- Automatic service discovery within the network

**Port Mapping:**
- **3000:3000** → Application accessible from host browser
- **27017** → Database port (internal only, not exposed to host)

### Data Persistence Strategy

**Volume Configuration:**
```yaml
volumes:
  mongodb_data:
    driver: local
```

**Benefits:**
- Data persists across container restarts
- Independent lifecycle from containers
- Can be backed up using `docker volume` commands

**Data Location:** 
- Linux/Mac: `/var/lib/docker/volumes/mongodb_data`
- Windows: `C:\ProgramData\Docker\volumes\mongodb_data`

### Security Considerations

1. **User Permissions:**
   - App runs as non-root user (`uid:1001`, `gid:1001`)
   - Follows principle of least privilege

2. **Secrets Management:**
   - API keys stored in `.env.local` (not in image)
   - `.dockerignore` prevents secrets from being copied
   - Environment variables injected at runtime

3. **Image Security:**
   - Uses official Alpine-based images (smaller attack surface)
   - Multi-stage build excludes dev dependencies
   - No source code in final image

### Resource Management

**Application Service:**
```yaml
resources:
  limits:
    cpus: '1.0'      # Maximum 1 CPU core
    memory: 1G       # Maximum 1GB RAM
  reservations:
    cpus: '0.5'      # Guaranteed 0.5 cores
    memory: 512M     # Guaranteed 512MB
```

**Database Service:**
```yaml
resources:
  limits:
    cpus: '0.5'      # Maximum 0.5 CPU core
    memory: 512M     # Maximum 512MB RAM
  reservations:
    cpus: '0.25'     # Guaranteed 0.25 cores
    memory: 256M     # Guaranteed 256MB
```

**Purpose:**
- Prevents resource starvation
- Ensures predictable performance
- Protects host system from runaway processes

### Health Checks

The MongoDB service includes a health check to ensure database availability before the app starts:

```yaml
healthcheck:
  test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**Benefits:**
- App waits for DB to be ready
- Prevents connection errors on startup
- Automatic restart on failure

## 🛑 Stopping the Application

To stop the containers and remove the network, run:

```bash
docker-compose down
```

To stop and **also remove the database volume** (WARNING: This deletes all data):
```bash
docker-compose down -v
```

## 🔍 Troubleshooting

**Issue: "Connection Refused" to MongoDB**
*   **Cause:** MongoDB container not fully initialized before app attempts connection
*   **Fix:** The health check in `docker-compose.yml` should prevent this. Wait 10-15 seconds after startup.
*   **Manual Check:** Run `docker-compose ps` to verify mongodb status shows "healthy"

**Issue: Changes didn't apply after rebuilding**
*   **Cause:** Docker using cached layers from previous build
*   **Fix:** Run `docker-compose build --no-cache && docker-compose up` to force fresh build

**Issue: Port 3000 already in use**
*   **Cause:** Another application or previous container instance using port 3000
*   **Fix:** Find and stop the conflicting process, or change port in `docker-compose.yml` (e.g., `"3001:3000"`)
*   **Check:** Run `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)

**Issue: Port 27017 already in use**
*   **Cause:** Local MongoDB installation or previous container running
*   **Fix:** Stop local MongoDB service or change port mapping in `docker-compose.yml`

**Issue: Out of disk space during build**
*   **Cause:** Docker images/volumes consuming excessive space
*   **Fix:** Clean Docker resources: `docker system prune -a --volumes` (WARNING: removes unused data)

**Issue: Container exits immediately after starting**
*   **Cause:** Application error or missing environment variables  
*   **Fix:** Check logs with `docker-compose logs weather-app` and verify `.env.local` exists with required variables

**Issue: Permission denied errors in container**
*   **Cause:** File ownership conflicts between host and container user (uid 1001)
*   **Fix:** Ensure mounted volumes have appropriate permissions or run container as root temporarily for debugging

**Issue: Slow build times**
*   **Cause:** Large build context or re-downloading dependencies
*   **Fix:** Verify `.dockerignore` is properly excluding `node_modules`, `.next`, and other unnecessary files
*   **Optimization:** Order Dockerfile instructions to maximize layer cache hits

**Issue: Cannot access application after "Ready" message**
*   **Cause:** Port mapping issue or firewall blocking connections
*   **Fix:** Verify port mapping with `docker-compose ps` and check firewall settings
*   **Test:** Try accessing from inside container: `docker-compose exec weather-app curl localhost:3000`

**Issue: Database data lost after restart**
*   **Cause:** Used `docker-compose down -v` which removes volumes
*   **Fix:** Use `docker-compose down` without `-v` flag to preserve data
*   **Recovery:** Data cannot be recovered if volume was deleted; restore from backup if available
