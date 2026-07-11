# Supabase Local Schema

This folder holds local-first Supabase assets for IATECH Builder.

The MVP should develop migrations here before connecting a hosted project:

- `migrations/` contains versioned SQL.
- `seed/` contains non-secret baseline content.

RLS is part of the product boundary. Do not add tables without explicit row-level security policies.

