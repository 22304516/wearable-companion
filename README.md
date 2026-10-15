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

- Implemented: a dashboard, simulator controls, display preferences, and history view for synthetic readings. Samples refresh every three seconds while the simulator is running; generation can be paused or resumed. Users can choose which metrics appear on Today. Up to 200 timestamped entries are stored locally. The History view includes recent trend bars and can clear saved samples.
- Not implemented: accounts/authentication, real BLE/NFC, alerts, exports, backend, production security, and a full accessibility audit.
- No physical wearable is available. Device status and readings must remain clearly identified as simulated.

See `docs/USER_GUIDE.md` for app workflows, `docs/SYSTEM_MAINTENANCE.md` for technical handover, and `docs/VALIDATION_CHECKLIST.md` for checks to perform and record. The project plan, risk register, and requirements status are also in `docs/`. Keep results based on actual work and evidence; do not record planned checks as completed.
