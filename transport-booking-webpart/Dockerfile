# Stage 1: Build
FROM node:18.19.1-bullseye-slim AS builder

# Build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ git ca-certificates bash openssl \
 && rm -rf /var/lib/apt/lists/*

# NPM 8 recommended for SPFx 1.18.x
RUN npm i -g npm@8.19.4

WORKDIR /workspace

# Copy manifest + lock first (better caching)
COPY package.json package-lock.json ./
ENV npm_config_legacy_peer_deps=true
RUN npm install

# Copy all sources
COPY . .

# Build SPFx package
RUN npx gulp clean \
 && npx gulp bundle --ship \
 && npx gulp package-solution --ship

# Stage 2: Runtime/Artifacts
FROM busybox:1.36.1 AS runtime
WORKDIR /app

# Copy only guaranteed artifacts
COPY --from=builder /workspace/sharepoint/solution/*.sppkg ./sharepoint/solution/
COPY --from=builder /workspace/dist ./dist/

# Default CMD prints out the artifact path
CMD ["sh", "-c", "echo 'SPFx package built:' && ls -la sharepoint/solution/"]
