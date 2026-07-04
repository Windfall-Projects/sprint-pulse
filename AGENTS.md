Always cross-reference the generated DB types when writing Supabase queries.
Don't assume the table name from the Zod schema name alone.

The Zod schemas in shared/ are API-facing input shapes, not necessarily 1:1
mirrors of DB columns. The route layer is responsible for mapping between the
two.

**CRITICAL: Zod Schemas in Server Actions**
All Next.js Server Actions MUST validate their incoming `FormData` or payloads using the shared Zod schemas from `packages/shared/src/schemas/index.ts`. 
Do not rely on manual string validation or database constraints alone. When extracting from `FormData`, convert camelCase keys from the UI into the snake_case keys expected by the schemas before calling `.safeParse()`. If validation fails, return structured errors to the UI.
