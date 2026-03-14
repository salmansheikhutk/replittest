-- Seed initial lessons and exercises (lessons 1–4, exercises 1–5)
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(1, 'Past Tense (Madi)', 'Arabic verbs usually have 3 root letters. The base is 3rd person masculine singular: **Fa''ala** (He did).', 'sarf', 'beginner', 1),
(2, 'Present Tense (Mudari)', 'Starts with prefixes: **Ya-** (He), **Ta-** (You/She), **A-** (I), **Na-** (We). Example: **Yaf''alu** (He does).', 'sarf', 'beginner', 2),
(3, 'Nominal Sentence (Ismiyya)', 'Starts with a noun. Two parts: **Mubtada** (Subject) and **Khabar** (Predicate). Both are **Marfu** (Nominative).', 'nahw', 'beginner', 1),
(4, 'Verbal Sentence (Fi''liyya)', 'Starts with a verb. Main parts: **Fi''l** (Verb) and **Fa''il** (Doer). Fa''il is always **Marfu**.', 'nahw', 'beginner', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(1, 1, 'Base form of past tense?', '{"He did","I did","You did"}', 'He did', '3rd person masculine singular is the root.'),
(2, 1, 'Standard root letter count?', '{"2","3","4"}', '3', 'Most Arabic verbs are triliteral (3 letters).'),
(3, 2, 'Prefix for ''He'' (3rd person)?', '{"Ya","Ta","Na"}', 'Ya', 'Ya- indicates 3rd person masculine singular.'),
(4, 3, 'Sentence starting with a noun?', '{"Ismiyya","Fi''liyya"}', 'Ismiyya', 'Jumla Ismiyya starts with an Ism (noun).'),
(5, 4, 'Grammatical state of the Fa''il (Doer)?', '{"Marfu","Mansub","Majrur"}', 'Marfu', 'The subject/doer of a verb is always nominative.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
