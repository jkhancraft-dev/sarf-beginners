# v10 Release Notes

## Completion status
- D-series rows: 933/933 present.
- Six-form cells: 5,598/5,598 populated or explicitly source-marked as no passive.
- Previously held cells: 6 → 0.
- Row-level form status: 933/933 `FORMS_VERIFIED`.
- Source values were not overwritten.

## Integrity rule
The release never treats a source anomaly as if it were the original print. The source remains available in `source`; the audited/release value is stored in `finalForm`.

## Known source-specific cases
Some source cells contain orthographic/diacritic anomalies. These are resolved in `finalForm` while retaining the printed form and a note. The 88 source rows that have no passive participle retain a null/explicit em-dash passive field rather than inventing one.
