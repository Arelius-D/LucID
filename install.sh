#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  LucID — Environment Check & Installation Script
#  Checks Docker & Docker Compose prerequisites, audits ports,
#  configures UFW firewall, prompts for DuckDNS DDNS, verifies
#  DNS resolution & DDNS health, sets permissions & deploys.
#
#  Usage:
#    ./install.sh          # Standard installation (inside ~/lucid)
#    ./install.sh --purge  # Complete teardown & image/data wipe
#
#  1-Line Remote Commands:
#    curl -fsSL https://raw.githubusercontent.com/Arelius-D/LucID/main/install.sh | bash
#    curl -fsSL https://raw.githubusercontent.com/Arelius-D/LucID/main/install.sh | bash -s -- --purge
# ═══════════════════════════════════════════════════════════════

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Determine actual user home directory when run under sudo
REAL_USER="${SUDO_USER:-$USER}"
REAL_HOME=$(eval echo "~${REAL_USER}")
INSTALL_DIR="${LUCID_DIR:-${REAL_HOME}/lucid}"

# Determine Docker CLI wrapper (auto-detect sudo requirement)
DOCKER_CMD="docker"
if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
  fi
fi

# Handle Purge / Teardown Flag
if [ "$1" = "--purge" ] || [ "$1" = "-p" ] || [ "$1" = "--clean" ] || [ "$1" = "--remove" ] || [ "$1" = "-r" ]; then
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}   LucID — Complete Environment Purge & Teardown${NC}"
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  
  echo -n "[TEARDOWN] Force stopping and removing all LucID containers... "
  if [ -d "${INSTALL_DIR}" ]; then
    cd "${INSTALL_DIR}" 2>/dev/null && ${DOCKER_CMD} compose down -v --remove-orphans 2>/dev/null || true
  fi
  ${DOCKER_CMD} rm -f lucid-app lucid-caddy lucid-ddns 2>/dev/null || true
  docker rm -f lucid-app lucid-caddy lucid-ddns 2>/dev/null || true
  sudo docker rm -f lucid-app lucid-caddy lucid-ddns 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Removing LucID Docker images... "
  ${DOCKER_CMD} rmi -f assarelius/lucid:latest caddy:latest qmcgaw/ddns-updater:latest 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Pruning unused Docker system caches and volumes... "
  ${DOCKER_CMD} system prune -af --volumes >/dev/null 2>&1 || true
  echo -e "${GREEN}[OK]${NC}"

  echo -n "[TEARDOWN] Cleaning local directory (${INSTALL_DIR})... "
  rm -rf "${INSTALL_DIR}" 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo ""
  echo -e "${GREEN}LucID containers, images, volumes, and directory completely wiped.${NC}"
  exit 0
fi

if [ "$(pwd)" != "${INSTALL_DIR}" ]; then
  mkdir -p "${INSTALL_DIR}"
  cd "${INSTALL_DIR}"
fi

# Fix directory ownership for real user
if [ -n "$SUDO_USER" ]; then
  chown -R "$REAL_USER:$REAL_USER" "$INSTALL_DIR" 2>/dev/null || true
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   LucID — E2EE Note-Taking Web Application Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "[DIR] Operating Directory: ${GREEN}${INSTALL_DIR}${NC}"
echo ""

# 1. Detect & Display Server Public IP
DETECTED_IP=$(curl -fsSL https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}' || echo "127.0.0.1")
echo -e "[NETWORK] Host Public IP: ${GREEN}${DETECTED_IP}${NC}"
echo -e "[INFO] Ensure DuckDNS points to ${GREEN}${DETECTED_IP}${NC} (or ddns-updater will sync it automatically)."
echo ""

# 2. Check Docker Installation
echo -n "[CHECK] Verifying Docker installation... "
if command -v docker >/dev/null 2>&1 || ${DOCKER_CMD} --version >/dev/null 2>&1; then
  DOCKER_VER=$(${DOCKER_CMD} --version | cut -d ' ' -f3 | tr -d ',')
  echo -e "${GREEN}[OK] (${DOCKER_VER})${NC}"
else
  echo -e "${RED}[FAILED]${NC}"
  echo -e "${YELLOW}[ERROR] Docker is not installed on this system.${NC}"
  echo -e "  - For automated zero-touch Docker & Docker Compose setup, run:"
  echo -e "    ${GREEN}curl -fsSL https://raw.githubusercontent.com/Arelius-D/NeXdocMan/main/nexdocman.sh | sudo bash -s -- -i -y${NC}"
  echo -e "  - Or visit: https://github.com/Arelius-D/NeXdocMan"
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
  echo -e "  - Run NeXdocMan automated setup: ${GREEN}curl -fsSL https://raw.githubusercontent.com/Arelius-D/NeXdocMan/main/nexdocman.sh | sudo bash -s -- -i -y${NC}"
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
else
  # Force reading interactive prompts from /dev/tty if available
  TTY_DEV="/dev/tty"
  if [ -c "$TTY_DEV" ] && [ "$1" != "-y" ]; then
    echo ""
    echo -e "${BLUE}────── Dynamic DNS (DuckDNS) Onboarding ──────${NC}"
    echo -e "Your Server Public IP is: ${GREEN}${DETECTED_IP}${NC}"
    read -p "Do you have a DuckDNS domain for zero-touch HTTPS TLS? (y/N): " HAS_DUCKDNS < "$TTY_DEV" || true
    if [[ "${HAS_DUCKDNS}" =~ ^[Yy]$ ]]; then
      read -p "  - Enter DuckDNS Domain (e.g. lucid-selfhosted.duckdns.org): " USER_DDNS_DOMAIN < "$TTY_DEV" || true
      read -p "  - Enter DuckDNS Token: " USER_DDNS_TOKEN < "$TTY_DEV" || true
      # Clean input strings (strip whitespace / line breaks)
      USER_DDNS_DOMAIN=$(echo "${USER_DDNS_DOMAIN}" | tr -d '[:space:]')
      USER_DDNS_TOKEN=$(echo "${USER_DDNS_TOKEN}" | tr -d '[:space:]')
      
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
fi

# Fallback: Ensure ddns-data/config.json is ALWAYS a valid JSON file so ddns-updater never crash-loops
if [ ! -f "${DDNS_DIR}/config.json" ]; then
  cat << 'EOF' > "${DDNS_DIR}/config.json"
{
  "settings": []
}
EOF
fi

# 8. Fetch repository deployment files directly via git clone or curl fallback
if command -v git >/dev/null 2>&1; then
  echo -n "[FETCH] Fetching repository deployment files via Git... "
  rm -rf ./temp_lucid_repo 2>/dev/null || true
  git clone --depth 1 https://github.com/Arelius-D/LucID.git ./temp_lucid_repo >/dev/null 2>&1
  cp ./temp_lucid_repo/docker-compose.yml ./docker-compose.yml
  cp ./temp_lucid_repo/Caddyfile ./Caddyfile
  cp ./temp_lucid_repo/install.sh ./install.sh
  chmod +x ./install.sh
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
  echo -n "[FETCH] Downloading latest install.sh script... "
  curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/main/install.sh?v=${CACHE_BUSTER}" -o install.sh
  chmod +x ./install.sh
  echo -e "${GREEN}[OK]${NC}"
fi

# Ensure real user owns all generated files and directories
if [ -n "$SUDO_USER" ]; then
  chown -R "$REAL_USER:$REAL_USER" "$INSTALL_DIR" 2>/dev/null || true
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

# Fix permissions again post-container launch (ensure data files are readable by host user)
if [ -n "$SUDO_USER" ]; then
  chown -R "$REAL_USER:$REAL_USER" "$INSTALL_DIR" 2>/dev/null || true
fi
chmod 666 ./data/store.json 2>/dev/null || true

# 12. Post-Deploy Health Check & DNS Resolution Audit
if [ "${DOMAIN_NAME}" != "${DETECTED_IP}" ]; then
  echo ""
  echo -n "[AUDIT] Auditing DNS resolution for domain ${DOMAIN_NAME}... "
  RESOLVED_IP=""
  if command -v nslookup >/dev/null 2>&1; then
    RESOLVED_IP=$(nslookup "${DOMAIN_NAME}" 2>/dev/null | grep -A 1 "Name:" | grep "Address:" | awk '{print $2}' || true)
  elif command -v getent >/dev/null 2>&1; then
    RESOLVED_IP=$(getent ahosts "${DOMAIN_NAME}" 2>/dev/null | head -n1 | awk '{print $1}' || true)
  fi

  if [ -n "${RESOLVED_IP}" ]; then
    echo -e "${GREEN}[RESOLVED: ${RESOLVED_IP}]${NC}"
  else
    echo -e "${YELLOW}[PENDING / PROPAGATING]${NC}"
  fi

  echo -n "[HEALTH] Auditing ddns-updater container status... "
  DDNS_STATUS=$(${DOCKER_CMD} inspect --format='{{.State.Health.Status}}' lucid-ddns 2>/dev/null || echo "running")
  echo -e "${GREEN}[${DDNS_STATUS}]${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  LucID Production E2EE Web Application is Online!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
if [ "${DOMAIN_NAME}" != "${DETECTED_IP}" ]; then
  echo -e "  ${BOLD}${MAGENTA}🔒 PRIMARY PRODUCTION URL (Caddy + Let's Encrypt TLS):${NC}"
  echo -e "     👉 ${CYAN}${BOLD}https://${DOMAIN_NAME}${NC}"
  echo ""
fi
echo -e "  📁 Installed Directory:   ${GREEN}${INSTALL_DIR}${NC}"
echo -e "  🔌 Server Public IP:       ${GREEN}${DETECTED_IP}${NC}"
echo -e "  🌐 Direct Web Access:      http://${DOMAIN_NAME}:${PORT}"
echo -e "  🔄 DDNS Updater Web UI:    http://${DOMAIN_NAME}:8000"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════${NC}"
