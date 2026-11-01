# Conjugation correctness audit — V10.4 focused candidate

## Scope
This audit is deliberately limited to the conjugation registry and conjugator feature. It does not perform mobile, responsive-layout, or general regression testing.

## Registry coverage confirmed by inspection
- 14 reviewed, lexeme-specific paradigms.
- All 14 contain 14-person active Māḍī and Muḍāriʿ tables.
- 13 have five imperative forms; Form IX `اِحْمَرَّ` intentionally has no ordinary productive imperative table.
- Passive Māḍī and Muḍāriʿ tables are supplied only where the registry supports a reviewed passive paradigm. Intransitive/stative examples do not receive fabricated passive tables.
- The selector contains 11 modes: Everything, Māḍī, Muḍāriʿ, Amr, Ism al-Fāʿil/lexical adjective, Ism al-Mafʿūl, Passive Māḍī, Passive Muḍāriʿ, Maṣdar, Ism al-Tafdīl, and Mīzān.
- Ism al-Tafdīl is not mechanically generated for every verb. Each reviewed record supplies either a direct form where appropriate or a note explaining why a contextual analytic expression is needed.
- Mīzān/وزن is supplied for each reviewed example.

## Corrective change made
The conjugator now explains unavailable forms inline, including the intentionally omitted Form IX imperative and absent passive paradigms. It also explicitly describes the 14-example review boundary and reinforces that unsupported forms are not guessed. This prevents an empty-looking result from being mistaken for a broken selector or a confirmed grammatical impossibility.

## Checks
Run from the `Sarf_v10` directory:
`node verification/conjugation_audit_test.js` and `node verification/conjugator_render_test.js`

The scripts check registry load, 14-entry count, 14-person row counts and pronoun order, non-empty forms, imperative coverage, passive table structure, explicit noun/tafḍīl coverage notes, Mīzān availability, and selected principal-form assertions. The render harness executes the actual `renderConjugator()` function for all 14 reviewed lemmas across all 11 selector modes (154 render combinations), and confirms that Mīzān and missing-form explanations appear where expected.

## Limitations — important
- The registry contains 14 reviewed paradigms, not complete reviewed tables for all 933 Qur'anic-dataset verbs or all 362 textbook/exercise entries.
- These automated checks validate data structure and selected forms; they do not certify every Arabic cell against an independent classical reference.
- The 14 paradigms include representative sound, derived, quadriliteral, and Form IX examples, but do not amount to comprehensive coverage of weak verbs (mithāl, ajwaf, nāqiṣ, lafīf), hamzated verbs, or all geminate behaviors.
- Ism al-Tafdīl is lexical/semantic and must not be inferred solely from a verb pattern. The UI intentionally shows a reviewed form or a contextual note.
- No mobile or broader regression testing was performed in this phase.
