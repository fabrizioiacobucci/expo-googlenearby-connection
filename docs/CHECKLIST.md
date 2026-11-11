# Checklist

The adopter's record of its level, of the state of its required documents, and of the decisions that the framework's [GOVERNANCE][governance] asks it to log. The framework's GOVERNANCE says which role fills in each part, and when.

## Level

Level: passing

The level is written after `Level:` as one word: `passing`, `silver` or `gold`.

## Register

| Document | Status | Reviewed |
|---|---|---|
| `GOVERNANCE` | `active` | 2026-11-10 |
| `README` | `active` | 2026-11-10 |
| `CONTRIBUTING` | `active` | 2026-11-10 |
| `SECURITY` | `active` | 2026-11-10 |
| `REFERENCE` | `active` | 2026-11-10 |
| arc42 section 8 | `active` | 2026-11-10 |
| arc42 section 9 | `active` | 2026-11-10 |

- The register MUST have one row per required document ([DOCUMENTS-INDEX][index]), except `CHECKLIST` and `DEFINITION-OF-DONE`, which are copies of framework documents; `LICENSE`, which holds licence texts; `CHANGELOG`, which grows with each release; and the dependency manifest, which the ecosystem's tools keep.
- **Document** is the name that DOCUMENTS-INDEX gives it, such as `README` or arc42 section 8.
- **Status** MUST be one of:
  - `draft`: the document is missing, or does not yet hold what the level requires;
  - `active`: the document holds what the level requires;
  - `retired`: the document is no longer required; its row MUST stay.
- A document marked `active` that is found not to hold what the level requires is `draft`, as the definition above says. Its Reviewed date stays unchanged, unless the finding comes from a review of the whole document, such as the periodic checks of the framework's GOVERNANCE.
- **Reviewed** is the date of the last review of the whole document, not of its last change; it is empty until the first review. Only such a review sets it: a change of status, to `active` included, leaves it unchanged.

## Log

| Date | Entry | Reason |
|---|---|---|

## Links

Replace `TAG` with the adopted framework tag.

[governance]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.3.0/framework/GOVERNANCE.md
[index]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.3.0/framework/DOCUMENTS-INDEX.md
