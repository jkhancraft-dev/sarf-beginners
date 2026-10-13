# Sarf V10.3 — Implementation, Verification and Test Status

- Version 7 textbook course is integrated under `textbook/` in an isolated iframe.
- Version 10's 933-verb data, meaning groups, finite-ending audit, and source PDF remain byte-for-byte unchanged from V10.2.
- Textbook course data contains 16 lessons, 65 sub-lessons, 14 pattern examples, 362 exercise entries, and a separate 30-verb Additional Practice bank.
- Fourteen reviewed lexeme-specific paradigms are loaded from `textbook/verified_conjugations.js`.
- The conjugator does not substitute a generic pattern template for a selected verb's missing paradigm.
- Final static, data-integrity, runtime-stub, quiz, lesson-unlock, and package integrity checks are recorded in `verification/V10_3_FINAL_TEST_REPORT.md`.
- Live Chromium browser navigation timed out in the execution environment; the report clearly records that limitation. Do not interpret static/runtime-stub checks as full visual browser certification.
