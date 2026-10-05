# Ṣarf for Beginners — Version 6

This is a GitHub Pages-ready build. `index.html` is at the package root.

## v6 changes
- Click-based lesson navigation instead of a single scrolling curriculum.
- One lesson screen at a time, with clickable sub-lessons.
- “I understand this lesson” completion control.
- Normal Practice is cumulative and limited to completed curriculum stages.
- “Unlock all questions” is available in Practice and Additional Practice for a full-textbook test mode.
- Medium / Hard / Hardest additional-practice levels remain available.
- About section uses the main Ṣarf textbook as its source and preserves the author's introduction/preface in original Arabic page images.
- Lesson 1 is explicitly framed around Ṣarf and Mīzān al-Ṣarf.
- Beginner-friendly English wording is retained without removing Arabic Ṣarf terminology.
- Correct answers show a green ✓; wrong answers show a red × and feedback sound.
- Service-worker cache bumped to v6.

## Source note
The author's Arabic introduction/preface is displayed as rendered source pages so the original Arabic script and diacritics are preserved rather than relying on unreliable PDF text extraction.

## QA
- `verify_content.js`: PASS
- `final_freeze_check.js`: freeze_allowed = true
- 16 mapped major lessons
- 65 instructional sub-lessons
- 14 indexed patterns
- 196 stored past-tense slots
- 362 source/lexical exercise entries
- 30 additional-practice verbs in the current additional-practice dataset

Known source anomaly retained for audit traceability: `تَعَرَّجُ`. This is flagged by the existing source QA and has not been silently altered.
