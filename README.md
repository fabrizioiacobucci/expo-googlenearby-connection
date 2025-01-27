# expo-googlenearby-connection

Expo module for Google Nearby Connection SDK

# API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/example.com#readme/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/example.com#readme/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```bash
npm install expo-googlenearby-connection
```

### Configure for Android

### Configure for iOS

The module doesn't support yet iOS.

# Usage

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

**Parameters:**

- `name: string`: The name of the endpoint.
- `serviceId: string`: The service ID.
- `options: object`: Advertising options.
    - `strategy: string`: The strategy to use (e.g., 'P2P_POINT_TO_POINT').
    - `connectionType: string`: The connection type (e.g., 'DISRUPTIVE').
    - `lowPowerMode: boolean`: Whether to use low power mode.

**Returns:**

- `void`

**Example:**

```ts
import { startAdvertisingName, AdvertisingOptions } from "expo-googlenearby-connection";

const advertisingOptions: AdvertisingOptions = {
    strategy: "P2P_POINT_TO_POINT",
    connectionType: "DISRUPTIVE",
    lowPowerMode: false,
};

startAdvertisingName("MyEndpoint", "com.example.service", advertisingOptions);
```

### `stopAdvertising`

Stops advertising the device.

**Returns:**

- `void`

**Example:**

```ts
import { stopAdvertising } from "expo-googlenearby-connection";

stopAdvertising();
```

## Discovering

### `startDiscovering`

Starts discovering nearby devices.

**Parameters:**

- `serviceId: string`: The service ID.
- `options: object`: Discovering options.
    - `strategy: string`: The strategy to use (e.g., 'P2P_POINT_TO_POINT').

**Returns:**

- `void`

**Example:**

```ts
import { startDiscovering, DiscoveringOptions } from "expo-googlenearby-connection";

const discoveringOptions: DiscoveringOptions = {
    strategy: "P2P_POINT_TO_POINT",
};

startDiscovering("com.example.service", discoveringOptions);
```

### `stopDiscovering`

Stops discovering nearby devices.

**Returns:**

- `void`

**Example:**

```ts
import { stopDiscovering } from "expo-googlenearby-connection";

stopDiscovering();
```

## Connections

### `requestConnectionName`

Requests a connection to a nearby device.

**Parameters:**

- `name: string`: The name of the endpoint.
- `endpointId: string`: The ID of the endpoint.
- `options: object`: Connection options.
    - `connectionType: string`: The connection type (e.g., 'DISRUPTIVE').
    - `lowPowerMode: boolean`: Whether to use low power mode.

**Returns:**

- `void`

**Example:**

```ts
import { requestConnectionName, ConnectionOptions } from "expo-googlenearby-connection";

const connectionOptions: ConnectionOptions = {
    connectionType: "DISRUPTIVE",
    lowPowerMode: false,
};

requestConnectionName("MyEndpoint", "endpointId", connectionOptions);
```

### `acceptConnection`

Accepts a connection request from a nearby device.

**Parameters:**

- `endpointId: string`: The ID of the endpoint.

**Returns:**

- `void`

**Example:**

```ts
import { acceptConnection } from "expo-googlenearby-connection";

acceptConnection("endpointId");
```

### `rejectConnection`

Rejects a connection request from a nearby device.

**Parameters:**

- `endpointId: string`: The ID of the endpoint.

**Returns:**

- `void`

**Example:**

```ts
import { rejectConnection } from "expo-googlenearby-connection";

rejectConnection("endpointId");
```

### `disconnectFromEndpoint`

Disconnects from a connected endpoint.

**Parameters:**

- `endpointId: string`: The ID of the endpoint.

**Returns:**

- `void`

**Example:**

```ts
import { disconnectFromEndpoint } from "expo-googlenearby-connection";

disconnectFromEndpoint("endpointId");
```

## Payloads

### `newPayloadBytes`

Creates a new byte payload.

**Parameters:**

- `bytes: Uint8Array`: The byte array.

**Returns:**

- `string`: The byte payload ID.

**Example:**

```ts
import { newPayloadBytes } from "expo-googlenearby-connection";

const bytePayload = newPayloadBytes(new Uint8Array([1, 2, 3]));
```

### `newPayloadFile`

Creates a new file payload.

**Parameters:**

- `data`: string: the URI of the file.
- `isSensitive?`: whether the file is sensitive (optional),
- `fileName?`: file name for the destination (optional).
- `parentFolder?`: string: the destination parent folder (optional).

**Returns:**

- `string`: The file payload ID.

**Example:**

```ts
import { newPayloadFile } from "expo-googlenearby-connection";

const filePayload = newPayloadFile("path/to/file");
```

### `newPayloadStream`

Creates a new stream payload.

**Parameters:**

- `size?`: number: optional stream buffer size (defaults to 1024).

**Returns:**

- `string`: The stream payload ID.

**Example:**

```ts
import { newPayloadStream } from "expo-googlenearby-connection";

const streamPayload = newPayloadStream();
```

### `sendPayloadToEndpoint`

Sends a payload to a connected endpoint.

**Parameters:**

- `endpointId: string`: The ID of the endpoint.
- `payload: string`: The payload ID to send.

**Returns:**

- `void`

**Example:**

```ts
import { sendPayloadToEndpoint } from "expo-googlenearby-connection";

sendPayloadToEndpoint("endpointId", bytePayload);
```

## Streams

### `writeStreamByte`

Writes a byte to a stream payload.

**Parameters:**

- `streamPayload: object`: The stream payload.
- `byte: number`: The byte to write.

**Returns:**

- `Promise<void>`

**Example:**

```ts
import { writeStreamByte } from "expo-googlenearby-connection";

await writeStreamByte(streamPayload, 1);
```

### `writeStreamByteArray`

Writes a byte array to a stream payload.

**Parameters:**

- `streamPayload: string`: The stream payload ID.
- `byteArray: Uint8Array`: The byte array to write.

**Returns:**

- `Promise<void>`

**Example:**

```ts
import { writeStreamByteArray } from "expo-googlenearby-connection";

await writeStreamByteArray(streamPayload, new Uint8Array([1, 2, 3]));
```

### `readStreamByte`

Reads a byte from a stream payload.

**Parameters:**

- `streamPayload: string`: The stream payload ID.

**Returns:**

- `Promise<number>`: The byte read.

**Example:**

```ts
import { readStreamByte } from "expo-googlenearby-connection";

const byte = await readStreamByte(streamPayload);
```

### `readStreamByteArray`

Reads a byte array from a stream payload.

**Parameters:**

- `streamPayload: string`: The stream payload ID.
- `offset: number`: The offset to start reading from.
- `length: number`: The number of bytes to read.

**Returns:**

- `Promise<Uint8Array>`: The byte array read.

**Example:**

```ts
import { readStreamByteArray } from "expo-googlenearby-connection";

const byteArray = await readStreamByteArray(streamPayload, 0, 3);
```

## Android Native Implementation

The Android native implementation can be found in the [`android`](android) folder. It includes the necessary code to integrate with the Google Nearby Connection SDK.

## Expo API

The Expo API can be found in the [`src`](src) folder. It provides the JavaScript interface for interacting with the Google Nearby Connection SDK.

## License

This project is licensed under the MIT License.

```

Similar code found with 2 license types
```
