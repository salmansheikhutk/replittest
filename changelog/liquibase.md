# If everything is managed from liquibase.

npm run db:status    # anything pending?
liquibase updateSQL 2>/dev/null | grep -E "^-- Changeset|^ALTER |^CREATE |^DROP |^INSERT INTO [^p]"
npm run db:migrate   # run it

# What if you created a table and added data in the table manually?
liquibase generateChangelog --changelog-file=changelog/captured.sql --diff-types=tables,columns,indexes,foreignkeys,data