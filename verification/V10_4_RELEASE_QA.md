# Sarf Beginners V10.4 — Release QA and Verification Record

**Build status:** V10.4 candidate package prepared for deployment and live retest.  
**Live baseline tested:** Published V10.3 at `https://jkhancraft-dev.github.io/sarf-beginners/`.  
**V10.4 package:** Local static/data checks completed; it has not yet been deployed to GitHub Pages, so no live-browser result is claimed for V10.4 itself.

## 1. Live V10.3 observations (TinyFish browser)

- The published homepage loaded and displayed the V10.3 title, 933-verb dataset count, four main tabs, search/filter controls, and 34 verb groups.
- Main navigation and the Textbook Course iframe opened successfully.
- The textbook contains 16 lesson records, 65 sub-lessons, 14 pattern-map examples, 376 textbook/exercise entries, and a separate 30-verb Additional Practice bank.
- The browser inspected the lesson list and confirmed the intended sequential lock model: Lesson 1 is initially open; later lessons unlock after earlier lessons are completed. Completing only one sub-lesson does not unlock Lesson 2. A focused run marked all five Lesson 1 sub-lessons understood and confirmed Lesson 2 then unlocked.
- Lesson 1 sub-lesson navigation and the “I understand this lesson” control responded. Progress is stored locally on the device.
- The Patterns tab displayed pattern cards and links into the conjugator.
- The conjugator was tested with `كَتَبَ` in Māḍī mode; a 14-person conjugation table appeared and the entry showed `reviewed-pattern-paradigm`.
- The Textbook Practice Questions tab exposed an “Unlock all questions” path and generated question/option buttons. The earlier exploratory browser session did not submit an answer, so scoring/feedback is not counted as verified by that session.
- Arabic script and harakāt appeared readable in the inspected desktop view.

## 2. V10.4 changes made

1. **Mobile layout:** Added narrow-screen rules for header wrapping, full-width search/select controls, horizontally scrollable tabs, larger touch targets, responsive verb cards, readable quiz choices, overflow-safe Arabic tables, stacked conjugator controls, and a mobile-friendly detail modal.
2. **Textbook iframe scrolling:** Added same-origin iframe auto-sizing so the outer page can scroll through the full textbook instead of trapping the reader in a fixed-height nested frame. This should expose all lesson tiles without requiring an inner iframe scroll. This is a code-level change awaiting live viewport verification.
3. **Lesson completeness and clarity:** Kept all 16 lessons and all 65 sub-lessons intact. The lesson screen now states how many lessons are complete and explains that all sub-lessons in the current lesson must be marked understood before the next lesson unlocks. Locked lessons now explain why they are locked.
4. **Quiz interaction clarity:** Added an instruction that answers are checked immediately. The “Next question” button starts disabled and becomes enabled after an answer is selected, reducing accidental skipping. The answer options remain real buttons wired to the existing correct/wrong feedback and score update handler.
5. **Progress count correction:** The dashboard now counts completed lessons only, rather than counting completed sub-lessons as completed lessons.
6. **Cache invalidation:** Updated the textbook service-worker cache key to the V10.4 version so deployed clients can fetch updated assets instead of keeping the previous cached CSS/JS.
7. **Preserved data:** No lesson or verb data was intentionally removed or rewritten. The 933-verb V10 dataset remains the same as V10.3; textbook data and the reviewed conjugation registry remain in place.

## 3. Local checks completed on the V10.4 package

- All JavaScript files passed `node --check`.
- All JSON files parsed successfully.
- All CSV files parsed successfully.
- Direct local asset references in the two HTML entry points resolved in the extracted project.
- Dataset count assertions passed: 16 lessons, 65 sub-lessons, 14 reviewed pattern examples, 362 exercise entries, plus the separate 30-verb Additional Practice bank.
- Existing V10.3 conjugation QA report documents representative paradigm rendering and prior selector/quiz stress tests. Those prior tests are not a substitute for a new V10.4 live-browser test.

## 4. Test matrix

| Area | Status | Evidence / limitation |
|---|---|---|
| V10.3 live homepage and navigation | PASS | Observed in TinyFish browser session |
| Textbook data completeness | PASS (data audit) | 16 lessons / 65 sub-lessons present |
| V10.3 lesson progression | PASS (Lesson 1 → Lesson 2) | Completed all five Lesson 1 sub-lessons in the browser; Lesson 2 unlocked as intended |
| V10.3 conjugator representative example | PASS (one case) | `كَتَبَ` Māḍī displayed 14 forms |
| All 14 reviewed paradigms | PASS in prior V10.3 QA scope | See `V10_3_FINAL_TEST_REPORT.md`; not every one of the 376 entries has a fully reviewed paradigm |
| V10.3 quiz answer/scoring workflow | PASS (2 answers) | Correct/wrong feedback, option disabling, score update, and next-question navigation verified |
| V10.4 JS syntax / data integrity | PASS | Local checks completed |
| V10.4 mobile layout | NOT TESTED in a real browser | Responsive CSS added; must verify after deployment on phone/narrow viewport |
| V10.4 iframe auto-height | NOT TESTED in a real browser | Same-origin resize observers added; needs deployed check |
| V10.4 quiz next-button gating | NOT TESTED in a real browser | Code change completed; needs deployed check |
| Real iOS/Safari device | NOT TESTED | Not available in this execution session |

## 5. Release boundary

This is a **V10.4 candidate package**, not a claim that V10.4 has already been deployed or fully browser-certified. A local headless Chromium smoke test was attempted against the candidate, but the process timed out before producing a DOM dump in this execution environment. The next release gate is to upload/deploy this package, then run the live browser checklist against the V10.4 URL and inspect the app on a real phone. The deployed V10.3 quiz and lesson-progression workflows were verified in follow-up live browser sessions; V10.4-specific mobile/iframe/quiz-gating changes still require the deployed retest. Fix any confirmed failures before calling the release fully verified.
