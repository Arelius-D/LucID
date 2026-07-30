#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  LucID — Environment Check & Installation Script
#  Checks Docker & Docker Compose prerequisites, audits ports,
#  configures UFW firewall, prompts for DuckDNS DDNS, sets storage
#  permissions & deploys.
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

# Determine Docker CLI wrapper (auto-detect sudo requirement)
DOCKER_CMD="docker"
if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
  fi
fi

# Handle Purge / Teardown Flag
if [ "$1" = "--purge" ] || [ "$1" = "-p" ] || [ "$1" = "--clean" ]; then
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}   LucID — Complete Environment Purge & Teardown${NC}"
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -n "[TEARDOWN] Stopping and removing LucID containers... "
  ${DOCKER_CMD} compose down -v 2>/dev/null || ${DOCKER_CMD} rm -f lucid-app lucid-caddy lucid-ddns 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Removing LucID Docker images... "
  ${DOCKER_CMD} rmi -f assarelius/lucid:latest caddy:latest qmcgaw/ddns-updater:latest 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Pruning unused Docker system caches... "
  ${DOCKER_CMD} system prune -af --volumes >/dev/null 2>&1 || true
  echo -e "${GREEN}[OK]${NC}"

  echo -n "[TEARDOWN] Cleaning local data, DDNS data, .env, and configuration files... "
  rm -rf ./data ./ddns-data .env Caddyfile docker-compose.yml 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo ""
  echo -e "${GREEN}LucID environment completely purged. No residual state remaining.${NC}"
  exit 0
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   LucID — E2EE Note-Taking Web Application Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# 1. Detect & Display Server Public IP
DETECTED_IP=$(curl -fsSL https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}' || echo "127.0.0.1")
echo -e "[NETWORK] Server Public IP: ${GREEN}${DETECTED_IP}${NC}"
echo -e "[INFO] If using DuckDNS, ensure your domain points to ${GREEN}${DETECTED_IP}${NC} (or ddns-updater will sync it automatically)."
echo ""

# 2. Check Docker Installation
echo -n "[CHECK] Verifying Docker installation... "
if command -v docker >/dev/null 2>&1 || ${DOCKER_CMD} --version >/dev/null 2>&1; then
  DOCKER_VER=$(${DOCKER_CMD} --version | cut -d ' ' -f3 | tr -d ',')
  echo -e "${GREEN}[OK] (${DOCKER_VER})${NC}"
else
  echo -e "${RED}[FAILED]${NC}"
  echo -e "${YELLOW}[ERROR] Docker is not installed. Please install Docker before running LucID.${NC}"
  exit 1
fi

# 3. Check Docker Compose Availability
echo -n "[CHECK] Verifying Docker Compose plugin/binary... "
if ${DOCKER_CMD} compose version >/dev/null 2>&1;  then
  COMPOSE_VER=$(${DOCKER_CMD} compose version --short)
  COMPOSE_EXEC="${DOCKER_CMD} compose"
  echo -e "${GREEN}[OK] (docker compose ${COMPOSE_VER})${NC}"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_VER=$(docker-compose --version | cut -d ' ' -f3 | tr -d ',')
  COMPOSE_EXEC="docker-compose"
  if [ "${DOCKER_CMD}" = "sudo docker" ]; then
    COMPOSE_EXEC="sudo docker-compose"
  fi
  echo -e "${GREEN}[OK] (docker-compose ${COMPOSE_VER})${NC}"
else
  echo -e "${RED}[FAILED]${NC}"
  echo -e "${YELLOW}[ERROR] Docker Compose plugin or binary is not found.${NC}"
  exit 1
fi

# 4. Audit Network Ports (Default 24002 / 80 / 443 / 8000)
PORT="${PORT:-24002}"
echo "[AUDIT] Checking network port availability..."
if command -v ss >/dev/null 2>&1; then
  for p in "${PORT}" 80 443 8000; do
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

# 5. Check & Configure UFW Firewall (if active)
echo "[FIREWALL] Auditing UFW firewall rules..."
if command -v ufw >/dev/null 2>&1; then
  UFW_STATUS=$(sudo ufw status 2>/dev/null | grep -i "Status:" | awk '{print $2}' || echo "inactive")
  echo "  - UFW Status: ${UFW_STATUS}"
  if [ "${UFW_STATUS}" = "active" ]; then
    echo "  - Ensuring firewall rules for ports ${PORT}/tcp, 80/tcp, 443/tcp, 8000/tcp..."
    sudo ufw allow "${PORT}/tcp" >/dev/null 2>&1 || true
    sudo ufw allow 80/tcp >/dev/null 2>&1 || true
    sudo ufw allow 443/tcp >/dev/null 2>&1 || true
    sudo ufw allow 8000/tcp >/dev/null 2>&1 || true
    echo -e "  - Firewall Rules: ${GREEN}[ALLOWED]${NC}"
  fi
else
  echo -e "  - ${GREEN}[SKIPPED] (ufw utility not installed)${NC}"
fi

# 6. Storage & DDNS Directory Verification
DATA_DIR="./data"
DDNS_DIR="./ddns-data"
echo -n "[SETUP] Initializing storage directories (${DATA_DIR}, ${DDNS_DIR})... "
mkdir -p "${DATA_DIR}" "${DDNS_DIR}"
chmod 755 "${DATA_DIR}" "${DDNS_DIR}"
echo -e "${GREEN}[OK]${NC}"

# 7. Interactive / Environment DuckDNS DDNS Setup
if [ -f ".env" ]; then
  # Load existing .env if present
  set -a; source .env 2>/dev/null || true; set +a
fi

IS_INTERACTIVE=false
if [ -c /dev/tty ]; then
  IS_INTERACTIVE=true
fi

if [ -n "${DUCKDNS_TOKEN}" ] && [ -n "${DUCKDNS_DOMAIN}" ]; then
  echo -e "[DDNS] Using existing DuckDNS configuration for domain: ${GREEN}${DUCKDNS_DOMAIN}${NC}"
  cat << EOF > "${DDNS_DIR}/config.json"
{
    "settings": [
        {
            "provider": "duckdns",
            "domain": "${DUCKDNS_DOMAIN}",
            "token": "${DUCKDNS_TOKEN}",
            "ip_version": "ipv4"
        }
    ]
}
EOF
  export DOMAIN_NAME="${DUCKDNS_DOMAIN}"
elif [ "$IS_INTERACTIVE" = true ] && [ "$1" != "-y" ]; then
  echo ""
  echo -e "${BLUE}────── Dynamic DNS (DuckDNS) Onboarding ──────${NC}"
  echo -e "Your Server Public IP is: ${GREEN}${DETECTED_IP}${NC}"
  read -p "Do you have a DuckDNS domain for zero-touch HTTPS TLS? (y/N): " HAS_DUCKDNS </dev/tty || true
  if [[ "${HAS_DUCKDNS}" =~ ^[Yy]$ ]]; then
    read -p "  - Enter DuckDNS Domain (e.g. lucid-selfhosted.duckdns.org): " USER_DDNS_DOMAIN </dev/tty || true
    read -p "  - Enter DuckDNS Token: " USER_DDNS_TOKEN </dev/tty || true
    if [ -n "${USER_DDNS_DOMAIN}" ] && [ -n "${USER_DDNS_TOKEN}" ]; then
      cat << EOF > "${DDNS_DIR}/config.json"
{
    "settings": [
        {
            "provider": "duckdns",
            "domain": "${USER_DDNS_DOMAIN}",
            "token": "${USER_DDNS_TOKEN}",
            "ip_version": "ipv4"
        }
    ]
}
EOF
      echo "DUCKDNS_DOMAIN=${USER_DDNS_DOMAIN}" >> .env
      echo "DUCKDNS_TOKEN=${USER_DDNS_TOKEN}" >> .env
      echo "DOMAIN_NAME=${USER_DDNS_DOMAIN}" >> .env
      export DOMAIN_NAME="${USER_DDNS_DOMAIN}"
      echo -e "  - ${GREEN}[CONFIGURED] DuckDNS dynamic IP updates enabled for ${DOMAIN_NAME} -> ${DETECTED_IP}${NC}"
    fi
  fi
fi

# 8. Fallback Target Domain / Host Configuration
if [ -z "${DOMAIN_NAME}" ]; then
  export DOMAIN_NAME="${DETECTED_IP}"
  echo -e "[CONFIG] Target domain/IP set to: ${GREEN}${DOMAIN_NAME}${NC}"
fi

# 9. Fetch repository deployment files directly via git clone or curl fallback
if command -v git >/dev/null 2>&1; then
  echo -n "[FETCH] Fetching repository deployment files via Git... "
  rm -rf ./temp_lucid_repo 2>/dev/null || true
  git clone --depth 1 https://github.com/Arelius-D/LucID.git ./temp_lucid_repo >/dev/null 2>&1
  cp ./temp_lucid_repo/docker-compose.yml ./docker-compose.yml
  cp ./temp_lucid_repo/Caddyfile ./Caddyfile
  rm -rf ./temp_lucid_repo
  echo -e "${GREEN}[OK]${NC}"
else
  CACHE_BUSTER=$(date +%s)
  echo -n "[FETCH] Downloading latest docker-compose.yml from main branch... "
  curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/main/docker-compose.yml?v=${CACHE_BUSTER}" -o docker-compose.yml
  echo -e "${GREEN}[OK]${NC}"
  echo -n "[FETCH] Downloading latest Caddyfile from main branch... "
  curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/main/Caddyfile?v=${CACHE_BUSTER}" -o Caddyfile
  echo -e "${GREEN}[OK]${NC}"
fi

# 10. Exponential backoff container image puller
pull_with_backoff() {
  local img="$1"
  local attempt=1
  local max_attempts=3
  local delay=5
  local pull_success=false

  echo -n "[PULL] Auditing image ${img}... "
  while [ $attempt -le $max_attempts ]; do
    if ${DOCKER_CMD} pull "$img" >/dev/null 2>&1; then
      echo -e "${GREEN}[OK]${NC}"
      pull_success=true
      break
    else
      if [ $attempt -lt $max_attempts ]; then
        echo -e "${YELLOW}[RETRY in ${delay}s]${NC}"
        sleep $delay
        delay=$((delay * 2))
      fi
    fi
    attempt=$((attempt + 1))
  done

  if [ "$pull_success" = false ]; then
    echo -e "${RED}[FAILED] Unable to pull ${img} after ${max_attempts} attempts.${NC}"
    exit 1
  fi
}

pull_with_backoff "assarelius/lucid:latest"
pull_with_backoff "caddy:latest"
pull_with_backoff "qmcgaw/ddns-updater:latest"

# 11. Launch Container Stack
echo ""
echo -e "${BLUE}[DEPLOY] Launching LucID stack using ${COMPOSE_EXEC}...${NC}"
${COMPOSE_EXEC} up -d

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  LucID is successfully deployed and running!${NC}"
echo -e "${GREEN}  Server Public IP: ${DETECTED_IP}${NC}"
echo -e "${GREEN}  Direct Web Access: http://${DOMAIN_NAME}:${PORT}${NC}"
echo -e "${GREEN}  Caddy HTTPS Access: https://${DOMAIN_NAME}${NC}"
echo -e "${GREEN}  DDNS Updater Web UI: http://${DOMAIN_NAME}:8000${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
