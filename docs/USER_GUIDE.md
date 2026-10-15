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

Today displays the selected sample metrics and the demo wearable label. Synthetic readings refresh every three seconds while sample generation is running. “Steps today” rises gradually through the local day; heart rate and temperature vary smoothly as sample values. These are illustrative simulator rules, not a validated model. A reading hidden in Settings is omitted from Today but remains in History.

### History

History stores up to 200 timestamped sample entries on the current device/browser. Entries are listed newest first. Recent trends show up to 20 samples per metric as range-scaled bars; each metric has its own scale, so the charts are for interface demonstration and should not be compared across metrics. **Clear** removes the saved entries. If the simulator is still running, a new entry will be recorded at the next sample interval.

### Devices

Devices controls the simulator only. **Pause sample generation** stops new sample creation. **Resume sample generation** starts it again. These actions do not scan for, pair with, or send commands to physical hardware.

### Settings

Use the checkboxes to choose which metrics appear on Today. **Show all readings** restores the default selection. Preferences are stored locally and do not require an account. History continues to include every metric, including metrics hidden from Today.

## Troubleshooting

- **The browser or phone cannot reach the app:** make sure the Expo terminal is still running; for a phone, check that both devices are on the same network.
- **The browser does not open:** run `npx expo start --web` from the project directory. If web packages are missing, install them with `npx expo install react-dom react-native-web @expo/metro-runtime`.
- **History or preferences do not persist:** check the in-app storage warning. Browser storage is scoped to the browser and site origin; clearing browser data can remove it. This prototype has no sync or backup.
- **The display looks stale after a dependency change:** stop Expo with Ctrl+C, then restart `npx expo start`.

## Limitations

All displayed sensor values are synthetic. There is no account, cloud backup, real device integration, notification service, or production-grade health-data handling. Do not use the readings to make health or safety decisions.
