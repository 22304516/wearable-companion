# System maintenance guide

## System summary

Wearable Companion is a React Native application built with Expo SDK 57 and TypeScript. Expo supports the current prototype on web and mobile. The app has optional Supabase email/password authentication when configured, but no remote app-data store or wearable protocol implementation.

## Source layout

| Path | Responsibility |
|---|---|
| `App.tsx` | Dashboard, Today/History/Devices/Settings views, simulator timer, preference controls, and local persistence. |
| `src/simulator.ts` | Produces synthetic demo metrics for two selectable profiles. It does not access Bluetooth or hardware. |
| `src/storage.ts` | Validates and normalizes locally restored history and metric preferences; history entries may include simulator source identity. |
| `src/history.ts` | Filters persisted synthetic records by rolling time range and calculates per-metric summaries. |
| `src/alerts.ts` | Sanitizes heart-rate demo-alert preferences and evaluates the synthetic threshold. |
| `src/authClient.ts` / `src/AuthScreen.tsx` | Optional Supabase email/password client, session refresh, registration, and sign-in screen. |
| `__tests__/core-logic-test.ts` | Focused unit coverage for the pure history, storage, unit, CSV, simulator, and alert helpers. |
| `src/units.ts` | Converts canonical Celsius samples for display/export when Fahrenheit is selected. |
| `src/csv.ts` | Formats the saved synthetic history as CSV and creates export filenames. |
| `src/exportCsv.ts` / `src/exportCsv.web.ts` | Platform-specific native share and browser download implementations. |
| `docs/ARCHITECTURE.md` | Component diagram, data flow, decisions, and known architecture gaps. |
| `docs/DEPENDENCY_AUDIT.md` | Dated npm audit findings and the reason no forced downgrade was applied. |
| `docs/` | Project plan, requirements status, risk register, user guide, maintenance guide, and validation checklist. |
| `package.json` | Expo scripts and runtime/development dependencies. |

## Local data

The app uses AsyncStorage, which is persistent but unencrypted key-value storage.

| Key | Contents |
|---|---|
| `wearable-companion.synthetic-history.v1` (demo) / `wearable-companion.user.<user-id>.synthetic-history.v1` (configured account) | Up to 200 timestamped synthetic entries with source identity. At three-second sampling, about ten minutes of continuous history. |
| `wearable-companion.visible-metrics.v1` (demo) / account-scoped equivalent | Labels selected for display on the Today dashboard. |
| `wearable-companion.selected-simulator.v1` (demo) / account-scoped equivalent | Selected synthetic profile ID. |
| `wearable-companion.temperature-unit.v1` (demo) / account-scoped equivalent | Temperature display choice (`C` or `F`); stored sample values remain in Celsius. |
| `wearable-companion.alert-settings.v1` (demo) / account-scoped equivalent | Whether the synthetic heart-rate alert is enabled and its threshold. |
| Supabase Auth session | Persisted by the Supabase client (AsyncStorage on native, browser storage on web); see the security limitations in `AUTH_SETUP.md`. |

History and preferences remain local to the app/browser installation, with separate key namespaces for each configured account. They are not synchronized, backed up, or encrypted. Do not store real health data in this prototype. To clear history, use **History → Clear**. To restore the default metric selection, use **Settings → Show all readings**. Clearing app/browser storage removes the local records and settings.

## Development setup and maintenance commands

Use a Node.js version supported by the installed Expo SDK and npm. Preserve `package-lock.json` when installing dependencies.

```sh
npm install
npx expo start
npx expo start --web
npm run lint
npm test
npx tsc --noEmit
npx expo-doctor
```

Use `npx expo install <package>` for Expo-compatible native dependencies. Recheck the SDK compatibility and platform requirements before adding libraries. Native modules may require a development build; verify Expo Go support before assuming they run in Expo Go.

## Operational notes

- Sample generation is an in-app timer with a three-second interval; it is not a background service and should not be assumed to run while the app is closed.
- The simulator derives heart rate and temperature from smooth time-based demo waves. The fitness-band sample step count starts at 300; the smartwatch profile has an arbitrary offset. Both rise at 0.12 steps per second from local midnight, capped at 10,000; they reset at the next local day. Values are illustrative and are not a physiological model.
- The Devices screen can select a simulator profile and pause/resume sample generation. This does not connect to or control hardware.
- The trend bars use a separate low-to-high scale for each metric and are illustrative only.
- If AsyncStorage fails, the app displays an error notice. Current in-memory samples may still display, but persistence should be treated as unavailable until resolved.
- Restored history is checked for valid timestamps and finite numeric readings; duplicate entry IDs are removed, entries are sorted newest first, and the configured 200-item limit is enforced. Invalid preference values are ignored.
- CSV export includes one row per reading, source device ID/name/type, and `is_synthetic=true`. The web target downloads a Blob; native targets write a temporary CSV in the app cache and open the platform share sheet. The file contains only local synthetic history for the selected profile and time range.
- Keep the simulator label and synthetic-data wording in place until a real, validated data source is implemented.

## Security and future hardware work

Provider-backed account registration/sign-in is implemented but remains unconfigured and unverified. The current demo heart-rate alert is an in-app threshold only; no system notification channel or device-event alert is implemented. Authorization for remote data, secure session storage, remote records, BLE, and real device management are not implemented. NFC feasibility and the scope decision are recorded in `NFC_FEASIBILITY.md`. Do not add a client-side password check as a substitute for authentication. Before handling real user or health information, define the threat model, data-retention policy, secure session design, RLS policies, consent requirements, and applicable university/project requirements. Real BLE/NFC work requires supported hardware and platform testing; simulator behavior is not evidence of hardware connectivity.

## Release and handover

Before a submission build, run the project checks, execute the manual scenarios in `VALIDATION_CHECKLIST.md`, record actual outcomes and platform versions, update `REQUIREMENTS_STATUS.md`, and list remaining limitations. Do not describe a planned check as a passed check. Do not include credentials, local environment files, caches, or generated build artifacts in a source archive.
