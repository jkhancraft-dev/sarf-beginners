# Ṣarf for Beginners — v7 review build

## Changes in v7

- Fixed lesson-to-practice gating: capabilities unlock at the individual lesson level instead of requiring all Māḍī or Muḍāriʿ lessons at once.
- “Unlock all questions” remains available even when normal practice has no eligible questions.
- Renamed major tense lessons to explicitly identify three-, four-, five-, and six-letter verbs.
- Added a multi-purpose Conjugator: enter a verified verb and choose Everything, Māḍī, Muḍāriʿ, Amr, Ism al-Fāʿil, Ism al-Mafʿūl, passive forms, Maṣdar, or Mīzān.
- Added complete expandable paradigms to the main textbook Verb Directory.
- Kept the Form/Pattern system as a reference map rather than pretending that changing a verb’s form preserves its meaning.
- Additional Practice now has separate Easy / Medium / Hard question banks. The level changes the question type and difficulty; levels do not mix.
- Hard questions randomly select a verb and a conjugation slot/pronoun.
- Additional Practice remains a Q&A/testing area for the additional Qur’anic verb set; the textbook Verb Directory is the reference area.
- Removed an obsolete `toggleLesson` global reference that could abort app initialization.
- Bumped the service-worker cache to v7.

## Verification

- JavaScript syntax check: PASS
- App initialization smoke test with DOM stubs: PASS
- Dataset QA: PASS — 14 patterns, 376 textbook/exercise entries, 0 QA issues
- Strict freeze gate: PASS — 0 failures
- Additional-practice structural QA: PASS — 30 verbs, 0 issues

## Important data boundary

The current v7 package retains the existing 30-verb additional-practice dataset. The architecture can generate many questions from those paradigms, but this build does not falsely claim that the entire 127-page Qur’anic-verb PDF has been imported as a complete database.
