# Application architecture and decisions

**Status:** current prototype architecture  
**Prepared:** 15 October 2026

## Scope and context

Wearable Companion is a single-developer capstone prototype. There is no reusable repository, wearable hardware, Jira instance, backend, or authentication provider. The current application demonstrates a mobile-first interface using synthetic readings. It is not a production health-data system.

## Component view

```mermaid
flowchart TD
  User[User]
  UI[Expo React Native UI<br/>Today · History · Devices · Settings]
  Sim[src/simulator.ts<br/>Two synthetic profiles]
  History[src/history.ts<br/>Range filters + summaries]
  Units[src/units.ts<br/>Display conversion]
  Store[src/storage.ts<br/>Validate local records]
  Local[(AsyncStorage<br/>History · preferences)]
  CSV[src/csv.ts<br/>CSV formatting]
  Web[src/exportCsv.web.ts<br/>Browser download]
  Native[src/exportCsv.ts<br/>FileSystem + system share sheet]

  User --> UI
  UI --> Sim
  Sim --> UI
  UI --> History
  History --> UI
  UI --> Units
  Units --> UI
  UI --> Store
  UI <--> Local
  UI --> CSV
  CSV --> Web
  CSV --> Native
```

`App.tsx` owns the current screen state and coordinates the simulator, storage, history, unit conversion, and export modules. Samples are stored in Celsius; `src/units.ts` converts the display and export value when Fahrenheit is selected. The selected simulator profile refreshes readings every three seconds while running. Each new history record stores the selected profile ID, name, and type. The interface labels both profiles as synthetic. History, selected profile, temperature unit, and display preferences are stored on the current device/browser; there is no server synchronization.

## Data flow

1. The app loads locally saved preferences and synthetic history.
2. `src/storage.ts` rejects malformed history entries, removes duplicate IDs, sorts valid entries newest first, and applies the 200-entry cap.
3. While the simulator is running, `src/simulator.ts` produces synthetic heart rate, step-count, and temperature values for the selected fitness-band or smartwatch profile. The app adds timestamps and source identity, then updates Today.
4. The app stores each sample in AsyncStorage. History first filters records to the selected simulator profile, then to the selected rolling 24-hour, 7-day, or all-sample range, calculates per-metric summaries, and charts the latest 20 samples per metric within that range.
5. When requested, `src/csv.ts` serializes the selected local synthetic history range including source identity. The web adapter downloads a CSV; the native adapter writes a temporary file and opens the platform share sheet.

## Key design decisions

### ADR-001 — Expo, React Native, and TypeScript

- **Status:** Accepted for the prototype.
- **Decision:** Use Expo with React Native and TypeScript, including the Expo web target.
- **Reason:** It provides one codebase for the mobile UI and browser demonstration, which is manageable for one primary developer.
- **Alternatives considered:** Native Android/iOS projects would require maintaining separate implementations; a web-only app would not meet the intended mobile demonstration goal.
- **Consequences:** Expo-compatible packages and platform-specific adapters are used where necessary. The choice has not demonstrated BLE or NFC feasibility; no real hardware is available, and Android/iOS integration remains to be verified.

### ADR-002 — Synthetic device source for development

- **Status:** Accepted for the prototype.
- **Decision:** Generate clearly labelled synthetic metrics rather than imply that a physical device is connected.
- **Reason:** No wearable hardware is available, and the project prompt explicitly allows a simulator where hardware is unavailable.
- **Consequences:** The simulator supports interface and history demonstrations only. It is not a medical model, BLE implementation, or proof of hardware support. A formal device-source interface and real adapter remain future work.

### ADR-003 — Local-only persistence for the prototype

- **Status:** Accepted for the current synthetic-data scope.
- **Decision:** Use AsyncStorage for the capped local history and dashboard metric preferences.
- **Reason:** The prototype has no backend or accounts, and a small on-device store is sufficient for synthetic demonstration data.
- **Consequences:** AsyncStorage is unencrypted; data is not synchronized, account-separated, or backed up. Do not store real health or personal data. A secure backend, authentication, authorization, and retention design are required before real user data is introduced.

### ADR-004 — Platform-specific CSV delivery

- **Status:** Accepted for the prototype.
- **Decision:** Share CSV formatting in `src/csv.ts`, then use the browser download adapter for web and Expo FileSystem/Sharing for native platforms.
- **Reason:** Web and native platforms expose different file-delivery mechanisms.
- **Consequences:** CSV output is intended for synthetic sample data. Export has static type checking and lint coverage but still needs manual verification in each target environment.

## Known architecture gaps

- No authentication, backend API, database service, or user-data separation.
- No BLE/NFC adapter, device discovery, physical-device selection, or simultaneous multiple-device connection. The two simulator profiles are not hardware support.
- The simulator is separated from the screen code as a module, but there is not yet a general device-source interface.
- AsyncStorage is not suitable for confidential health records.
- Android/iOS, native CSV sharing, and hardware integrations must be verified on their actual targets before claiming support.

## Future architecture gate

Before adding real user or health data, select an authentication and backend design, enforce per-user authorization, define data retention/deletion, and review privacy/security requirements. Before adding BLE/NFC, confirm device protocols and mobile platform support with compatible hardware. Keep simulator and hardware sources explicitly distinguishable in the UI and stored records.
