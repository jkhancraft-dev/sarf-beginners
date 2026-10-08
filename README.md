# Sarf — Beginners v10

## Release
**v10.0.0 — Qur'an D-Series form-complete release**

This release carries forward the morphology-first design direction of the v9 project and integrates the audited 933-entry D-series dataset.

### Included
- 933 D-series rows (D1–D12; source numbers 1–934, with source #932 blank).
- 5,598 six-form cells.
- Source-print values are preserved in the dataset under `forms[*].source`.
- Audited release values are under `forms[*].finalForm`.
- All six previously held cells are externally resolved; there are now **0 HOLD cells**.
- Harakāt-preserving search by default, with an explicit optional harakāt-insensitive toggle.
- Dedicated **Verbs & Meanings** testing, separate from **More Practice**.
- More Practice tests individual paradigm items.
- Detail view resolves the six-form paradigm and passive complements.

## Verification boundary
The six formerly held cells were resolved using external lexical/Qur'anic evidence. The broader D-series audit already established the six-form morphology layer through source-image review, pattern checks, and manual review.

The source PDF's occurrence counts, English glosses, and example strings remain source-transcribed metadata unless explicitly marked externally verified. They are not silently replaced with a different corpus's values.

### Resolved HOLD cells
- #99 masdar: `صَلَاة` retained for the “he prays” sense; Lane's Lexicon explicitly notes this as the quasi-verbal noun of `صَلَّى` in that sense.
- #248 active: `مُضَارّ` as the standalone paradigm form; `مُضَارٍّ` is an inflected Qur'anic surface form.
- #289 present: `يُبْدِي` for `أَبْدَى` from root `ب د و`.
- #534 masdar: `إِنَارَة` for `أَنَارَ` from root `ن و ر`.
- #604 masdar: `تَصَدٍّ` for `تَصَدَّى`.
- #697 masdar: `تَنَاجٍ` for `تَنَاجَى`.

## Source
Primary D-series source: **All Verbs of the Qur'an**, Understand Al-Qur'an Academy. The source file is retained separately in the project/library.

## File layout
- `index.html` — static GitHub Pages-compatible app.
- `app.js` — search, paradigm detail, meaning quiz, additional morphology practice.
- `styles.css` — responsive UI.
- `data/verbs.json` — 933-row v10 dataset.
