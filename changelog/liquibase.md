# If everything is managed from liquibase.

npm run db:status    # anything pending?
liquibase updateSQL 2>/dev/null | grep -E "^-- Changeset|^ALTER |^CREATE |^DROP |^INSERT INTO [^p]"
npm run db:migrate   # run it

# What if you created a table and added data in the table manually?
liquibase generateChangelog --changelog-file=changelog/captured.sql --diff-types=tables,columns,indexes,foreignkeys,data

# How does the calculation work?
--changeset, this is the most important line e.g.

--changeset system:0002_testing_table
CREATE TABLE IF NOT EXISTS "testing" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "value" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--changeset system:0002_drop_testing_name
ALTER TABLE "testing" DROP COLUMN IF EXISTS "name";


Liquibase will first calculate the md5sum, i.e. it will remove all the comments, and look at each --changeset block, and give it a hash. If the hash matches, it will know it has already ran it. If e.g. the second --changeset is new, it will know it has not run this yet.

Steps:
1. Read changelog table, get all he md5sum values and filenames
2. Calculate all the md5sum values again, and see what is different.
3. That is what goes to pending.
4. Entry in liquibase for success.