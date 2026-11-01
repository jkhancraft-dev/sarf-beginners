# Sarf v10 — D-Series Certification

Date: 2026-10-08

## Dataset totals
- D-series rows: **933**
- Source-number span: **1–934**, with source #932 blank
- Paradigm cells: **5,598** (933 × 6)
- Previously held cells: **6**
- Held cells after external lexical resolution: **0**
- Row-level form status: **933/933 FORMS_VERIFIED**

## What was carried forward
The audit bundle supplied the six-form Arabic layer for all 933 D rows, preserving the source transcription and storing audited values separately. Source anomalies were not silently overwritten.

## Six resolved cells
| Row | Field | v10 release value | Resolution |
|---|---|---|---|
| 99 | masdar | صَلَاة | Lane's Lexicon identifies صَلَاة as the quasi-verbal noun of Form II صلّى in the prayer sense. |
| 248 | active | مُضَارّ | The Qur'anic مُضَارٍّ is an inflected surface form; the standalone paradigm is مُضَارّ. |
| 289 | present | يُبْدِي | Dictionaries give أَبْدَى / يُبْدِي / أَبْدِ / إِبْدَاء from root ب د و. |
| 534 | masdar | إِنَارَة | Dictionaries give أَنَارَ / يُنِيرُ / أَنِرْ / إِنَارَة from root ن و ر. |
| 604 | masdar | تَصَدٍّ | Dictionaries give تَصَدَّى / يَتَصَدَّى / تَصَدَّ / تَصَدٍّ. |
| 697 | masdar | تَنَاجٍ | Dictionaries give تَنَاجَى / يَتَنَاجَى / تَنَاجَ / تَنَاجٍ. |

## Data integrity rules
1. `forms[*].source` is immutable source-print/transcription evidence.
2. `forms[*].finalForm` is the v10 release value.
3. `forms[*].note` records corrections or verification rationale.
4. A source row with no passive form remains explicitly unfilled; v10 does not invent a passive participle.

## Remaining provenance boundary
The release is **form-complete**. The source PDF's English glosses, occurrence counts, and example strings are retained as source-transcribed metadata; they are not silently replaced with values from another corpus. This keeps the v10 dataset faithful to the requested source while making the morphology layer releasable.
