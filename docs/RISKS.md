# Initial risk register

| Risk | Likelihood / impact | Response |
|---|---|---|
| Solo workload exceeds the 13-week window | High / High | Keep an MVP, prioritize one demo path, review scope weekly. |
| No device prevents BLE/NFC validation | High / High | Use an explicit simulator; keep hardware integration unverified and document future validation needs. |
| Authentication/backend scope consumes time | Medium / High | Confirm assessment expectations early; avoid insecure home-grown authentication. |
| Assessment dates or group-form expectations differ | Medium / High | Verify official unit instructions and ask teaching staff about individual contribution paperwork. |
| Generated documentation drifts from implementation | Medium / Medium | Update status and evidence after each meaningful milestone. |
| Synthetic health-like values are mistaken for real measurements | Medium / High | Label simulator and synthetic data in the interface, docs, and demo. |

This is an initial planning register, not a record of incidents or completed mitigations.

## Detailed review

The likelihood, impact, and severity below are qualitative planning judgments, not measured probabilities or an official university scoring scheme. “Open” means the exposure still exists; a mitigation may reduce likelihood or impact without removing the risk. 

| ID | Risk | Likelihood | Impact / severity | Mitigation | Contingency | Owner | Status |
|---|---|---:|---|---|---|---|---|
| R-01 | Available time is insufficient for all proposal features and handover work. | High | High / High | Keep a prioritized, evidence-based backlog; confirm official deadlines and focus on a demonstrable synthetic-data MVP. | Report unfinished scope and limitations; seek official scope guidance where needed. | Project owner | Open |
| R-02 | No compatible wearable is available for physical integration or verification. | High | High / High | Use the explicitly labelled simulator; do not claim hardware support. | Demonstrate the simulator and explain the hardware gate. | Project owner | Open; simulator mitigation active |
| R-03 | BLE behavior differs across Android/iOS or device implementations. | High | High / High | Select hardware and verify its documented protocol and platform support before implementing an adapter. | Keep BLE out of claims; demonstrate simulation until a compatible target is available. | Project owner | Open; no adapter |
| R-04 | NFC is not relevant to the selected wearable or cannot be validated on an available platform. | Medium | Medium / Medium | NFC feasibility and scope limits are documented in `NFC_FEASIBILITY.md`. | Keep NFC deferred; revisit only for a documented tag/device workflow. | Project owner | Monitored; implementation deferred |
| R-05 | Wearable services/characteristics or sensor protocols are undocumented or inaccessible. | High | High / High | Require device documentation and access before estimating integration. | Restrict demonstrations to synthetic readings and state that no device protocol was tested. | Project owner | Open |
| R-06 | A security or privacy weakness exposes account or health-related information. | Medium | High / High | Restrict current use to synthetic data; use a publishable client key only; require secure session storage, RLS, retention/deletion, and privacy review before real data. | Disable configured account/data features until the design and controls are verified. | Project owner | Open; synthetic-only boundary active |
| R-07 | Backend/authentication integration fails because no provider project, schema, email setup, or policies are configured. | Medium | High / High | Keep `AUTH_SETUP.md` and `.env.example` current; configure a dedicated development project before live account testing. | Continue only in clearly labelled demo mode and report authentication as unverified. | Project owner | Open; provider not configured |
| R-08 | History volume or frequent sampling causes storage or performance issues. | Medium | Medium / Medium | Retain a 200-entry cap and validate stored records; assess retention before increasing the sample rate or cap. | Reduce sample retention or change sampling policy after measuring actual target behavior. | Project owner | Open; performance not measured |
| R-09 | Independent workload makes planning, implementation, testing, and documentation difficult to complete together. | High | High / High | Use a solo-sized backlog, small commits, and explicit dependency/status tracking. | Defer optional work and preserve a clear record of completed and remaining scope. | Project owner | Active |
| R-10 | Unit requirements or project scope change after the current baseline. | Medium | High / High | Keep requirements, backlog, WBS, and presentation tied to actual unit instructions. | Re-prioritize the backlog and document any scope change; do not infer approval. | Project owner | Open |
| R-11 | Incomplete testing leads to unsupported claims or undiscovered workflow defects. | High | High / High | Maintain `TEST_PLAN.md` and record platform, commit, steps, and results in `VALIDATION_CHECKLIST.md`. | Limit claims to tested web/helper behavior until a platform test is available. | Project owner | Open; native/provider/hardware checks incomplete |
| R-12 | Documentation falls behind implementation or describes planned behavior as completed. | Medium | Medium / Medium | Update traceability, user/maintenance docs, backlog, and validation evidence with each milestone. | Correct the affected documentation before presentation or handover. | Project owner | Monitored |
| R-13 | Assessment expectations, group-form treatment, or project-owner requirements are unclear. | Medium | High / High | Use the administrative checklist; confirm team/sprint details and form instructions from official sources. | Keep unknown fields marked not recorded and request clarification from the teaching team. | Project owner | Open; official clarification pending |
| R-14 | iOS build, distribution, or platform behavior cannot be validated with the current environment. | High | High / High | Record the unavailable CoreSimulatorService/mobile target; follow Expo-supported build instructions when a target is available. | Demonstrate on the verified web target and label iOS/mobile as unverified. | Project owner | Open; no mobile target |
| R-15 | Third-party dependency vulnerabilities or incompatible upgrades affect build reliability/security. | High | High / High | Keep the lockfile; review `DEPENDENCY_AUDIT.md`; avoid forced breaking downgrades and plan compatible upgrades. | Hold the current known-good stack for synthetic demo use; do not use it with sensitive production data. | Project owner | Open; 36 audit advisories documented |
