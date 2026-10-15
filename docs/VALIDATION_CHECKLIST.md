# Validation checklist

This is a set of checks to perform and record. It is not a results report. Fill in the date, platform, app version, and outcome only after performing each check.

## Automated checks

| Check | Command | Result / date |
|---|---|---|
| TypeScript type check | `npx tsc --noEmit` | Passed, 15 Oct 2026 |
| ESLint | `npm run lint` | Passed, 15 Oct 2026 |
| Expo configuration/dependency review | `npx expo-doctor` | Passed 21/21 checks, no issues, 15 Oct 2026 (`expo-doctor@1.20.4`) |

## Manual scenarios

| Scenario | Expected result | Result / platform / date |
|---|---|---|
| Start on web | App opens and shows the simulator notice. | Passed in the local Expo web preview, Codex in-app browser, 15 Oct 2026; browser/OS version not surfaced. |
| Start on a mobile target | App opens and shows the same core screens. | Not run, 15 Oct 2026: `adb` is not available; Xcode CoreSimulatorService reported no available runtime and could not connect. Use a physical device or working simulator when available. |
| Observe Today while running | Synthetic values update approximately every three seconds. | Not recorded |
| Observe step count during one local day | Synthetic step count does not decrease before the local day rolls over. | Not recorded |
| Pause on Devices | Values stop changing and no new history entry is created while paused. | Web smoke check, 15 Oct 2026: paused status appeared and selected-profile History count remained 21 after approximately 10 seconds. |
| Resume on Devices | Synthetic updates and history capture resume. | Web smoke check, 15 Oct 2026: running status returned and History count rose from 21 to 23 after resuming. |
| Select each device simulator | Today updates to the chosen simulated profile; new history and CSV rows retain its source identity. | Web smoke check, 15 Oct 2026: default fitness band and selected smartwatch showed their own synthetic profile; new History rows named the smartwatch source. Smartwatch choice remained after reload. CSV source columns were not exercised. |
| Hide one metric in Settings | Metric disappears from Today but remains in History. | Not recorded |
| Reload the app | Saved metric preference and history are restored on the same installation. | Not recorded |
| Clear History | Existing entries disappear; a later simulator sample may create a new entry. | Not recorded |
| Restore malformed local data | Invalid entries are ignored without breaking the screen or trend charts. | Not recorded |
| Review trend bars | Up to 20 samples appear per metric; low/high ranges are labelled. | Web smoke check, 15 Oct 2026: trend cards and low/high labels rendered for available recent samples. Maximum sample count and accessibility were not checked. |
| Select each History time range | 24-hour, 7-day, and all-sample filters show only matching records; an empty range explains what to do. | Web smoke check, 15 Oct 2026: switched from 24 hours to 7 days and All; range labels and sample counts updated. Only recent samples were present, so older-record exclusion/boundaries were not exercised. |
| Review range summaries | Average, low, high, latest, and sample count match the selected records for each metric. | Not recorded |
| Export a selected History range | CSV contains only records in the selected profile/range and includes device ID/name/type plus the synthetic-data marker. | Not recorded |
| Export history on web | A CSV downloads with timestamp, device ID/name/type, metric, value, unit, and `is_synthetic=true` columns. | Not recorded |
| Export history on mobile | The share sheet opens with a CSV file that can be saved or shared. | Not recorded |
| Review offline/hardware wording | App identifies readings and device as simulated and does not imply hardware access. | Not recorded |

## Development verification record

**Date:** 15 October 2026

**Environment:** Expo web preview at `localhost:8083`, Codex in-app browser; browser/OS version not surfaced. The preview ran from the local working tree before this feature commit.

**Observed:** app loaded; History range controls, summary cards, and trend cards rendered; selecting 7 days and All updated the displayed range label and available sample count. After the multiple-profile change, selecting the smartwatch updated Today, new History entries showed smartwatch source identity, and the selection persisted after reload. The only saved samples were recent, so the date cutoff logic was not manually verified with older sample data. Expo also reported an unknown error while installing React Native DevTools; the web bundle completed and the app rendered.

**Automated checks:** `npx tsc --noEmit` passed; `npm run lint` passed; `git diff --check` passed. A separate Expo Doctor run on 15 October 2026 passed 21/21 checks with no issues. These checks do not verify native platforms or CSV download/share behavior.

## Evidence to retain

Record the actual device/browser, operating system version, app commit, steps, expected and observed outcomes, and any issue found. Capture screenshots only after reviewing them for personal information. Hardware-specific checks remain unverified until physical hardware and a real integration are available.
