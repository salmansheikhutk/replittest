-- Add new lessons and exercises
-- Created: 2026-03-13
-- Adds 14 lessons (sarf & nahw across beginner/intermediate/advanced) with 2-3 exercises each

-- Sarf – Beginner (continuing order after existing 2)
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(5, 'Command Form (Amr)', 'The imperative (Amr) is formed from the present tense by removing the prefix and adjusting the beginning. Example: **Yaktub** → **Uktub** (Write!). If the first root letter has a sukun, add a hamzat al-wasl.', 'sarf', 'beginner', 3),
(6, 'Prohibition (Nahy)', 'Prohibition is expressed using **Laa** + the jussive (Majzum) form of the present tense. Example: **Laa taktub** (Don''t write!). The verb keeps its present-tense prefix but loses any final vowel or nun.', 'sarf', 'beginner', 4);

-- Sarf – Intermediate
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(7, 'Verb Forms (Awzaan I–X)', 'Arabic has ten standard verb forms (I–X). Each adds specific meaning to the root. Form I is the base (**Fa''ala**), Form II doubles the middle letter (**Fa''''ala**), Form III lengthens the first vowel (**Faa''ala**), and so on. Learning the patterns helps you predict meaning from any root.', 'sarf', 'intermediate', 1),
(8, 'Doer Noun (Ism al-Fa''il)', 'The active participle indicates the doer of an action. From Form I: **Faa''il** (e.g., **Kaatib** – writer). From derived forms, replace the prefix with **Mu-** and use a kasra before the last root letter (e.g., Form II: **Mu''allim** – teacher).', 'sarf', 'intermediate', 2),
(9, 'Object Noun (Ism al-Maf''ul)', 'The passive participle indicates the one acted upon. From Form I: **Maf''ul** (e.g., **Maktub** – written). From derived forms, replace the prefix with **Mu-** and use a fatha before the last root letter (e.g., Form II: **Mu''allam** – that which is taught).', 'sarf', 'intermediate', 3);

-- Sarf – Advanced
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(10, 'Verbal Noun (Masdar)', 'The masdar is the verbal noun that names the action itself. Form I has many patterns (e.g., **Kitaaba** – writing, **''Ilm** – knowledge). Derived forms have fixed patterns: Form II uses **Taf''il**, Form III uses **Mufaa''ala** or **Fi''aal**, and so on.', 'sarf', 'advanced', 1),
(11, 'Weak Verbs (Fi''l al-Mu''tall)', 'Weak verbs contain a **Waw** or **Ya** as one of the root letters. They change during conjugation: **Qaala** (he said, root: q-w-l) loses its waw in the present (**Yaqul**). Types include Mithal (weak first letter), Ajwaf (weak middle), and Naqis (weak last letter).', 'sarf', 'advanced', 2);

-- Nahw – Beginner (continuing order after existing 2)
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(12, 'The Three Cases (I''rab)', 'Arabic nouns change their endings based on grammatical role. **Marfu''** (nominative, -u) for subjects, **Mansub** (accusative, -a) for objects, and **Majrur** (genitive, -i) after prepositions. Example: **Al-walad-u** (the boy, subject) vs. **Al-walad-a** (the boy, object).', 'nahw', 'beginner', 3),
(13, 'Definite and Indefinite (Ma''rifa/Nakira)', 'An indefinite noun takes **tanwin** (nunation): **Kitaab-un** (a book). Adding **Al-** makes it definite: **Al-Kitaab-u** (the book). Tanwin and Al- never appear together on the same word. Proper nouns are inherently definite without Al-.', 'nahw', 'beginner', 4);

-- Nahw – Intermediate
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(14, 'Idhafa (Possessive Construction)', 'Idhafa links two nouns in a possessive relationship. The first noun (**Mudaf**) loses its tanwin and Al-. The second noun (**Mudaf Ilayh**) takes the genitive case. Example: **Kitaab-u al-mu''allim-i** (the teacher''s book).', 'nahw', 'intermediate', 1),
(15, 'Adjective Agreement (Na''t)', 'Adjectives follow the noun they describe and must agree in four things: **gender**, **number**, **case**, and **definiteness**. Example: **Al-walad-u al-kabiir-u** (the big boy) – both definite and nominative.', 'nahw', 'intermediate', 2),
(16, 'Prepositions (Huruf al-Jarr)', 'Prepositions such as **fi** (in), **min** (from), **ila** (to), **''ala** (on), and **bi** (with/by) make the following noun **Majrur** (genitive). Example: **Fi al-bayt-i** (in the house). The noun after a preposition always takes a kasra or genitive ending.', 'nahw', 'intermediate', 3);

-- Nahw – Advanced
INSERT INTO lessons (id, title, content, category, level, "order") VALUES
(17, 'Conditional Sentences (Jumlat al-Shart)', 'Conditional sentences have a condition (shart) and a response (jawab). With **In** (if), both verbs are in the jussive (Majzum). With **Idha** (when/if), the condition verb is past tense and the response can be past or present. Example: **In tadrus tanjah** (If you study, you succeed).', 'nahw', 'advanced', 1),
(18, 'Emphasis (Tawkid)', 'Emphasis (Tawkid) comes in two types. **Lafzi** (verbal): repeating the word — **Jaa''a jaa''a al-walad** (The boy came, came). **Ma''nawi** (semantic): using words like **nafs-uhu** (himself), **kull-uhum** (all of them), or **''ayn-uhu** (his very self) to emphasize meaning.', 'nahw', 'advanced', 2);

-- Update lesson sequence
ALTER SEQUENCE lessons_id_seq RESTART WITH 19;

-- Exercises for lesson 5: Command Form (Amr)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(6, 5, 'How do you form the imperative from "Yaktub" (He writes)?', '{"Uktub","Aktub","Iktub"}', 'Uktub', 'Remove the prefix Ya-, and since the first root letter has a sukun, add a hamzat al-wasl with a damma: Uktub.'),
(7, 5, 'What must be removed from the present tense to form Amr?', '{"The prefix letter","The root letters","The ending"}', 'The prefix letter', 'The present-tense prefix (Ya-, Ta-, etc.) is removed to form the base of the imperative.'),
(8, 5, 'Which person is the imperative (Amr) used for?', '{"First person","Second person","Third person"}', 'Second person', 'The direct command form is used for the second person (you).');

-- Exercises for lesson 6: Prohibition (Nahy)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(9, 6, 'How do you say "Don''t write!" in Arabic grammar?', '{"Laa taktub","Laa katabta","Maa taktub"}', 'Laa taktub', 'Prohibition uses Laa + the jussive form of the present tense.'),
(10, 6, 'What mood does the verb take after "Laa" of prohibition?', '{"Indicative (Marfu)","Subjunctive (Mansub)","Jussive (Majzum)"}', 'Jussive (Majzum)', 'The Laa of prohibition (Laa al-Nahiya) causes the verb to become Majzum.');

-- Exercises for lesson 7: Verb Forms (Awzaan I–X)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(11, 7, 'What happens to the middle root letter in Form II?', '{"It is doubled","It is removed","It gets a long vowel"}', 'It is doubled', 'Form II (Fa''''ala) doubles the middle root letter, often giving an intensive or causative meaning.'),
(12, 7, 'How many standard verb forms are there in Arabic?', '{"7","10","15"}', '10', 'Arabic has ten standard verb forms (I through X), each with its own pattern and meaning.'),
(13, 7, 'Which form is the base (ground) form?', '{"Form I","Form II","Form IV"}', 'Form I', 'Form I (Fa''ala) is the base form from which all others are derived.');

-- Exercises for lesson 8: Doer Noun (Ism al-Fa'il)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(14, 8, 'What is the pattern for the active participle from Form I?', '{"Faa''il","Maf''ul","Taf''il"}', 'Faa''il', 'The active participle from Form I follows the pattern Faa''il (e.g., Kaatib – writer).'),
(15, 8, 'What prefix is used for the active participle from derived forms?', '{"Mu-","Ma-","Ta-"}', 'Mu-', 'Derived forms use Mu- as a prefix for the active participle, with a kasra before the last root letter.');

-- Exercises for lesson 9: Object Noun (Ism al-Maf'ul)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(16, 9, 'What is the pattern for the passive participle from Form I?', '{"Maf''ul","Faa''il","Fa''iil"}', 'Maf''ul', 'The passive participle from Form I follows the pattern Maf''ul (e.g., Maktub – written).'),
(17, 9, 'What vowel comes before the last root letter in derived-form passive participles?', '{"Kasra","Fatha","Damma"}', 'Fatha', 'In derived forms, the passive participle uses Mu- prefix with a fatha before the last root letter.');

-- Exercises for lesson 10: Verbal Noun (Masdar)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(18, 10, 'Do Form I masdars follow a single fixed pattern?', '{"Yes, always Fa''l","No, they have many patterns","Yes, always Taf''il"}', 'No, they have many patterns', 'Form I masdars are irregular and must be memorized; they follow various patterns.'),
(19, 10, 'What is the masdar pattern for Form II?', '{"Taf''il","Mufaa''ala","Infi''aal"}', 'Taf''il', 'Form II uses the pattern Taf''il for its masdar (e.g., Ta''liim – teaching).'),
(20, 10, 'What does a masdar express?', '{"The action itself as a noun","The doer of the action","The time of the action"}', 'The action itself as a noun', 'A masdar is a verbal noun that names the action without reference to time or doer.');

-- Exercises for lesson 11: Weak Verbs (Fi'l al-Mu'tall)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(21, 11, 'What is a verb with a weak middle root letter called?', '{"Ajwaf","Mithal","Naqis"}', 'Ajwaf', 'Ajwaf verbs have a waw or ya as the middle root letter (e.g., Qaala, root: q-w-l).'),
(22, 11, 'Which letters are considered "weak" in Arabic?', '{"Waw and Ya","Alif and Ha","Ha and Hamza"}', 'Waw and Ya', 'Waw and Ya (and Alif as a transformed form) are the weak letters that cause changes during conjugation.');

-- Exercises for lesson 12: The Three Cases (I'rab)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(23, 12, 'Which case marks the subject of a sentence?', '{"Marfu'' (nominative)","Mansub (accusative)","Majrur (genitive)"}', 'Marfu'' (nominative)', 'The subject (Mubtada or Fa''il) takes the nominative case (Marfu''), marked with -u.'),
(24, 12, 'What ending does a Mansub noun take?', '{"-u","-a","-i"}', '-a', 'The accusative case (Mansub) is marked with a fatha (-a) on the last letter.'),
(25, 12, 'When does a noun become Majrur?', '{"After a preposition","As a subject","As a verb"}', 'After a preposition', 'A noun becomes Majrur (genitive, -i) when it follows a preposition (Harf al-Jarr).');

-- Exercises for lesson 13: Definite and Indefinite (Ma'rifa/Nakira)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(26, 13, 'What does tanwin indicate on a noun?', '{"The noun is indefinite","The noun is definite","The noun is a verb"}', 'The noun is indefinite', 'Tanwin (nunation, e.g., -un, -an, -in) marks a noun as indefinite.'),
(27, 13, 'Can "Al-" and tanwin appear on the same word?', '{"Yes, always","No, never","Only in special cases"}', 'No, never', 'Al- (definite article) and tanwin (indefinite marker) are mutually exclusive on a single word.');

-- Exercises for lesson 14: Idhafa (Possessive Construction)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(28, 14, 'What case does the Mudaf Ilayh take?', '{"Nominative (Marfu'')","Accusative (Mansub)","Genitive (Majrur)"}', 'Genitive (Majrur)', 'The second noun in an Idhafa (Mudaf Ilayh) always takes the genitive case.'),
(29, 14, 'What happens to the Mudaf in an Idhafa?', '{"It loses tanwin and Al-","It gains tanwin","It becomes a verb"}', 'It loses tanwin and Al-', 'The first noun (Mudaf) drops its tanwin and cannot take the definite article Al-.'),
(30, 14, 'What does "Kitaabu al-mu''allimi" mean?', '{"The teacher''s book","A book for teachers","The teacher reads"}', 'The teacher''s book', 'This is an Idhafa: Kitaab (book) is Mudaf, al-mu''allim (the teacher) is Mudaf Ilayh in genitive.');

-- Exercises for lesson 15: Adjective Agreement (Na't)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(31, 15, 'In how many things must an adjective agree with its noun?', '{"2","3","4"}', '4', 'An adjective must agree with its noun in gender, number, case, and definiteness.'),
(32, 15, 'If the noun is definite, what must the adjective be?', '{"Definite (with Al-)","Indefinite (with tanwin)","Either one"}', 'Definite (with Al-)', 'The adjective must match the noun in definiteness, so a definite noun requires a definite adjective.');

-- Exercises for lesson 16: Prepositions (Huruf al-Jarr)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(33, 16, 'What case does a preposition assign to the noun after it?', '{"Nominative (Marfu'')","Accusative (Mansub)","Genitive (Majrur)"}', 'Genitive (Majrur)', 'Prepositions (Huruf al-Jarr) always make the following noun Majrur (genitive).'),
(34, 16, 'Which of the following is a preposition (Harf Jarr)?', '{"Fi (in)","Huwa (he)","Kataba (wrote)"}', 'Fi (in)', 'Fi (in) is one of the common Arabic prepositions, along with min, ila, ala, and bi.');

-- Exercises for lesson 17: Conditional Sentences (Jumlat al-Shart)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(35, 17, 'What mood do both verbs take after "In" (if)?', '{"Indicative (Marfu'')","Jussive (Majzum)","Subjunctive (Mansub)"}', 'Jussive (Majzum)', 'The particle In (if) causes both the condition verb and the response verb to be in the jussive mood.'),
(36, 17, 'What tense follows "Idha" in the condition clause?', '{"Past tense","Present tense","Imperative"}', 'Past tense', 'After Idha (when/if), the condition clause uses a past-tense verb, even if the meaning is future.'),
(37, 17, 'In "In tadrus tanjah," what is the jawab al-shart?', '{"tadrus","tanjah","In"}', 'tanjah', 'The jawab al-shart (response) is "tanjah" (you succeed), the result of the condition.');

-- Exercises for lesson 18: Emphasis (Tawkid)
INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
(38, 18, 'What is Tawkid Lafzi?', '{"Repeating the word for emphasis","Using a special noun for emphasis","Changing the verb form"}', 'Repeating the word for emphasis', 'Lafzi (verbal) emphasis means repeating the exact word to stress its meaning.'),
(39, 18, 'Which word is used for Ma''nawi (semantic) emphasis meaning "himself"?', '{"Nafsuhu","Kulluhum","Aynuhu"}', 'Nafsuhu', 'Nafsuhu (himself) is one of the key words used for semantic emphasis in Arabic grammar.');

-- Update exercise sequence
ALTER SEQUENCE exercises_id_seq RESTART WITH 40;
