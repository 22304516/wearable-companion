# Wearable Companion — 2026-CSE3CAP

An individual capstone prototype for exploring a user-friendly mobile interface for wearable data. This initial version uses synthetic readings only; it does not connect to wearable hardware, provide medical advice, or collect real health data.

## Run locally

Requirements: Node.js LTS and Expo Go on a phone, or an Android/iOS simulator.

```sh
npm install
npx expo start
```

Run the focused pure-logic unit tests with `npm test -- --ci`; `npm run lint` and `npx tsc --noEmit` check the source and types.

Scan the QR code with Expo Go, or use the terminal shortcuts for a simulator. Without auth credentials, the app runs in synthetic-only demo mode.

## Authentication

The app includes Supabase email/password registration and sign-in. To enable it, configure the project URL and publishable key as described in [docs/AUTH_SETUP.md](./docs/AUTH_SETUP.md). Without both variables, the app runs in visibly labelled synthetic-only demo mode. No backend stores app readings yet; do not enter real health data.

## Current status

- Implemented: a dashboard, two selectable synthetic device profiles, simulator controls, display preferences, a synthetic in-app threshold alert, and history view for synthetic readings. Samples refresh every three seconds while the simulator is running; generation can be paused or resumed. Users can choose which metrics appear on Today and choose Celsius or Fahrenheit for temperature. Up to 200 timestamped entries with source identity are stored locally. History includes 24-hour, 7-day, and all-sample filters, per-range metric summaries and trend bars, CSV export, and clear controls.
- Implemented partially: Supabase email/password account flow, gated app access when configured, and account-namespaced local records. No provider project is configured yet.
- Not implemented: real BLE/NFC, system notifications or device-event alerts, cloud data storage, production security, and a full accessibility audit.
- No physical wearable is available. Device status and readings must remain clearly identified as simulated.
- NFC feasibility is documented in `docs/NFC_FEASIBILITY.md`; no tag reader or real NFC workflow is implemented.

See `docs/USER_GUIDE.md` for app workflows, `docs/DEMO_CHECKLIST.md` for the proposed demonstration flow, `docs/SYSTEM_MAINTENANCE.md` for technical handover, `docs/ARCHITECTURE.md` for architecture and decisions, `docs/TEST_PLAN.md` for requirement-linked test cases and current results, `docs/VALIDATION_CHECKLIST.md` for detailed manual checks and recorded evidence, `docs/PRODUCT_BACKLOG.md` for current stories and remaining work, `docs/PROJECT_REFLECTION.md` for a fact-grounded draft requiring owner review, `docs/REQUIREMENTS_TRACEABILITY.md` for requirement coverage and gaps, `docs/PRIVACY_AND_REGULATORY_REVIEW.md` for conditional privacy, ethics, and TGA review items, `docs/WORK_BREAKDOWN_STRUCTURE.md` for remaining deliverables, and `docs/ADMINISTRATIVE_CHECKLIST.md` for information needed before completing official group-assignment forms. `docs/STAKEHOLDER_REGISTER.md`, `docs/COMMUNICATION_PLAN.md`, the project plan, risk register, and requirements status are also in `docs/`. Keep results based on actual work and evidence; do not record planned checks as completed.

See [docs/DEPENDENCY_AUDIT.md](./docs/DEPENDENCY_AUDIT.md) for the current transitive npm audit findings and upgrade constraint.
