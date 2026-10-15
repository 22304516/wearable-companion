# Requirements status — starter baseline

| Area | Current status | Evidence / next step |
|---|---|---|
| Mobile dashboard | Starter implemented | Review on target phone/simulator and record results. |
| Wearable connection | Simulated only | No hardware available; real BLE remains unverified. |
| Device management | Simulator controls implemented | Users can pause/resume synthetic sample generation. Real discovery, pairing, and device commands are not implemented. |
| Sensor readings | Synthetic demo values | Clearly labelled; replace with device adapter only when available. |
| Historical storage | Implemented for synthetic demo readings | Timestamped samples are stored locally; maximum 200 entries. Verify persistence on target platforms. |
| Historical trends | Basic visual trend view implemented for synthetic samples | History shows up to 20 recent samples as range-scaled bars with low/high labels. This is a demo visualisation, not clinical analysis. |
| Authentication | Not implemented | Confirm expected deployment and security scope before selecting an approach. |
| NFC | Not implemented | Requires compatible hardware and platform validation. |
| Alerts/notifications | Not implemented | Prioritize after core workflow. |
| User/maintenance/project documentation | Initial planning docs only | Complete from actual implementation and actual work evidence. |
| Testing | Not yet verified | Run and record checks on web and a mobile target; do not claim results in advance. |

This table is a baseline. Update it as implementation changes.
