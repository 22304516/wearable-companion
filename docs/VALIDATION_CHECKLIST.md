# Validation checklist

This document combines planned checks with a results log. Record dates, platforms, and outcomes only after performing each check; unrecorded scenarios remain unverified.

## Automated checks

| Check | Command | Result / date |
|---|---|---|
| TypeScript type check | `npx tsc --noEmit` | Passed, 3 Oct 2026 |
| ESLint | `npm run lint` | Passed, 3 Oct 2026 |
| Core logic unit tests | `npm test -- --ci` | Passed, 10 tests in 1 suite, 3 Oct 2026. Covers pure helpers only; not UI, auth-provider workflows, native modules, or hardware. |
| Expo configuration/dependency review | `npx expo-doctor` | Passed 21/21 checks, no issues, 3 Oct 2026 (`expo-doctor@1.20.4`) |

## Manual scenarios

| Scenario | Expected result | Result / platform / date |
|---|---|---|
| Start on web | App opens and shows the simulator notice. | Passed in the local Expo web preview, Codex in-app browser, 3 Oct 2026; browser/OS version not surfaced. |
| Start on a mobile target | App opens and shows the same core screens. | Not run, 3 Oct 2026: `adb` is not available; Xcode CoreSimulatorService reported no available runtime and could not connect. Use a physical device or working simulator when available. |
| Authentication not configured | App clearly presents synthetic-only demo mode; configured mode requires sign-in. | Web preview, 3 Oct 2026: demo-mode notice appeared because no Supabase environment variables are set. Real sign-up/sign-in/session/logout flow remains unverified. |
| Authentication form validation | Invalid email and too-short password show field errors before the Supabase request. | Web preview with placeholder environment values, 4 Oct 2026: malformed email showed “Enter a valid email address”; a valid-format placeholder email with a short password showed the 8-character validation message. No valid credentials were entered and no authentication request was submitted. |
| Observe Today while running | Synthetic values update approximately every three seconds. | Not recorded |
| Observe step count during one local day | Synthetic step count does not decrease before the local day rolls over. | Not recorded |
| Pause on Devices | Values stop changing and no new history entry is created while paused. | Web smoke check, 3 Oct 2026: paused status appeared and selected-profile History count remained 21 after approximately 10 seconds. |
| Resume on Devices | Synthetic updates and history capture resume. | Web smoke check, 4 Oct 2026: running status returned and History count rose from 21 to 23 after resuming. |
| Select each device simulator | Today updates to the chosen simulated profile; new history and CSV rows retain its source identity. | Web smoke check, 4 Oct 2026: default fitness band and selected smartwatch showed their own synthetic profile; new History rows named the smartwatch source. Smartwatch choice remained after reload. CSV source columns were not exercised. |
| Configure the synthetic heart-rate alert | Enable the in-app threshold; the alert appears at/above it and clears below it. The choice survives reload. | Passed, web, 4 Oct 2026: with an 80 bpm threshold and the smartwatch simulator, the accessible synthetic/non-medical notice appeared at 87 and 83 bpm; it disappeared when the reading reached 76 bpm. Alert restored to Off and threshold to 120 bpm afterward. Reload persistence and OS notifications remain unverified; OS notifications are not implemented. |
| Hide one metric in Settings | Metric disappears from Today but remains in History. | Passed, web, 4 Oct 2026: hid Steps; it disappeared from Today and remained in History. The setting remained hidden after reload. Restored Steps to Shown and confirmed Today displayed it again. |
| Change temperature unit | Skin temperature converts correctly across Today, History summaries/trends/records, and exported CSV. Other metrics remain unchanged. | Web smoke check, 4 Oct 2026: Fahrenheit appeared on Today, History summaries/trends/records and Celsius restored on Today. The downloaded CSV check below confirmed °F temperature rows and unchanged bpm/steps unit labels. |
| Reload the app | Saved metric preference and history are restored on the same installation. | Not recorded |
| Reload temperature preference | Selected Celsius/Fahrenheit choice remains selected and is used for future display/export. | Web smoke check, 4 Oct 2026: Fahrenheit remained active on Today after reload; mobile and export persistence not checked. |
| Clear History | Existing entries disappear; a later simulator sample may create a new entry. | Not recorded |
| Restore malformed local data | Invalid entries are ignored without breaking the screen or trend charts. | Not recorded |
| Review trend bars | Up to 20 samples appear per metric; low/high ranges are labelled. | Web smoke check, 4 Oct 2026: trend cards and low/high labels rendered for available recent samples. Maximum sample count and accessibility were not checked. |
| Select each History time range | 24-hour, 7-day, and all-sample filters show only matching records; an empty range explains what to do. | Web smoke check, 4 Oct 2026: switched from 24 hours to 7 days and All; range labels and sample counts updated. Only recent samples were present, so older-record exclusion/boundaries were not exercised. |
| Keyboard access to radio choices | Each group exposes its selected option and Space changes the focused choice. | Passed in isolated local web preview, 4 Oct 2026: browser DOM showed one `aria-checked=true` option per group; Space selected 7 days, the smartwatch simulator, and Fahrenheit. Native VoiceOver/TalkBack behavior remains unverified. |
| Review range summaries | Average, low, high, latest, and sample count match the selected records for each metric. | Passed, web, 4 Oct 2026: compared the visible 24-hour History summaries with independent calculations from the exported CSV. Heart rate 80.0 / 73 / 87 / 78 bpm, steps 6927.3 / 6891 / 6968 / 6968, and skin temperature 98.4 / 98.2 / 98.6 / 98.2 °F matched (average / low / high / latest); each metric had 200 samples. |
| Export a selected History range | CSV contains only records in the selected profile/range and includes device ID/name/type plus the synthetic-data marker. | Partial, web, 4 Oct 2026: exported the selected 24-hour range for Demo smartwatch and verified all 200 retained timestamps are within the range, with device identity and synthetic markers. The retained history contains only recent records, so older-record exclusion at a range boundary remains unverified. |
| Export in Fahrenheit mode | CSV skin-temperature values use °F; other metric values keep their units. | Passed, web, 4 Oct 2026: downloaded and parsed CSV contained °F skin-temperature rows, bpm heart-rate rows, and steps rows. Source-record immutability is supported by the display-conversion helper but was not separately observed in this export check. |
| Export history on web | A CSV downloads with timestamp, device ID/name/type, metric, value, unit, and `is_synthetic=true` columns. | Passed for browser download and file schema, local Expo web preview in Codex in-app browser, 4 Oct 2026. Inspected 200 timestamps / 600 metric rows; exact eight-column schema matched, all synthetic markers were `true`, and each of three metrics had 200 rows. Sample export: task `outputs/wearable-companion-synthetic-export-sample.csv`. Browser/OS version was not surfaced. |
| Export history on mobile | The share sheet opens with a CSV file that can be saved or shared. | Not recorded |
| Review offline/hardware wording | App identifies readings and device as simulated and does not imply hardware access. | Not recorded |