# Dependency audit note

**Scope:** npm audit of the installed application dependency tree after adding the Expo-compatible Jest test setup.

`npm audit --omit=dev` reported 36 advisories in the tree (23 high, 13 moderate, no critical). Findings are transitive through the Expo SDK 57 / React Native / Metro toolchain. The audit's suggested forced fixes include downgrading Expo to 44.0.6 and React Native to 0.72.17, which are incompatible with this project's SDK and current source. A dry run confirmed `--force` is the path npm proposes; no audit fix was applied.

The project remains on Expo SDK 57. Expo SDK 58 was still in beta in the official changelog at this review date, so moving this capstone to a beta SDK solely to chase the audit report would introduce an unverified platform upgrade. Recheck the advisory tree after a compatible stable Expo patch/SDK is available and run Expo Doctor, lint, type checks, unit tests, and platform smoke checks after any upgrade.

This audit output is a dependency-management signal, not proof that every listed transitive issue is reachable in the shipped app. Conversely, green Expo Doctor checks do not resolve or disprove npm audit findings. Do not suppress or force-downgrade dependencies to make the report appear clean.

## References

- [Expo changelog](https://expo.dev/changelog/sdk-58-beta)
- [Expo SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/)
