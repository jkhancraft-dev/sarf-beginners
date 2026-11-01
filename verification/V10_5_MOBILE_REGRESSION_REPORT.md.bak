# V10.5 Candidate — Mobile Usability & General Regression Report

Date: 2026-10-13  
Candidate: V10.5 navigation/usability update built from the V10.4 conjugation-audit package.  
Production site tested: https://jkhancraft-dev.github.io/sarf-beginners/ (still V10.4 during this run).

## Changes in the V10.5 candidate

- Main navigation reordered to **Textbook Course → Browse → Verbs & Meanings → More Practice**.
- Added a final right-aligned navigation metadata item: **V10.5 · 933 verbs**.
- Kept the title and existing dataset description in the header; no production changes were made.
- Added responsive navigation sizing, horizontal scrolling for narrow tab rows, safer min-width behavior for controls/panels, and a disabled-button cursor/opacity cue.
- Preserved the existing textbook iframe sizing behavior and conjugation-audit candidate files.

## Live browser regression run — current deployed V10.4

A real browser run visited the public site and exercised the main user flows. Results observed:

| Area | Observed result | Notes |
|---|---|---|
| Header and nav readability | Pass | Version/title and study badge readable. Existing nav order remains Browse → Verbs & Meanings → More Practice → Textbook Course. |
| Main tab switching | Pass | All four sections opened; active-tab state updated. |
| Search and form filter | Pass | Search field, All forms selector and Ignore harakāt checkbox available and usable. |
| Verb cards | Pass | Arabic, root, meaning, passive preview and source metadata rendered. |
| Verb detail overlay | Partial | The test report noted inline section switching; the main verb card modal open/close behavior was not conclusively exercised in this run. |
| Verbs & Meanings | Pass | Groups and meaning table loaded; group test control was present. |
| More Practice | Pass | Four choices displayed; answer selection updated score; Next produced another question. |
| Textbook course sub-tabs | Pass | Seven sub-tabs appeared. |
| Lesson navigation | Pass | Lesson 1 and its five sub-lessons opened and navigated. |
| Conjugator availability | Pass | Input, 11 output modes and Show button appeared. This run verified availability, not the linguistic correctness of every mode. |
| Visible runtime/load errors | None observed | No visible error banners or broken navigation were reported by the browser run. |

Browser run: https://agent.tinyfish.ai/runs/928a23d8-29d5-419b-8e5f-9ec227b979cb

## Mobile-specific verification limitation

The browser result described its overflow check as being on the **main desktop viewport** and did not provide a confirmed emulated viewport width or device metrics. A local Playwright attempt to open the working candidate was blocked by the environment (`ERR_BLOCKED_BY_ADMINISTRATOR` for localhost). Therefore:

- The deployed V10.4 desktop/general flows have been browser-tested.
- The V10.5 candidate's responsive CSS has been statically inspected and its breakpoints are present at 650px, 520px and 380px.
- **A true 390px/320px browser/device run of the V10.5 candidate is not yet verified.** This report does not claim that mobile testing passed.

## Local automated checks on candidate source

- `node --check app.js`: pass.
- `node --check textbook/app.js`: pass.
- Conjugator rendering: 154 real render-function executions across 14 reviewed lemmas × 11 modes — pass.
- Conjugation registry audit: 817 structural/coverage assertions — pass.
- These are code/data-structure checks, not proof of full Arabic linguistic correctness or mobile rendering.

## Release recommendation

Keep this as a **preview candidate**, not production-certified. Deploy V10.5 to a separate preview and confirm it at narrow widths (at minimum 320px, 390px and 430px) before merging. The first-priority navigation and right-end metadata placement are implemented in the package; they are not yet visible on the public V10.4 URL.
