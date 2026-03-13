npm run db:status    # anything pending?
liquibase updateSQL 2>/dev/null | grep -E "^-- Changeset|^ALTER |^CREATE |^DROP |^INSERT INTO [^p]"
npm run db:migrate   # run it