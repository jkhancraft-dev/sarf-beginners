# V11.0 Android and offline QA

## Implemented
- Separate typed-verb quick conjugator in the textbook conjugator area.
- User chooses the exact وزن and presses OK; the output is looked up from the bundled local 287-record conjugation database.
- Form I exposes فَعَلَ / فَعِلَ / فَعُلَ separately because the Form I vowel class is lexically significant.
- The quick conjugator does not fabricate paradigms for entries absent from the database or for a mismatched وزن.
- Compact two-column tables keep pronoun and conjugated form visible together on narrow screens; Arabic font size is reduced modestly.
- Root PWA manifest, icons, and service worker added. Root service worker precaches main scripts, datasets, shared databases, textbook assets, and preface images. Textbook's own service worker has a new cache namespace.

## Automated checks to run before release
- `node --check` all JavaScript files.
- Existing provisional database, conjugation, UI smoke, and conjugator render tests.
- Confirm quick conjugator can find كَتَبَ with Form I فَعَلَ and returns active past/present, imperative, passive paradigms, and stored nominal forms.
- Confirm wrong وزن and unknown verb produce a no-match explanation, not invented output.
- Confirm all `CORE_ASSETS` service-worker paths exist in the package.
- Confirm manifest JSON parses and icon files are present.

## Important limitations
- The quick conjugator is database-backed, not a universal Arabic morphology engine. It supports entries and patterns actually stored in the 287-record provisional database; it cannot safely conjugate every possible triliteral through hexaliteral verb from spelling alone.
- Form I's three vocalic classes are separate options. For a verb not in the database, the learner must not infer its present-tense vowel class from the root alone.
- Offline mode becomes available after the first successful online load and service-worker installation. Browser storage can be cleared by Android/Chrome, in which case a fresh online visit is needed to repopulate it.
- Actual Android handset testing remains required for viewport, PWA installation, offline relaunch, and device-specific rendering. This package has not been tested on the user's physical device.
