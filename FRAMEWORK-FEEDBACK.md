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
