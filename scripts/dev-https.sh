#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

HOSTS_FILE="/etc/hosts"
DOMAIN="dev.gamzatech.site"
IP="127.0.0.1"
ENTRY="${IP}    ${DOMAIN}"

if [[ "${EUID}" -ne 0 ]]; then
  SUDO="sudo"
else
  SUDO=""
fi

cleanup_hosts() {
  local temp_file
  temp_file="$(mktemp)"
  grep -v "${DOMAIN}" "${HOSTS_FILE}" > "${temp_file}" || true
  ${SUDO} cp "${temp_file}" "${HOSTS_FILE}"
  rm -f "${temp_file}"
}

echo
echo "[INFO] Current directory: ${PWD}"
echo "[INFO] Project directory: ${PROJECT_DIR}"
echo

echo "[INFO] Updating hosts file..."
temp_file="$(mktemp)"
grep -v "${DOMAIN}" "${HOSTS_FILE}" > "${temp_file}" || true
echo "${ENTRY}" >> "${temp_file}"
${SUDO} cp "${temp_file}" "${HOSTS_FILE}"
rm -f "${temp_file}"
echo "[OK] Set: ${ENTRY}"

trap cleanup_hosts EXIT

echo
echo "========================================"
echo "  Starting Next.js dev server (HTTPS)"
echo "  URL: https://${DOMAIN}:3000"
echo "  Press Ctrl+C to stop"
echo "========================================"
echo

cd "${PROJECT_DIR}"
echo "[INFO] Running from: ${PWD}"
echo

yarn next dev -H "${DOMAIN}" -p 3000 --experimental-https
