#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  LucID — Environment Check & Installation Script
#  Checks Docker & Docker Compose prerequisites, audits ports,
#  configures UFW firewall, sets storage permissions & deploys.
#
#  Usage:
#    ./install.sh          # Standard installation
#    ./install.sh --purge  # Complete teardown & image/data wipe
# ═══════════════════════════════════════════════════════════════

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Handle Purge / Teardown Flag
if [ "$1" = "--purge" ] || [ "$1" = "-p" ] || [ "$1" = "--clean" ]; then
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}   LucID — Complete Environment Purge & Teardown${NC}"
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -n "[TEARDOWN] Stopping and removing LucID containers... "
  docker compose down -v 2>/dev/null || docker rm -f lucid-app lucid-caddy 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Removing LucID Docker images... "
  docker rmi -f assarelius/lucid:latest caddyserver/caddy:latest 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Pruning unused Docker system caches... "
  docker system prune -af --volumes >/dev/null 2>&1 || true
  echo -e "${GREEN}[OK]${NC}"

  echo -n "[TEARDOWN] Cleaning local data and configuration files... "
  rm -rf ./data Caddyfile docker-compose.yml 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo ""
  echo -e "${GREEN}LucID environment completely purged. No residual state remaining.${NC}"
  exit 0
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   LucID — E2EE Note-Taking Web Application Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# 1. Check Docker Installation
echo -n "[CHECK] Verifying Docker installation... "
if command -v docker >/dev/null 2>&1; then
  DOCKER_VER=$(docker --version | cut -d ' ' -f3 | tr -d ',')
  echo -e "${GREEN}[OK] (${DOCKER_VER})${NC}"
else
  echo -e "${RED}[FAILED]${NC}"
  echo -e "${YELLOW}[ERROR] Docker is not installed. Please run NeXdocMan or install Docker first.${NC}"
  exit 1
fi

# 2. Check Docker Compose Availability
echo -n "[CHECK] Verifying Docker Compose plugin/binary... "
if docker compose version >/dev/null 2>&1;  then
  COMPOSE_VER=$(docker compose version --short)
  COMPOSE_CMD="docker compose"
  echo -e "${GREEN}[OK] (docker compose ${COMPOSE_VER})${NC}"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_VER=$(docker-compose --version | cut -d ' ' -f3 | tr -d ',')
  COMPOSE_CMD="docker-compose"
  echo -e "${GREEN}[OK] (docker-compose ${COMPOSE_VER})${NC}"
else
  echo -e "${RED}[FAILED]${NC}"
  echo -e "${YELLOW}[ERROR] Docker Compose plugin or binary is not found.${NC}"
  exit 1
fi

# 3. Audit Network Ports (Default 24002 / 80 / 443)
PORT="${PORT:-24002}"
echo "[AUDIT] Checking network port availability..."
if command -v ss >/dev/null 2>&1; then
  for p in "${PORT}" 80 443; do
    echo -n "  - Checking port ${p}/tcp... "
    if ss -tulpn | grep -q ":${p} "; then
      echo -e "${YELLOW}[IN USE / ACTIVE]${NC}"
    else
      echo -e "${GREEN}[FREE]${NC}"
    fi
  done
else
  echo -e "  - ${GREEN}[SKIPPED] (ss network utility not present)${NC}"
fi

# 4. Check & Configure UFW Firewall (if active)
echo "[FIREWALL] Auditing UFW firewall rules..."
if command -v ufw >/dev/null 2>&1; then
  UFW_STATUS=$(sudo ufw status 2>/dev/null | grep -i "Status:" | awk '{print $2}' || echo "inactive")
  echo "  - UFW Status: ${UFW_STATUS}"
  if [ "${UFW_STATUS}" = "active" ]; then
    echo "  - Ensuring firewall rules for ports ${PORT}/tcp, 80/tcp, 443/tcp..."
    sudo ufw allow "${PORT}/tcp" >/dev/null 2>&1 || true
    sudo ufw allow 80/tcp >/dev/null 2>&1 || true
    sudo ufw allow 443/tcp >/dev/null 2>&1 || true
    echo -e "  - Firewall Rules: ${GREEN}[ALLOWED]${NC}"
  fi
else
  echo -e "  - ${GREEN}[SKIPPED] (ufw utility not installed)${NC}"
fi

# 5. Storage Directory Verification
DATA_DIR="./data"
echo -n "[SETUP] Initializing local storage directory (${DATA_DIR})... "
mkdir -p "${DATA_DIR}"
chmod 755 "${DATA_DIR}"
echo -e "${GREEN}[OK]${NC}"

# 6. Detect Public/Host IP for Caddy SNI domain binding if DOMAIN_NAME is not set
if [ -z "${DOMAIN_NAME}" ]; then
  DETECTED_IP=$(curl -fsSL https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}' || echo "localhost")
  export DOMAIN_NAME="${DETECTED_IP}"
  echo -e "[CONFIG] Target domain/IP set to: ${GREEN}${DOMAIN_NAME}${NC}"
fi

# 7. Fetch latest docker-compose.yml and Caddyfile (always overwrite to guarantee latest release)
CACHE_BUSTER=$(date +%s)
echo -n "[FETCH] Downloading latest docker-compose.yml from main branch... "
curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/main/docker-compose.yml?v=${CACHE_BUSTER}" -o docker-compose.yml
echo -e "${GREEN}[OK]${NC}"

echo -n "[FETCH] Downloading latest Caddyfile from main branch... "
curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/main/Caddyfile?v=${CACHE_BUSTER}" -o Caddyfile
echo -e "${GREEN}[OK]${NC}"

# 8. Launch Container Stack
echo ""
echo -e "${BLUE}[DEPLOY] Launching LucID stack using ${COMPOSE_CMD}...${NC}"
${COMPOSE_CMD} up -d

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  LucID is successfully deployed and running!${NC}"
echo -e "${GREEN}  Direct Web Access: http://${DOMAIN_NAME}:${PORT}${NC}"
echo -e "${GREEN}  Caddy HTTPS Access: https://${DOMAIN_NAME}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
