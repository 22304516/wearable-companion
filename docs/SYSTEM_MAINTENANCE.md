# System maintenance guide

## System summary

Wearable Companion is a single-screen React Native application built with Expo SDK 57 and TypeScript. Expo supports the current prototype on web and mobile. There is no backend, authentication service, wearable protocol implementation, or cloud data store.

## Source layout

| Path | Responsibility |
|---|---|
| `App.tsx` | Dashboard, Today/History/Devices/Settings views, simulator timer, preference controls, and local persistence. |
| `src/simulator.ts` | Produces synthetic demo metrics. It does not access Bluetooth or hardware. |
| `src/storage.ts` | Validates and normalizes locally restored history and metric preferences. |
| `src/csv.ts` | Formats the saved synthetic history as CSV and creates export filenames. |
| `src/exportCsv.ts` / `src/exportCsv.web.ts` | Platform-specific native share and browser download implementations. |
| `docs/ARCHITECTURE.md` | Component diagram, data flow, decisions, and known architecture gaps. |
| `docs/` | Project plan, requirements status, risk register, user guide, maintenance guide, and validation checklist. |
| `package.json` | Expo scripts and runtime/development dependencies. |

## Local data

The app uses AsyncStorage, which is persistent but unencrypted key-value storage.

| Key | Contents |
|---|---|
| `wearable-companion.synthetic-history.v1` | Up to 200 timestamped entries; each entry contains the synthetic metrics. |
| `wearable-companion.visible-metrics.v1` | Labels selected for display on the Today dashboard. |

History and preferences are local to the app/browser installation. They are not synchronized, backed up, encrypted, or associated with an account. Do not store real health data in this prototype. To clear history, use **History → Clear**. To restore the default metric selection, use **Settings → Show all readings**. Clearing app/browser storage also removes both keys.

## Development setup and maintenance commands

Use a Node.js version supported by the installed Expo SDK and npm. Preserve `package-lock.json` when installing dependencies.

```sh
npm install
npx expo start
npx expo start --web
npm run lint
npx tsc --noEmit
npx expo-doctor
```

Use `npx expo install <package>` for Expo-compatible native dependencies. Recheck the SDK compatibility and platform requirements before adding libraries. Native modules may require a development build; verify Expo Go support before assuming they run in Expo Go.

## Operational notes

- Sample generation is an in-app timer with a three-second interval; it is not a background service and should not be assumed to run while the app is closed.
- The simulator derives heart rate and temperature from smooth time-based demo waves. The synthetic step count starts at 300 and rises at 0.12 steps per second from local midnight, capped at 10,000; it resets at the next local day. These values are illustrative and are not a physiological model.
- The simulator can be paused on the Devices screen. This changes only synthetic sample generation.
- The trend bars use a separate low-to-high scale for each metric and are illustrative only.
- If AsyncStorage fails, the app displays an error notice. Current in-memory samples may still display, but persistence should be treated as unavailable until resolved.
- Restored history is checked for valid timestamps and finite numeric readings; duplicate entry IDs are removed, entries are sorted newest first, and the configured 200-item limit is enforced. Invalid preference values are ignored.
- CSV export includes one row per reading and marks each row `is_synthetic=true`. The web target downloads a Blob; native targets write a temporary CSV in the app cache and open the platform share sheet. The file contains only local synthetic history.
- Keep the simulator label and synthetic-data wording in place until a real, validated data source is implemented.

## Security and future hardware work

Authentication, authorization, secure remote storage, BLE, NFC, and real device management are not implemented. Do not add a client-side password check as a substitute for authentication. Before handling real user or health information, define the threat model, data-retention policy, authentication architecture, consent requirements, and applicable university/project requirements. Real BLE/NFC work requires supported hardware and platform testing; simulator behavior is not evidence of hardware connectivity.

## Release and handover

Before a submission build, run the project checks, execute the manual scenarios in `VALIDATION_CHECKLIST.md`, record actual outcomes and platform versions, update `REQUIREMENTS_STATUS.md`, and list remaining limitations. Do not describe a planned check as a passed check. Do not include credentials, local environment files, caches, or generated build artifacts in a source archive.
