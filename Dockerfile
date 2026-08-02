# Pinned major version for reproducible builds (was: node:alpine, a floating tag
# that could jump Node majors between two identical builds).
#
# Even-numbered lines only, and only while they are Active LTS. Odd majors are
# Current releases with roughly seven months of life and no LTS phase at all:
# Dependabot proposed node:25-alpine here, and v25 reached end of life on
# 2026-06-01 with no further security patches, so taking the higher number would
# have shipped users an unpatched runtime. v24 (Krypton) is Active LTS and is
# supported to 2028-04-30. Next move is v26, which becomes LTS on 2026-10-28.
FROM node:26-alpine

WORKDIR /app

# Copy manifests first so the dependency layer caches independently of source.
COPY package*.json ./

# npm ci installs exactly what package-lock.json pins, and fails if the two
# disagree — unlike npm install, which silently resolves new versions.
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Drop root: the image ships with an unprivileged `node` user (uid 1000).
RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 3000

HEALTHCHECK --interval=60s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT:-3000}/health" || exit 1

CMD ["node", "server.js"]
