# expo-googlenearby-connection

Expo module for Google Nearby Connection SDK.

**GENERAL INFO:** since the SDK provides some callback objects for the main functionality, in which we were able to use only Expo events in order to know what's going on in JS, we've choosen to use events for the whole module as uniform medium of communication between native and JS.

**PAYLOADS:** since we cannot represent a Payload object in JS, the API functions and events handle the Payloads ID which is a Long number represented as string (to avoid rounding and losing the reference).
We then keep an internal queue of inbound and outbound Payloads that can be queried with the related functions.

**STREAMS:** the SDK doesn't send a Stream Payload if the stream doesn't have yet any data inside it. So, please, remember to Write something in the stream with either `writeStreamByte` or `writeStreamByteArray` in the stream after creation but before sending.

**NOTE:** on Google SDK documentation, it is shown that the SDK doesn't need Location permissions to work on API 32 and up. However, it seems that the documention is not 100% up to date.
When testing this without Location permissions, we are not able to start discovering.
Therefore, the API is requesting Location permissions as well as GPS on.

# Google API documentation

- [Documentation for the latest stable release](https://developers.google.com/nearby/connections/overview)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, just add the package to your NPM dependencies and import the functions that you need. There is no extra configuration through plugin at the moment.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```bash
npm install expo-googlenearby-connection
```

### Configure for Android

### Configure for iOS

The module doesn't support iOS.

# Usage

## Error handling

Based on the General info above:

- we send every exception back to JS for comfortable error handling.
- you can find the related events in [GoogleNearbyConnection.events.ts](src/GoogleNearbyConnection.events.ts).
- using the Exception type foudn in [GoogleNearbyConnection.types.ts](src/GoogleNearbyConnection.types.ts).

The data property usually includes the Payload Id (in case of exceptions on Payloads) or the Endpoint Id (in case of exceptions on Endpoint communication).
We'll include more details in future.

## Permissions

### `usePermissions`

Requests the necessary permissions for using Google Nearby Connections.

**Example:**

```ts
import { usePermissions } from "expo-googlenearby-connection";

const [permissions, requestPermissions, getPermissions] = usePermissions();

const reqPermissions = () => {
    requestPermissions().then((res) => {
        console.log("Permissions: ", res);
    });
    getPermissions().then((res) => {
        console.log("Permissions: ", res);
    });
};
```

## Advertising

### `startAdvertisingName`

Starts advertising the device to nearby devices.

**Example:**

```ts
import {
    startAdvertisingName,
    AdvertisingOptions,
    ConnectionType,
} from "expo-googlenearby-connection";

const SERVICE_ID = "com.example.service";

const advertisingOptions: AdvertisingOptions = {
    strategy: "P2P_POINT_TO_POINT",
    connectionType: ConnectionType.DISRUPTIVE,
    lowPowerMode: false,
};

startAdvertisingName("MyEndpoint", SERVICE_ID, advertisingOptions);
```

### `stopAdvertising`

Stops advertising the device.

**Example:**

```ts
import { stopAdvertising } from "expo-googlenearby-connection";

stopAdvertising();
```

## Discovering

### `startDiscovering`

Starts discovering nearby devices.

**Example:**

```ts
import {
    startDiscovering,
    DiscoveringOptions,
} from "expo-googlenearby-connection";

const SERVICE_ID = "com.example.service";

const discoveringOptions: DiscoveringOptions = {
    strategy: "P2P_POINT_TO_POINT",
};

startDiscovering(SERVICE_ID, discoveringOptions);
```

### `stopDiscovering`

Stops discovering nearby devices.

**Example:**

```ts
import { stopDiscovering } from "expo-googlenearby-connection";

stopDiscovering();
```

## Connections

### `requestConnectionName`

Requests a connection to a nearby device.

**Example:**

```ts
import {
    requestConnectionName,
    ConnectionOptions,
    ConnectionType,
} from "expo-googlenearby-connection";

const connectionOptions: ConnectionOptions = {
    connectionType: ConnectionType.DISRUPTIVE,
    lowPowerMode: false,
};

requestConnectionName("MyEndpoint", "endpointId", connectionOptions);
```

### `acceptConnection`

Accepts a connection request from a nearby device.

**Example:**

```ts
import { acceptConnection } from "expo-googlenearby-connection";

acceptConnection("endpointId");
```

### `rejectConnection`

Rejects a connection request from a nearby device.

**Example:**

```ts
import { rejectConnection } from "expo-googlenearby-connection";

rejectConnection("endpointId");
```

### `disconnectFromEndpoint`

Disconnects from a connected endpoint.

**Example:**

```ts
import { disconnectFromEndpoint } from "expo-googlenearby-connection";

disconnectFromEndpoint("endpointId");
```

## Payloads

### `newPayloadBytes`

Creates a new byte payload.

**Example:**

```ts
import { newPayloadBytes } from "expo-googlenearby-connection";

const bytePayload = newPayloadBytes(new Uint8Array([1, 2, 3]));
```

### `newPayloadFile`

Creates a new file payload.

**Example:**

```ts
import { newPayloadFile } from "expo-googlenearby-connection";

const filePayload = newPayloadFile(
    "file:///storage/emulated/0/DCIM/Camera/photo.jpg",
);
```

### `newPayloadStream`

Creates a new stream payload.

**Example:**

```ts
import { newPayloadStream } from "expo-googlenearby-connection";

const streamPayload = newPayloadStream();
```

### `sendPayloadToEndpoint`

Sends a payload to a connected endpoint.

**Example:**

```ts
import { sendPayloadToEndpoint } from "expo-googlenearby-connection";

sendPayloadToEndpoint("endpointId", bytePayload);
```

## Streams

### `writeStreamByte`

Writes a byte to a stream payload.

**Example:**

```ts
import { writeStreamByte } from "expo-googlenearby-connection";

await writeStreamByte(streamPayload, 1);
```

### `writeStreamByteArray`

Writes a byte array to a stream payload.

**Example:**

```ts
import { writeStreamByteArray } from "expo-googlenearby-connection";

await writeStreamByteArray(streamPayload, new Uint8Array([1, 2, 3]));
```

### `readStreamByte`

Reads a byte from a stream payload.

**Example:**

```ts
import { readStreamByte } from "expo-googlenearby-connection";

const byte = await readStreamByte(streamPayload);
```

### `readStreamByteArray`

Reads a byte array from a stream payload.

**Example:**

```ts
import { readStreamByteArray } from "expo-googlenearby-connection";

const byteArray = await readStreamByteArray(streamPayload, 0, 3);
```

## This repository

- How to report a bug, propose a change or contribute: [CONTRIBUTING.md](CONTRIBUTING.md); discussion happens in the issues and pull requests.
- The project documents of this repository are `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md` and `LICENSE` in its root, and the others in `docs/`.
- This repository follows [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple), at framework tag `v0.2.0`; its level is recorded in its [CHECKLIST](docs/CHECKLIST.md).

## License

This project is licensed under the MIT License.
