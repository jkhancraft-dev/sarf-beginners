# V10.7 — Conjugation quiz corrections

- Selecting any verb in Conjugation of Verbs now starts its quiz and smoothly scrolls to the quiz area.
- Quiz navigation now includes **Back to verb list**, returning to the selected category and wazan/list area.
- Fixed noun inflection generation so Ism al-Fāʿil and Ism al-Mafʿūl keep separate source stems and type labels. For example, for كَتَبَ: Ism al-Fāʿil dual is كَاتِبَانِ and Ism al-Mafʿūl dual is مَكْتُوبَانِ.
- Added regression tests for all six generated gender/number forms for both participle classes, and for noun-type labels across the verb catalog.
- Updated conjugation dataset version and service-worker cache key.

## QA scope

Node syntax and automated dataset/quiz checks are run on this candidate. The automated tests do not certify a live browser viewport or actual Android device; those remain separate acceptance tests before publishing.

## V10.7 — Provisional 287-verb conjugation directory
- Added shared `conjugation_database.json` containing 287 textbook verb records and 14-pronoun finite paradigms.
- Added per-verb conjugation tables to the Conjugation of Verbs study view.
- Added generated finite forms to the existing mixed ṣarf quiz bank.
- Provisional data is visibly labelled and remains subject to later lexical verification.
