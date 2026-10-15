# Demonstration Checklist

**Status:** Draft for rehearsal; no demonstration or rehearsal is recorded as completed. The sequence below is a proposed five-minute walkthrough. Adjust its length and format to the official assessment instructions.

## Before the demonstration

- [ ] Confirm the assessment date, time limit, platform, and submission/demo format from official unit materials.
- [ ] Use a clean browser profile or test installation if practical; avoid entering personal or health data.
- [ ] Install dependencies and launch the app using the setup steps in `USER_GUIDE.md`.
- [ ] Confirm the app loads and the synthetic-data notice is visible.
- [ ] Check that Today, History, Devices, and Settings screens open.
- [ ] Ensure the simulator is running and sample history is available; if not, allow it to generate samples.
- [ ] Check browser downloads and local storage availability before showing CSV export or persistence.
- [ ] Have this checklist and `VALIDATION_CHECKLIST.md` available to record actual issues after rehearsal.

## Proposed five-minute walkthrough

| Approx. time | Action | What to explain / expected behavior |
|---|---|---|
| 0:00–0:30 | Introduce the project and its scope. | Explain it is an individual capstone prototype using synthetic data. State that it has no physical wearable connection and is not for health decisions. |
| 0:30–1:20 | Show Today. | Point out the simulator notice, sample metrics, units, and timestamps. Explain that values refresh about every three seconds while generation is running. |
| 1:20–2:00 | Open Devices and pause, then resume generation. | Show the control changing simulator activity. Clarify that this does not discover, pair with, or send commands to a physical wearable. |
| 2:00–2:50 | Open Settings and hide one metric, then return to Today. | Show the selected metric omitted from Today. Explain that this local preference does not remove the metric from saved History. |
| 2:50–3:50 | Open History, switch time ranges, and review a summary and trend bars. | Explain the rolling 24-hour, 7-day, and all-sample filters. Summaries and charts use the selected synthetic sample range; charts are interface demonstrations, not clinical analysis. |
| 3:50–4:30 | Export CSV, if it has been verified on the demonstration platform. | Show the download or share flow only if confirmed during rehearsal. Point out that export follows the selected time range and contains a synthetic-data marker. |
| 4:30–5:00 | Summarize limitations and next work. | Mention authentication, real BLE/NFC, alerts, multi-device support, and formal accessibility/platform validation as incomplete where applicable. Refer to the requirements matrix for detail. |

## Fallbacks

- If the app will not load, retry the documented start procedure once. If the issue remains, show the source and project documentation and report the actual failure; do not claim the live workflow succeeded.
- If the simulator has no saved entries, resume it and allow samples to generate. Skip export if there is no data or if export has not been verified.
- If export fails, report the failure and use the written CSV schema/documentation only as an explanation; do not present a sample file as a successful live export.
- If a mobile target is unavailable, demonstrate on the platform that is actually running and state that other platforms remain unverified.

## After rehearsal

Record the date, app commit, browser/device and OS, steps attempted, observed result, and any issues in `VALIDATION_CHECKLIST.md`. Update this document and the requirements matrix if the observed behavior differs from the expected behavior above. Remove or revise any step that is not supported by actual evidence.
