# Test plan and current execution summary

**Baseline:** 15 October 2026. This plan targets the current Expo/React Native prototype and its synthetic-only mode. It does not claim production, hardware, native-platform, or full accessibility certification. Detailed check dates and observations are in `VALIDATION_CHECKLIST.md`; automated helper coverage is in `__tests__/core-logic-test.ts`.

## Test environment and status terms

- **Passed:** the specific behavior was exercised and observed in the named environment.
- **Partial:** a related result was observed, but the complete expected behavior or output was not inspected.
- **Not run:** no execution evidence is recorded.
- **Not implemented:** the app has no behavior to test for this case yet.
- Browser/OS version was not surfaced by the Codex in-app browser. No Android emulator or iOS simulator was available; `adb` was absent and Xcode CoreSimulatorService could not connect.
- Automated tests cover pure helper functions. They do not exercise React Native UI, Supabase service behavior, platform APIs, or physical hardware.

## Test cases

| ID | Requirement | Preconditions and steps | Expected result | Actual result / status / evidence |
|---|---|---|---|---|
| AUTH-01 | FR-01 | No Supabase variables; launch the web app. | App clearly identifies synthetic-only demo mode. | **Passed**, web preview, 15 Oct 2026. Notice appeared; no provider credentials were configured. See `VALIDATION_CHECKLIST.md`. |
| AUTH-02 | FR-01 | Use placeholder provider settings; enter malformed email, then a valid-format placeholder email with a password shorter than eight characters. | Client validation messages appear before any authentication request. | **Passed**, web preview, 15 Oct 2026. Both validation messages appeared; no valid credentials were entered and no auth request was submitted. |
| AUTH-03 | FR-01 | Configure an owner-created Supabase project; register with a dedicated test account and follow the configured confirmation flow. | Registration result and any email-confirmation requirement are reported correctly. | **Not run:** no provider project or test account is configured. |
| AUTH-04 | FR-01 | With a confirmed test account, sign in, reload, inspect protected access, sign out, and sign in as a second test account. | Session restores; sign-out gates the app; local namespaces remain distinct. | **Not run:** provider lifecycle and account separation are unverified. |
| DEVICE-01 | FR-02, FR-07, FR-11 | In web preview, choose the fitness-band and smartwatch simulator profiles. | Selected profile is identified as synthetic, updates Today, and appears in new history records. | **Passed**, web smoke check, 15 Oct 2026. Both profiles were exercised; source identity appeared in History and persisted after reload. No BLE device was used. |
| DEVICE-02 | FR-02 | Pause generation, wait, then resume and observe the selected profile's History count. | Count stops while paused and resumes increasing after restart. | **Passed**, web smoke check, 15 Oct 2026. Count stayed at 21 while paused for about 10 seconds; it rose from 21 to 23 after resume. |
| DEVICE-03 | FR-02, FR-07, FR-11 | With a compatible wearable and supported mobile target, exercise discovery, connection, disconnection, reconnection, permissions, and multiple-device behavior. | Actual hardware state and device identity are accurate; errors and permissions are handled. | **Not implemented/not run:** no BLE adapter, hardware, or mobile target. |
| SENSOR-01 | FR-04 | Run the synthetic simulator and inspect Today and a new history row. | Metrics show units, source, status, and synthetic-data warning. | **Partial:** Today and the demo notice rendered in web; source labels were observed. A full metric-by-metric/manual timestamp verification was not recorded. |
| SENSOR-02 | FR-04 | Leave the running simulator open and observe steps over a local day boundary. | Synthetic step count does not decrease before the local day changes. | **Not run:** no day-boundary observation recorded. |
| HIST-01 | FR-05, FR-06 | With recent samples, switch History through 24 hours, 7 days, and All. | Range label and included records update; empty range has guidance. | **Partial:** web range labels and available counts updated. Only recent samples were present; historical cutoff boundaries and an empty-range workflow were not fully exercised. |
| HIST-02 | FR-05, FR-06 | Run `npm test -- --ci` on the pure history helpers. | Cutoff filtering, ordering, future-record exclusion, and finite summary values are correct. | **Passed**, 15 Oct 2026. Covered by `history helpers` tests; this does not prove UI calculations across a platform. |
| HIST-03 | FR-05, FR-06 | Restore malformed persisted records and inspect the app and trend views. | Invalid records are ignored without crashing or corrupting remaining records. | **Partial:** sanitizer helper tests passed; a malformed-data scenario was not manually run through the app UI. |
| HIST-04 | FR-05, FR-06 | Compare visible 24-hour History summaries with independent calculations from the downloaded CSV. | Average, low, high, latest, and per-metric sample count match the selected records. | **Passed**, web, 15 Oct 2026. Heart-rate, steps, and skin-temperature average/low/high/latest/count all matched across 200 samples per metric. See `VALIDATION_CHECKLIST.md`. |
| PREF-01 | FR-08 | On web, select the smartwatch and Fahrenheit; reload and inspect Today/History and export CSV. | Choices persist and temperature display/export is labelled in °F; other metrics retain their units. | **Passed** for web profile/unit persistence, display, and CSV unit labels, 15 Oct 2026. Native persistence and stored-value immutability remain unverified. |
| PREF-02 | FR-08 | In Settings, focus each radio option and use Space to choose simulator and temperature unit; inspect DOM state. | Focused selection changes and exactly one option exposes `aria-checked=true`. | **Passed**, isolated local web preview, 15 Oct 2026. Native VoiceOver/TalkBack behavior is unverified. |
| ALERT-01 | FR-09 | Enable an 80 bpm synthetic threshold and select a profile producing a sample at or above that value. | An in-app notice appears, identifies synthetic data, and states that it is not medical/emergency advice. | **Passed**, web preview, 15 Oct 2026. A synthetic smartwatch sample of 83 bpm produced the notice. OS notification and device-event alert behavior are not implemented. |
| ALERT-02 | FR-09 | Run `npm test -- --ci` on alert settings and trigger helpers. | Invalid thresholds are sanitized; only enabled thresholds trigger. | **Passed**, 15 Oct 2026, pure-helper tests only. UI persistence and disabled-state recovery are not covered by this test. |
| CSV-01 | FR-05, FR-08 | Run `npm test -- --ci` on CSV formatting and display helpers. | CSV escaping, formula-like cell safety, and filename are correct; temperature display conversion is separately tested. | **Passed**, 15 Oct 2026, pure-helper coverage. Browser export integration is covered separately by CSV-02. |
| CSV-02 | FR-05 | Select a History range and press Export CSV in the isolated web preview; inspect the downloaded file. | Browser downloads a CSV with selected source/range and documented columns. | **Partial** for range filtering; **passed** for download and file schema, 15 Oct 2026. Parsed 200 timestamps / 600 rows with the eight expected columns, synthetic markers, selected simulator identity, and expected metric units. Only recent samples existed, so old-record exclusion was not tested. See `VALIDATION_CHECKLIST.md`; sample file is in task `outputs`. |
| CSV-04 | FR-08 | Select Fahrenheit in Settings, export History, and inspect metric and unit columns. | Skin-temperature rows use °F; heart-rate and steps units remain bpm and steps. | **Passed**, local web preview, 15 Oct 2026. CSV contained the selected unit labels; persisted source-value immutability was not separately observed. See `VALIDATION_CHECKLIST.md`. |
| CSV-03 | FR-05 | On a supported mobile device, export history and inspect the OS share sheet and file. | A CSV file is available to the user with the expected schema and selected unit/range. | **Not run:** no mobile target. |
| ADMIN-01 | FR-10 | Authenticate as an authorised administrator, configure a plot, then access as an ordinary user. | Configuration persists and unauthorized users cannot view or change it. | **Not implemented:** no admin role, configuration interface, API, or database. |
| PLAT-01 | FR-12 | Run the app on Android and iOS targets and complete the core workflow on each. | Each claimed platform builds and its core behavior is recorded with device/OS/version. | **Not run:** no Android or iOS simulator/device available in this environment. |
| A11Y-01 | FR-13 | In local web preview, inspect roles/names/selected state and use keyboard Space on history range, profile, and unit options. | Controls are named, selectable state is exposed, and keyboard operation works. | **Passed for these radio controls on web**, 15 Oct 2026. Full keyboard navigation, contrast, zoom/text scaling, native assistive technology, and touch-target audit remain outstanding. |
| SEC-01 | Security and privacy | Inspect repository/configuration and dependency audit; do not enter real health data. | No committed credentials; client uses publishable key only; security gaps and advisories are disclosed. | **Partial:** no credentials were found in tracked configuration; auth form was tested only with placeholders. `npm audit --omit=dev` reported 36 advisories (23 high, 13 moderate, no critical); forced upgrade was avoided because proposed fixes required breaking stack changes. No RLS or secure session vault exists. See `DEPENDENCY_AUDIT.md`. |

## Automated commands

| Command | Latest recorded result | Coverage boundary |
|---|---|---|
| `npm test -- --ci` | Passed: 10 tests in 1 suite, 15 Oct 2026. | Pure helpers only. |
| `npm run lint` | Passed, 15 Oct 2026. | Static lint rules. |
| `npx tsc --noEmit` | Passed, 15 Oct 2026. | Type checking. |
| `npx expo-doctor` | Passed 21/21 checks, 15 Oct 2026. | Expo config/dependency diagnostics; not runtime platform verification. |

## Exit criteria and unresolved tests

Do not describe the prototype as production-ready or hardware-verified. Before any real user or health data: configure a controlled provider project, review secure session storage, define schema/RLS/retention/deletion, and test account separation. Before platform claims: validate on actual Android/iOS targets. Before claiming CSV delivery: inspect a downloaded web file and a native share result. Record new evidence in `VALIDATION_CHECKLIST.md` and update `REQUIREMENTS_TRACEABILITY.md` and `PRODUCT_BACKLOG.md`.
