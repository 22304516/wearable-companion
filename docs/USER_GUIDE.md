# User guide

## What this prototype does

Wearable Companion demonstrates a mobile-friendly dashboard using synthetic readings. It is a capstone prototype: it does not connect to a wearable, collect personal health information, or provide medical advice. The simulator banner remains visible in the app.

## Start the app

From the project folder, install dependencies and start Expo:

```sh
npm install
npx expo start
```

For a browser, press **W** in the Expo terminal or run `npx expo start --web`. For a phone, scan the terminal QR code with Expo Go while the phone and computer are on the same network. Keep the Expo terminal running while using the app.

## Use the screens

### Today

Today displays the selected sample metrics and selected simulator profile. Synthetic readings refresh every three seconds while sample generation is running. “Steps today” rises gradually through the local day; heart rate and temperature vary smoothly as sample values. These profiles use different arbitrary offsets to make source selection visible; they are illustrative simulator rules, not a validated model. A reading hidden in Settings is omitted from Today but remains in History.

### History

History stores up to 200 timestamped sample entries on the current device/browser. Each new entry records its simulator profile. Because the simulator records every three seconds, the cap holds about 10 minutes of continuous samples; the wider filters can only show older records if they remain among those saved entries. Use **24 hours**, **7 days**, or **All** to filter records from the currently selected profile by a rolling time window. The range summary shows count, average, low, high, and latest value for each metric in the selected range. Entries are listed newest first. Temperature follows the unit selected in Settings. Recent trends show up to 20 samples per metric as range-scaled bars; each metric has its own scale, so charts are for interface demonstration and should not be compared across metrics. **Export CSV** exports entries from the selected profile and time range with timestamps, device ID/name/type, metric labels, values, units, and an `is_synthetic` column; temperature uses the selected display unit. Web downloads the CSV; mobile opens the system share sheet. **Clear** removes all saved entries from every profile, regardless of the selected range. If the simulator is still running, a new entry will be recorded at the next sample interval.

### Devices

Devices lets you choose one of two synthetic profiles, a fitness band or a smartwatch, and pause or resume sample generation. New readings and history entries use the selected profile; existing records remain associated with their original profile. These profiles are not discovered devices and do not scan for, pair with, or send commands to physical hardware.

### Settings

Use the checkboxes to choose which metrics appear on Today. **Show all readings** restores the default selection. Choose **Celsius (°C)** or **Fahrenheit (°F)** for skin temperature; stored samples remain in Celsius and are converted for display and export. Preferences are stored locally and do not require an account. History continues to include every metric, including metrics hidden from Today.

## Troubleshooting

- **The browser or phone cannot reach the app:** make sure the Expo terminal is still running; for a phone, check that both devices are on the same network.
- **The browser does not open:** run `npx expo start --web` from the project directory. If web packages are missing, install them with `npx expo install react-dom react-native-web @expo/metro-runtime`.
- **History or preferences do not persist:** check the in-app storage warning. Browser storage is scoped to the browser and site origin; clearing browser data can remove it. This prototype has no sync or backup.
- **The display looks stale after a dependency change:** stop Expo with Ctrl+C, then restart `npx expo start`.

## Limitations

All displayed sensor values are synthetic. There is no account, cloud backup, real device integration, notification service, or production-grade health-data handling. Do not use the readings to make health or safety decisions.
