# Work Breakdown Structure

**Planning basis:** one primary developer; no wearable hardware, existing codebase, or Jira. The week schedule in `PROJECT_PLAN.md` is a planning assumption based on the supplied 13-week outline, not confirmation of official assessment dates.

## Work packages

| WBS | Work package | Key outputs / completion evidence | Current status |
|---|---|---|---|
| 1.0 | Project foundation | Reproducible Expo/TypeScript repository, dependency lockfile, run instructions, Git history | Prototype repository and run instructions exist. |
| 1.1 | Environment and app scaffold | Expo app starts on a supported development environment | Web app launched by the user and local web smoke-checked. No mobile test target is currently available; `adb` is absent and iOS simulator services are unavailable in the current environment. |
| 1.2 | Repository hygiene | Source, documentation, and lockfile tracked; no secrets committed | Git repository exists. Review final archive contents before submission. |
| 2.0 | Requirements and project planning | Prioritized scope, schedule, risk register, traceability, WBS, stakeholder and communication plans | Planning drafts exist, including stakeholder and communication plans; confirm official deadlines and assessment interpretation. |
| 2.1 | Requirements baseline | Requirements status and traceability matrix linked to prototype evidence | Drafted in `REQUIREMENTS_STATUS.md` and `REQUIREMENTS_TRACEABILITY.md`. |
| 2.2 | Schedule and backlog | Solo-feasible sequence of work and scope decisions | Initial schedule and backlog in `PROJECT_PLAN.md`; update using actual progress. |
| 2.3 | Risk management | Current risks, owner/response, review date | Initial register exists; revisit as constraints change. |
| 3.0 | Mobile application prototype | Demonstrable synthetic-data app with clear limitations | Core prototype implemented; verify key workflows manually on target platforms. |
| 3.1 | Dashboard and navigation | Today, History, Devices, and Settings views; clear synthetic-data notice | Implemented in `App.tsx`. |
| 3.2 | Simulator and device controls | Timestamped sample metrics; pause/resume sample generation; no false BLE state | Implemented in `src/simulator.ts` and Devices view; no hardware integration. |
| 3.3 | Local history and visualisation | Persistent bounded records, time filters, summaries, trends, loading/empty/error handling | Implemented using AsyncStorage with rolling 24-hour, 7-day, and all-sample ranges and per-metric summaries; manual persistence and calculation checks remain. |
| 3.4 | Preferences | Persist selected dashboard metrics and restore defaults | Implemented locally; manual persistence check remains. |
| 3.5 | Data export | CSV export on web and native share workflow; synthetic-data column | Implemented; verify file contents/download and native sharing on each target. |
| 4.0 | Quality assurance and security | Recorded checks, resolved defects, supported-platform limits, privacy/security decisions | TypeScript and lint checks have passed during development; manual validation is pending. Authentication, backend, and production security are not implemented. |
| 4.1 | Automated/static checks | Type check, lint, dependency/config review recorded with commit and date | TypeScript and lint passed; Expo Doctor passed 21/21 checks with no issues on 15 Oct 2026. No full test suite is recorded. |
| 4.2 | Manual workflow verification | Complete `VALIDATION_CHECKLIST.md` with actual platform/version/results | Not recorded yet. |
| 4.3 | Accessibility and usability review | Check contrast, keyboard/touch use, screen-reader labels, text scaling, and responsive layout | Not recorded yet. |
| 4.4 | Authentication/security scope | Real authentication decision, authorization, per-user data design, privacy review | Required by FR-01 in the source prompt; implementation deferred pending backend/provider decision. No real user data should be entered. |
| 4.5 | Hardware feasibility | BLE/NFC compatibility investigation and, if possible, physical-device test record | No hardware is available; simulator is the current fallback. |
| 5.0 | Technical and user documentation | User guide, maintenance notes, architecture, known limitations, validation evidence | Initial guides and architecture are drafted; update from verified results. |
| 5.1 | User guide | Setup, screens, workflows, troubleshooting, screenshots | Written in `USER_GUIDE.md`; screenshots are still to be captured and reviewed. |
| 5.2 | System maintenance documentation | Architecture, dependencies, local data, operations, known gaps | Written in `SYSTEM_MAINTENANCE.md` and `ARCHITECTURE.md`; keep in sync with source. |
| 5.3 | Requirements and test evidence | Traceability and completed validation records | Traceability exists; manual results remain unrecorded. |
| 6.0 | Demonstration and submission handover | Reliable demo, final presentation, source archive, administrative checklist | Not complete. Prepare after platform verification and scope review. |
| 6.1 | Demonstration materials | Timed sequence, setup, expected outcomes, synthetic data, fallback, limitations | Drafted in `DEMO_CHECKLIST.md`; assessment format and rehearsal still need confirmation. |
| 6.2 | Scrum Master presentation | Project overview, actual progress, individual responsibilities, risks, reflection, next steps | Not prepared; use the supplied presentation template when available. |
| 6.3 | Final source archive | Reproducible source and docs; exclude secrets, caches, and regenerable build artifacts | Not prepared; review `package-lock.json` and archive contents before submission. |
| 6.4 | University administration | Authorship and effort-form information checklist, based on actual declarations | Not prepared; do not invent signatures, contributions, percentages, or approvals. |

## Work-package completion rule

Treat an output as complete only when its artifact exists, it matches the current implementation, relevant checks have actual recorded results, and known limitations are visible. A source file or planning entry alone does not establish that a user workflow or platform has been verified.

## Next priority

1. Run the manual validation checklist on web and at least one available mobile target; record what was actually tested.
2. Confirm whether FR-01 authentication is required for the assessment and select an appropriate backend/authentication approach before implementation.
3. Capture reviewed screenshots, then prepare the demo checklist and remaining submission/administrative deliverables.
