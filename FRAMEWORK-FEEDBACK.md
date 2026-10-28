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

## 6. Unclear whether decisions made before adoption need an ADR

- **Date**: 2026-10-27
- **Rule**: [DOCUMENTS-INDEX, Passing](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md#passing), arc42 section 9 row, and [DEFINITION-OF-DONE, Changes](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DEFINITION-OF-DONE.md#changes)
- **Finding**: DOCUMENTS-INDEX asks for "one ADR per significant architectural decision, written when the decision is made", which read literally includes the decisions made before adoption, while DEFINITION-OF-DONE asks for an ADR only in the change that makes a decision. Only the framework's own ADR 0006 says that the rule asks for no ADR of past decisions. This repository chose to write none, and says so in its arc42 section 9.
- **Impact**: an adopter with a history of decisions cannot tell, from the framework documents, whether arc42 section 9 can be `active` without ADRs for them.
- **Proposal**: state in DOCUMENTS-INDEX that ADRs of decisions made before adoption MAY be written, and that section 9 says which decisions have none.
- **Status**: `open`

## 7. No rule for ADRs proposed before the change that makes the decision

- **Date**: 2026-10-27
- **Rule**: [DEFINITION-OF-DONE, Changes](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DEFINITION-OF-DONE.md#changes) and [DOCUMENTS-INDEX, Passing](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md#passing), arc42 section 9 row
- **Finding**: ADR 0001 of this repository was committed with status `proposed`, before the changes that carry out the upgrade, so that the maintainer could review the decision on its own. The framework asks that "a change that makes a significant architectural decision MUST include its ADR" and that the ADR be "written when the decision is made", but does not say whether an ADR may come first as `proposed`, which change then counts as the one that makes the decision, or when its status becomes `accepted`.
- **Impact**: an adopter that reviews decisions before carrying them out cannot tell whether it follows the rule, and two adopters can date the same kind of decision differently.
- **Proposal**: state that an ADR MAY be committed as `proposed` before the change that carries out its decision, and that this change sets it to `accepted`, with the date of acceptance.
- **Status**: `open`

## 8. The link checker also reads ignored files, such as `node_modules/`

- **Date**: 2026-10-27
- **Rule**: [README, Adopting the framework](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/README.md#adopting-the-framework), with entry 5
- **Finding**: once the dependencies of this repository were installed, `scripts/check-links.sh` of the framework checked every Markdown file under `node_modules/`, reported hundreds of broken links in third-party READMEs, and ran for minutes. It skips only `.git/`, not the files that git ignores. This repository now runs it on a copy of the files that git tracks or would add.
- **Impact**: an adopter with installed dependencies, which is almost every software project, gets a failing check that says nothing about its own documents.
- **Proposal**: have the link checker read only the files that `git ls-files` lists, or skip the paths that git ignores.
- **Status**: `open`

## 9. No rule for changing an accepted ADR

- **Date**: 2026-10-27
- **Rule**: [CONVENTIONS, ADRs](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/CONVENTIONS.md#adrs) and [GLOSSARY, ADR](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/GLOSSARY.md)
- **Finding**: after ADR 0001 of this repository was accepted, carrying it out showed a consequence it did not list: the module class became a type only, a breaking change. The framework says nothing on whether an accepted ADR may be edited. The source that GLOSSARY cites, Nygard 2011, only says that a reversed decision is kept and marked as superseded. This repository added the consequence to the accepted ADR and noted in its More Information when and why.
- **Impact**: adopters cannot tell whether to edit an accepted ADR, write a new one, or leave the consequence unrecorded, so the same event is recorded differently from one adopter to another.
- **Proposal**: state that an accepted ADR MAY be edited to add consequences or information that leave its decision unchanged, with a note of the date and the reason, and that a change to the decision itself needs a new ADR that supersedes it.
- **Status**: `open`

## 10. Unclear whether releases made before adoption need release notes

- **Date**: 2026-10-27
- **Rule**: [DEFINITION-OF-DONE, Releases](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DEFINITION-OF-DONE.md#releases) and [DOCUMENTS-INDEX, Passing](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md#passing), `CHANGELOG` row
- **Finding**: this module had five releases on npm, 0.1.0 to 0.1.4, before it adopted the framework, and none had release notes. DEFINITION-OF-DONE says that "every release MUST have release notes in `CHANGELOG`", and DOCUMENTS-INDEX asks `CHANGELOG` for release notes, without saying whether this covers the releases made before adoption. This repository started its `CHANGELOG` with the unreleased changes and a sentence saying that the earlier versions have none.
- **Impact**: an adopter with past releases cannot tell whether it must reconstruct their notes from the history before its next release, and the same question as entry 6 arises for each rule that applies "at each release".
- **Proposal**: state, as for ADRs, that the release rules apply to the releases made after adoption, and that the `CHANGELOG` MAY say that earlier releases have no notes.
- **Status**: `open`

## 11. No guidance on a glossary of the adopter's terms

- **Date**: 2026-10-28
- **Rule**: [DOCUMENTS-INDEX](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md) and [GLOSSARY](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/GLOSSARY.md)
- **Finding**: the framework keeps a glossary of its own terms and requires, for its own documents, that each term be used in its canonical form, but DOCUMENTS-INDEX asks no adopter, at any level, for a glossary of its own terms, nor says where one would go. This repository wrote its REFERENCE with terms such as endpoint name, endpoint info and payload ID before it had a glossary, and then added `docs/GLOSSARY.md`, in the framework's format, with a rule in its CONTRIBUTING to keep it current.
- **Impact**: an adopter finds out late that its documents use several words for one thing, or one word for several, and has to rebuild the glossary from documents already written.
- **Proposal**: state that an adopter MAY keep a `GLOSSARY` in `docs/`, in the format of the framework's GLOSSARY, and SUGGESTED that each change that adds a term updates it; or require it from a level, as arc42 section 12 does.
- **Status**: `open`

## 12. Unclear where an adopter states the meaning of the BCP 14 keywords

- **Date**: 2026-10-28
- **Rule**: [CONVENTIONS, Requirements](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/CONVENTIONS.md#requirements) and [GLOSSARY, BCP 14 keywords](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/GLOSSARY.md#requirements-and-quality)
- **Finding**: CONVENTIONS says that "an adopter SHOULD write requirements with BCP 14 keywords", but not where the adopter states what the keywords mean, as [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) asks each document that uses them to do. The framework states it in its own GLOSSARY, which adopters are not asked to have (entry 11). This repository had used the keywords in two documents only, and written other requirements in plain words; it now uses them in every project document, and states their meaning once, in its `docs/GLOSSARY.md`, which its README links for every project document.
- **Impact**: an adopter writes requirements whose strength a reader cannot tell, or repeats the statement of RFC 8174 in each document.
- **Proposal**: state where an adopter declares the meaning of the keywords, for example once in a glossary or in the README "This repository" section, linked from the documents that use them.
- **Status**: `open`
