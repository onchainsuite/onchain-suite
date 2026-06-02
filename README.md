# Onchain Suite

Onchain Suite is the first integrated communication layer built natively for Web3. We help Web3
teams drive retention and engagement by combining on-chain behavioral analytics with lifecycle
messaging and privacy-aware authentication.

## What We Do

Most Web3 products have rich on-chain activity but limited ways to translate that behavior into
actionable marketing and retention workflows. Onchain Suite connects the data and the delivery layer
so growth teams can:

- Understand user behavior across chains and apps
- Segment audiences based on real activity signals
- Trigger personalized campaigns at the right moment
- Measure impact with analytics built into the workflow

## Product Suite

- **R3tain**: retention-focused email marketing built for Web3 brands, with campaigns designed to
  reduce churn and increase re-engagement.
- **Onch3n**: behavioral analytics that captures and interprets blockchain-based activity into
  marketer-friendly insights and retention signals.
- **3ridge**: authentication and data-management layer that helps platforms integrate marketing and
  analytics with privacy-preserving onboarding.

## Who It’s For

- Web3 consumer apps, DeFi protocols, NFT platforms, and on-chain communities
- Growth and marketing teams that need actionable analytics and reliable messaging
- Developers who want a clean API/SDK surface to embed analytics + auth + messaging

## This Repository

This repo contains the Onchain Suite web application (dashboard + website) and a same-origin API
proxy (`/api/v1/*`) that forwards requests to the backend to simplify auth and avoid CORS issues in
browser environments.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Links

- Website: https://onchainsuite.com
- X (Twitter): https://twitter.com/onchainsuite
