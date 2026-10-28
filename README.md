# expo-googlenearby-connection

Expo module for Google Nearby Connection SDK.

The module reports what happens, success or failure, through events, and handles payloads by their ID. Its functions, types and events, and the conventions they follow, are described in [docs/REFERENCE.md](docs/REFERENCE.md).

# Google API documentation

- [Documentation for the latest stable release](https://developers.google.com/nearby/connections/overview)

# Requirements

- Expo SDK 58 or later, from version 0.2.0 of the module; apps on an older Expo SDK can keep version 0.1.4, which was built for Expo SDK 52 ([ADR 0001](docs/adr/0001-upgrade-in-place-to-expo-sdk-58.md)).
- Android only.

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, just add the package to your NPM dependencies and import the functions that you need. There is no extra configuration through plugin at the moment.

# Installation in bare React Native projects

For bare React Native projects, you MUST [install and configure the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```bash
npm install expo-googlenearby-connection
```

### Configure for Android

No configuration is needed: the module declares the Android permissions it uses, listed in [docs/REFERENCE.md](docs/REFERENCE.md#external-interface), and `requestPermissionsAsync` requests them.

### Configure for iOS

The module doesn't support iOS.

# Usage

A minimal flow between two devices, in a React component: request the permissions, advertise on one device and discover on the other, connect, then send bytes. Every function, type and event is described in [docs/REFERENCE.md](docs/REFERENCE.md).

```ts
import { useEventListener } from "expo";
import Nearby, {
    acceptConnection,
    ConnectionInitiated,
    ConnectionResult,
    ConnectionType,
    EndpointFound,
    newPayloadBytes,
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

// On both devices: accept the connection, then send once it is open
useEventListener(Nearby, "ConnectionInitiated", (event: ConnectionInitiated) => {
    acceptConnection(event.endpointId);
});
useEventListener(Nearby, "ConnectionResult", (event: ConnectionResult) => {
    if (event.status.startsWith("[0]")) {
        sendPayloadToEndpoint(event.endpointId, newPayloadBytes(new Uint8Array([1, 2, 3])));
    }
});
```

The example app in [example/](example/) uses every function of the module.

## This repository

- How to report a bug, propose a change or contribute: [CONTRIBUTING.md](CONTRIBUTING.md); discussion happens in the issues and pull requests.
- The project documents of this repository are `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md` and `LICENSE` in its root, and the others in `docs/`.
- The functions, types and events of the module: [docs/REFERENCE.md](docs/REFERENCE.md).
- The terms of the module, and the meanings of the BCP 14 keywords, such as MUST and SHOULD, in every project document: [docs/GLOSSARY.md](docs/GLOSSARY.md).
- What changed between versions: [docs/CHANGELOG.md](docs/CHANGELOG.md).
- This repository follows [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple), at framework tag `v0.2.0`; its level is recorded in its [CHECKLIST](docs/CHECKLIST.md).

## License

This project is licensed under the MIT License.
