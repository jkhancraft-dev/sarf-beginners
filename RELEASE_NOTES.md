# Sarf Beginners v10.1.1 — Release Notes

## What changed in this maintenance update
- Added the passive past and passive present to each eligible verb detail/card; these are separate from the passive participle (**اسم مفعول**).
- Added 1,812 pattern-generated passive finite cells across 906 entries. Twenty-seven rows are marked as not normally passivized.
- Fixed the Form-IV imperatives of the hamzated-final roots قرء and نبء: `أَقْرِئْ` and `أَنْبِئْ` (original source transcription retained separately).
- Corrected contracted geminate passive generation for Forms III, IV, VI, VIII, and X. Regression examples include `حُوجِجَ / يُحَاجَجُ`, `أُحِبَّ / يُحَبُّ`, `اُضْطُرَّ / يُضْطَرُّ`, and `اُسْتُحِقَّ / يُسْتَحَقُّ`.
- More Practice covers five finite forms: active past, active present, imperative, passive past, and passive present. It excludes nominal forms, multi-form strings, and choices that are not safe single strings.
- Questions do not display the target past form in the prompt; choices are distinct and shuffled.
- Corrected 25 reviewed active finite-form source-number/field pairs, plus six reviewed nominal spellings, while preserving source transcriptions.
- CSV includes generated passive fields and status. The app searches the new passive forms and handles the missing source number 932 correctly.

## Important morphology note
The source PDF supplies the original six fields but does not supply the passive finite forms added here. These passive māḍī/muḍāriʿ cells are generated from standard pattern rules and are not individually dictionary-attested for every one of the 933 lexical entries. Some verbs are intransitive/reflexive or lexically restricted, even when a formal pattern is mechanically constructible. The app labels the forms as generated and explicitly marks the rows for which a routine passive is not supplied.

## Source preservation
The original source transcription is preserved in `forms[*].source`. Corrected release values live in `forms[*].finalForm`. Passive finite forms live separately in `passiveVerbForms`, not in `forms.passive`.


## V10.2 — readability and grouped meanings
- Increased label text for māḍī, muḍāriʿ, amr, ism fāʿil, ism mafʿūl, and maṣdar.
- Arabic MCQ choices use a larger Arabic font comparable to the prompt.
- Added group selection to Verbs & Meanings. Groups contain up to 30 verbs in source order (933 verbs total); the test only draws from the active group.
- Passive finite forms remain separate from اسم المفعول and are explicitly shown in the conjugation detail.
- No easy/medium/hard difficulty controls are included.
- Added `data/meaning_groups.json` and `verification/MEANING_GROUP_ALLOCATION.csv` documenting the 32 current groups and their members.
- Grouping is source-order temporary grouping because the historical V7/V6 allocation file was not available; see README.


## V10.3 — implementation/integration stage only
- Added the Version 7 textbook curriculum under a separate Textbook Course tab, isolated from the existing V10 app.
- Included lesson sequence, pattern map with links to textbook examples, textbook-only practice/unlock flow, course About/preface content, and the Textbook Verb Conjugator surface.
- Version 10's existing Quranic 933-verb dataset was retained unchanged.
- Conjugation verification and final regression/browser tests are deliberately reserved for the next two stages. This package is not certified as a final release.


## V10.3 — textbook integration and final test build
- Integrated the Version 7 course in a separate Textbook Course iframe, preserving the existing Version 10 app and dataset.
- Added 14 reviewed lexeme-specific conjugation records and wired them into the Textbook Verb Conjugator. Missing paradigms remain explicitly unverified; abstract pattern templates are not presented as a selected verb's conjugation.
- Updated the D1–D12 filter labels to descriptive Arabic pattern/form names while preserving their underlying filter values.
- Added the conjugation registry and all preface images to the textbook offline cache.
- Tested syntax, package integrity, dataset QA, conjugator rendering and form assertions, lesson-based unlocking, full-textbook unlock, and separation from the 30-verb Additional Practice bank.
- Browser automation was blocked in the execution environment, so this release note does not claim live-browser certification. See `verification/V10_3_FINAL_TEST_REPORT.md`.

## V10.4 — mobile usability and textbook completion QA
- Updated the main app and textbook styling for narrow screens: improved wrapping, input sizing, tap targets, horizontal navigation, quiz options, conjugation controls, lesson cards, and Arabic table overflow.
- Changed the textbook iframe to auto-size to its same-origin document. The outer app now owns vertical scrolling instead of trapping users inside a short nested frame; this also allows the full 16-lesson catalogue to be visible by scrolling.
- Added stronger keyboard focus indicators and touch interaction hints.
- Corrected the textbook dashboard's completed-lesson count: it now counts completed lessons, rather than counting each completed sub-lesson as a lesson.
- Bumped the textbook service-worker cache key to prevent old V10.3 assets from remaining cached after upgrade.
- Preserved all 933 Quranic verb records, all 16 textbook lessons/65 sub-lessons, the 362 textbook/exercise entries, the 30-verb Additional Practice bank, and the 14 reviewed conjugation registry entries.
- This package is a candidate release for the next live-browser test. Do not describe mobile, all quiz workflows, or all paradigms as fully verified until those tests pass against the deployed V10.4 site.


## V10.5 candidate — navigation and usability pass
- Moved Textbook Course to the first tab in the main navigation.
- Moved version/dataset count to the final right-hand item in the navigation row.
- Added small-screen navigation sizing/overflow refinements and safer flex sizing for search controls and panels.
- This candidate is not yet certified by the mobile/regression browser pass.

## V10.5 focused textbook-test and verb-detail update (2026-10-19)

- Added three difficulty levels to the Full Textbook Test under Textbook Practice Questions.
- Easy: textbook fundamentals, root, pattern/وزن, meaning, basic active past, and basic terminology from māḍī through maṣdar.
- Medium: active past/present/imperative slots, verb-to-pattern identification, and reviewed derived forms.
- Hard: randomized reviewed active/passive conjugation slots and reviewed ism al-fāʿil / ism al-mafʿūl gender-number forms. Pronoun questions identify person, gender, and number explicitly; masculine and feminine dual labels are distinguished.
- Moved core source paradigm ahead of passive finite forms in the 933-verb detail view, and replaced D-series shorthand in the detail header with the form name and corresponding وزن.
- Removed the Ignore harakāt checkbox.
- Textbook Course is the first/default tab; version and dataset metadata stays at the end of the tab row.
- See `verification/V10_5_TEXTBOOK_TEST_QA.md` for scope and limitations.
