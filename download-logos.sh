#!/usr/bin/env bash
# ============================================
# Download airline logos from logo.dev
# ============================================
# Usage: ./download-logos.sh
# Requires: curl
#
# Fetches each airline's logo by domain and saves it as logos/<IATA>.png
# If a logo is missing (404), that airline will fall back to a text badge in the UI.

set -u

if [ -z "${LOGO_DEV_TOKEN:-}" ]; then
  read -sp "Please enter logo.dev token: " TOKEN
  echo
else
  TOKEN="$LOGO_DEV_TOKEN"
fi
OUT_DIR="logos"
SIZE=400
FORMAT="webp"

mkdir -p "$OUT_DIR"

# IATA code → primary domain
# Order: code,domain (one per line)
AIRLINES=$(cat <<'EOF'
JL,jal.com
NH,ana.co.jp
MU,ceair.com
CZ,csair.com
CA,airchina.com
HU,hnair.com
CX,cathaypacific.com
SQ,singaporeair.com
KE,koreanair.com
OZ,flyasiana.com
QR,qatarairways.com
LH,lufthansa.com
KL,klm.com
UA,united.com
AA,aa.com
DL,delta.com
WN,southwest.com
AS,alaskaair.com
TG,thaiairways.com
ZH,shenzhenair.com
MF,xiamenair.com
HX,hongkongairlines.com
7G,starflyer.jp
9C,ch.com
HO,juneyaoair.com
SC,sda.cn
FM,ceair.com
KA,cathaypacific.com
VS,virginatlantic.com
UL,srilankan.com
AI,airindia.com
9W,jetairways.com
SV,saudia.com
LX,swiss.com
IB,iberia.com
NK,spirit.com
F9,flyfrontier.com
TR,flyscoot.com
QF,qantas.com
AC,aircanada.com
EOF
)

TOTAL=$(echo "$AIRLINES" | wc -l | tr -d ' ')
OK=0
FAIL=0
SKIP=0
i=0

echo "Downloading $TOTAL airline logos to $OUT_DIR/ ..."
echo ""

while IFS=',' read -r iata domain; do
  [ -z "$iata" ] && continue
  i=$((i + 1))
  OUT_FILE="$OUT_DIR/${iata}.${FORMAT}"

  if [ -s "$OUT_FILE" ]; then
    printf "[%2d/%s] %-3s %-28s SKIP (exists)\n" "$i" "$TOTAL" "$iata" "$domain"
    SKIP=$((SKIP + 1))
    continue
  fi

  URL="https://img.logo.dev/${domain}?token=${TOKEN}&size=${SIZE}&format=${FORMAT}&retina=true&fallback=404"

  # Fetch, capture HTTP status
  HTTP_STATUS=$(curl -s -o "$OUT_FILE" -w "%{http_code}" "$URL")

  if [ "$HTTP_STATUS" = "200" ] && [ -s "$OUT_FILE" ]; then
    printf "[%2d/%s] %-3s %-28s OK\n" "$i" "$TOTAL" "$iata" "$domain"
    OK=$((OK + 1))
  else
    rm -f "$OUT_FILE"
    printf "[%2d/%s] %-3s %-28s FAIL (HTTP %s)\n" "$i" "$TOTAL" "$iata" "$domain" "$HTTP_STATUS"
    FAIL=$((FAIL + 1))
  fi
done <<< "$AIRLINES"

echo ""
echo "Done. Downloaded: $OK  Skipped: $SKIP  Failed: $FAIL  Total: $TOTAL"
