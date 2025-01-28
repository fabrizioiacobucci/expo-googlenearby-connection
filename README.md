# expo-googlenearby-connection

Expo module for Google Nearby Connection SDK.

**GENERAL INFO:** since the SDK provides some callback objects for the main functionality, in which we were able to use only Expo events in order to know what's going on in JS, we've choosen to use events for the whole module as uniform medium of communication between native and JS.

**PAYLOADS:** since we cannot represent a Payload object in JS, the API functions and events handle the Payloads ID which is a Long number represented as string (to avoid rounding and losing the reference).
We then keep an internal queue of inbound and outbound Payloads that can be queried with the related functions.

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

The module doesn't support yet iOS.

# Usage

## Error handling

Based on the General info above, we send every exception back to JS for comfortable error handling.
These come in with the following events:

```ts
    /**
     * @function AdvertisingFailed
     * @description Called when advertising fails.
     * @param {Exception} event - The event data.
     */
    AdvertisingFailed(event: Exception): void;

    /**
     * @function DiscoveringFailed
     * @description Called when discovering fails.
     * @param {Exception} event - The event data.
     */
    DiscoveringFailed(event: Exception): void;

    /**
     * @function ConnectionRequestFailed
     * @description Called when a connection request fails.
     * @param {Exception} event - The event data.
     */
    ConnectionRequestFailed(event: Exception): void;

    /**
     * @function ConnectionAcceptFailed
     * @description Called when a connection acceptance fails.
     * @param {EndpointEvent} event - The event data.
     */
    ConnectionAcceptFailed(event: Exception): void;

    /**
     * @function ConnectionRejectFailed
     * @description Called when a connection rejection fails.
     * @param {Exception} event - The event data.
     */
    ConnectionRejectFailed(event: Exception): void;

    /**
     * @function PayloadSendFailed
     * @description Called when a payload send fails.
     * @param {Exception} event - The event data.
     */
    PayloadSendFailed(event: Exception): void;

    /**
     * @function PayloadRemoveFailed
     * @description Called when a payload remove fails.
     * @param {Exception} event - The event data.
     */
    PayloadRemoveFailed(event: Exception): void;

    /**
     * @function PayloadCancelFailed
     * @description Called when a payload cancelation fails.
     * @param {Exception} event - The event data.
     */
    PayloadCancelFailed(event: Exception): void;

    /**
     * @function PayloadNotFound
     * @description Called when a payload is not found.
     * @param {Exception} event - The event data.
     */
    PayloadNotFound(event: Exception): void;

    /**
     * @function PayloadInvalidArguments
     * @description Called when a invalid arguments have been passed.
     * @param {Exception} event - The event data.
     */
    PayloadInvalidArguments(event: Exception): void;

    /**
     * @function PayloadIOException
     * @description Called when an IOException occurs.
     * @param {Exception} event - The event data.
     */
    PayloadIOException(event: Exception): void;

    /**
     * @function PayloadException
     * @description Called when a generic Exception occurs.
     * @param {Exception} event - The event data.
     */
    PayloadException(event: Exception): void;
```

With the following Exception type:

```ts
/**
 * @typedef Exception
 * @description Represents an exception event.
 * @property {string} error - The error message.
 * @property {string} stackTrace - The stack trace of the error.
 * @property {string | number} data - Additional data related to the exception.
 */
export type Exception = {
    error: string;
    stackTrace: string;
    data: string;
};
```

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
