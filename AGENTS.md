Always cross-reference the generated DB types when writing Supabase queries.
Don't assume the table name from the Zod schema name alone.

The Zod schemas in shared/ are API-facing input shapes, not necessarily 1:1
mirrors of DB columns. The route layer is responsible for mapping between the
two.
