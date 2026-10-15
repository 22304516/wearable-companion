# Validation checklist

This is a set of checks to perform and record. It is not a results report. Fill in the date, platform, app version, and outcome only after performing each check.

## Automated checks

| Check | Command | Result / date |
|---|---|---|
| TypeScript type check | `npx tsc --noEmit` | Not recorded |
| ESLint | `npm run lint` | Not recorded |
| Expo configuration/dependency review | `npx expo-doctor` | Not recorded |

## Manual scenarios

| Scenario | Expected result | Result / platform / date |
|---|---|---|
| Start on web | App opens and shows the simulator notice. | Not recorded |
| Start on a mobile target | App opens and shows the same core screens. | Not recorded |
| Observe Today while running | Synthetic values update approximately every three seconds. | Not recorded |
| Observe step count during one local day | Synthetic step count does not decrease before the local day rolls over. | Not recorded |
| Pause on Devices | Values stop changing and no new history entry is created while paused. | Not recorded |
| Resume on Devices | Synthetic updates and history capture resume. | Not recorded |
| Hide one metric in Settings | Metric disappears from Today but remains in History. | Not recorded |
| Reload the app | Saved metric preference and history are restored on the same installation. | Not recorded |
| Clear History | Existing entries disappear; a later simulator sample may create a new entry. | Not recorded |
| Restore malformed local data | Invalid entries are ignored without breaking the screen or trend charts. | Not recorded |
| Review trend bars | Up to 20 samples appear per metric; low/high ranges are labelled. | Not recorded |
| Export history on web | A CSV downloads with timestamp, metric, value, unit, and `is_synthetic=true` columns. | Not recorded |
| Export history on mobile | The share sheet opens with a CSV file that can be saved or shared. | Not recorded |
| Review offline/hardware wording | App identifies readings and device as simulated and does not imply hardware access. | Not recorded |

## Evidence to retain

Record the actual device/browser, operating system version, app commit, steps, expected and observed outcomes, and any issue found. Capture screenshots only after reviewing them for personal information. Hardware-specific checks remain unverified until physical hardware and a real integration are available.
