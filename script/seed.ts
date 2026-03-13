import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    // Check if data already exists — skip if so
    const { rows } = await client.query("SELECT COUNT(*) FROM lessons");
    if (parseInt(rows[0].count) > 0) {
      console.log("Lessons already seeded, skipping lessons.");
    } else {
      console.log("Seeding lessons...");
      await client.query(`
        INSERT INTO lessons (id, title, content, category, level, "order") VALUES
        (3, 'Past Tense (Madi)', 'Arabic verbs usually have 3 root letters. The base is 3rd person masculine singular: **Fa''ala** (He did).', 'sarf', 'beginner', 1),
        (4, 'Present Tense (Mudari)', 'Starts with prefixes: **Ya-** (He), **Ta-** (You/She), **A-** (I), **Na-** (We). Example: **Yaf''alu** (He does).', 'sarf', 'beginner', 2),
        (5, 'Nominal Sentence (Ismiyya)', 'Starts with a noun. Two parts: **Mubtada** (Subject) and **Khabar** (Predicate). Both are **Marfu** (Nominative).', 'nahw', 'beginner', 1),
        (6, 'Verbal Sentence (Fi''liyya)', 'Starts with a verb. Main parts: **Fi''l** (Verb) and **Fa''il** (Doer). Fa''il is always **Marfu**.', 'nahw', 'beginner', 2)
      `);

      console.log("Seeding exercises...");
      await client.query(`
        INSERT INTO exercises (id, lesson_id, question, options, correct_answer, explanation) VALUES
        (5, 3, 'Base form of past tense?', '{"He did","I did","You did"}', 'He did', '3rd person masculine singular is the root.'),
        (6, 3, 'Standard root letter count?', '{2,3,4}', '3', 'Most Arabic verbs are triliteral (3 letters).'),
        (7, 4, 'Prefix for ''He'' (3rd person)?', '{Ya,Ta,Na}', 'Ya', 'Ya- indicates 3rd person masculine singular.'),
        (8, 5, 'Sentence starting with a noun?', '{Ismiyya,Fi''liyya}', 'Ismiyya', 'Jumla Ismiyya starts with an Ism (noun).'),
        (9, 6, 'Grammatical state of the Fa''il (Doer)?', '{Marfu,Mansub,Majrur}', 'Marfu', 'The subject/doer of a verb is always nominative.')
      `);

      // Reset sequences to avoid id conflicts on future inserts
      await client.query(`SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons))`);
      await client.query(`SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises))`);
    }

    const { rows: testingRows } = await client.query("SELECT COUNT(*) FROM testing");
    if (parseInt(testingRows[0].count) > 0) {
      console.log("Testing table already seeded, skipping.");
    } else {
      console.log("Seeding testing table...");
      await client.query(`
        INSERT INTO testing (name, description, value) VALUES
        ('Alpha', 'First test record', 10),
        ('Beta', 'Second test record', 42),
        ('Gamma', 'Third test record', 99),
        ('Delta', 'Fourth test record', 7)
      `);
    }

    console.log("Seeding complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
