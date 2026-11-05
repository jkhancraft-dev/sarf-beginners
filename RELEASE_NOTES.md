# Sarf Beginners V11.0 — offline conjugator and Android layout

- Connected Textbook Verbs “View complete Ṣarf” to the shared provisional 287-verb conjugation database.
- Displays 14-pronoun active past/present and passive past/present tables where available, five imperative forms, and stored lexical forms.
- Kept reviewed textbook paradigms available; provisional records are explicitly labelled.
- Added an explicit OK button to the textbook verb conjugator (Enter key still submits).
- Added a bundled 933-verb data fallback so Browse, Verbs & Meanings, and More Practice populate even when JSON fetch is unavailable.
- Restored automatic rendering of learning groups and practice questions on dataset initialization.

Lexical verification remains a separate future task; generated records are provisional.

## V10.9 deployment consistency fix
- Corrected the landing-page document title and visible header from stale V10.6 to V10.9.
- Updated the navigation release label from V10.8 to V10.9.
- Bumped the textbook service-worker cache name to force clients to refresh the textbook app shell and provisional conjugation database.
- No morphology records or learning content were changed.


## V11.0 — offline conjugator and Android layout
- Added a standalone input-based quick conjugator inside the Textbook Verb Conjugator. It accepts a typed Arabic lemma, a selected وزن (Form I vocalic classes, Forms II–X, and quadriliteral Form I), and an OK action.
- The quick conjugator reads the local 287-record paradigm database. It does not algorithmically invent paradigms for unlisted verbs; unsupported inputs return an explicit no-match message.
- Reduced conjugation table typography slightly and fixed pronoun/form columns to fit the phone width without horizontal scrolling in the textbook and shared conjugation directory.
- Added root PWA manifest, app icons, and root-scope offline service worker. Main data, app files, textbook files, conjugation registries, and textbook page images are precached. First visit still requires internet so the cache can be populated.
- Bumped textbook service-worker cache and updated all visible release labels to V11.0.
