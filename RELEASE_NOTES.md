# Sarf Beginners v10.1.1 — Release Notes

## What changed in this maintenance update
- Added the passive past and passive present to each eligible verb detail/card; these are separate from the passive participle (**اسم مفعول**).
- Added 1,812 pattern-generated passive finite cells across 906 entries. Twenty-seven rows are marked as not normally passivized.
- Fixed the Form-IV imperatives of the hamzated-final roots قرء and نبء: `أَقْرِئْ` and `أَنْبِئْ` (original source transcription retained separately).
- Corrected contracted geminate passive generation for Forms III, IV, VI, VIII, and X. Regression examples include `حُوجِجَ / يُحَاجَجُ`, `أُحِبَّ / يُحَبُّ`, `اُضْطُرَّ / يُضْطَرُّ`, and `اُسْتُحِقَّ / يُسْتَحَقُّ`.
- More Practice covers five finite forms: active past, active present, imperative, passive past, and passive present. It excludes nominal forms, multi-form strings, and choices that are not safe single strings.
- Questions do not display the target past form in the prompt; choices are distinct and shuffled.
- Corrected 25 reviewed active finite-form source-number/field pairs, plus six reviewed nominal spellings, while preserving source transcriptions.
- CSV includes generated passive fields and status. The app searches the new passive forms and handles the missing source number 932 correctly.

## Important morphology note
The source PDF supplies the original six fields but does not supply the passive finite forms added here. These passive māḍī/muḍāriʿ cells are generated from standard pattern rules and are not individually dictionary-attested for every one of the 933 lexical entries. Some verbs are intransitive/reflexive or lexically restricted, even when a formal pattern is mechanically constructible. The app labels the forms as generated and explicitly marks the rows for which a routine passive is not supplied.

## Source preservation
The original source transcription is preserved in `forms[*].source`. Corrected release values live in `forms[*].finalForm`. Passive finite forms live separately in `passiveVerbForms`, not in `forms.passive`.
