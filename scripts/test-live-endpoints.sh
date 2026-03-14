
#!/bin/bash

# Configuration
API_URL="https://onchainsuite.com/api/v1"
EMAIL="obafemijoshua2020@gmail.com"
PASSWORD="J@shitech47"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Live Endpoint Tests${NC}"

# 1. Authenticate
echo -e "\n${GREEN}1. Authenticating...${NC}"
AUTH_RESPONSE=$(curl -s -L -c cookies.txt -X POST "$API_URL/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Handle potential redirects or errors
if [ -z "$TOKEN" ]; then
  # Try to extract from redirect if needed, but for now just fail verbosely
  echo -e "${RED}❌ Authentication Failed${NC}"
  echo "Response Body: $AUTH_RESPONSE"

  # Try accessToken if token is missing
  TOKEN=$(echo $AUTH_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ No Token Found${NC}"
  exit 1
fi

echo -e "✅ Authenticated. Token acquired."

# 2. Get Organization ID
echo -e "\n${GREEN}2. Fetching Organizations...${NC}"
ORG_RESPONSE=$(curl -s -L -b cookies.txt -X GET "$API_URL/organization/list" \
  -H "Authorization: Bearer $TOKEN")

echo "Debug Org Response: $ORG_RESPONSE"

ORG_ID=$(echo $ORG_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$ORG_ID" ]; then
  echo -e "${RED}❌ No Organization Found${NC}"
  exit 1
fi

echo -e "✅ Organization ID: $ORG_ID"

# 3. Test Sender Identities
echo -e "\n${GREEN}3. Testing Sender Identities${NC}"

# List
echo -e "\n[GET] List Sender Identities"
curl -s -L -b cookies.txt -X GET "$API_URL/sender-identities" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-org-id: $ORG_ID"

# Create (Test Identity)
TEST_EMAIL="test-sender-$(date +%s)@onchainsuite.com"
echo -e "\n\n[POST] Create Sender Identity ($TEST_EMAIL)"
CREATE_RES=$(curl -s -L -b cookies.txt -X POST "$API_URL/sender-identities" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-org-id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\", \"name\":\"Test Automation\"}")
echo $CREATE_RES

IDENTITY_ID=$(echo $CREATE_RES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -n "$IDENTITY_ID" ]; then
  # Get DNS
  echo -e "\n\n[GET] Get DNS Records"
  curl -s -L -b cookies.txt -X GET "$API_URL/sender-identities/$IDENTITY_ID/dns" \
    -H "Authorization: Bearer $TOKEN" \
    -H "x-org-id: $ORG_ID"

  # Recheck Status
  echo -e "\n\n[POST] Recheck Verification"
  curl -s -L -b cookies.txt -X POST "$API_URL/sender-identities/$IDENTITY_ID/recheck" \
    -H "Authorization: Bearer $TOKEN" \
    -H "x-org-id: $ORG_ID"

  # Delete
  echo -e "\n\n[DELETE] Delete Sender Identity"
  curl -s -L -b cookies.txt -X DELETE "$API_URL/sender-identities/$IDENTITY_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "x-org-id: $ORG_ID"
fi

# 4. Test Domain Endpoints (if applicable)
echo -e "\n\n${GREEN}4. Testing Domain Endpoints${NC}"
curl -s -L -b cookies.txt -X GET "$API_URL/domain" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-org-id: $ORG_ID"

echo -e "\n\n${GREEN}✅ Tests Completed${NC}"
