# Requirements traceability matrix

**Baseline:** master development prompt supplied for 2026-CSE3CAP  
**Project snapshot:** 15 October 2026  
**Scope note:** This records the current prototype source and known constraints. “Implemented” means present in source; it does not imply every platform or workflow has been manually verified.

## Functional requirements

| ID | Requirement | Status | Current implementation / evidence | Remaining work or verification |
|---|---|---|---|---|
| FR-01 | Registration, login, logout, validation, sessions, protected features, user-specific data | Not implemented | No authentication service or accounts are present. The prototype uses synthetic data and local storage. | Required for the full prompt. Choose a real authentication/backend architecture before implementation; do not use a local mock login. Define per-user data isolation and session handling. |
| FR-02 | BLE discovery, device selection, connection lifecycle, permissions, unsupported-device feedback | Partial: simulator only | `src/simulator.ts` provides synthetic readings; `Devices` pauses/resumes sample generation and explicitly says no hardware is connected. | No BLE discovery, pairing, permissions, disconnection, reconnection, or hardware verification. Requires compatible wearable hardware. |
| FR-03 | Investigate and implement feasible NFC use | Not implemented | No NFC code or hardware is present. | Determine whether NFC is relevant to an available device; otherwise document as out of scope. NFC must not be presented as continuous sensor transport. |
| FR-04 | Real-time sensor readings with units, timestamps, and source identification | Partial: synthetic data | `Today` displays heart rate, steps, and temperature; sample source is labelled synthetic; new history entries carry timestamp and selected simulator profile identity. | No physical sensor values, battery data, or connection-derived measurements. Confirm all display behavior on intended mobile targets. |
| FR-05 | Store/retrieve history, time filtering, summaries, charts, missing-data handling | Partial: local prototype history | AsyncStorage keeps up to 200 synthetic entries; `src/storage.ts` validates saved entries; History filters to rolling 24-hour, 7-day, or all-sample ranges and shows per-metric average, low, high, latest, and count summaries. | At a 3-second sample interval, the 200-entry cap retains only about 10 minutes of continuous history. No real database or account-scoped records. Review retention strategy and verify calculations, persistence, and recovery on target platforms. |
| FR-06 | Useful visualisation, time ranges, units, empty/loading/error states, reusable components | Partial | History displays range-scaled trend bars from the selected saved-data range; unit labels, loading/error messages, and range-specific empty state are represented. | Visual summaries are screen-level components and are not independently reusable yet. Verify chart and summary readability/accessibility. |
| FR-07 | View/select/manage devices, connection state, identify data source | Partial: simulator profiles | Devices offers a synthetic fitness-band and smartwatch profile; the selected source appears on Today and is attached to new history entries. | Profiles are not discovered or connected devices; no physical-device list, disconnect/reconnect workflow, or simultaneous connection handling. |
| FR-08 | Persistent user preferences, dashboard customization, theme, units, alert preferences | Partial | Settings stores selected dashboard metrics locally; History retains all metrics. | Theme, units, alert settings, and account-synced preferences are not implemented. |
| FR-09 | Configurable threshold/device-event alerts and notifications | Not implemented | No alert configuration or notification system exists. | If added, label demonstration alerts clearly and verify permission/native configuration. Avoid medical claims. |
| FR-10 | Authorized administrator configuration of plots and device/sensor types | Not implemented | No administrator interface, authorization, or configuration persistence exists. | Requires an authorization model; hiding controls alone would not satisfy this requirement. |
| FR-11 | Multiple device support and distinguish identity/type/status/source | Partial: multiple simulated profiles | Two selectable synthetic profiles have distinct IDs, names, types, and generated sample offsets. History and CSV preserve source identity. | No physical device registry or simultaneous hardware connections. Simulator coverage does not verify hardware support. |
| FR-12 | Android and iOS support | Partial: cross-platform target selected | Expo/React Native project targets Android and iOS and also runs on web. The user reported the web app working. | Android/iOS behavior has not been recorded as manually verified in the project evidence. Record each device/OS and build method after testing. |
| FR-13 | Accessibility and usability | Partial | Responsive layout, labelled controls, tab/checkbox states, and visible simulator/error notices are present. | No formal screen-reader, contrast, text-scaling, touch-target, or usability audit is recorded. |

## Cross-cutting project objectives

The prompt states these as quality objectives rather than numbered functional requirements.

| Objective | Status | Evidence / remaining work |
|---|---|---|
| Security and privacy | Partial for a synthetic-data prototype | No secrets or real health data are used. Local AsyncStorage is unencrypted; there is no auth, authorization, transport security, account separation, or production data-retention design. Do not use with real personal/health data. |
| Reliability and error handling | Partial | Persisted records are validated, and storage errors have visible notices. Manual failure/recovery scenarios remain unrecorded. |
| Maintainability | Partial | Simulator profiles, history summaries, storage validation, CSV formatting, and platform export code are separated into `src/` modules. There is not yet a real device-source interface or BLE adapter. |
| Performance | Not assessed | History is capped at 200 entries, but no performance measurements have been recorded. |
| Testing and quality assurance | Partially checked | TypeScript, ESLint, and Expo Doctor have passed. Limited web smoke checks for history filters and simulator source selection are recorded in `VALIDATION_CHECKLIST.md`; most manual scenarios and mobile/hardware tests remain unverified. |
| Documentation and handover | Initial deliverables drafted | User guide, proposed demo checklist, maintenance guide, risk register, project plan, validation checklist, matrix, architecture notes, WBS, stakeholder register, and proposed communication plan exist. Screenshots, reflection, presentation, archive, and administrative checklist remain to be prepared or confirmed. |

## Verification record

Recent development checks completed: `npx tsc --noEmit`, `npm run lint`, and `git diff --check`. These checks do not establish that Android/iOS, CSV sharing, BLE, NFC, authentication, or the manual workflows have been verified. Record manual results in `VALIDATION_CHECKLIST.md` after performing them.
