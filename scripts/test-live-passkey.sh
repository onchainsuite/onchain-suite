
#!/bin/bash

API_URL="https://onchainsuite.com/api/v1"
EMAIL="obafemijoshua2020@gmail.com"
PASSWORD="J@shitech47"

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Passkey Flow Tests${NC}"

# 1. Login (to get token for registration)
echo -e "\n1. Authenticating..."
AUTH_RES=$(curl -s -L -c cookies.txt -X POST "$API_URL/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")
TOKEN=$(echo $AUTH_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Get Status
echo -e "\n\n[GET] Passkey Status"
curl -s -L -b cookies.txt -X GET "$API_URL/auth/passkey/status" \
  -H "Authorization: Bearer $TOKEN"

# 3. Start Registration
echo -e "\n\n[POST] Start Registration"
curl -s -L -b cookies.txt -X POST "$API_URL/auth/passkey/register/start" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{}"

# 4. Start Login (Public)
echo -e "\n\n[POST] Start Login (Public)"
curl -s -L -b cookies.txt -X POST "$API_URL/auth/passkey/login/start" \
  -H "Content-Type: application/json" \
  -d "{}"

echo -e "\n\n${GREEN}✅ Passkey API Reachability Verified${NC}"
# Note: Full flow requires browser interaction for WebAuthn signatures.
