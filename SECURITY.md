# Security policy

How to report a security problem in expo-googlenearby-connection, and what happens next.

## What to report, and where

This repository holds an Expo module, published on npm, that exposes the Google Nearby Connections API of Google Play services to JavaScript on Android ([README](README.md)).

- Reporters SHOULD report privately:
  - a vulnerability in the module, in its JavaScript API or in its Android native code, such as a way for a nearby device to receive payloads or files that it should not, to read data of the app, or to make the app crash;
  - any sign that the repository or the npm package has been tampered with, or that a maintainer's account has been compromised;
  - a secret or personal data found in the repository or its history.
- Reporters SHOULD report in the [issues](https://github.com/fabrizioiacobucci/expo-googlenearby-connection/issues) a bug that is not a security problem.
- Reporters SHOULD report a vulnerability in a dependency, such as Expo or Google Play services, to that project.

## How to report privately

Reporters SHOULD use [Report a vulnerability](https://github.com/fabrizioiacobucci/expo-googlenearby-connection/security/advisories/new) in this repository. Only the maintainers and the reporter see the report. It needs a GitHub account; this repository has no other private channel.

## First response

The maintainers MUST send a first response to a private report within 14 days.
