#!/bin/bash
# Watch for DNS propagation to GitHub Pages.
# Exits when both www and apex resolve correctly.

WWW="www.rossmcf.com"
APEX="rossmcf.com"
GITHUB_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")

check_www() {
  dig +short CNAME "$WWW" | grep -q "github.io"
}

check_apex() {
  local resolved
  resolved=$(dig +short A "$APEX")
  for ip in "${GITHUB_IPS[@]}"; do
    echo "$resolved" | grep -q "$ip" && return 0
  done
  return 1
}

echo "Watching DNS for $WWW and $APEX..."
echo "Press Ctrl+C to stop."
echo ""

while true; do
  www_ok=false
  apex_ok=false

  check_www  && www_ok=true
  check_apex && apex_ok=true

  timestamp=$(date +"%H:%M:%S")

  if $www_ok && $apex_ok; then
    echo "[$timestamp] ✓ www  ✓ apex — DNS is propagated!"
    exit 0
  else
    www_status=$( $www_ok  && echo "✓" || echo "✗")
    apex_status=$($apex_ok && echo "✓" || echo "✗")
    echo "[$timestamp] $www_status www  $apex_status apex — waiting..."
  fi

  sleep 30
done
