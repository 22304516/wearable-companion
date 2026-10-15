# NFC feasibility decision

**Reviewed:** 15 October 2026  
**Decision:** NFC is investigated but not implemented in this prototype.

## Findings

- NFC is a short-range tag interaction, not a continuous sensor stream. Apple Core NFC exposes reader sessions for reading NDEF messages from supported tags. Android's NFC framework similarly discovers tags and parses NDEF records.
- A limited future use could be tap-to-identify: an NDEF tag on a supported wearable or its packaging could carry a public model identifier or manufacturer help URL. The app could use that as an onboarding hint and then use the device's supported BLE protocol for connection and readings.
- A tag identifier or URI is untrusted input. A future implementation should validate the record, display the identified model for user confirmation, avoid automatically pairing based solely on tag content, and never place credentials or health data on an open tag.
- A tag-assisted workflow only works if a specific wearable/tag actually provides compatible NDEF data and the selected phone supports NFC reading. The project has no selected wearable, physical NFC tag, or available mobile test target. iOS reading additionally requires Core NFC capability and a device that supports NFC; Android has its own NFC capability and tag-dispatch behavior.
- This app uses Expo/React Native. Native NFC access would require a compatible native module, app configuration, and a development build; web cannot read a physical NFC tag through the current app.

## Project decision

Do not add a fake NFC scan button or claim pairing. Keep NFC out of the current implementation because there is no target device or tag protocol to implement and no compatible phone available for verification. The existing synthetic simulator remains the only demonstrated source. FR-03 is therefore **investigated, not implemented**.

If compatible hardware becomes available, the next investigation should identify its tag type and NDEF schema, verify supported iOS and Android models, add a native NFC adapter behind a platform-specific interface, and test tag reading on real devices. NFC should only identify or assist setup; BLE or the manufacturer's supported connection must carry live sensor data.

## References

- [Apple Core NFC overview](https://developer.apple.com/documentation/corenfc)
- [Apple: Building an NFC Tag-Reader App](https://developer.apple.com/documentation/corenfc/building-an-nfc-tag-reader-app)
- [Android NFC basics](https://developer.android.com/develop/connectivity/nfc/nfc)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
