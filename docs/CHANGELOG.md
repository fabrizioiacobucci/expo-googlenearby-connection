# Changelog

All notable changes to expo-googlenearby-connection, by version. The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and the versions follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-10

### Changed

- **Breaking:** the module supports Expo SDK 58 and later only, with React 19 and React Native 0.88. Apps on Expo SDK 52 or older can keep version 0.1.4, which needs React 18; no version of the module supports Expo SDK 53 to 57 ([ADR 0001](adr/0001-upgrade-in-place-to-expo-sdk-58.md)).
- **Breaking:** for TypeScript, the functions of the module that declared no return type now take it from the native functions, instead of `any`. Among them, `newPayloadStream` returns `string | null`, where `null` means that the payload was not created and an error event was sent, as `newPayloadFile` already did, so code that uses its result as a `string` no longer type-checks.
- **Breaking:** for TypeScript, `getPayloadInfo`, `isMarkSupportedStream`, `readStreamByte`, `readStreamByteArray`, `availableStream` and `skipStream` now declare that they can return `null`, as they already did when the operation failed, after an error event was sent; code that uses their result without checking for `null` no longer type-checks.
- The Android library takes its `compileSdk` and `minSdk` from the app; when the app defines neither, it now falls back to 36 and 24 instead of 34 and 28.
- The Android library uses Google Play services Location 21.4.0 instead of 21.3.0. It keeps Nearby 19.3.0: Nearby 19.5.0 and later are compiled with Kotlin 2.4, which the Kotlin 2.2 of Expo SDK 58 cannot read, and Nearby 19.4.0 adds only support for UWB, which the module does not use.

### Removed

- **Breaking:** `ExpoGoogleNearbyConnectionModuleClass` exists only as a TypeScript type; code that used it as a value at runtime no longer works.

### Fixed

- `flushStream`, `writeStreamByte`, `writeStreamByteArray`, `markStream` and `resetStream` resolve once the native operation has completed, instead of at once, so that code which awaits one of them, and then sends the stream, sends it after the operation.
- `ConnectionRequestFailed` carries in the `data` of its `Exception` the ID of the endpoint that the connection was requested to, as REFERENCE states, instead of the name or the bytes that `requestConnectionName` or `requestConnectionInfo` sent.

## [0.1.4] - 2025-01-28

### Added

- The `InvalidStrategy` event, whose data is an `Exception`, emitted when the options of `startAdvertisingName`, `startAdvertisingInfo` or `startDiscovering` hold a strategy that is not `P2P_CLUSTER`, `P2P_STAR` or `P2P_POINT_TO_POINT`.
- The README explains how the module reports results through events, how it identifies payloads, how to handle errors, and why it asks for location even on recent Android versions.

### Changed

- An unknown strategy no longer makes advertising or discovering throw: the module emits `InvalidStrategy` and goes on with `P2P_CLUSTER`.

### Removed

- **Breaking:** for TypeScript, the type `EndpointEventError`, which no event used.

## [0.1.3] - 2025-01-27

### Changed

- `startDiscovering` checks that location is on with every Android version, not only up to Android 11: when it is off, it asks the user to turn it on, and does not start.

### Removed

- **Breaking:** the events `LocationSettingsChangedToEnabled` and `LocationSettingsChangedToDisabled`, which the module no longer emits and no longer declares for TypeScript; the answer to the request to turn location on comes with `LocationRequestApproved`, `LocationRequestDenied` or `LocationRequestUnknown`.

### Fixed

- After the user answers the request to turn location on, the module emits `LocationRequestApproved`, `LocationRequestDenied` or `LocationRequestUnknown`, since it now receives the answer.

## [0.1.2] - 2025-01-27

### Changed

- The Android manifest of the module declares the Bluetooth, Wi-Fi and location permissions with every Android version, without upper SDK limits, and no longer states that Bluetooth scanning and nearby Wi-Fi devices are never used for location.
- The README shows the install command in a code block.

## [0.1.1] - 2025-01-26

### Changed

- The npm page of the package links to the GitHub repository, its issues and its README, instead of placeholder addresses.

## [0.1.0] - 2025-01-25

### Added

- First release: an Expo module for Android that exposes Google Nearby Connections to JavaScript and TypeScript, with functions to check and request its permissions, advertise, discover, connect, and send and receive payloads of bytes, files and streams, and with events that report their results and errors. iOS is not supported.

[Unreleased]: https://github.com/fabrizioiacobucci/expo-googlenearby-connection/compare/0.2.0...HEAD
[0.2.0]: https://github.com/fabrizioiacobucci/expo-googlenearby-connection/compare/0.1.4...0.2.0
[0.1.4]: https://www.npmjs.com/package/expo-googlenearby-connection/v/0.1.4
[0.1.3]: https://www.npmjs.com/package/expo-googlenearby-connection/v/0.1.3
[0.1.2]: https://www.npmjs.com/package/expo-googlenearby-connection/v/0.1.2
[0.1.1]: https://www.npmjs.com/package/expo-googlenearby-connection/v/0.1.1
[0.1.0]: https://www.npmjs.com/package/expo-googlenearby-connection/v/0.1.0
