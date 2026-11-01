# Sarf — Beginners v10.6

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


## V10.3 implementation/integration stage (not final release)
- Added a separate **Textbook Course** area based on the supplied Version 7 package. It runs in an isolated iframe so its selectors and CSS do not collide with the original V10 app.
- Included the 16-lesson textbook sequence, 14-pattern map, source lesson/exercise dataset, textbook-only practice, the About section and original preface pages, and a dedicated Textbook Verb Conjugator.
- Textbook practice and conjugator lookup use only the textbook verb/example dataset, not Version 7's extra-practice list. Version 10's 933-verb bank and More Practice remain in their own section.
- The Full Textbook Test uses a separate one-way unlock from the V10/additional-practice areas.
- **Next stage:** conjugation verification. **Final browser/regression testing and release certification have not yet been completed.** See `IMPLEMENTATION_INTEGRATION_STATUS.md`.


## V10.3 final package — testing notes
- Includes the reviewed conjugation registry for the 14 textbook pattern-map examples in `textbook/verified_conjugations.js`. The conjugator displays verb-specific paradigms for these examples and does not substitute the abstract pattern table for a selected lexeme.
- The `All Forms` filter keeps the original D1–D12 values internally for compatibility, but shows Arabic pattern labels and standard form names where supported by the source classification. D10 is explicitly described as an additional/irregular group rather than forced into one standard form.
- The textbook service-worker cache includes the verified registry and all four preface pages.
- Verification and limitations are documented in `verification/V10_3_FINAL_TEST_REPORT.md`. Live Chromium browser automation could not be completed in this environment; static, data-integrity, syntax, and DOM-stub runtime checks were performed instead.

## Final test report
See `verification/V10_3_FINAL_TEST_REPORT.md` for checks performed, fixes made, preserved V10 data hashes, scope limits, and the browser-automation limitation.


## V10.4 candidate — mobile usability and QA follow-up

- Improved mobile layouts and tap targets across the main app and textbook.
- Textbook iframe now auto-sizes to reduce nested scrolling and expose the full course page.
- Lesson list explains sequential unlock requirements and shows lesson completion counts.
- Quiz answer instructions and Next-question gating clarify the answer/feedback workflow.
- See `verification/V10_4_RELEASE_QA.md` for what is and is not yet verified.


## V10.5 pre-APK package
- Textbook Course is the first/default main tab; Browse, Verbs & Meanings, and More Practice follow.
- The Full Textbook Test offers Easy, Medium, and Hard levels after the explicit full-access unlock.
- The main verb detail view places core source forms before passive finite forms and uses descriptive form/wazn labels.
- The textbook manifest and service-worker cache namespace are updated to V10.5.
- Read `verification/V10_5_PREAPK_AUDIT.md` before publishing. The candidate passes local automated checks but has not yet had a confirmed 320/390/430px device/preview test.


## V10.6 — Conjugation of Verbs section

- Adds a separate **Conjugation of Verbs** tab while retaining **Textbook Course** as the first/default tab.
- Provides four verb-form groups: Thulāthī (3-letter), Rubāʿī (4-letter), Khumāsī (5-letter), and Sudāsī (6-letter). Each group is filtered by the Sarf textbook's wazan patterns.
- Catalog contains 287 unique verb/root+wazan records assembled from the textbook verb/exercise index and exact textbook examples; includes the six Sudāsī patterns/examples listed on textbook page 19.
- A selected verb launches a four-choice mixed quiz. Questions use exact textbook examples/exercise answers and the 14 reviewed complete paradigms; supported forms include active/passive past and present, imperative, maṣdar, Ism al-Fāʿil, and Ism al-Mafʿūl. Reviewed noun bases can be practised in masculine/feminine singular, dual, and sound plural forms.
- Unsupported forms are not generated or guessed. Verbs with only partial source coverage clearly show that limitation and still support root/wazan/meaning questions.
- New data/core/UI files: `conjugation_data.json`, `conjugation_core.js`, `conjugation.js`; mobile-responsive CSS and version/cache updated to V10.6.
- See `verification/V10_6_CONJUGATION_OF_VERBS_QA.md` for local QA and the remaining mobile/browser release gate.
