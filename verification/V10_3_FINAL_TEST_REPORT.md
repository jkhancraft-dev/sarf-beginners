# Sarf Beginners V10.3 — Final Test Report

**Build:** V10.3 GitHub Pages package  
**Scope:** Version 10.2 application/data foundation + isolated Version 7 textbook course + reviewed conjugation registry.

## Summary

The final package passed static syntax checks, JSON/CSV integrity checks, textbook dataset QA, conjugator rendering tests, representative paradigm assertions, quiz-choice stress tests, lesson-progress/unlock tests, package asset checks, and comparison of protected Version 10 data files against the V10.2 source package.

**Browser-test limitation:** direct Chromium headless navigation did not complete in this execution environment (the process timed out during startup/navigation). Therefore this report does not claim a live visual browser test or real-device mobile test. The app was instead exercised through a DOM-stub runtime harness. A real-browser smoke test should still be performed after deployment if the user needs visual/browser certification.

## Package and data integrity

- Version 10 Quranic dataset: 933 records; CSV contains 933 data rows plus header.
- Version 10.2 data files compared byte-for-byte and unchanged:
  - `data/verbs.json`
  - `data/verbs_flat.csv`
  - `data/meaning_groups.json`
  - `verification/V10_1_1_FINITE_ENDING_AUDIT.csv`
  - `verification/MEANING_GROUP_ALLOCATION.csv`
  - `sources/All_verbs-Quran.pdf`
- Textbook app data: 16 lessons, 65 sub-lessons, 14 pattern-map examples, 362 textbook/exercise entries, and a separate 30-verb Additional Practice bank.
- Reviewed conjugation registry: 14 lexeme-keyed entries; active past and indicative present contain 14 rows per entry. Imperative rows are present only where included in the reviewed record. Passive tables are present only for entries with reviewed passive paradigms.
- `qaDataset(DATA)` returned zero issues; `additionalPracticeQA(DATA)` returned zero issues.

## Runtime and interaction checks

- JavaScript syntax checked for all application and service-worker scripts.
- The textbook app scripts initialized in a DOM-stub harness.
- Every one of the 14 reviewed conjugation records rendered with all 11 selector modes (154 selector/render combinations).
- Targeted Arabic form assertions passed for `كَتَبَ`, `أَكْرَمَ`, `بَرْهَنَ`, `اِحْمَرَّ`, and `كَرُمَ`.
- A non-registry textbook verb does not fall back to an abstract pattern as if it were that verb's conjugation.
- A 250-question randomized textbook quiz stress test produced four distinct options per question and did not encounter the missing-`expected_answers` runtime error found during testing; that bug was corrected.
- Lesson progression test: after completing L01 and L02, the normal textbook question pool was limited to 30 eligible entries; Full Textbook Test unlocked 376 textbook-index entries (14 pattern examples + 362 exercise entries).
- Textbook full-access flag remains separate from the Additional Practice full-access flag; unlocking the textbook test does not unlock the 30-verb additional bank.
- D1–D12 filter labels now show descriptive form/pattern labels while retaining the original D1–D12 option values used by the filter logic.
- The textbook service-worker asset list includes `verified_conjugations.js` and all four preface page images.
- ZIP integrity check passed after packaging.

## Fixes made during final testing

1. Integrated the Stage 2 reviewed conjugation JSON into the actual textbook app as `textbook/verified_conjugations.js`; before this fix, the Stage 1 ZIP did not load that registry into the conjugator.
2. Added the missing `miniTable()` helper and removed the unsafe abstract `DATA.past_conjugations[v.wazn]` fallback from the conjugator path.
3. Fixed a random quiz crash caused by question-answer getter callbacks assuming every textbook entry contained the same `expected_answers` fields.
4. Updated the service-worker cache key and asset list to include the new registry and preface page 1.
5. Updated D1–D12 visible filter labels and the final package title/notes.

## Linguistic coverage boundary

The complete conjugation tables in the registry cover the **14 representative pattern-map examples** only. The other 362 textbook/exercise entries are kept as source/index records; this release does not claim that every one of those entries has a separately reviewed complete paradigm. When a full reviewed paradigm is absent, the conjugator says so or shows only forms explicitly stored in the source record.

## Remaining limitation

Live browser rendering, real mobile viewport checks, and full regression interaction in a graphical browser were not completed because Chromium navigation timed out in the execution environment. The static/runtime checks above passed, but they are not a substitute for a real-browser smoke test.
