#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  LucID — Environment Check & Installation Script
#  Checks Docker & Docker Compose prerequisites, verifies ports,
#  sets up storage permissions, and launches the container.
# ═══════════════════════════════════════════════════════════════

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
  echo -e "${YELLOW}[ERROR] Docker is not installed. Please install Docker before running LucID.${NC}"
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

# 3. Check Port Availability (Default 24002 / Configurable)
PORT="${PORT:-24002}"
echo -n "[CHECK] Checking port ${PORT} availability... "
if command -v ss >/dev/null 2>&1; then
  if ss -tulpn | grep -q ":${PORT} "; then
    echo -e "${YELLOW}[IN USE] (Port ${PORT} is currently active)${NC}"
  else
    echo -e "${GREEN}[FREE]${NC}"
  fi
else
  echo -e "${GREEN}[SKIPPED] (ss utility not present)${NC}"
fi

# 4. Storage Directory Verification
DATA_DIR="./data"
echo -n "[SETUP] Initializing local storage directory (${DATA_DIR})... "
mkdir -p "${DATA_DIR}"
chmod 755 "${DATA_DIR}"
echo -e "${GREEN}[OK]${NC}"

# 5. Ensure docker-compose.yml is present
if [ ! -f "docker-compose.yml" ]; then
  echo -n "[FETCH] Downloading docker-compose.yml from main branch... "
  curl -fsSL https://raw.githubusercontent.com/Arelius-D/LucID/main/docker-compose.yml -o docker-compose.yml
  echo -e "${GREEN}[OK]${NC}"
fi

# 6. Launch Container
echo ""
echo -e "${BLUE}[DEPLOY] Launching LucID container using ${COMPOSE_CMD}...${NC}"
${COMPOSE_CMD} up -d

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  LucID is successfully deployed and running!${NC}"
echo -e "${GREEN}  Local Access: http://localhost:${PORT}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
