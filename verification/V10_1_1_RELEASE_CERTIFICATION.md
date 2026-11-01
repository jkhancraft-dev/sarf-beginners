# Sarf v10.1.1 Release Certification Summary

Date: 2026-10-12

- 933 dataset entries retained, with original source transcriptions preserved.
- 5,598 original six-field cells retained.
- 25 reviewed active finite-form corrections and 6 nominal spelling corrections documented in `V10_1_CORRECTIONS.csv` (31 total).
- Two especially important Form-IV imperative endings fixed: `أَقْرِئْ` (#470) and `أَنْبِئْ` (#513).
- 906 passive finite pairs are pattern-generated (1,812 cells); 27 rows are marked not normally passivized.
- Corrected passive patterns for contracted geminate roots are regression-tested, including Forms III, IV, VI, VIII, and X.
- The terminal-mark audit covers all 4,665 possible finite slots across 933 rows (active past/present/imperative plus passive past/present); the 54 passive slots with no routine form are recorded as skipped rather than failed.
- Result: 4611 passing/accepted terminal-mark checks, 54 expected skips, 0 flagged failures.

**Boundary:** this is a rules-based final-mark and regression audit, not a qualified human dictionary review of every internal vowel/lexeme. Generated passive forms are not copied from the source PDF and are not individually dictionary-attested for all 933 entries. See `V10_1_PASSIVE_AND_PRACTICE_AUDIT.md` and `V10_1_1_FINITE_ENDING_AUDIT.csv`.
