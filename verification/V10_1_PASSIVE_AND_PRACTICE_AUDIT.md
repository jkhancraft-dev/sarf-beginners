# V10.1.1 Passive-Form and Practice Audit

Date: 2026-10-12

## Scope
- Inspected the V10.0 web app, 933-row JSON database, and 933-row CSV export.
- Confirmed the old app used only the six source fields and its quiz drew answer strings directly from all six, including nominal cells and source strings that sometimes contained multiple alternatives or malformed ending marks.
- Added two separate finite passive fields. These are distinct from `forms.passive` (اسم مفعول).

## Counts and structural checks
- Dataset entries: **933/933**.
- Existing source-form cells: **5,598** (unchanged six-field design).
- Active finite fields checked for clean, single-form strings: **2799/2,799** (māḍī, muḍāriʿ, amr × 933).
- Pattern-generated passive finite pairs: **906/933 rows = 1812 cells**.
- Rows marked not normally passivized: **27/933** (D6/Form VII, D8/Form IX, and stative D10 entries).
- Numbering integrity: 933 unique source numbers in range 1–934; source number 932 remains absent, as in the source.
- Corrected source-number/field pairs: **31**; original source transcription retained in `forms[*].source`.
- CSV rebuilt with passive past/present and passive-generation status.

## Reviewed finite-form corrections
| Source no. | Field | Original source string | V10.1.1 release string | Correction note |
|---:|---|---|---|---|
| 50 | `amr` | `حَىٍّ` | `حَيِّ` | Corrected malformed weak/geminate imperative; standard Form-II command is حَيِّ. |
| 101 | `amr` | `صَوِّر` | `صَوِّرْ` | Restored the missing final sukūn on a regular Form-II imperative. |
| 104 | `amr` | `ضَيِّق` | `ضَيِّقْ` | Restored the missing final sukūn on a regular Form-II imperative. |
| 128 | `amr` | `عَوِّق` | `عَوِّقْ` | Restored the missing final sukūn on a regular Form-II imperative. |
| 196 | `amr` | `وَدِّع` | `وَدِّعْ` | Restored the missing final sukūn on a regular Form-II imperative. |
| 202 | `amr` | `وَقِّر` | `وَقِّرْ` | Restored the missing final sukūn on a regular Form-II imperative. |
| 273 | `amr` | `وَاطٍ، وَاطِءْ` | `وَاطِئْ` | Removed an ambiguous comma-separated source string; retained the standard imperative وَاطِئْ for the practice bank. |
| 331 | `amr` | `أَحْىِ` | `أَحْيِ` | Corrected malformed weak imperative to the Form-IV command أَحْيِ. |
| 404 | `amr` | `أَشِر` | `أَشِرْ` | Restored the missing final sukūn on the Form-IV imperative. |
| 408 | `amr` | `أَصِرّ` | `أَصِرَّ` | Restored the final fatḥa on the geminate Form-IV imperative. |
| 425 | `amr` | `أَطِق` | `أَطِقْ` | Restored the missing final sukūn on the Form-IV hollow-verb imperative. |
| 435 | `amr` | `أَعِدَّ/أَعْدِدْ` | `أَعِدَّ` | Replaced a slash-separated pair of alternatives with the standard Form-IV imperative أَعِدَّ. |
| 456 | `amr` | `أَغِر` | `أَغِرْ` | Restored the missing final sukūn on the Form-IV imperative. |
| 470 | `amr` | `أَقْرِ` | `أَقْرِئْ` | Restored the final hamza and sukūn in the Form-IV imperative of the hamzated-final root قرء. |
| 513 | `amr` | `أَنْبِ` | `أَنْبِئْ` | Restored the final hamza and sukūn in the Form-IV imperative of the hamzated-final root نبء. |
| 565 | `amr` | `تَبَرَّء` | `تَبَرَّأْ` | Corrected final hamza seating and restored the imperative sukūn. |
| 568 | `amr` | `تَبَوَّء` | `تَبَوَّأْ` | Corrected final hamza seating and restored the imperative sukūn. |
| 706 | `amr` | `تَوَاعَد` | `تَوَاعَدْ` | Restored the missing final sukūn on the Form-VI imperative. |
| 861 | `past` | `اِسْتَحْيَ` | `اِسْتَحْيَا` | Restored the final alif in the weak Form-X perfect. |
| 861 | `present` | `يَسْتَحْيِيُ` | `يَسْتَحْيِي` | Removed an incorrect explicit ḍamma from the final weak yāʾ. |
| 861 | `amr` | `اِسْتَحِي` | `اِسْتَحْيِ` | Corrected the weak Form-X imperative, including the middle sukūn and final kasra. |
| 903 | `amr` | `اسْتَمِرّ` | `اِسْتَمِرَّ` | Restored the final fatḥa on the geminate Form-X imperative. |
| 905 | `amr` | `اِسْتَنْبِئ` | `اِسْتَنْبِئْ` | Restored the missing sukūn on the final hamza of the Form-X imperative. |
| 918 | `amr` | `اِدْهَامِم` | `اِدْهَامِمْ` | Restored the final sukūn on a lexically attested imperative variant. |
| 921 | `amr` | `اِقْشَعْرِر` | `اِقْشَعِرَّ` | Selected a dictionary-attested imperative variant for the quadriliteral intensive verb. |
| 50 | `active` | `مُحَىٍّ` | `مُحَيٍّ` | Corrected a malformed defective active-participle spelling. |
| 50 | `passive` | `مُحَىًّ` | `مُحَيًّى` | Corrected a malformed defective passive-participle spelling. |
| 289 | `passive` | `مُبْدًی` | `مُبْدًى` | Corrected the weak-ending spelling of the Form-IV passive participle. |
| 331 | `active` | `مُحْىٍ` | `مُحْيٍ` | Corrected the weak-ending spelling of the Form-IV active participle. |
| 331 | `passive` | `مُحْيَا` | `مُحْيًى` | Corrected the weak-ending spelling of the Form-IV passive participle. |
| 861 | `passive` | `مُسْتَحْيً` | `مُسْتَحْيًى` | Restored the missing final weak letter in the Form-X passive participle. |

## Passive-pattern regression samples
These examples cover Forms II, III, IV, V, VI, VIII, X, quadriliteral Form I, the assimilated D12 group, and contracted geminate roots. In this update, several passive outputs for geminate roots were corrected to restore the missing radical or the proper contracted vocalization. The outputs are checked against standard passive pattern tables/examples; this is a regression suite, not individual dictionary certification of all 1,812 generated cells.

| Source no. | Expected past passive | Actual | Expected present passive | Actual | Check |
|---:|---|---|---|---|---|
| 1 | `أُثِّمَ` | `أُثِّمَ` | `يُؤَثَّمُ` | `يُؤَثَّمُ` | PASS |
| 209 | `بُودِرَ` | `بُودِرَ` | `يُبَادَرُ` | `يُبَادَرُ` | PASS |
| 213 | `بُويِعَ` | `بُويِعَ` | `يُبَايَعُ` | `يُبَايَعُ` | PASS |
| 277 | `أُوتِيَ` | `أُوتِيَ` | `يُؤْتَى` | `يُؤْتَى` | PASS |
| 288 | `أُبْدِلَ` | `أُبْدِلَ` | `يُبْدَلُ` | `يُبْدَلُ` | PASS |
| 404 | `أُشِيرَ` | `أُشِيرَ` | `يُشَارُ` | `يُشَارُ` | PASS |
| 564 | `تُبُدِّلَ` | `تُبُدِّلَ` | `يُتَبَدَّلُ` | `يُتَبَدَّلُ` | PASS |
| 658 | `تُبُورِكَ` | `تُبُورِكَ` | `يُتَبَارَكُ` | `يُتَبَارَكُ` | PASS |
| 728 | `اُتُّخِذَ` | `اُتُّخِذَ` | `يُتَّخَذُ` | `يُتَّخَذُ` | PASS |
| 735 | `اُبْتُغِيَ` | `اُبْتُغِيَ` | `يُبْتَغَى` | `يُبْتَغَى` | PASS |
| 845 | `اُسْتُؤْجِرَ` | `اُسْتُؤْجِرَ` | `يُسْتَأْجَرُ` | `يُسْتَأْجَرُ` | PASS |
| 852 | `اُسْتُبِينَ` | `اُسْتُبِينَ` | `يُسْتَبَانُ` | `يُسْتَبَانُ` | PASS |
| 922 | `حُصْحِصَ` | `حُصْحِصَ` | `يُحَصْحَصُ` | `يُحَصْحَصُ` | PASS |
| 924 | `بُعْثِرَ` | `بُعْثِرَ` | `يُبَعْثَرُ` | `يُبَعْثَرُ` | PASS |
| 933 | `اُثُّوقِلَ` | `اُثُّوقِلَ` | `يُثَّاقَلُ` | `يُثَّاقَلُ` | PASS |
| 934 | `اُدُّورِكَ` | `اُدُّورِكَ` | `يُدَّارَكُ` | `يُدَّارَكُ` | PASS |
| 219 | `حُوجِجَ` | `حُوجِجَ` | `يُحَاجَجُ` | `يُحَاجَجُ` | PASS |
| 306 | `أُتِمَّ` | `أُتِمَّ` | `يُتَمُّ` | `يُتَمُّ` | PASS |
| 318 | `أُحِبَّ` | `أُحِبَّ` | `يُحَبُّ` | `يُحَبُّ` | PASS |
| 663 | `تُحُوجِجَ` | `تُحُوجِجَ` | `يُتَحَاجَجُ` | `يُتَحَاجَجُ` | PASS |
| 790 | `اُضْطُرَّ` | `اُضْطُرَّ` | `يُضْطَرُّ` | `يُضْطَرُّ` | PASS |
| 859 | `اُسْتُحِقَّ` | `اُسْتُحِقَّ` | `يُسْتَحَقُّ` | `يُسْتَحَقُّ` | PASS |

## Finite-ending audit (V10.1.1)
- Reviewed the terminal haraka rules for all 2,799 source active finite cells (past, present, imperative) and recorded all active/passive finite slots in `V10_1_1_FINITE_ENDING_AUDIT.csv`.
- A present-form final weak yāʾ can correctly have no written final ḍamma because the indicative ending is estimated; a final-weak imperative instead commonly ends in a short vowel after deletion of the weak radical. Empty terminal marks are therefore assessed by morphology, not filled indiscriminately.
- Fixed two hamzated-final Form-IV imperatives: `أَقْرِ` → `أَقْرِئْ` (#470) and `أَنْبِ` → `أَنْبِئْ` (#513).
- Corrected the pattern handling of contracted geminate roots for Forms III, IV, VI, VIII, and X; regression pairs include `حُوجِجَ / يُحَاجَجُ`, `أُحِبَّ / يُحَبُّ`, `اُضْطُرَّ / يُضْطَرُّ`, and `اُسْتُحِقَّ / يُسْتَحَقُّ`.

## Finite-ending audit (V10.1.1)
- Reviewed the terminal haraka rules for all 2,799 source active finite cells (past, present, imperative) and recorded all active/passive finite slots in `V10_1_1_FINITE_ENDING_AUDIT.csv`.
- A present-form final weak yāʾ can correctly have no written final ḍamma because the indicative ending is estimated; a final-weak imperative instead commonly ends in a short vowel after deletion of the weak radical. Empty terminal marks are therefore assessed by morphology, not filled indiscriminately.
- Fixed two hamzated-final Form-IV imperatives: `أَقْرِ` → `أَقْرِئْ` (#470) and `أَنْبِ` → `أَنْبِئْ` (#513).
- Corrected the pattern handling of contracted geminate roots for Forms III, IV, VI, VIII, and X; regression pairs include `حُوجِجَ / يُحَاجَجُ`, `أُحِبَّ / يُحَبُّ`, `اُضْطُرَّ / يُضْطَرُّ`, and `اُسْتُحِقَّ / يُسْتَحَقُّ`.

## Practice-session safeguards
- More Practice draws only from finite active/passive verbs: active past, active present, imperative, passive past, passive present.
- It does not use the nominal fields اسم فاعل / اسم مفعول / مصدر as though they were finite verbs.
- Multi-form/punctuation strings are excluded from the practice bank.
- Choices must be distinct, are shuffled with Fisher–Yates, and answer capture uses choice indices rather than placing Arabic strings directly in HTML attributes.
- When the target is a past form, the prompt displays the root/meaning instead of revealing the target past form.
- Detail lookup uses `sourceNumber` rather than array index, which keeps the last rows correct despite the missing source #932.

## Morphology / source limitation
The source PDF provides the original six cells only. Passive māḍī and muḍāriʿ are pattern-generated in V10.1.1; the interface labels them as generated, third-person masculine singular forms. Forms VII and IX are normally middle/intransitive and have no routine passive; the rare D10 items are stative/intransitive. Some Forms V/VI and other verbs may be lexically restricted even though the pattern is formable. The generated forms should not be represented as quotations from the source PDF or as individually dictionary-attested for every lexical item.

## External pattern references consulted
- Modern Standard Arabic: “The passive voice” — https://modern-standard-arabic.net/en/ee_chapters/1-the-passive-voice/
- Modern Standard Arabic: “Tables of verbal patterns and nouns”, including weak hollow roots, Forms II–VI — https://modern-standard-arabic.net/en/ee_chapters/tables-of-verbal-patterns-and-nouns/
- Elon.io Arabic Grammar: “Passive of Weak, Hamzated, and Geminate Verbs” — https://elon.io/grammar/arabic-modern-standard/verbs/passive-weak-verbs
- Form VII/Form IX restriction and passive pattern background were cross-checked against grammar summaries at https://elon.io/grammar/arabic-modern-standard/roots-patterns/participle-patterns and https://elon.io/grammar/arabic-modern-standard/verbs/weak-derived-forms
- The review of imperative corrections for اِقْشَعَرَّ and rare ادهامّ followed dictionary/conjugation references: https://tasrif.reverso.net/ and https://www.arabicacademy.gov.eg/.

## Honest residual boundary
The automated tests certify row counts, app field wiring, clean finite practice strings, and the listed pattern-regression examples. They do **not** amount to a human, dictionary-by-dictionary verification of all 933 verbs or all source noun fields. The pre-existing six source forms remain preserved, with focused corrections for the malformed cells identified during this review.
