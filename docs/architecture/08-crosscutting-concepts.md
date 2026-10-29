# 8. Crosscutting concepts

The concepts that apply across this repository: how the module is tested, how it is built, how it is released, and how it reports errors.

## Test strategy

The module has two parts: the TypeScript in `src/`, which apps call, and the Kotlin in `android/`, which calls Google Nearby Connections. The TypeScript has tests that run on any computer; the Kotlin needs the Android SDK and two Android devices, since Nearby Connections needs two endpoints, so it is tested by hand.

| What can go wrong | How it is caught, and by whom | When |
|---|---|---|
| A function of the public API calls the native module wrongly, such as resolving before the native operation completes | The Jest tests in `src/__tests__/`, which call the public API and replace the native module with a test double, run by contributors with `npm test` | Before each change to `src/` is merged |
| The TypeScript does not compile, or breaks a rule of the code style | `npm run build` and `npm run lint`, run by contributors | Before each change to `src/` is merged |
| The Kotlin does not build, or Nearby Connections does not work through the module | The [tests on devices](../../CONTRIBUTING.md#tests-on-devices), with the example app on two devices, run by contributors and by the Maintainers ([GOVERNANCE](../GOVERNANCE.md#roles)) | Before each change to `android/`, or to how a function calls the native module, is merged, and before each release |
| The example app no longer builds against the module or the Expo SDK | `npx expo-doctor`, `npx tsc --noEmit` and `npx expo export --platform android` in `example/`, run by contributors | Before each change to the module or to `example/` is merged |
| A relative link of a Markdown file points to a missing file or heading | The link checker of foss-docs-made-simple, run by contributors | Before each change to a Markdown file is merged |
| A change leaves a project document inaccurate | The change criteria of the [DEFINITION-OF-DONE](../DEFINITION-OF-DONE.md#changes), checked by the Maintainers | Before each change is merged |
| A required document is missing, or the release notes are not written | The release criteria of the [DEFINITION-OF-DONE](../DEFINITION-OF-DONE.md#releases), checked by the Documentation Owner | Before each release |

How to run each check, and which tests a change needs, is in [CONTRIBUTING](../../CONTRIBUTING.md#tests).

Known gaps, which no check covers yet:

- no continuous integration runs the checks;
- no automated test runs the Kotlin code;
- the tests on devices are run by hand, so the versions of Android they cover are the ones that the tester has.

## Build

`npm run build` compiles the TypeScript of `src/` with `tsc` into `build/`, which the package exports, through the scripts in `internal/module_scripts/` that the Expo SDK 58 module template provides ([ADR 0002](../adr/0002-build-test-and-lint-as-the-sdk-58-template.md)). npm runs the same build, through the `prepare` script, when it installs the dependencies of this repository and when it publishes the package.

The Kotlin of `android/` is not built here: the Gradle build of each app that installs the module compiles it, with `expo-module-gradle-plugin`, and takes the compile SDK and the minimum SDK from the app, with 36 and 24 when the app sets neither.

## Release

The module is released as the npm package `expo-googlenearby-connection`, whose content `.npmignore` selects: the build, the TypeScript sources, the Android library, an iOS stub, the module configuration and the documents, without the example app, the tests and the build scripts. Its versions follow Semantic Versioning over the public API that [REFERENCE](../REFERENCE.md#public-api) declares, as [CONTRIBUTING](../../CONTRIBUTING.md#how-to-contribute) states.

A release is made by the Maintainers, when the release criteria of the [DEFINITION-OF-DONE](../DEFINITION-OF-DONE.md#releases) are met and the tests on devices have passed:

1. on `develop`, the version in `package.json` is set, and the "Unreleased" section of the [CHANGELOG](../CHANGELOG.md) becomes the section of that version;
2. `develop` is merged into `main`;
3. the merge commit on `main` is tagged with the version, without a prefix, as the tag `0.1.4` is;
4. the package is published from `main` with `npm publish`.

## Errors

The module reports a failure of Google Nearby Connections through an error event, not by throwing, and a function that returns a value returns `null` after such a failure. [REFERENCE](../REFERENCE.md#conventions) describes this convention.
