# V10.5 — Textbook Test and Verb Detail QA

## Changes in this candidate

- Added Easy, Medium, and Hard difficulty choices to the Full Textbook Test inside Textbook Practice Questions.
- Easy questions cover textbook fundamentals (Mīzān, root, basic verb forms, maṣdar/derived-form terminology), plus meanings and patterns from the textbook exercise bank.
- Medium questions test active past/present/imperative slots, pattern identification, and reviewed ism al-fāʿil, ism al-mafʿūl, and maṣdar examples.
- Hard questions randomly sample reviewed active and passive Māḍī/Muḍāriʿ tables, Amr, and reviewed derived nouns. Every finite-form question names the specific pronoun row. Dual rows distinguish masculine and feminine; Amr dual prompts explicitly specify the intended gender even where the form is identical.
- Hard derived-noun questions explicitly name masculine/feminine and singular/dual/plural, with dual and sound-plural forms rendered in nominative where applicable.
- Question options are drawn from stored/reviewed forms; missing or unsupported forms are not guessed.
- Main app detail view now presents the core source paradigm first, followed by passive finite forms. Core forms are ordered Māḍī, Muḍāriʿ, Amr, Ism al-Fāʿil, Maṣdar, Ism al-Mafʿūl.
- Verb detail header replaces D-series shorthand with a form label and associated وزن, e.g. `Form II · فَعَّلَ`.
- Removed the Ignore harakāt checkbox and its event dependency.
- Textbook Course is the first tab and is the default visible section; Browse, Verbs & Meanings, and More Practice follow. V10.5 / 933 verbs metadata remains last in the tab row.
- Added responsive one-column difficulty buttons for narrow screens.

## Automated checks

- `node --check` passed for `app.js` and `textbook/app.js`.
- Data/registry loaded for test harness; all 14 reviewed paradigm records available.
- 200 randomized question-generation attempts per level (Easy, Medium, Hard): no generation failures.
- Hard question examples exercised active Māḍī, active Muḍāriʿ, Amr, passive Māḍī, passive Muḍāriʿ, and derived noun gender/number variants.
- Main verb detail ordering and removal of `ignoreHarakat` were statically checked.
- ZIP integrity check passed after packaging.

## Coverage limitation

The textbook data contains 14 reviewed full conjugation paradigms and a larger exercise bank with root, وزن, and meaning data. Hard conjugation questions draw only from reviewed full paradigms; the app does not invent missing paradigms for every indexed verb. More exhaustive linguistic review and actual narrow-viewport browser testing remain necessary before calling the package fully release-certified or APK-ready.

## Browser status

This is a local automated/code QA report. The modified V10.5 candidate has not yet been deployed to a separate preview for live-browser verification. Do not treat this report as confirmation that the new UI has passed a real mobile device test.
