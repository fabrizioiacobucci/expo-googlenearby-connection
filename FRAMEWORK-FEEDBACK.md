# Framework feedback

Gaps, blind spots, ambiguities and other problems of [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple) found while this repository adopts it, at framework tag `v0.2.0`. The maintainers review each entry and report it to the framework's [issues](https://github.com/fabrizioiacobucci/foss-docs-made-simple/issues).

Each entry states:

- **Date**: when it was found;
- **Rule**: the framework document or rule concerned, linked at the adopted tag;
- **Finding**: what happened;
- **Impact**: what it costs an adopter;
- **Proposal**: what the framework could do;
- **Status**: `open`, or `reported` with the link to the issue.

## 1. Adopters cannot check their copied documents

- **Date**: 2026-10-27
- **Rule**: [DOCUMENTS-INDEX, Passing](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md#passing), `CHECKLIST` and `DEFINITION-OF-DONE` rows
- **Finding**: `scripts/check-copies.sh` reads the reference documents from `framework/` in the repository it checks, so it only runs in the framework's own repository. An adopter has no tool to check that its copies still match the framework at its tag.
- **Impact**: copies drift without anyone noticing; here they had drifted already (entry 2).
- **Proposal**: let the script take the framework tag or a path to a framework checkout as the reference, and document how an adopter runs it.
- **Status**: `open`

## 2. Nothing protects the copies from formatters

- **Date**: 2026-10-27
- **Rule**: [DOCUMENTS-INDEX, Passing](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md#passing), `CHECKLIST` and `DEFINITION-OF-DONE` rows
- **Finding**: a Markdown formatter, probably the editor's Prettier, padded the tables and re-indented the status list of `docs/CHECKLIST.md` and `docs/DEFINITION_OF_DONE.md`, so they no longer matched the framework's text.
- **Impact**: an adopter that formats on save breaks the "copy" requirement without editing the documents.
- **Proposal**: state whether a copy may differ in whitespace and table layout, or tell adopters to exclude the copies from formatters, for example with a `.prettierignore` entry.
- **Status**: `open`

## 3. No starting text for the "This repository" section and the governance additions

- **Date**: 2026-10-27
- **Rule**: [README, Adopting the framework](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/README.md#adopting-the-framework), steps 3 and 5
- **Finding**: the framework gives no starting text for project documents apart from `CHECKLIST` and `DEFINITION-OF-DONE`, so this repository copied the framework's own project documents. Its README now lists `SECURITY.md`, `AGENTS.md` and `docs/CHANGELOG.md`, which did not exist here, and its `GOVERNANCE` lists additions that only apply to the framework, such as Semantic Versioning for every framework tag.
- **Impact**: an adopter inherits project-specific statements and broken links that look correct at first reading.
- **Proposal**: provide a minimal, adopter-neutral example of the README "This repository" section and of the `GOVERNANCE` "Documentation" section, or warn that the framework's own documents are not templates.
- **Status**: `open`

## 4. A status change outside a review leaves the Reviewed date unclear

- **Date**: 2026-10-27
- **Rule**: [CHECKLIST, Register](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/CHECKLIST.md#register) and [GOVERNANCE, Periodic checks](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/GOVERNANCE.md#periodic-checks)
- **Finding**: `README` was set back from `active` to `draft` because it lacks content that passing requires, without a review of the whole document. The framework defines **Reviewed** as the date of the last review of the whole document, but does not say whether a status change made outside such a review keeps that date, replaces it, or needs a log entry.
- **Impact**: two adopters can record the same event differently, and a reader cannot tell when a status was last changed, or why.
- **Proposal**: state that a status change outside a review keeps the **Reviewed** date, and whether it needs a log entry with its reason.
- **Status**: `open`

## 5. The link checker works for adopters, but they are not told

- **Date**: 2026-10-27
- **Rule**: [README, Adopting the framework](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/README.md#adopting-the-framework)
- **Finding**: `scripts/check-links.sh` of the framework ran unchanged on this repository and found the broken link to `docs/CHANGELOG.md` in the README. The framework does not tell adopters that they can use it. It also does not check file names written as code, such as the `SECURITY.md` that the README listed among the project documents although it did not exist.
- **Impact**: adopters miss a check that costs nothing, and file names written as code can still point to nothing.
- **Proposal**: tell adopters how to run the link checker on their repository, and consider checking file names written as code in the "This repository" section.
- **Status**: `open`
