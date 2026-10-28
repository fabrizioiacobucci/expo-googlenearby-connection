# Changelog

All notable changes to expo-googlenearby-connection, by version. The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and the versions follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Versions up to 0.1.4 were released before this repository adopted foss-docs-made-simple, and have no release notes.

## [Unreleased]

### Changed

- **Breaking:** the module supports Expo SDK 58 and later only, with React 19 and React Native 0.88. Apps on an older Expo SDK can keep version 0.1.4 ([ADR 0001](adr/0001-upgrade-in-place-to-expo-sdk-58.md)).
- **Breaking:** for TypeScript, the functions of the module that declared no return type now take it from the native functions, instead of `any`. `newPayloadFile` and `newPayloadStream` return `string | null`, where `null` means that the payload was not created and an error event was sent, so code that uses their result as a `string` no longer type-checks.
- The Android library takes its `compileSdk` and `minSdk` from the app; when the app defines neither, it now falls back to 36 and 24 instead of 34 and 30.

### Removed

- **Breaking:** `ExpoGoogleNearbyConnectionModuleClass` exists only as a TypeScript type; code that used it as a value at runtime no longer works.

### Fixed

- `flushStream` resolves once the native operation has completed, instead of at once, so that code which awaits it, and then sends the stream, sends it after the operation.

[Unreleased]: https://github.com/fabrizioiacobucci/expo-googlenearby-connection/compare/0.1.4...HEAD
