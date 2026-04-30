# Implementation TODO

## Part A: Fix Prisma Migrations for VPS PostgreSQL
- [ ] Step 1: Update `backend/prisma/schema.prisma` to use `env("DATABASE_URL")`
- [ ] Step 2: Update `deploy.sh` to use Prisma migrations instead of raw SQL
- [ ] Step 3: Create `.env.example` with all required variables
- [ ] Step 4: Create `MIGRATION_GUIDE.md` with VPS deployment steps
- [ ] Step 5: Update `backend/src/seed.ts` to work with migrations

## Part B: Private Access Links per Role
- [ ] Step 6: Update `src/App.tsx` with role-based entry routes
- [ ] Step 7: Update `src/pages/Login.tsx` with role query param support
- [ ] Step 8: Create invite token system for admin access (optional but recommended)
- [ ] Step 9: Update `backend/src/routes/auth.ts` with invite-only admin registration
- [ ] Step 10: Test and verify all routes work correctly

