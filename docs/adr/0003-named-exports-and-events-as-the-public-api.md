---
status: accepted
date: 2026-11-10
decision-makers: "@fabrizioiacobucci"
---

# Declare the named exports and the events as the public API

## Context and Problem Statement

The versions of the npm package follow Semantic Versioning ([GOVERNANCE](../GOVERNANCE.md#documentation)), which needs a declared public API: the part of the module that a minor or a patch release does not break. The external interface of the module is wider than what an app needs to call. It has the named exports of the package, which are the functions, the `usePermissions` hook, the types and the enums; the default export, which is the native module object, with a method for each function and the events of the module; the type `ExpoGoogleNearbyConnectionModuleClass`, which declares those methods; and the Android permissions that the module declares and requests. Which part of the external interface is the public API?

## Decision Drivers

* An app knows which releases can break it from the version number alone.
* Each function of the module can be called in two ways, as a named export and as a method of the native module object, and only one of them needs to stay stable.
* An upgrade of the Expo SDK can force a change of the native module object and of its type, as SDK 58 did ([ADR 0001](0001-upgrade-in-place-to-expo-sdk-58.md)).
* The permissions that Google Nearby Connections needs change with the versions of Android, so the module has to follow them without waiting for a major release.

## Considered Options

* The whole external interface
* The named exports and the events, without the methods of the native module object, its type and the permissions
* The named exports, the events and the permissions

## Decision Outcome

Chosen option: "The named exports and the events, without the methods of the native module object, its type and the permissions", because it keeps stable the one way of calling the module that the documents describe, and leaves free to change the parts that the Expo SDK and Android decide.

The public API is:

* the named exports of the package, with their names, parameters, return types and behavior, including the events each function emits, and except the type `ExpoGoogleNearbyConnectionModuleClass`;
* the names of the events of the module and the types of their data.

An app uses the default export only to listen to the events. The methods of the native module object, the type that declares them and the Android permissions are outside the public API, so a minor or a patch release can change them. So is what the package does on iOS and on the web, since the module supports Android only. Each change of the permissions is listed in the [CHANGELOG](../CHANGELOG.md), since it changes the manifest of the app and the dialogs that its users see. [REFERENCE](../REFERENCE.md#public-api) declares the public API, and describes the whole external interface.

### Consequences

* Good, because an app that calls the named exports and listens to the events is not broken by a minor or a patch release.
* Good, because a change that an upgrade of the Expo SDK forces on the native module object or on its type does not, on its own, need a major release.
* Good, because the module can add or drop a permission when a version of Android asks for it, in a minor release.
* Bad, because TypeScript lets an app call the methods of the default export, which no version number protects; only REFERENCE tells the app so.
* Bad, because a minor release can change the permissions that an app declares and requests, so an app has to read the CHANGELOG to notice it.
* Bad, because the default export is used for the events, which are in the public API, while its methods are outside it, a boundary that REFERENCE has to explain.

### Confirmation

The decision is confirmed when REFERENCE declares the public API as above, a breaking change of it is marked in its commit and listed first in the CHANGELOG, as [CONTRIBUTING](../../CONTRIBUTING.md) requires, and each change of the permissions has its entry in the CHANGELOG.

## Pros and Cons of the Options

### The whole external interface

* Good, because the boundary needs no explanation: everything that an app can reach is covered.
* Bad, because each function is covered twice, as a named export and as a method, and a change of either is a breaking change.
* Bad, because a change of the native module object that an upgrade of the Expo SDK forces, or a new permission that a version of Android needs, would each need a major release.

### The named exports, the events and the permissions

* Good, because an app is told by the version number when its manifest and its permission dialogs change.
* Bad, because the module could follow a version of Android that needs another permission only with a major release, or would stop working on it until then.

## More Information

This ADR was written after its decision. The decision was made on 2026-10-28, when REFERENCE was written and first declared the public API, and on 2026-10-30 it was confirmed for the permissions, with the rule that each change of them goes to the CHANGELOG. It had no ADR until a review of the project documents, on 2026-11-10, found that it affects the external interface, which the [DEFINITION-OF-DONE](../DEFINITION-OF-DONE.md#changes) names among the significant architectural decisions.

The type `ExpoGoogleNearbyConnectionModuleEvents`, which maps the name of each event to its listener, is a named export inside the public API: it holds only the names of the events and the types of their data.

On 2026-11-10, after this ADR was accepted, it was added that what the package does on iOS and on the web is outside the public API. The chosen option stays the same.
