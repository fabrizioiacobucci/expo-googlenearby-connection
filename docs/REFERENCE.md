# Reference

The external interface of expo-googlenearby-connection, and the part of it that is the public API under [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). Its terms, such as endpoint, payload ID and service ID, are defined in [GLOSSARY](GLOSSARY.md).

## External interface

The module is the npm package `expo-googlenearby-connection`, for Expo SDK 58 or later, on Android only. It has no command line, no configuration file and no config plugin. An app uses:

- the named exports of the package: the functions, the `usePermissions` hook, the types and the enums described below;
- the default export of the package, the native module object, to listen to the events of the module with `useEventListener` from `expo`;
- the Android permissions that the module declares in its manifest, which the build merges into the app's manifest, and that `requestPermissionsAsync` requests at run time:
  - on every Android version: `ACCESS_WIFI_STATE`, `CHANGE_WIFI_STATE` and `ACCESS_COARSE_LOCATION`;
  - on Android 12 (API 31) and later: `BLUETOOTH_SCAN`, `BLUETOOTH_ADVERTISE` and `BLUETOOTH_CONNECT`, and on Android 13 (API 33) and later also `NEARBY_WIFI_DEVICES`;
  - before Android 12: `BLUETOOTH` and `BLUETOOTH_ADMIN`;
  - the manifest also declares `INTERNET` and `ACCESS_FINE_LOCATION`, which the module does not request.

## Public API

The public API is narrower than the external interface. It is:

- the named exports of the package, with their names, parameters, return types and behavior, including the events each function emits;
- the names of the events of the module and the types of their data.

The rest of the external interface is outside the public API: the methods of the native module object, its class `ExpoGoogleNearbyConnectionModuleClass`, and the Android permissions.

## Conventions

- **Events.** The module reports what happens, success or failure, through events, because the callbacks of Google Nearby Connections reach JavaScript only as events. An app listens to them on the default export:

  ```ts
  import Nearby, { EndpointFound } from "expo-googlenearby-connection";
  import { useEventListener } from "expo";

  useEventListener(Nearby, "EndpointFound", (event: EndpointFound) => {
      console.log("Found " + event.endpointId);
  });
  ```

- **Errors.** A function does not throw when Google Nearby Connections fails: it emits an error event, whose data is an `Exception`, and a function that returns a value returns `null`. The `data` of the `Exception` holds, as a string, the payload ID or the endpoint ID concerned, or `"null"` when there is none.
- **Payload IDs.** A payload is identified by its ID, a 64-bit integer passed as a string, so that JavaScript does not round it. The module keeps the inbound and outbound payloads in a queue, which the payload functions query and change.
- **Streams.** An app MUST write to a stream payload, with `writeStreamByte` or `writeStreamByteArray`, before sending it, since Google Nearby Connections does not send a stream payload that has no data yet.
- **Location.** To discover, an app MUST hold the permissions and have the location services of the device on, also on the Android versions on which Google's documentation says that location is not needed; when they are off, `startDiscovering` asks the user to turn them on.

## Functions

### Permissions

| Function | Returns | What it does |
|---|---|---|
| `requestPermissionsAsync()` | `Promise<PermissionResponse>` | Requests the Android permissions of the module, and resolves with their status. |
| `getPermissionsAsync()` | `Promise<PermissionResponse>` | Resolves with the status of the Android permissions of the module, without requesting them. |
| `usePermissions()` | `[PermissionResponse \| null, request, get]` | React hook, made with `createPermissionHook` of `expo`: the current status, and the two functions above. |

`PermissionResponse` is the type of `expo`: `granted` is true only when every permission is granted, and `canAskAgain` is false when Android no longer shows the dialog of a denied permission.

```ts
import { usePermissions } from "expo-googlenearby-connection";

const [permissions, requestPermissions] = usePermissions();

requestPermissions().then((response) => console.log("Granted: " + response.granted));
```

### Advertising and discovery

| Function | Returns | What it does | Events |
|---|---|---|---|
| `startAdvertisingName(endpointName: string, serviceId: string, advertisingOptions: AdvertisingOptions)` | `void` | Advertises this device under a name, for the given service. | `AdvertisingStarted`, `AdvertisingFailed` |
| `startAdvertisingInfo(endpointInfo: Uint8Array, serviceId: string, advertisingOptions: AdvertisingOptions)` | `void` | Advertises this device with the given bytes as its endpoint info. | `AdvertisingStarted`, `AdvertisingFailed` |
| `stopAdvertising()` | `void` | Stops advertising. | `AdvertisingStopped` |
| `startDiscovering(serviceId: string, discoveringOptions: DiscoveringOptions)` | `void` | Discovers the devices that advertise the given service. When the location services are off, it asks the user to turn them on instead, and does not start: call it again once they are on. | `DiscoveringStarted`, `DiscoveringFailed`, `EndpointFound`, `EndpointLost`; when location is off, `LocationPromptAccepted` or `LocationPromptRejected`, then `LocationRequestApproved`, `LocationRequestDenied` or `LocationRequestUnknown` |
| `stopDiscovering()` | `void` | Stops discovering. | `DiscoveringStopped` |
| `stopAllEndpoints()` | `void` | Stops advertising and discovering, and disconnects from every endpoint. | `StopAllEndpoints` |

An unknown strategy in the options emits `InvalidStrategy`, and the operation goes on with `P2P_CLUSTER`.

```ts
import { ConnectionType, startAdvertisingName, startDiscovering } from "expo-googlenearby-connection";

const SERVICE_ID = "com.example.service";

startAdvertisingName("MyEndpoint", SERVICE_ID, {
    strategy: "P2P_POINT_TO_POINT",
    connectionType: ConnectionType.DISRUPTIVE,
    lowPowerMode: false,
});
startDiscovering(SERVICE_ID, { strategy: "P2P_POINT_TO_POINT" });
```

### Connections

| Function | Returns | What it does | Events |
|---|---|---|---|
| `requestConnectionName(endpointName: string, endpointId: string, connectionOptions?: ConnectionOptions)` | `void` | Requests a connection to a discovered endpoint, sending a name. | `ConnectionRequested`, `ConnectionRequestFailed`, then `ConnectionInitiated` on both devices |
| `requestConnectionInfo(endpointInfo: Uint8Array, endpointId: string, connectionOptions?: ConnectionOptions)` | `void` | Requests a connection to a discovered endpoint, sending bytes as the endpoint info. | as `requestConnectionName` |
| `acceptConnection(endpointId: string)` | `void` | Accepts a connection after `ConnectionInitiated`; the connection opens when both devices accept it. | `ConnectionAccepted`, `ConnectionAcceptFailed`, then `ConnectionResult` |
| `rejectConnection(endpointId: string)` | `void` | Rejects a connection after `ConnectionInitiated`. | `ConnectionRejected`, `ConnectionRejectFailed`, then `ConnectionResult` |
| `disconnectFromEndpoint(endpointId: string)` | `void` | Disconnects from a connected endpoint. | `DisconnectFromEndpoint`; the other device gets `EndpointDisconnection` |

While a connection is open, `BandwidthChanged` reports changes of its quality.

```ts
import { acceptConnection, requestConnectionName } from "expo-googlenearby-connection";

requestConnectionName("MyEndpoint", endpointId);
// on ConnectionInitiated, on both devices:
acceptConnection(endpointId);
```

### Payloads

| Function | Returns | What it does | Events |
|---|---|---|---|
| `newPayloadBytes(data: Uint8Array)` | `string` | Creates a payload of bytes and returns its ID. | |
| `newPayloadFile(data: string, isSensitive?: boolean, fileName?: string, parentFolder?: string)` | `string \| null` | Creates a payload of the file at the URI `data`, and returns its ID. | on failure, an error event |
| `newPayloadStream(size?: number)` | `string \| null` | Creates a stream payload with a buffer of `size` bytes, 1024 by default, and returns its ID. | on failure, an error event |
| `sendPayloadToEndpoint(endpointId: string, payloadId: string)` | `void` | Sends a payload to a connected endpoint. | `PayloadSend`, `PayloadSendFailed`, then `PayloadTransferUpdate`; the other device gets `PayloadReceived` and `PayloadTransferUpdate` |
| `sendPayloadToEndpoints(endpointIds: string[], payloadId: string)` | `void` | Sends a payload to several connected endpoints. | as `sendPayloadToEndpoint` |
| `getPayloadInfo(payloadId: string)` | `PayloadInfo \| null` | Returns the information of a payload. | on failure, an error event |
| `getPayloadInfoList()` | `PayloadInfo[]` | Returns the information of every payload in the queue. | |
| `getPayloadList()` | `string[]` | Returns the ID of every payload in the queue. | |
| `payloadExists(payloadId: string)` | `boolean` | Tells whether a payload is in the queue. | |
| `setPayloadProperty(payloadId: string, name: PayloadProperty, value: string)` | `void` | Sets a property of a payload. | on failure, an error event |
| `removePayload(payloadId: string)` | `void` | Removes a payload from the queue. | `PayloadRemoved`, `PayloadRemoveFailed` |
| `removePayloadAll()` | `void` | Removes every payload from the queue. | `PayloadRemovedAll` |
| `cancelPayload(payloadId: string)` | `void` | Cancels the transfer of a payload. | `PayloadCanceled`, `PayloadCancelFailed` |

The error events of the payload functions are `PayloadNotFound`, `PayloadInvalidArguments`, `PayloadIOException` and `PayloadException`.

```ts
import { newPayloadBytes, sendPayloadToEndpoint } from "expo-googlenearby-connection";

const payloadId = newPayloadBytes(new Uint8Array([1, 2, 3]));
sendPayloadToEndpoint(endpointId, payloadId);
```

### Streams

Each function takes the ID of a stream payload. The asynchronous ones resolve once the native operation has completed; on failure, they emit a payload error event and resolve with `null`, or with nothing when they return no value.

| Function | Returns | What it does |
|---|---|---|
| `writeStreamByte(payloadId: string, byte: number)` | `Promise<void>` | Writes a byte to the stream. |
| `writeStreamByteArray(payloadId: string, byteArray: Uint8Array, offset = 0, length = byteArray.length)` | `Promise<void>` | Writes `length` bytes of `byteArray`, from `offset`, to the stream. |
| `flushStream(payloadId: string)` | `Promise<void>` | Flushes the stream. |
| `readStreamByte(payloadId: string)` | `Promise<number \| null>` | Reads a byte from the stream. |
| `readStreamByteArray(payloadId: string, offset: number, length: number)` | `Promise<Uint8Array \| null>` | Reads up to `length` bytes from the stream into an array of `length` bytes, from index `offset`. |
| `availableStream(payloadId: string)` | `Promise<number \| null>` | Returns the number of bytes that can be read without blocking. |
| `markStream(payloadId: string, readLimit: number)` | `Promise<void>` | Marks the current position, valid for the next `readLimit` bytes read. |
| `isMarkSupportedStream(payloadId: string)` | `boolean \| null` | Tells whether the stream supports `markStream` and `resetStream`. |
| `resetStream(payloadId: string)` | `Promise<void>` | Moves back to the last mark. |
| `skipStream(payloadId: string, amount: number)` | `Promise<number \| null>` | Skips up to `amount` bytes, and returns the number skipped. |

```ts
import { newPayloadStream, sendPayloadToEndpoint, writeStreamByteArray } from "expo-googlenearby-connection";

const payloadId = newPayloadStream();
if (payloadId) {
    await writeStreamByteArray(payloadId, new Uint8Array([1, 2, 3]));
    sendPayloadToEndpoint(endpointId, payloadId);
}
```

## Types

### Options

| Type | Fields |
|---|---|
| `Strategy` | `"P2P_CLUSTER"`, `"P2P_STAR"` or `"P2P_POINT_TO_POINT"`, the strategies of Google Nearby Connections; the advertising and the discovering endpoints MUST use the same one. |
| `ConnectionOptions` | `connectionType: ConnectionType`; `lowPowerMode: boolean`. |
| `DiscoveringOptions` | `strategy: Strategy`. |
| `AdvertisingOptions` | the fields of `ConnectionOptions` and of `DiscoveringOptions`. |

### Payloads

| Type | Fields |
|---|---|
| `PayloadInfo` | `id: string`; `type: PayloadType`; `offset: number`; for a file, `uri?: string` and `size?: number`; for bytes, `bytes?: Uint8Array`. |

### Event data

| Type | Fields |
|---|---|
| `EndpointEvent` | `endpointId: string`. |
| `EndpointFound` | `endpointId: string`; `endpointInfo: Uint8Array`, the name or the bytes the endpoint advertises; `serviceId: string`. |
| `ConnectionInitiated` | `endpointId: string`; `endpointName: string`; `endpointInfo: Uint8Array`; `authenticationDigits: string`, a short code that both users can compare; `authenticationStatus: number`; `rawAuthenticationToken: Uint8Array`; `isIncomingConnection: boolean`. |
| `ConnectionResult` | `endpointId: string`; `status: string`, the status code of Google Nearby Connections and its message, as `"[code]message"`; code `0` means that the connection is open. |
| `BandwidthChanged` | `endpointId: string`; `quality: BandwidthQuality`. |
| `PayloadEvent` | `payloadId: string`. |
| `PayloadReceivedInfo` | `endpointId: string`; `payloadId: string`; `type: PayloadType`; `data`: the bytes, for bytes, the URI of the received file, for a file, and the string `"Stream received"`, for a stream. The type also allows `null`. |
| `PayloadTransferUpdate` | `payloadId: string`; `status: PayloadTransferUpdateStatus`; `bytesTransferred: number`; `totalBytes: number`. |
| `PayloadSend` | `endpointIds: string[] \| string`, the endpoint or endpoints; `payloadId: string`. |
| `Exception` | `error: string`, the message; `stackTrace: string`; `data: string`, as in [Conventions](#conventions). |

## Enums

| Enum | Values |
|---|---|
| `ConnectionType` | `BALANCED = 0`, `DISRUPTIVE = 1`, `NON_DISRUPTIVE = 2`. |
| `BandwidthQuality` | `UNKNOWN = 0`, `LOW = 1`, `MEDIUM = 2`, `HIGH = 3`. |
| `PayloadType` | `BYTES = 1`, `FILE = 2`, `STREAM = 3`. |
| `PayloadTransferUpdateStatus` | `SUCCESS = 1`, `FAILURE = 2`, `IN_PROGRESS = 3`, `CANCELED = 4`. |
| `PayloadProperty` | `OFFSET`, `FILENAME`, `PARENTFOLDER`, `SENSITIVE`, each equal to its name. |

## Events

The type of the data of each event is in [Event data](#event-data); an event without data passes none.

| Group | Event | Data |
|---|---|---|
| Advertising | `AdvertisingStarted`, `AdvertisingStopped` | none |
| | `AdvertisingFailed` | `Exception` |
| Discovery | `DiscoveringStarted`, `DiscoveringStopped` | none |
| | `DiscoveringFailed` | `Exception` |
| | `EndpointFound` | `EndpointFound` |
| | `EndpointLost` | `EndpointEvent` |
| | `InvalidStrategy` | `Exception` |
| Location | `LocationPromptAccepted`, `LocationRequestApproved`, `LocationRequestDenied`, `LocationRequestUnknown` | none |
| | `LocationPromptRejected` | `Exception` |
| Connections | `ConnectionRequested`, `ConnectionAccepted`, `ConnectionRejected`, `DisconnectFromEndpoint`, `EndpointDisconnection` | `EndpointEvent` |
| | `ConnectionRequestFailed`, `ConnectionAcceptFailed`, `ConnectionRejectFailed` | `Exception` |
| | `ConnectionInitiated` | `ConnectionInitiated` |
| | `ConnectionResult` | `ConnectionResult` |
| | `BandwidthChanged` | `BandwidthChanged` |
| | `StopAllEndpoints` | none |
| Payloads | `PayloadReceived` | `PayloadReceivedInfo` |
| | `PayloadTransferUpdate` | `PayloadTransferUpdate` |
| | `PayloadSend` | `PayloadSend` |
| | `PayloadRemoved`, `PayloadCanceled` | `PayloadEvent` |
| | `PayloadRemovedAll` | none |
| | `PayloadSendFailed`, `PayloadRemoveFailed`, `PayloadCancelFailed`, `PayloadNotFound`, `PayloadInvalidArguments`, `PayloadIOException`, `PayloadException` | `Exception` |
