# V10.5 Pre-APK Audit — 2026-10-19

## Candidate scope
This report concerns the local V10.5 ZIP candidate, not an already-published replacement for the live GitHub Pages site.

## Live published URL inspection
URL: https://jkhancraft-dev.github.io/sarf-beginners/

- Page title identifies the site as Sarf — Beginners v10.5 and the visible navigation order is Textbook Course, Browse, Verbs & Meanings, More Practice.
- The published page uses a mobile viewport meta tag. Browser automation reported no horizontal overflow/clipping in the viewport it inspected, but did not provide a confirmed viewport width, so this is not a 320/390/430px certification.
- Search/form filter, verb details, textbook iframe navigation, main tabs, and existing practice controls were exercised by a read-only browser run. The browser tool could not directly inspect the console.
- The published site did **not** show the new Full Textbook Test Easy/Medium/Hard screen. Direct fetch of the live textbook manifest and service worker also showed `Ṣarf V10.4` and `sarf-v10-4-mobile-textbook-verified-conjugator`. This indicates the latest candidate changes have not yet been uploaded/published; it is not evidence that the candidate ZIP lacks the feature.

## Fixes made to this V10.5 package
- Changed `textbook/manifest.json` short name to `Ṣarf V10.5`.
- Changed `textbook/sw.js` cache key to `sarf-v10-5-mobile-full-test`, which makes the service worker install a fresh cache namespace and retire the previous one on activation.

## Automated verification
- `node --check app.js`: PASS
- `node --check textbook/app.js`: PASS
- `node --check textbook/qa.js`: PASS
- `node --check textbook/qa_additional.js`: PASS
- `node verification/conjugation_audit_test.js`: PASS — 14 reviewed paradigms and 817 structural/coverage assertions.
- `node verification/conjugator_render_test.js`: PASS — 154 render executions across 14 reviewed lemmas × 11 modes.
- Randomized Full Textbook Test generator: 200 attempts per level (Easy, Medium, Hard), no generation failures in the focused harness.
- ZIP integrity: PASS.

## Coverage and release limitations
- Hard conjugation questions use only the 14 reviewed full-paradigm records; this package does not claim all 933 Quranic verb records have complete reviewed conjugations.
- Browser console inspection was unavailable.
- The updated candidate itself was not deployed to a separate live preview; therefore a real narrow-viewport browser/device test of the final ZIP is still outstanding.
- Before generating a public APK, upload the **contents** of the `Sarf_v10` directory into the repository root, then verify the published URL has the V10.5 manifest/cache key and Full Textbook Test levels. Finally, test the resulting app on the target Android device for Arabic font rendering, screen rotation, scroll behavior, offline/cache updates, and back navigation.

## Status
**Updated V10.5 pre-APK candidate; automated checks passed, but not certified as flawless or fully mobile-device tested.**
