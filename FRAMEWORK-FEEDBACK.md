# Framework feedback

Gaps, blind spots, ambiguities and other problems of [foss-docs-made-simple](https://github.com/fabrizioiacobucci/foss-docs-made-simple) found while this repository adopts it, at framework tag `v0.3.0`. The maintainers review each entry and report it to the framework's [issues](https://github.com/fabrizioiacobucci/foss-docs-made-simple/issues).

Each entry states:

- **Date**: when it was found;
- **Rule**: the framework document or rule concerned, linked at the adopted tag;
- **Finding**: what happened;
- **Impact**: what it costs an adopter;
- **Proposal**: what the framework could do;
- **Status**: `open`, or `reported` with the link to the issue.

The earlier entries, found at the previous framework tag, were reported in the framework issues 6 to 18, all closed by the framework tag above; the [issues](https://github.com/fabrizioiacobucci/foss-docs-made-simple/issues?q=is%3Aissue+is%3Aclosed) hold their history.

## 1. GOVERNANCE writes the role as "Maintainers" and as "the maintainers"

- **Date**: 2026-11-10
- **Rule**: [GOVERNANCE, Roles](https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.3.0/framework/GOVERNANCE.md#roles)
- **Finding**: GOVERNANCE defines the role as "Maintainers", with a capital, and then writes "the maintainers" three times, while "Documentation Owner" always keeps its capitals; the framework's GLOSSARY has no entry for either role.
- **Impact**: a review of this repository's documents flagged "the maintainers" in `SECURITY` as inconsistent with the role, and withdrew the finding only after reading that the framework writes both.
- **Proposal**: write the role one way throughout GOVERNANCE, or say that both forms name the role.
- **Status**: `reported` in [issue 23](https://github.com/fabrizioiacobucci/foss-docs-made-simple/issues/23)

