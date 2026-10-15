# Wearable Companion — 2026-CSE3CAP

An individual capstone prototype for exploring a user-friendly mobile interface for wearable data. This initial version uses synthetic readings only; it does not connect to wearable hardware, provide medical advice, or collect real health data.

## Run locally

Requirements: Node.js LTS and Expo Go on a phone, or an Android/iOS simulator.

```sh
npm install
npx expo start
```

Scan the QR code with Expo Go, or use the terminal shortcuts for a simulator. No credentials or backend are required for this initial demo.

## Current status

- Implemented in this starter: a single-screen mobile dashboard, simulated device label, synthetic sample metrics, and periodic demo refresh.
- Not implemented: accounts/authentication, persistent history, real BLE/NFC, alerts, exports, backend, production security, and accessibility audit.
- No physical wearable is available. Device status and readings must remain clearly identified as simulated.

See `docs/` for the initial backlog, schedule, risk register, and requirements status. Update these from actual work and evidence; do not record planned activities as completed.
