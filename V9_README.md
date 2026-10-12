# Ṣarf Beginners v9

GitHub Pages-ready review build.

## v9 changes
- Fixed pattern matching: Form I patterns فَعَلَ / فَعِلَ / فَعُلَ are now kept distinct; other patterns are matched with their harakat intact.
- Pattern cards again use verified example verbs and a Ṣarf-type dropdown: Everything available, Māḍī, Muḍāriʿ, Amr, Ism al-Fāʿil, Ism al-Mafʿūl, passive Māḍī, passive Muḍāriʿ, Maṣdar.
- Verb-directory entries now resolve matching source records, including the richer Qur'anic additional records, so entries such as كَتَبَ can display their stored complete paradigms.
- Added a dedicated **Verbs & Meanings** section between Conjugator and Practice.
- Meaning groups are learned and tested there only; More Practice no longer contains the meaning-test UI.
- Each meaning group has Learn and Test controls; Test is enabled after the group is marked learned.
- More Practice remains reserved for additional Ṣarf/Qur'anic-verb Q&A.
- Search remains available for Arabic, root, meaning and وزن.

## Data integrity note
The app displays only source-backed paradigms that are actually present in the current bundled dataset. It does not fabricate missing conjugations. The current bundled Qur'anic additional dataset contains the 30 fully structured additional verbs from the prior build; the full All_verbs-Quran.pdf corpus is not silently claimed as fully imported in this build.
