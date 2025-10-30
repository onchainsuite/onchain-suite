import { type ApiEndpoint } from "../types";

// Mock data
export const endpoints: ApiEndpoint[] = [
  {
    path: "/api/query",
    method: "POST",
    description: "Execute SQL queries on your data",
    rateLimit: "100/min",
  },
  {
    path: "/api/segment",
    method: "GET",
    description: "Retrieve segment data and user lists",
    rateLimit: "200/min",
  },
  {
    path: "/api/segment",
    method: "POST",
    description: "Create or update user segments",
    rateLimit: "50/min",
  },
  {
    path: "/api/insights",
    method: "GET",
    description: "Get AI-generated insights and recommendations",
    rateLimit: "50/min",
  },
  {
    path: "/api/alerts",
    method: "GET",
    description: "Fetch active alerts and notifications",
    rateLimit: "100/min",
  },
];

export const exampleRequest = `curl -X POST https://api.on3hain.com/api/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "SELECT * FROM wallets LIMIT 10",
    "chain": "ethereum"
  }'`;

export const exampleResponse = `{
  "success": true,
  "data": [
    {
      "wallet_address": "0x742d...3f4a",
      "balance": "1234.56",
      "transactions": 234
    }
  ],
  "meta": {
    "count": 10,
    "execution_time": "45ms"
  }
}`;
