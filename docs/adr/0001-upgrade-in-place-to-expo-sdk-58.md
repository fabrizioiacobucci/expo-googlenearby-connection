---
status: accepted
date: 2026-10-27
decision-makers: "@fabrizioiacobucci"
---

# Upgrade in place to Expo SDK 58, and support SDK 58 and later only

## Context and Problem Statement

Version 0.1.4 of the module, the latest on npm, is built against Expo SDK 52: its development dependencies are `expo ~52.0.26` and `react-native 0.76.6`, and its peer dependency `react ^18.3.1` stops npm from installing it in an app on SDK 53 or later, which use React 19. The current SDK is 58: `expo` 58.0.19 bundles `react` 19.3.0 and `react-native` 0.88.0, and the module template of `create-expo-module` 58 changes how a module is built, tested and linted. How does the module move to SDK 58, and which SDKs does its next release support?

## Decision Drivers

* Users of the module build their apps on the current SDK.
* Each change is small enough to be reviewed on its own.
* One maintainer tests the module by hand, on two Android devices, since Nearby Connections needs two endpoints; each test round is costly.
* The npm package follows Semantic Versioning ([GOVERNANCE](../GOVERNANCE.md#documentation)).

## Considered Options

* Upgrade in place, straight to SDK 58
* Upgrade in place, one SDK at a time, from 53 to 58
* Generate a new module from the SDK 58 template and move the code into it

## Decision Outcome

Chosen option: "Upgrade in place, straight to SDK 58", because no release is made for SDKs 53 to 57, so their intermediate states would cost test rounds without reaching any user, and because changing the existing module one file at a time, each file aligned with the SDK 58 template, keeps both the history and the size of each change readable.

The next release supports SDK 58 and later only. Its peer dependency on `expo` is `>=58.0.0`; the one on React 18 is dropped, and `react` and `react-native` take any version, as in the SDK 58 template, since an Expo SDK fixes them. Apps on an older SDK keep version 0.1.4. Dropping those SDKs breaks compatibility, so the next release is 0.2.0, as Semantic Versioning allows a breaking change in a minor release before 1.0.0.

How the module is built, tested and linted under SDK 58 is a decision of its own, recorded in a later ADR.

### Consequences

* Good, because each change of the upgrade is one file, or one group of files that only work together, aligned with the SDK 58 template.
* Good, because one round of tests on devices covers the whole upgrade.
* Good, because version 0.1.4 stays on npm for apps on older SDKs.
* Bad, because a defect introduced between SDK 52 and SDK 58 is found only at the end, among six SDKs' worth of changes, and cannot be traced to one SDK.
* Bad, because an app on SDK 57 or older gets no fix released after 0.1.4.
* Bad, because SDK 58 removed the index signature that let `NativeModule` accept any property, so `ExpoGoogleNearbyConnectionModuleClass` now declares each function of the native module and exists only as a type, no longer as a value at runtime, a second breaking change of 0.2.0.

### Confirmation

This ADR becomes `accepted` in the change that updates the dependencies of the module to SDK 58. The decision is confirmed when the module builds in the example app on SDK 58 and the test on two devices passes; the release notes of 0.2.0 state that SDKs older than 58 are no longer supported.

## Pros and Cons of the Options

### Upgrade in place, one SDK at a time, from 53 to 58

* Good, because each step is smaller, and a defect can be traced to the SDK that introduced it.
* Bad, because it needs six rounds of builds and tests on devices, for versions that no release would ever reach.

### Generate a new module from the SDK 58 template and move the code into it

* Good, because the result matches the template exactly.
* Bad, because the upgrade becomes one large change, which cannot be reviewed step by step.
* Bad, because the history of each file starts again, unless the files are moved back over the old ones by hand.

## More Information

The SDK 58 versions come from the npm registry: [`expo` 58.0.19](https://www.npmjs.com/package/expo/v/58.0.19), whose `bundledNativeModules.json` lists the bundled versions, and [`expo-module-template` 58.0.8](https://www.npmjs.com/package/expo-module-template/v/58.0.8), the template that `create-expo-module` 58 generates modules from.

The consequence on `ExpoGoogleNearbyConnectionModuleClass` was added on 2026-10-27, after this ADR was accepted, when the upgrade showed it; it changes no part of the decision.
