# Pinned major version for reproducible builds (was: node:alpine, a floating tag
# that could jump Node majors between two identical builds).
FROM node:25-alpine

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
  CMD node -e "require('http').request({host:'127.0.0.1',port:3000,path:'/health',timeout:5000},r=>process.exit(r.statusCode<400?0:1)).on('error',()=>process.exit(1)).end()"

CMD ["node", "server.js"]
