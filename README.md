# Sarf — Beginners v10.2

## Release overview
Sarf is a static, GitHub Pages-compatible study tool for the 933-entry D-series verb list from *All Verbs of the Qur’an*.

### Included
- 933 D-series entries (D1–D12; source numbers 1–934, with source number 932 absent in the source list).
- The original six source fields: māḍī, muḍāriʿ, imperative, active participle, passive participle, and maṣdar.
- Separate generated passive finite forms: past passive and present passive, third-person masculine singular.
- Search by source number, root, meaning, and active/passive form, with optional harakāt-insensitive matching.
- Separate **Verbs & Meanings** and **More Practice** sessions.
- More Practice asks only finite-form questions: active past, active present, imperative, passive past, and passive present.
- Cleanly shuffled, distinct answer choices; ambiguous strings are excluded from practice.

## Source preservation and passive-form provenance
- `forms[*].source` preserves the original source transcription.
- Corrected display/practice values are placed in `forms[*].finalForm` and carry a review note/status.
- The source PDF supplies the original six source fields; it does not supply the new finite passive fields.
- `passiveVerbForms` contains pattern-generated third-person masculine singular forms. They are not individually dictionary-attested for every lexical verb; passive use can be restricted for particular verbs.
- Form VII, Form IX, and the marked stative/intransitive D10 entries are labelled as not normally passivized rather than given routine generated forms.

## Verification files
- `verification/V10_1_PASSIVE_AND_PRACTICE_AUDIT.md` — passive and practice audit, regression samples, sources, and limits.
- `verification/V10_1_CORRECTIONS.csv` — source-to-release correction log.
- `verification/V10_1_1_FINITE_ENDING_AUDIT.csv` — terminal-harakat checks on active and generated passive finite forms.
- `verification/V10_1_1_RELEASE_CERTIFICATION.md` — this maintenance release summary.
- `sources/All_verbs-Quran.pdf` — reference PDF used for the original six-field data.

## GitHub Pages layout
Upload the *contents* of `Sarf_v10` into the repository root, so `index.html`, `app.js`, `styles.css`, and `data/verbs.json` are top-level/root-relative as expected by GitHub Pages.


## V10.2 updates
- Explicitly prominent passive māḍī and passive muḍāriʿ in conjugation details.
- Larger morphology labels and Arabic multiple-choice options.
- Grouped meaning-learning/test section, 30 source-ordered verbs per group; each test is restricted to its selected group.
- The original V7 package/theme and exact group mapping were not available in the active project files, so V10.2 preserves V10 structure and uses a compatible blue/white theme rather than claiming an exact V7 clone.

## Group allocation note
The app now exposes Group A–Z and AA–AF (30 verbs per group, with 3 in the final group) in both Browse and Verbs & Meanings. The V7/V6 source package and its historical group allocation were not available in the active project files during this revision, so the group mapping in `data/meaning_groups.json` is a temporary source-order grouping, not a claim that it reproduces V7/V6 exactly. The original verb records and their order are preserved.
