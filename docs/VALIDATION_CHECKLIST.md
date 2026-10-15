# Validation checklist

This document combines planned checks with a results log. Record dates, platforms, and outcomes only after performing each check; unrecorded scenarios remain unverified.

## Automated checks

| Check | Command | Result / date |
|---|---|---|
| TypeScript type check | `npx tsc --noEmit` | Passed, 15 Oct 2026 |
| ESLint | `npm run lint` | Passed, 15 Oct 2026 |
| Core logic unit tests | `npm test -- --ci` | Passed, 10 tests in 1 suite, 15 Oct 2026. Covers pure helpers only; not UI, auth-provider workflows, native modules, or hardware. |
| Expo configuration/dependency review | `npx expo-doctor` | Passed 21/21 checks, no issues, 15 Oct 2026 (`expo-doctor@1.20.4`) |

## Manual scenarios

| Scenario | Expected result | Result / platform / date |
|---|---|---|
| Start on web | App opens and shows the simulator notice. | Passed in the local Expo web preview, Codex in-app browser, 15 Oct 2026; browser/OS version not surfaced. |
| Start on a mobile target | App opens and shows the same core screens. | Not run, 15 Oct 2026: `adb` is not available; Xcode CoreSimulatorService reported no available runtime and could not connect. Use a physical device or working simulator when available. |
| Authentication not configured | App clearly presents synthetic-only demo mode; configured mode requires sign-in. | Web preview, 15 Oct 2026: demo-mode notice appeared because no Supabase environment variables are set. Real sign-up/sign-in/session/logout flow remains unverified. |
| Authentication form validation | Invalid email and too-short password show field errors before the Supabase request. | Web preview with placeholder environment values, 15 Oct 2026: malformed email showed “Enter a valid email address”; a valid-format placeholder email with a short password showed the 8-character validation message. No valid credentials were entered and no authentication request was submitted. |
| Observe Today while running | Synthetic values update approximately every three seconds. | Not recorded |
| Observe step count during one local day | Synthetic step count does not decrease before the local day rolls over. | Not recorded |
| Pause on Devices | Values stop changing and no new history entry is created while paused. | Web smoke check, 15 Oct 2026: paused status appeared and selected-profile History count remained 21 after approximately 10 seconds. |
| Resume on Devices | Synthetic updates and history capture resume. | Web smoke check, 15 Oct 2026: running status returned and History count rose from 21 to 23 after resuming. |
| Select each device simulator | Today updates to the chosen simulated profile; new history and CSV rows retain its source identity. | Web smoke check, 15 Oct 2026: default fitness band and selected smartwatch showed their own synthetic profile; new History rows named the smartwatch source. Smartwatch choice remained after reload. CSV source columns were not exercised. |
| Configure the synthetic heart-rate alert | Enable the in-app threshold, lower it below the current synthetic reading, then raise it above the reading; the alert appears and clears. The choice survives reload. | Partial web check, 15 Oct 2026: enabled the alert, set threshold to 80 bpm, and selected the smartwatch simulator; an 83 bpm reading produced the alert and non-medical disclaimer. Reset the toggle, threshold, and selected profile afterward. Reload persistence, clearing on a falling reading, and OS notifications remain unverified. |
| Hide one metric in Settings | Metric disappears from Today but remains in History. | Not recorded |
| Change temperature unit | Skin temperature converts correctly across Today, History summaries/trends/records, and exported CSV. Other metrics remain unchanged. | Web smoke check, 15 Oct 2026: Fahrenheit appeared on Today, History summaries/trends/records and Celsius restored on Today. CSV conversion not exercised. |
| Reload the app | Saved metric preference and history are restored on the same installation. | Not recorded |
| Reload temperature preference | Selected Celsius/Fahrenheit choice remains selected and is used for future display/export. | Web smoke check, 15 Oct 2026: Fahrenheit remained active on Today after reload; mobile and export persistence not checked. |
| Clear History | Existing entries disappear; a later simulator sample may create a new entry. | Not recorded |
| Restore malformed local data | Invalid entries are ignored without breaking the screen or trend charts. | Not recorded |
| Review trend bars | Up to 20 samples appear per metric; low/high ranges are labelled. | Web smoke check, 15 Oct 2026: trend cards and low/high labels rendered for available recent samples. Maximum sample count and accessibility were not checked. |
| Select each History time range | 24-hour, 7-day, and all-sample filters show only matching records; an empty range explains what to do. | Web smoke check, 15 Oct 2026: switched from 24 hours to 7 days and All; range labels and sample counts updated. Only recent samples were present, so older-record exclusion/boundaries were not exercised. |
| Keyboard access to radio choices | Each group exposes its selected option and Space changes the focused choice. | Passed in isolated local web preview, 15 Oct 2026: browser DOM showed one `aria-checked=true` option per group; Space selected 7 days, the smartwatch simulator, and Fahrenheit. Native VoiceOver/TalkBack behavior remains unverified. |
| Review range summaries | Average, low, high, latest, and sample count match the selected records for each metric. | Not recorded |
| Export a selected History range | CSV contains only records in the selected profile/range and includes device ID/name/type plus the synthetic-data marker. | Not recorded |
| Export in Fahrenheit mode | CSV skin-temperature values use °F; stored readings and other metric values remain unchanged. | Not recorded |
| Export history on web | A CSV downloads with timestamp, device ID/name/type, metric, value, unit, and `is_synthetic=true` columns. | Not recorded |
| Export history on mobile | The share sheet opens with a CSV file that can be saved or shared. | Not recorded |
| Review offline/hardware wording | App identifies readings and device as simulated and does not imply hardware access. | Not recorded |

## Development verification record

**Date:** 15 October 2026

**Environment:** Expo web preview at `localhost:8083`, Codex in-app browser; browser/OS version not surfaced. The preview ran from the local working tree before this feature commit.

**Observed:** app loaded; History range controls, summary cards, and trend cards rendered; selecting 7 days and All updated the displayed range label and available sample count. After the multiple-profile change, selecting the smartwatch updated Today, new History entries showed smartwatch source identity, and the selection persisted after reload. Pause/resume stopped and restarted history capture. After adding unit preferences, Fahrenheit appeared on Today and all History temperature fields; it remained active after reload, and selecting Celsius restored Celsius on Today. CSV unit export was not exercised. The only saved samples were recent, so the date cutoff logic was not manually verified with older sample data. Expo also reported an unknown error while installing React Native DevTools; the web bundle completed and the app rendered.

**Automated checks:** `npx tsc --noEmit` passed; `npm run lint` passed; `git diff --check` passed. A separate Expo Doctor run on 15 October 2026 passed 21/21 checks with no issues. These checks do not verify native platforms or CSV download/share behavior.

**Follow-up, 15 October 2026:** Added optional Supabase authentication and synthetic heart-rate threshold controls. The app bundle loaded in a local Expo web preview at `localhost:8084`; the unauthenticated state visibly identified itself as demo mode. With the 80 bpm threshold enabled, selecting the synthetic smartwatch produced an accessible in-app alert at 83 bpm. The configured authentication flow and native behavior were not tested because no Supabase project credentials or mobile target were available. The preview server was stopped after checking. A follow-up Expo Doctor run after adding test dependencies passed 21/21 checks; the new Jest suite passed 10 unit tests.

**Authentication form check, 15 October 2026:** A temporary local web preview used only placeholder Supabase URL/key values. Invalid email and short password inputs displayed their validation messages. No valid credential or auth request was sent. The placeholder configuration was not saved in the repository; the preview was stopped.

**Accessibility follow-up, 15 October 2026:** Web review found that radio controls changed visually but did not expose their selected state in the DOM. History range, simulator profile, and temperature unit controls now provide `aria-checked` alongside React Native selected state and respond to Space. Verified the selected state and keyboard operation in an isolated local Expo web preview. This is a targeted web accessibility check, not a full WCAG, native screen-reader, contrast, or text-scaling audit.

**Presentation draft, 15 October 2026:** Prepared a 10-slide Scrum Master presentation from the current repository and recorded evidence. The PPTX passed structural package integrity, 10-slide count, slide geometry, heading/bullet geometry, and Arial font-policy checks with no findings. The montage and slide 7 were visually inspected; automated layout validation reported no findings. The slides have not been individually reviewed in native PowerPoint. No supplied template was available; team and sprint numbers remain marked not recorded. Rehearsal, assessor-format confirmation, and review in native PowerPoint remain pending. The draft is delivered in the task `outputs` folder and is not committed to this repository.

**Source archive, 15 October 2026:** Created a ZIP from the committed Git tree with 51 tracked files (including `package-lock.json`). Inspected the listing; no `.env`, `.git`, `node_modules`, or `.expo` entries were present. The final archive is delivered in the task `outputs` folder. Recreate it after subsequent source changes.

## Evidence to retain

Record the actual device/browser, operating system version, app commit, steps, expected and observed outcomes, and any issue found. Capture screenshots only after reviewing them for personal information. Hardware-specific checks remain unverified until physical hardware and a real integration are available.
