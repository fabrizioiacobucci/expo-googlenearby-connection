# Definition of Done

What an adopter checks at each change and at each release, so that its project documents stay complete and current, and its releases meet the framework's licence and signing rules. These criteria add to the adopter's own.

## Changes

- A change SHOULD update, in the change itself, every project document it makes inaccurate. This applies from passing, before the badge asks for current documentation at silver, because a document costs least to update in the change that makes it inaccurate.
- A change that makes a significant architectural decision MUST include its ADR ([DOCUMENTS-INDEX][index], arc42 section 9).
- An adopter SHOULD treat a decision as a significant architectural decision when it affects the structure of the software, its quality characteristics, such as performance or security, its dependencies, its external interface or the interfaces between its building blocks, or its construction techniques, such as a language, a framework or a policy for errors or logging. A decision that only applies an earlier ADR, or a rule that the adopter's project documents already state, is part of that earlier decision.
- From silver, a known defect that makes a project document inconsistent with the current version of the software MUST be tracked like any other defect, and fixed.

## Releases

- A release MUST NOT be made while a required document is missing ([DOCUMENTS-INDEX][index]).
- Every release MUST have release notes in `CHANGELOG`, written as [CONVENTIONS][conventions] requires, unless the adopter omits them as "Continuous delivery" below allows.
- A release MUST NOT be made while a dependency that is part of what the adopter distributes has an incompatible licence ([LICENSE-POLICY][license-policy]).
- At gold, a release MUST NOT be made while a source file lacks the copyright or licence statement that [LICENSE-POLICY][license-policy] requires.
- From silver, every release intended for widespread use MUST be cryptographically signed, and the private signing key MUST NOT be on any site that distributes the software to the public.
- It is SUGGESTED that each release be identified in version control, for example by a git tag.
- From silver, it is SUGGESTED that the important version tags be cryptographically signed, such as those of major and minor releases and of releases that fix publicly known vulnerabilities.

## Continuous delivery

- An adopter whose software is not intended for reuse in several places, such as the software of a single website or service, and that delivers it continuously, MAY omit release notes.
- Such an adopter MUST treat every deployment to users as a release for the other criteria of this document.

## Links

Replace `TAG` with the adopted framework tag.

[index]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md
[conventions]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/CONVENTIONS.md
[license-policy]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/LICENSE-POLICY.md
