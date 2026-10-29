# expo-googlenearby-connection

An Expo module that lets an Android app find nearby devices, connect to them and exchange bytes, files and streams with them, without an internet connection, through [Google Nearby Connections](https://developers.google.com/nearby/connections/overview).

The module reports what happens, success or failure, through events, and handles payloads by their ID. Its functions, types and events, and the conventions they follow, are described in [docs/REFERENCE.md](docs/REFERENCE.md).

## Google API documentation

- [Documentation for the latest stable release](https://developers.google.com/nearby/connections/overview)

## Requirements

- Expo SDK 58 or later, from version 0.2.0 of the module; apps on an older Expo SDK can keep version 0.1.4, which was built for Expo SDK 52 ([ADR 0001](docs/adr/0001-upgrade-in-place-to-expo-sdk-58.md)).
- Android only.

## Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, add the package to your dependencies and import the functions that you need; no config plugin is needed:

```bash
npx expo install expo-googlenearby-connection
```

The module has native code, so it does not run in Expo Go: start the app from a [development build](https://docs.expo.dev/develop/development-builds/introduction/), for example with `npx expo run:android`.

## Installation in bare React Native projects

For bare React Native projects, you MUST [install and configure the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```bash
npm install expo-googlenearby-connection
```

### Configure for Android

No configuration is needed: the module declares the Android permissions it uses, listed in [docs/REFERENCE.md](docs/REFERENCE.md#external-interface), and `requestPermissionsAsync` requests them.

### Configure for iOS

The module doesn't support iOS.

## Usage

A minimal flow between two devices, in a React component: request the permissions, advertise on one device and discover on the other, connect, then send bytes. Every function, type and event is described in [docs/REFERENCE.md](docs/REFERENCE.md).

```ts
import { useEventListener } from "expo";
import { Alert } from "react-native";
import Nearby, {
    acceptConnection,
    ConnectionInitiated,
    ConnectionResult,
    ConnectionType,
    EndpointFound,
    newPayloadBytes,
    rejectConnection,
    requestConnectionName,
    requestPermissionsAsync,
    sendPayloadToEndpoint,
    startAdvertisingName,
    startDiscovering,
} from "expo-googlenearby-connection";

const SERVICE_ID = "com.example.service";
const STRATEGY = "P2P_CLUSTER";

// On both devices
await requestPermissionsAsync();

// On the advertising device
startAdvertisingName("Device A", SERVICE_ID, {
    strategy: STRATEGY,
    connectionType: ConnectionType.BALANCED,
    lowPowerMode: false,
});

// On the discovering device: request a connection to each endpoint found
startDiscovering(SERVICE_ID, { strategy: STRATEGY });
useEventListener(Nearby, "EndpointFound", (event: EndpointFound) => {
    requestConnectionName("Device B", event.endpointId);
});

// On both devices: accept the connection once the user has checked that both devices show the same code,
// then send once it is open
useEventListener(Nearby, "ConnectionInitiated", (event: ConnectionInitiated) => {
    Alert.alert(`Connect to ${event.endpointName}?`, `Code: ${event.authenticationDigits}`, [
        { text: "Reject", onPress: () => rejectConnection(event.endpointId) },
        { text: "Accept", onPress: () => acceptConnection(event.endpointId) },
    ]);
});
useEventListener(Nearby, "ConnectionResult", (event: ConnectionResult) => {
    if (event.status.startsWith("[0]")) {
        sendPayloadToEndpoint(event.endpointId, newPayloadBytes(new Uint8Array([1, 2, 3])));
    }
});
```

The example app in [example/](example/) uses every function of the module.

## Using the module securely

- Google Nearby Connections encrypts each connection, but does not check which device is at the other end. Before accepting a connection, an app SHOULD show the `authenticationDigits` of `ConnectionInitiated` on both devices and accept only once the users have confirmed that they match, as Google [recommends](https://developers.google.com/nearby/connections/android/manage-connections); an app that accepts every connection lets any nearby device that knows its service ID connect to it.
- Payloads come from another device: an app SHOULD check a payload, its size and its content, before using it, and treat a received file as untrusted.
- Vulnerabilities of the module are reported privately, as [SECURITY.md](SECURITY.md) explains.

## This repository

- How to report a bug, propose a change or contribute: [CONTRIBUTING.md](CONTRIBUTING.md); discussion happens in the issues and pull requests.
- How to report a vulnerability privately: [SECURITY.md](SECURITY.md).
- The project documents of this repository are `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md` and `LICENSE` in its root, and the others in `docs/`.
- The functions, types and events of the module: [docs/REFERENCE.md](docs/REFERENCE.md).
- The terms of the module, and the meanings of the BCP 14 keywords, such as MUST and SHOULD, in every project document: [docs/GLOSSARY.md](docs/GLOSSARY.md).
- What changed between versions: [docs/CHANGELOG.md](docs/CHANGELOG.md).
- This repository follows [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple), at framework tag `v0.2.0`; its level is recorded in its [CHECKLIST](docs/CHECKLIST.md).

## License

This project is licensed under the MIT License.
