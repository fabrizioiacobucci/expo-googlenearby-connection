# Contributing to expo-googlenearby-connection

How to contribute to this repository, the rules that every change follows, how to set up the environment, and how to test a change.

## How to contribute

- Bugs, questions, feedback and proposals SHOULD be reported in the [issues](https://github.com/fabrizioiacobucci/expo-googlenearby-connection/issues), except security problems, which [SECURITY.md](SECURITY.md) routes.
- Changes MUST be sent as pull requests to the `develop` branch; `main` receives `develop` at each release.
- Every commit MUST carry a `Signed-off-by` line, by which its author certifies the [Developer Certificate of Origin](https://developercertificate.org/) (`git commit -s`), except the merge commits that GitHub creates for pull requests. This is an addition to the framework's [contribution rule](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/LICENSE-POLICY.md#contributions).
- Commit messages MUST follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), with the same exception; a breaking change of the public API is marked with `!` and a `BREAKING CHANGE` footer. This is an addition to the framework's [commit rule](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/CONVENTIONS.md#commits).
- The versions of the npm package follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html), over the public API that [docs/REFERENCE.md](docs/REFERENCE.md#public-api) declares.

## What a change needs

A change SHOULD, before it is merged:

- pass the checks of what it touches, listed in [Tests](#tests), and the tests on devices when it touches the native code;
- meet the "Changes" criteria of the [DEFINITION-OF-DONE](docs/DEFINITION-OF-DONE.md): update in the same change every document it makes inaccurate, [docs/REFERENCE.md](docs/REFERENCE.md) included, add the changes that users notice, breaking changes first, to the "Unreleased" section of [docs/CHANGELOG.md](docs/CHANGELOG.md), and include an ADR for each significant architectural decision ([arc42 section 9](docs/architecture/09-architecture-decisions.md));
- use the terms of [docs/GLOSSARY.md](docs/GLOSSARY.md), and update it when the change adds a term or changes its meaning;
- follow the code style of the repository: TypeScript formatted by Prettier with `.prettierrc`, linted by ESLint with `eslint.config.cjs`, and every exported function with a synopsis that states its parameters and what it returns.

## Setting up the environment

- **Module:** Node.js 22.13 or later, as React Native 0.88 and Expo SDK 58 require. From the repository root, `npm install` installs the dependencies and builds the module into `build/`.
- **Example app and native code:** the Android SDK, with compile SDK 37, which React Native 0.88 sets for the app, a JDK 17, and two Android devices, since Nearby Connections needs two endpoints. The app in `example/` uses the module from this repository, as built in `build/`:
  1. from the repository root, `npm install`, then `npm run build` after each change to `src/`; run in a terminal without `CI=1`, `npm run build` keeps rebuilding on each change;
  2. from `example/`, `npm install`, then `npx expo run:android` on each device.

## Tests

### Checks

Contributors SHOULD run the checks of what the change touches, and SHOULD say in the pull request which ones failed, if any. No continuous integration runs them yet.

- The module, from the repository root: `CI=1 npm run build`, `npm run lint` and `npm test`.
- The example app, from `example/`, once the module is built: `npx expo-doctor`, `npx tsc --noEmit` and `npx expo export --platform android`.
- The links of the Markdown files: `scripts/check-links.sh` of [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple/tree/v0.2.0/scripts), at tag `v0.2.0`, run on a copy of the files that git tracks, since it also reads `node_modules/`.

### Test policy

- A change to `src/` SHOULD add or update, in `src/__tests__/`, the tests of the behaviour it changes. The tests call the public API, from `src/index.ts`, and replace the native module, `src/ExpoGoogleNearbyConnection.ts`, with a test double, as `src/__tests__/streams.test.ts` does.
- The tests in `src/__tests__/` do not run the Kotlin code. A change to `android/`, or to how a function calls the native module, SHOULD also pass the tests on devices below, and the pull request SHOULD say which steps passed, on which Android versions.

### Tests on devices

With the example app on two devices, A and B:

1. **Build:** from `example/`, `npx expo prebuild --clean` and `npx expo run:android` build with no Kotlin or Gradle errors.
2. **Permissions:** on Settings, "Request permissions" shows the permission dialogs, and the badge reads "Permissions granted" once they are granted, with the location services on.
3. **Advertising and discovery:** "Start advertising" on A and "Start discovering" on B show A's endpoint under "Endpoints" on B; "Stop advertising" and "Stop discovering" stop them.
4. **Connection:** on B, the button with A's endpoint ID requests a connection; on Connections, "Accept" under "Connections out" on B and under "Connections in" on A opens it, and it shows under "Active connections" on both; "Disconnect" closes it.
5. **Payloads:** on Payloads, bytes ("Send text"), a file ("Pick file", then "Send file") and a stream ("Init stream", then "Send stream") reach B, and their transfer reaches `SUCCESS`.
