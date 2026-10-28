# Glossary

The terms that the documents and the code of expo-googlenearby-connection use, one meaning each. A term in _Avoid_ names the same thing and is not used.

## Requirements

**BCP 14 keywords**:
`MUST`, `SHOULD`, `MAY`, their synonyms (`REQUIRED`, `SHALL`, `RECOMMENDED`, `OPTIONAL`) and their negations, with the meanings of [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), which they carry only in capitals ([RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)). The documents of this repository use them with these meanings.
_Avoid_: RFC 2119 keywords

## Nearby Connections

**Endpoint**:
A device that runs an app using Google Nearby Connections, as another device sees it.
_Avoid_: peer, node

**Endpoint ID**:
The string that Google Nearby Connections gives an endpoint, and that the functions and the events of the module use to name it.

**Endpoint name**:
The string that an app advertises, with `startAdvertisingName`, or sends with a connection request, with `requestConnectionName`.
_Avoid_: device name

**Endpoint info**:
The bytes that an app advertises, with `startAdvertisingInfo`, or sends with a connection request, with `requestConnectionInfo`, in place of an endpoint name. The `endpointInfo` of `EndpointFound` holds the endpoint name or the endpoint info, as bytes.

**Service ID**:
The string that names the service of an app; an endpoint discovers only the endpoints that advertise the same service ID.
_Avoid_: app ID

**Strategy**:
The topology of the connections that Google Nearby Connections allows: `P2P_CLUSTER`, `P2P_STAR` or `P2P_POINT_TO_POINT`.
_Avoid_: mode

**Advertising**:
Making this device discoverable, as an endpoint, by the devices that discover the same service ID.

**Discovery**:
Looking for the endpoints that advertise a service ID. The functions say "discovering", as in `startDiscovering`.

**Connection request**:
What one endpoint sends to a discovered endpoint to open a connection; the connection opens once both endpoints accept it.
_Avoid_: invitation, pairing

**Connection**:
The link between two endpoints after both have accepted a connection request, over which they send payloads.

## Payloads

**Payload**:
Data that an endpoint sends over a connection: bytes, a file or a stream.
_Avoid_: message, packet

**Payload ID**:
The 64-bit integer that identifies a payload, passed as a string so that JavaScript does not round it.

**Payload queue**:
The list of the inbound and outbound payloads that the module keeps, and that the payload functions query and change.
_Avoid_: cache, store

**Stream payload**:
A payload whose data the sending app writes over time, with the stream functions, and the receiving app reads.

## The module

**Native module**:
The Kotlin part of the module, which calls Google Nearby Connections; JavaScript reaches it through the default export of the package.
_Avoid_: bridge

**Event**:
A message that the native module sends to JavaScript, which an app listens to with `useEventListener`.

**Error event**:
An event that reports a failure, whose data is an `Exception`.

**Public API**:
The part of the external interface of the module that Semantic Versioning covers, as [REFERENCE](REFERENCE.md#public-api) declares it.
