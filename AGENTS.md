# Agents

Instructions for coding agents working in this repository.

- Every commit MUST be signed off with the Developer Certificate of Origin (`git commit -s`), and its message MUST follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), as [GOVERNANCE](docs/GOVERNANCE.md) states.
- This repository is a pilot adopter of [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple) at framework tag `v0.2.0`. When you notice a gap, a blind spot, an ambiguity or any other problem of the framework while adopting it, you MUST add an entry to [FRAMEWORK-FEEDBACK.md](FRAMEWORK-FEEDBACK.md) in the same commit in which it shows up, so that the maintainers can review it later and report it to the framework.

## Before each commit

- You MUST meet the "Changes" criteria of the [DEFINITION-OF-DONE](docs/DEFINITION-OF-DONE.md): update, in the same commit, every project document that the change makes inaccurate, and include an ADR for each significant architectural decision that the change makes ([arc42 section 9](docs/architecture/09-architecture-decisions.md)).
- You MUST follow the project [GOVERNANCE](docs/GOVERNANCE.md) and the framework documents at tag `v0.2.0` that it links, among them GOVERNANCE, CONVENTIONS, LICENSE-POLICY and DOCUMENTS-INDEX: record in the [CHECKLIST](docs/CHECKLIST.md) each change of a document's status, and add each change that users notice, breaking changes first, to the "Unreleased" section of the `CHANGELOG`.
- You MUST use the terms of the [GLOSSARY](docs/GLOSSARY.md), and update it in the same commit when the change adds a term or changes its meaning ([CONTRIBUTING](CONTRIBUTING.md#what-a-change-needs)).
- You MUST run the [checks](CONTRIBUTING.md#checks) of what the change touches, and report any that fails; the link checker reads `node_modules/` too, so run it on a copy of the files that git tracks ([FRAMEWORK-FEEDBACK](FRAMEWORK-FEEDBACK.md), entry 8).
- You MUST follow the [test policy](CONTRIBUTING.md#test-policy). The [tests on devices](CONTRIBUTING.md#tests-on-devices) need the Android SDK and two devices; when the environment has neither, you MUST say so instead of reporting them as passed.
