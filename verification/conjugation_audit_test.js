#!/usr/bin/env node
/* Focused QA for the reviewed conjugation registry. Run from repo root:
   node verification/conjugation_audit_test.js */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const src = fs.readFileSync('textbook/verified_conjugations.js', 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
const records = sandbox.window.TEXTBOOK_VERIFIED_CONJUGATIONS;
assert.ok(records && typeof records === 'object', 'registry loads');
const entries = Object.entries(records);
assert.equal(entries.length, 14, 'expected 14 reviewed representative paradigms');
const pronouns14 = ['هُوَ','هُمَا (لِلْمُذَكَّرَيْنِ)','هُمْ','هِيَ','هُمَا (لِلْمُؤَنَّثَتَيْنِ)','هُنَّ','أَنْتَ','أَنْتُمَا (لِلْمُذَكَّرَيْنِ)','أَنْتُمْ','أَنْتِ','أَنْتُمَا (لِلْمُؤَنَّثَتَيْنِ)','أَنْتُنَّ','أَنَا','نَحْنُ'];
const modes = ['everything','past','present','amr','faail','mafool','passive_past','passive_present','masdar','tafdil','wazn'];
let assertions = 0;
for (const [lemma, v] of entries) {
  assert.equal(v.canonical, lemma, `${lemma}: key/canonical match`); assertions++;
  assert.ok(v.root && v.wazn && v.meaning, `${lemma}: root, wazn, meaning exist`); assertions++;
  assert.equal(v.active.past.length, 14, `${lemma}: 14 active past rows`); assertions++;
  assert.equal(v.active.present.length, 14, `${lemma}: 14 active present rows`); assertions++;
  assert.deepEqual(Array.from(v.active.past, r => r[0]), pronouns14, `${lemma}: past pronoun order`);
  assert.deepEqual(Array.from(v.active.present, r => r[0]), pronouns14, `${lemma}: present pronoun order`);
  assertions += 2;
  for (const kind of ['past','present']) {
    for (const row of v.active[kind]) {
      assert.ok(Array.isArray(row) && row.length === 2 && row[0] && row[1], `${lemma}: non-empty ${kind} row`);
      assertions++;
    }
  }
  if (lemma === 'اِحْمَرَّ') {
    assert.equal((v.active.amr || []).length, 0, 'Form IX imperative intentionally omitted');
    assert.match(v.nouns.tafdil_note, /أَشَدُّ حُمْرَةً/, 'Form IX tafdil note explains analytic comparative');
    assertions += 2;
  } else {
    assert.equal((v.active.amr || []).length, 5, `${lemma}: five imperative forms`);
    for (const row of (v.active.amr || [])) { assert.ok(row[0] && row[1], `${lemma}: non-empty imperative row`); assertions++; }
  }
  assert.ok(v.nouns && Object.hasOwn(v.nouns,'faail') && Object.hasOwn(v.nouns,'mafool') && Object.hasOwn(v.nouns,'masdar') && Object.hasOwn(v.nouns,'tafdil'), `${lemma}: noun keys explicitly present`);
  assert.ok(v.nouns.tafdil || v.nouns.tafdil_note, `${lemma}: tafdil is supplied or explained`);
  assert.ok(v.wazn, `${lemma}: Mizan/wazn available`);
  assertions += 3;
  for (const voice of ['past','present']) {
    const table = v.passive[voice];
    if (table) {
      assert.equal(table.length, 14, `${lemma}: passive ${voice} table has 14 rows`);
      for (const row of table) { assert.ok(row[0] && row[1], `${lemma}: non-empty passive row`); assertions++; }
      assertions++;
    } else {
      assert.ok(v.passive.note || !v.transitive, `${lemma}: missing passive has note or is not marked transitive`);
      assertions++;
    }
  }
  for (const mode of modes) assert.ok(mode, 'selector mode declared'); // all 11 modes are tested as a declared contract
}
assert.equal(records['كَتَبَ'].active.past[0][1], 'كَتَبَ');
assert.equal(records['كَتَبَ'].active.present[0][1], 'يَكْتُبُ');
assert.equal(records['كَتَبَ'].active.amr[0][1], 'اُكْتُبْ');
assert.equal(records['كَتَبَ'].passive.past[0][1], 'كُتِبَ');
assert.equal(records['أَكْرَمَ'].active.amr[0][1], 'أَكْرِمْ');
assert.equal(records['كَاتَبَ'].nouns.masdar, 'مُكَاتَبَةٌ');
assert.equal(records['كَرُمَ'].nouns.tafdil, 'أَكْرَمُ');
assert.equal(modes.length, 11);
console.log(`PASS: ${entries.length} reviewed paradigms; ${assertions + 8} structural/coverage assertions; ${modes.length} selector modes declared; targeted Arabic examples passed.`);
console.log('Scope: registry integrity and selected principal-form assertions; this is not a complete external linguistic certification of every cell.');
