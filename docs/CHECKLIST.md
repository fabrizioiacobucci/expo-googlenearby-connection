# Checklist

The adopter's record of its level, of the state of its required documents, and of the decisions that the framework's [GOVERNANCE][governance] asks it to log. The framework's GOVERNANCE says which role fills in each part, and when.

## Level

Level: _passing_

## Register

| Document       | Status   | Reviewed   |
| -------------- | -------- | ---------- |
| `GOVERNANCE`   | `active` | 2026-10-26 |
| `README`       | `active` | 2026-10-26 |
| `CONTRIBUTING` | `draft`  | 2026-10-26 |

- The register MUST have one row per required document ([DOCUMENTS-INDEX][index]), except `CHECKLIST` and `DEFINITION-OF-DONE`, which are copies of framework documents; `LICENSE`, which holds licence texts; `CHANGELOG`, which grows with each release; and the dependency manifest, which the ecosystem's tools keep.
- **Document** is the name that DOCUMENTS-INDEX gives it, such as `README` or arc42 section 8.
- **Status** MUST be one of:
    - `draft`: the document is missing, or does not yet hold what the level requires;
    - `active`: the document holds what the level requires;
    - `retired`: the document is no longer required; its row MUST stay.
- **Reviewed** is the date of the last review of the whole document, not of its last change; it is empty until the first review.

## Log

| Date | Entry | Reason |
| ---- | ----- | ------ |

## Links

Replace `TAG` with the adopted framework tag.

[governance]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/GOVERNANCE.md
[index]: https://github.com/fabrizioiacobucci/foss-docs-made-simple/blob/v0.2.0/framework/DOCUMENTS-INDEX.md
