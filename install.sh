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

# The app container runs as the INSTALLING user - detected, never guessed.
# Compose reads these from .env, so vault files are created with the user's own
# ownership and normal permissions instead of a world-writable workaround.
LUCID_UID="$(id -u "${REAL_USER}" 2>/dev/null || id -u)"
LUCID_GID="$(id -g "${REAL_USER}" 2>/dev/null || id -g)"
export LUCID_UID LUCID_GID

# Determine Docker CLI wrapper (auto-detect sudo requirement)
DOCKER_CMD="docker"
if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
  fi
fi

# Handle Purge / Teardown Flag
# ── Branch / channel selection ───────────────────────────────────────────────
# Which branch the deployment files (docker-compose.yml, Caddyfile) and the
# container image are taken from. main -> :latest, dev -> :dev.
BRANCH="main"
PURGE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --purge|-p|--clean|--remove|-r) PURGE=1 ;;
    --dev|-d|dev)                   BRANCH="dev" ;;
    --main|-m|main|--stable)        BRANCH="main" ;;
    --branch|-b)                    shift; [ -n "${1:-}" ] || { echo "install.sh: --branch needs a name" >&2; exit 2; }; BRANCH="$1" ;;
    --branch=*)                     BRANCH="${1#*=}" ;;
    -h|--help)
      echo "install.sh — deploy LucID"
      echo ""
      echo "USAGE"
      echo "  install.sh [CHANNEL] [ACTION]"
      echo ""
      echo "CHANNEL"
      echo "  --main, -m         stable branch, image assarelius/lucid:latest   (default)"
      echo "  --dev, -d          dev branch,    image assarelius/lucid:dev"
      echo "  --branch NAME      any branch;    image tag matches the branch name"
      echo ""
      echo "ACTION"
      echo "  --purge, -p        stop and remove containers, images, volumes, data, ufw rules"
      echo "  -h, --help         this text"
      echo ""
      echo "EXAMPLES"
      echo "  install.sh                 install stable"
      echo "  install.sh --dev           install the dev branch and :dev image"
      echo "  install.sh --purge         complete teardown"
      exit 0
      ;;
    *) echo "install.sh: unknown argument '$1' (try --help)" >&2; exit 2 ;;
  esac
  shift
done

# main is published as :latest; every other branch is published under its own name.
if [ "$BRANCH" = "main" ]; then
  IMAGE_TAG="latest"
else
  IMAGE_TAG="$BRANCH"
fi

# Handle Purge / Teardown Flag
if [ "$PURGE" -eq 1 ]; then
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}   LucID — Complete Environment Purge & Teardown${NC}"
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  
  echo -n "[TEARDOWN] Force stopping and removing all LucID containers... "
  if [ -d "${INSTALL_DIR}" ]; then
    cd "${INSTALL_DIR}" 2>/dev/null && ${DOCKER_CMD} compose down -v --remove-orphans >/dev/null 2>&1 || true
  fi
  ${DOCKER_CMD} rm -f lucid-app lucid-caddy lucid-ddns >/dev/null 2>&1 || true
  docker rm -f lucid-app lucid-caddy lucid-ddns >/dev/null 2>&1 || true
  sudo docker rm -f lucid-app lucid-caddy lucid-ddns >/dev/null 2>&1 || true
  echo -e "${GREEN}[OK]${NC}"

  echo -n "[TEARDOWN] Reverting firewall rules created specifically for LucID... "
  if command -v ufw >/dev/null 2>&1; then
    if [ -f "${INSTALL_DIR}/.ufw_rules" ]; then
      while IFS= read -r rule; do
        # HARD SAFETY GUARD: NEVER TOUCH PORT 22 / SSH RULES
        if [ -n "${rule}" ] && [[ ! "${rule}" =~ ^22(/|$) ]]; then
          sudo ufw delete allow "${rule}" >/dev/null 2>&1 || true
        fi
      done < "${INSTALL_DIR}/.ufw_rules"
    else
      # No ledger means no proof this installer added anything. Purge restores
      # the firewall to its pre-install state and nothing else - without the
      # record, the only correct move is to leave the firewall alone.
      echo "  - No .ufw_rules ledger found; firewall left untouched."
    fi
  fi
  echo -e "${GREEN}[OK]${NC}"
  
  echo -n "[TEARDOWN] Removing LucID Docker images... "
  # Only LucID's own images. caddy:latest and qmcgaw/ddns-updater:latest are
  # shared bases another stack on the host may be using.
  ${DOCKER_CMD} rmi -f assarelius/lucid:latest assarelius/lucid:dev "assarelius/lucid:${IMAGE_TAG}" >/dev/null 2>&1 || true
  echo -e "${GREEN}[OK]${NC}"

  echo -n "[TEARDOWN] Removing LucID's named volumes... "
  # compose down -v already removed them when the compose file was present; this
  # covers the case where it was not. Scoped to this project - a purge must never
  # touch volumes, images or caches belonging to anything else on the host.
  ${DOCKER_CMD} volume rm lucid_caddy_data lucid_caddy_config >/dev/null 2>&1 || true
  echo -e "${GREEN}[OK]${NC}"

  echo -n "[TEARDOWN] Cleaning local directory (${INSTALL_DIR})... "
  rm -rf "${INSTALL_DIR}" 2>/dev/null || true
  echo -e "${GREEN}[OK]${NC}"
  
  echo ""
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}  LucID environment has been completely uninstalled.${NC}"
  echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
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

# 4. Audit Network Ports (Default 58243 / 80 / 443 / 8000)
PORT="${PORT:-58243}"
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
rm -f .ufw_rules 2>/dev/null || true
if command -v ufw >/dev/null 2>&1; then
  UFW_STATUS=$(sudo ufw status 2>/dev/null | grep -i "Status:" | awk '{print $2}' || echo "inactive")
  echo "  - UFW Status: ${UFW_STATUS}"
  if [ "${UFW_STATUS}" = "active" ]; then
    # Only Caddy's ingress needs firewall rules. The app port and the DDNS UI are
    # published on 127.0.0.1 in docker-compose.yml, so the kernel refuses outside
    # connections to them no matter what the firewall says - allowing them would
    # add rules that serve nothing.
    echo "  - Ensuring firewall rules for ports 80/tcp and 443/tcp (Caddy ingress)..."
    for rule in "80/tcp" "443/tcp"; do
      # SAFETY GUARD: Never touch port 22
      if [[ "${rule}" =~ ^22(/|$) ]]; then continue; fi
      # The ledger records only rules THIS install ADDS. Purge restores the
      # firewall to its pre-install state - an allowance the user already had
      # (their own web server, another stack) is never recorded, never removed.
      if sudo ufw status | grep -qE "^${rule}[[:space:]]+ALLOW"; then
        echo "  - ${rule} already allowed (pre-existing; purge will not touch it)"
      else
        sudo ufw allow "${rule}" >/dev/null 2>&1 || true
        echo "${rule}" >> .ufw_rules
      fi
    done
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
ENV_DUCK_DOMAIN="${DUCKDNS_DOMAIN}"
ENV_DUCK_TOKEN="${DUCKDNS_TOKEN}"

if [ -f ".env" ]; then
  # Load existing .env if present
  set -a; source .env 2>/dev/null || true; set +a
fi

DUCKDNS_DOMAIN="${ENV_DUCK_DOMAIN:-${DUCKDNS_DOMAIN}}"
DUCKDNS_TOKEN="${ENV_DUCK_TOKEN:-${DUCKDNS_TOKEN}}"

if [ -n "${DUCKDNS_TOKEN}" ] && [ -n "${DUCKDNS_DOMAIN}" ]; then
  echo -e "[DDNS] Using DuckDNS configuration for domain: ${GREEN}${DUCKDNS_DOMAIN}${NC}"
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
  echo "DUCKDNS_DOMAIN=${DUCKDNS_DOMAIN}" > .env
  echo "DUCKDNS_TOKEN=${DUCKDNS_TOKEN}" >> .env
  echo "DOMAIN_NAME=${DUCKDNS_DOMAIN}" >> .env
  export DOMAIN_NAME="${DUCKDNS_DOMAIN}"
else
  # Force reading interactive prompts from /dev/tty if available
  TTY_DEV="/dev/tty"
  if [ -c "$TTY_DEV" ]; then
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
        echo "DUCKDNS_DOMAIN=${USER_DDNS_DOMAIN}" > .env
        echo "DUCKDNS_TOKEN=${USER_DDNS_TOKEN}" >> .env
        echo "DOMAIN_NAME=${USER_DDNS_DOMAIN}" >> .env
        export DOMAIN_NAME="${USER_DDNS_DOMAIN}"
        echo -e "  - ${GREEN}[CONFIGURED] DuckDNS dynamic IP updates enabled for ${DOMAIN_NAME} -> ${DETECTED_IP}${NC}"
      fi
    fi
  fi
fi

# Fallback: Ensure DOMAIN_NAME is ALWAYS populated (defaults to DETECTED_IP if DuckDNS is not configured)
if [ -z "${DOMAIN_NAME}" ]; then
  export DOMAIN_NAME="${DETECTED_IP}"
  echo "DOMAIN_NAME=${DETECTED_IP}" >> .env
  echo -e "[CONFIG] Target domain/IP set to: ${GREEN}${DETECTED_IP}${NC}"
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
  echo -n "[FETCH] Fetching deployment files from branch ${BRANCH} via Git... "
  rm -rf ./temp_lucid_repo 2>/dev/null || true
  git clone --depth 1 --branch "$BRANCH" https://github.com/Arelius-D/LucID.git ./temp_lucid_repo >/dev/null 2>&1
  cp ./temp_lucid_repo/docker-compose.yml ./docker-compose.yml
  cp ./temp_lucid_repo/Caddyfile ./Caddyfile
  cp ./temp_lucid_repo/install.sh ./install.sh
  chmod +x ./install.sh
  rm -rf ./temp_lucid_repo
  echo -e "${GREEN}[OK]${NC}"
else
  CACHE_BUSTER=$(date +%s)
  echo -n "[FETCH] Downloading docker-compose.yml from branch ${BRANCH}... "
  curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/${BRANCH}/docker-compose.yml?v=${CACHE_BUSTER}" -o docker-compose.yml
  echo -e "${GREEN}[OK]${NC}"
  echo -n "[FETCH] Downloading Caddyfile from branch ${BRANCH}... "
  curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/${BRANCH}/Caddyfile?v=${CACHE_BUSTER}" -o Caddyfile
  echo -e "${GREEN}[OK]${NC}"
  echo -n "[FETCH] Downloading latest install.sh script... "
  curl -fsSL "https://raw.githubusercontent.com/Arelius-D/LucID/${BRANCH}/install.sh?v=${CACHE_BUSTER}" -o install.sh
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

# Pin the compose file to the channel that was requested.
if [ -f docker-compose.yml ]; then
  sed -i "s|image: assarelius/lucid:.*|image: assarelius/lucid:${IMAGE_TAG}|g" docker-compose.yml
fi

# Persist the detected uid/gid for compose (idempotent across re-runs).
grep -q '^LUCID_UID=' .env 2>/dev/null || echo "LUCID_UID=${LUCID_UID}" >> .env
grep -q '^LUCID_GID=' .env 2>/dev/null || echo "LUCID_GID=${LUCID_GID}" >> .env
pull_with_backoff "assarelius/lucid:${IMAGE_TAG}"
pull_with_backoff "caddy:latest"
pull_with_backoff "qmcgaw/ddns-updater:latest"

# 11. Launch Container Stack
echo ""
echo -e "${BLUE}[DEPLOY] Launching LucID stack using ${COMPOSE_EXEC}...${NC}"
${COMPOSE_EXEC} up -d

# Ownership post-launch: the container now writes as the installing user, so no
# permission workaround is needed. Existing installs upgraded from versions where
# the container wrote as uid 1000 get their data realigned to the user - best
# effort, a no-op on fresh installs and wherever the uid already matches.
if [ -n "$SUDO_USER" ]; then
  chown -R "$REAL_USER:$REAL_USER" "$INSTALL_DIR" 2>/dev/null || true
fi
sudo chown -R "${LUCID_UID}:${LUCID_GID}" ./data 2>/dev/null || chown -R "${LUCID_UID}:${LUCID_GID}" ./data 2>/dev/null || true

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
  echo -e "  ${BOLD}${MAGENTA}[URL]  Primary production URL (Caddy + Let's Encrypt TLS):${NC}"
  echo -e "         ${CYAN}${BOLD}https://${DOMAIN_NAME}${NC}"
  echo ""
fi
echo -e "  [DIR]  Installed directory:    ${GREEN}${INSTALL_DIR}${NC}"
echo -e "  [IP]   Server public IP:       ${GREEN}${DETECTED_IP}${NC}"
echo -e "  [APP]  App API, host-only:     http://127.0.0.1:${PORT}   (loopback bind; reach via the host or an SSH tunnel)"
echo -e "  [DDNS] Updater UI, host-only:  http://127.0.0.1:8000    (loopback bind; never published to the internet)"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════${NC}"
