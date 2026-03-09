# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# ---- Runtime Stage ----
FROM node:22-alpine AS runtime

WORKDIR /app

# Create non-root user
RUN addgroup -S mcp && adduser -S mcp -G mcp

# Copy only production deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy compiled code
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER mcp

# Labels for Docker Hub / MCP Registry
LABEL org.opencontainers.image.title="DevUtils MCP Server"
LABEL org.opencontainers.image.description="Comprehensive developer utility tools for MCP: hashing, encoding, UUID, JWT, JSON, network, text, and more."
LABEL org.opencontainers.image.source="https://github.com/paladini/devutils-mcp-server"
LABEL org.opencontainers.image.licenses="MIT"

# Entry point
ENTRYPOINT ["node", "dist/index.js"]
