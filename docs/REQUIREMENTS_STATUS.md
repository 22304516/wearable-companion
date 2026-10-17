# Requirements status — starter baseline

| Area | Current status | Evidence / next step |
|---|---|---|
| Mobile dashboard | Starter implemented | Review on target phone/simulator and record results. |
| Wearable connection | Simulated only | No hardware available; real BLE remains unverified. |
| Device management | Two selectable simulator profiles implemented | Users can select a synthetic fitness-band or smartwatch profile and pause/resume sample generation. History and exports label the source. No physical discovery, pairing, or device commands are implemented. |
| NFC feasibility | Investigated; implementation deferred | NFC could support NDEF-based tap identification for a compatible wearable/tag, but no device/tag or mobile test target exists. See [NFC_FEASIBILITY.md](./NFC_FEASIBILITY.md). NFC is not a continuous sensor link. |
| Sensor readings | Synthetic demo values | Clearly labelled; replace with device adapter only when available. |
| User preferences | Implemented for dashboard metric visibility, simulator profile, and temperature unit | Web smoke checks confirmed Fahrenheit display on Today/History and persistence after reload. Native platforms and CSV unit export remain unverified. |
| Alerts | Partial: configurable synthetic heart-rate in-app threshold | Settings can enable and adjust a demo threshold; Today shows an alert when a sample reaches it. No system notifications, device-event alerts, or medical interpretation. Manual behavior remains unverified. |
| Historical storage | Implemented for synthetic demo readings | Timestamped samples are stored locally; maximum 200 entries. History has rolling 24-hour, 7-day, and all-sample filters with per-metric averages, low/high/latest values, and sample counts. Verify filter boundaries and calculations on target platforms. |
| Historical trends | Basic filtered trend view implemented for synthetic samples | History shows up to 20 samples from the selected range as range-scaled bars with low/high labels. This is a demo visualisation, not clinical analysis. |
| Data export | CSV export implemented for selected synthetic history range | Web downloads a CSV; native platforms share a temporary CSV file. Verify range selection and export on each target platform. |
| Authentication | Supabase email/password integration implemented; external project not configured | Configured mode gates access, supports sign-up/sign-in/session restore/sign-out, and scopes local app keys by account ID. Follow [AUTH_SETUP.md](./AUTH_SETUP.md) to connect a project. No cloud data storage or RLS is implemented or verified. |
| NFC | Not implemented | Requires compatible hardware and platform validation. |
| Alerts/notifications | Not implemented | Prioritize after core workflow. |
| User/maintenance/project documentation | Draft guides and project records prepared | User guide, maintenance guide, product backlog, test plan, reflection draft, and validation evidence describe the current prototype; actual app screenshots and owner review of the reflection remain outstanding. |
| Testing | Static checks and targeted web checks recorded | TypeScript, lint, Expo Doctor, and 10 pure-helper tests pass; web History and key radio keyboard states were checked. Mobile target is unavailable in the current environment; provider, export file contents, broader workflows, and historical boundaries remain unverified. |
