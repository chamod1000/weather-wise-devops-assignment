# ============================================
# Stage 1: Dependencies Installation
# ============================================
# Using Alpine Linux for minimal image size (~5MB base vs ~900MB full node)
# This stage installs only production dependencies
FROM node:20-alpine AS deps

# Add compatibility layer for native dependencies that require glibc
# libc6-compat provides compatibility for packages built against glibc
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package files first to leverage Docker layer caching
# If package.json hasn't changed, this layer will be reused
COPY package.json package-lock.json ./

# Use 'npm ci' instead of 'npm install' for faster, deterministic builds
# npm ci installs exact versions from package-lock.json and is optimized for CI/CD
RUN npm ci

# ============================================
# Stage 2: Application Builder
# ============================================
# This stage builds the Next.js application in production mode
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules from deps stage to avoid reinstalling
# This saves significant build time
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code and configuration files
# .dockerignore ensures we don't copy unnecessary files
COPY . .

# Disable Next.js telemetry for privacy and build performance
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
# next.config.mjs must have 'output: standalone' for this build to work
# This creates a self-contained production build with minimal dependencies
RUN npm run build

# ============================================
# Stage 3: Production Runner
# ============================================
# Final lightweight image containing only production artifacts
# This multi-stage approach reduces final image size by ~60%
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Disable telemetry in production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security (principle of least privilege)
# Running as root is a security risk; this creates a system user with minimal permissions
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets (images, fonts, etc.)
COPY --from=builder /app/public ./public

# Copy the standalone build output
# This includes only necessary files for running the app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files (CSS, JS bundles) generated during build
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
# All subsequent commands and the application will run as this user
USER nextjs

# Document the port the application listens on
# This is informational and doesn't actually publish the port
EXPOSE 3000

# Start the Next.js production server
# The standalone build uses a minimal server.js instead of the full Next.js server
CMD ["node", "server.js"]