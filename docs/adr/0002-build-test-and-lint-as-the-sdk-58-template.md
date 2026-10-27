---
status: proposed
date: 2026-10-27
decision-makers: "@fabrizioiacobucci"
---

# Build, test and lint the module as the SDK 58 module template does

## Context and Problem Statement

The module builds, tests and lints through `expo-module-scripts` 4, the line of Expo SDK 52: its npm scripts call `expo-module build`, `expo-module test` and `expo-module lint`, and `.eslintrc.js` extends the legacy ESLint configuration of that package. Upgrading to SDK 58 ([ADR 0001](0001-upgrade-in-place-to-expo-sdk-58.md)) leaves no version of `expo-module-scripts` meant for modules outside the Expo repository: its README describes it as the scripts of the Expo SDK, its latest version on npm is 56.0.3, and npm marks 56.0.8 as deprecated, an "accidentally published version of SDK 58's internal scripts" that "should not be used for third-party Expo modules". The module template of `create-expo-module` 58 no longer uses it. How does the module build, test and lint under SDK 58?

## Decision Drivers

* Each later SDK upgrade can be done by comparing the module with the template of that SDK.
* The module depends on no package that is deprecated or meant for the Expo repository only.
* Diffs stay readable: no change reformats the existing code as a whole.

## Considered Options

* Follow the SDK 58 module template
* Keep `expo-module-scripts`, at 56.0.3
* Write minimal npm scripts of our own, calling `tsc`, `jest` and `eslint` directly

## Decision Outcome

Chosen option: "Follow the SDK 58 module template", because it is what Expo generates for new modules today, so it is the reference that each later upgrade compares against, and because it removes the dependency on a package that Expo does not maintain for modules like this one.

As in the template of `expo-module-template` 58.0.8:

* the `build`, `clean`, `test`, `prepare` and `open:*` npm scripts run the local scripts in `internal/module_scripts/`, copied from the template;
* the development dependencies are declared directly: `typescript` ~6.0, `jest` ^30 with `jest-expo` ~58 and `@react-native/jest-preset` 0.88.0, `eslint` ~9.39 with `eslint-config-universe` ^16 in a flat configuration, `eslint.config.cjs`, and `prettier` ^3;
* the Jest configuration is in `package.json`.

The one difference from the template is `.prettierrc`: it keeps the style of the existing code, four spaces and double quotes, instead of the template's two spaces and single quotes, so that no change reformats the whole module.

### Consequences

* Good, because each later SDK upgrade starts from a diff between the module and the template of that SDK.
* Good, because the tools the module uses are its own development dependencies, at versions it chooses.
* Bad, because the scripts in `internal/module_scripts/` live in this repository, and an upgrade has to bring in the template's changes to them.
* Bad, because the code style differs from the template, so a file copied from the template has to be reformatted.

### Confirmation

This ADR becomes `accepted` in the change that removes `expo-module-scripts`. The decision is confirmed when `npm run build`, `npm run lint` and `npm test` run with no `expo-module-scripts` installed.

## Pros and Cons of the Options

### Keep `expo-module-scripts`, at 56.0.3

* Good, because it needs no new files in this repository.
* Bad, because its README describes it as the scripts of the Expo SDK, and npm marks a later version of it as not meant for modules outside the Expo repository.
* Bad, because its tools stay at their SDK 56 versions, such as `jest-expo` ~56, behind the SDK the module targets.

### Write minimal npm scripts of our own, calling `tsc`, `jest` and `eslint` directly

* Good, because it is the smallest setup: one line per script, and no files to copy.
* Bad, because it differs from the template, so each later SDK upgrade has to work out what the template changed and whether it applies.

## More Information

The template is [`expo-module-template` 58.0.8](https://www.npmjs.com/package/expo-module-template/v/58.0.8), from which `create-expo-module` 58 generates modules; the deprecation notice is on [`expo-module-scripts` 56.0.8](https://www.npmjs.com/package/expo-module-scripts/v/56.0.8).
