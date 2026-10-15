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
| 2.2 | Schedule and backlog | Solo-feasible sequence of work and scope decisions | Schedule baseline is in `PROJECT_PLAN.md`; current stories, estimates, dependencies, and statuses are in `PRODUCT_BACKLOG.md`. No numbered sprint allocations or results are reconstructed. |
| 2.3 | Risk management | Current risks, owner/response, review date | Detailed qualitative review of R-01–R-15 recorded in `RISKS.md` on 15 Oct 2026; dependency, security, testing, and schedule risks remain open. |
| 3.0 | Mobile application prototype | Demonstrable synthetic-data app with clear limitations | Core prototype implemented; verify key workflows manually on target platforms. |
| 3.1 | Dashboard and navigation | Today, History, Devices, and Settings views; clear synthetic-data notice | Implemented in `App.tsx`. |
| 3.2 | Simulator and device controls | Timestamped sample metrics; selectable sources; pause/resume sample generation; no false BLE state | Two selectable synthetic profiles are available in `src/simulator.ts` and Devices view; source identity is saved with history/export. No hardware integration. |
| 3.3 | Local history and visualisation | Persistent bounded records, time filters, summaries, trends, loading/empty/error handling | Implemented using AsyncStorage with rolling 24-hour, 7-day, and all-sample ranges and per-metric summaries; manual persistence and calculation checks remain. |
| 3.4 | Preferences | Persist selected dashboard metrics, simulator profile, and temperature units | Web smoke checks confirmed profile and temperature-unit persistence; unit display conversion was visible on Today and History. The web CSV file also confirmed °F temperature rows and unchanged bpm/steps unit labels. Native persistence remains unverified. |
| 3.5 | Data export | CSV export on web and native share workflow; synthetic-data column | Browser download and schema were verified from the local web preview (200 timestamps, 600 metric rows, eight columns, all marked synthetic); a sample CSV is in task `outputs`. Older-record range exclusion and native share remain unverified. |
| 4.0 | Quality assurance and security | Recorded checks, resolved defects, supported-platform limits, privacy/security decisions | TypeScript and lint checks have passed during development; manual validation is pending. Supabase Auth and synthetic demo alerts are implemented in part; external provider setup and production security remain incomplete. |
| 4.1 | Automated/static checks | Type check, lint, dependency/config review recorded with commit and date | Requirement-linked test plan is in `TEST_PLAN.md`; TypeScript and lint passed; Expo Doctor passed 21/21 checks; 10 pure-helper Jest unit tests passed on 15 Oct 2026. UI, auth-provider, native, and hardware checks remain incomplete. |
| 4.2 | Manual workflow verification | Complete `VALIDATION_CHECKLIST.md` with actual platform/version/results | Limited web smoke checks recorded for history filters and simulator source selection; most workflows and all mobile targets remain unverified. |
| 4.3 | Accessibility and usability review | Check contrast, keyboard/touch use, screen-reader labels, text scaling, and responsive layout | Targeted web check found and fixed missing selected-state announcements and Space-key handling for radio choices. See `VALIDATION_CHECKLIST.md`. Full native screen-reader, contrast, text-scaling, and broader usability reviews remain outstanding. |
| 4.4 | Authentication/security scope | Real authentication decision, authorization, per-user data design, privacy review | Supabase email/password flow, local account-key namespaces, and web client-side validation are implemented. Configure a real project and verify account/session flows; cloud data, RLS, secure session storage, and deployment-specific privacy review remain incomplete. `PRIVACY_AND_REGULATORY_REVIEW.md` records conditional review gates. Do not enter real user data. |
| 4.5 | Hardware feasibility | BLE/NFC compatibility investigation and, if possible, physical-device test record | NFC tag-assisted identification feasibility is documented; no wearable, NFC tag, or mobile target is available. BLE hardware integration remains unverified; simulator is the current fallback. |
| 5.0 | Technical and user documentation | User guide, maintenance notes, architecture, known limitations, validation evidence | Initial guides and architecture are drafted; update from verified results. |
| 5.1 | User guide | Setup, screens, workflows, troubleshooting, screenshots | Written in `USER_GUIDE.md`; screenshots are still to be captured and reviewed. |
| 5.2 | System maintenance documentation | Architecture, dependencies, local data, operations, known gaps | Written in `SYSTEM_MAINTENANCE.md` and `ARCHITECTURE.md`; keep in sync with source. |
| 5.3 | Requirements and test evidence | Traceability and completed validation records | Traceability exists; manual results remain unrecorded. |
| 6.0 | Demonstration and submission handover | Reliable demo, final presentation, source archive, administrative checklist | Presentation draft and clean source archive are prepared in the task `outputs` folder. Rehearsal, supported-platform validation, and official administrative requirements remain pending. |
| 6.1 | Demonstration materials | Timed sequence, setup, expected outcomes, synthetic data, fallback, limitations | Drafted in `DEMO_CHECKLIST.md`; assessment format and rehearsal still need confirmation. |
| 6.2 | Scrum Master presentation | Project overview, actual progress, individual responsibilities, risks, reflection, next steps | 10-slide draft prepared on 15 Oct 2026 at `outputs/2026-CSE3CAP_scrum_master_presentation_draft.pptx`. No supplied template was present. Team and sprint numbers are marked not recorded; confirm assessment details and personalize before presenting. Structural, font, and layout checks passed; rehearsal and native PowerPoint review remain pending. |
| 6.3 | Final source archive | Reproducible source and docs; exclude secrets, caches, and regenerable build artifacts | Clean ZIP snapshot prepared from the committed repository at `outputs/wearable-companion-source.zip`. Includes tracked source, docs, and lockfile; excludes Git history, installed dependencies, Expo cache, and untracked local secrets. Rebuild the archive after any repository changes. |
| 6.4 | University administration | Authorship and effort-form information checklist, based on actual declarations | Preparation checklist exists in `ADMINISTRATIVE_CHECKLIST.md`. Official forms, roster, effort evidence, signatures, submission, and approvals remain outstanding; do not invent them. |

## Work-package completion rule

Treat an output as complete only when its artifact exists, it matches the current implementation, relevant checks have actual recorded results, and known limitations are visible. A source file or planning entry alone does not establish that a user workflow or platform has been verified.

## Next priority

1. Confirm official assessment instructions and replace the presentation placeholders only with verified team, sprint, and submission details. Rehearse the draft and record any changes.
2. Confirm with the supervisor whether any participant testing is expected; obtain an ethics determination before recruiting or collecting research data.
3. Configure an owner-created Supabase development project and verify sign-up, email confirmation, sign-in, restored session, sign-out, and account data separation.
4. Review secure session storage, RLS, privacy obligations, intended-purpose wording, and TGA scope before considering any real account, health data, public release, or clinical claim.
5. Capture reviewed screenshots from the current app. Run the remaining manual validation checklist on web and at least one available mobile target when a target exists. Complete the official forms only after obtaining current unit instructions and actual roster/effort information; regenerate the source archive after repository changes.
