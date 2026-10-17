# Initial project plan

## Assumptions

- No wearable hardware is available. The first end-to-end demonstration uses a clearly labelled simulator.
- Expo/React Native + TypeScript is the chosen starting stack to keep mobile setup manageable. Revisit if unit or assessor requirements specify another stack.

## 13-week schedule

| Week | Dates (Mon–Sun) | Sprint / checkpoint | Focus |
|---|---|---|---|
| 1 | 13–19 Jul | Foundation | Scope, repository, app shell, backlog |
| 2 | 20–26 Jul | Sprint 1 | Navigation, layout, requirements mapping |
| 3 | 27 Jul–2 Aug | Sprint 1 | Simulator and first demo flow |
| 4 | 3–9 Aug | Sprint 2; report Sprint 1 in workshop | Refine demo, capture actual progress |
| 5 | 10–16 Aug | Sprint 2 | Device abstraction, data model |
| 6 | 17–23 Aug | Sprint 3; report Sprint 2 | History storage and review |
| 7 | 24–30 Aug | Sprint 3 | Trends, usability/accessibility pass |
| 8 | 31 Aug–6 Sep | Sprint 4; report Sprint 3 | Security and error handling |
| 9 | 7–13 Sep | Sprint 4 | Documentation and workflow verification |
| 10 | 14–20 Sep | Sprint 5; report Sprint 4 | Stabilise and demo preparation |
| 11 | 21–27 Sep | Sprint 5 | Final documentation and handover |
| 12 | 28 Sep–4 Oct | Report Sprint 5; final presentations/reporting | Submission packaging |
| 13 | 5–11 Oct | Final presentations | Demonstration and final handover |

Dates are planning assumptions derived from the supplied week numbers, not confirmed university deadlines. Confirm assessment dates with the unit materials.

## Initial backlog

The current story-level backlog, acceptance criteria, estimates, dependencies, and evidence-based statuses are maintained in [PRODUCT_BACKLOG.md](./PRODUCT_BACKLOG.md). The schedule below remains a planning baseline; it is not a record of actual sprint completion.

1. **P0 — Foundation:** establish reproducible app setup and record requirements.
2. **P0 — Simulator:** show synthetic metrics and an explicit simulated-device state.
3. **P1 — Core experience:** add navigation, device management states, validation, and useful empty/error states.
4. **P1 — History:** store demo readings locally and show a simple historical trend.
5. **P1 — Documentation:** user guide, system maintenance notes, architecture, traceability, and demo guide based on implemented behavior.
6. **P2 — Authentication/security:** decide whether local-only prototype or backend is required; implement only a defensible scope.
7. **P2 — Hardware:** assess BLE/NFC feasibility if hardware/API access becomes available; until then mark unverified.
8. **P2 — Delivery:** workflow review, evidence log, source archive, and submission checklist.
