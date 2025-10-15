# Next Steps for BD Control Plane

This document provides a clear roadmap for continuing development of the BD Control Plane.

## 🎯 Current Status

**Completion**: 18/18 BD issues closed (100%)
**State**: Feature-complete UI, but needs backend fixes for production

## 🔴 Critical Fixes Required (Blocking Production)

### 1. Fix Better Auth OAuth Token Retrieval

**Problem**: API routes try to get GitHub token with `(session as any).accessToken` but Better Auth doesn't expose OAuth tokens in the session by default.

**Location**:
- `app/api/repos/route.ts:22`
- `app/api/issues/route.ts:20`
- `app/api/graph/route.ts:20`
- `app/api/metrics/route.ts:20`

**Fix**:
```typescript
// Instead of:
const accessToken = (session as any).accessToken;

// Do this:
import { db } from "@/lib/db";
import { account } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const accounts = await db.select()
  .from(account)
  .where(eq(account.userId, session.user.id))
  .where(eq(account.providerId, "github"));

const accessToken = accounts[0]?.accessToken;
```

**Estimated Time**: 30 minutes

---

### 2. Add Mobile Navigation

**Problem**: Nav menu is completely hidden on mobile (`hidden md:flex`). Users cannot navigate the app on mobile devices.

**Location**: `components/nav.tsx:62`

**Fix**: Add hamburger menu with sheet/drawer:
```bash
npx shadcn@latest add sheet
```

Then create mobile menu that slides in from left/right.

**Estimated Time**: 45 minutes

---

### 3. Implement Database Migrations

**Problem**: No database migrations exist. `npx drizzle-kit push` won't work without them.

**Location**: Missing `drizzle/` directory

**Fix**:
```bash
# Generate initial migration
npx drizzle-kit generate

# This creates migrations from schema.ts
# Then users can run: npx drizzle-kit push
```

**Estimated Time**: 15 minutes

---

### 4. Implement Personal Access Token Storage

**Problem**: Settings page UI exists but doesn't save PATs to database.

**Location**: `app/settings/page.tsx:33` (handleAddToken function)

**Fix**:
1. Create API route: `app/api/tokens/route.ts`
2. Add POST handler to insert into `personalAccessToken` table
3. Add GET handler to fetch user's tokens
4. Update Settings page to call API
5. Encrypt tokens before storing (use Better Auth's encryption utilities)

**Estimated Time**: 1 hour

---

### 5. Fix Tailwind Build for Production

**Problem**: Tailwind v4 requires `lightningcss` which doesn't support Android ARM64.

**Location**: Build process

**Options**:
- **Option A**: Downgrade to Tailwind v3 (guaranteed compatibility)
- **Option B**: Build on x64 system (GitHub Actions, Vercel works fine)
- **Option C**: Wait for Tailwind v4 ARM64 support

**Recommended**: Option B - Deploy on Vercel (x64), works perfectly.

**Estimated Time**: Already solved if deploying to Vercel!

---

## 🟡 Important Improvements (Better UX)

### 6. Add Error Handling in Client Components

**Problem**: API failures show generic errors or blank screens.

**Fix**: Add proper error states:
```typescript
const [error, setError] = useState<Error | null>(null);

// In catch block:
catch (err) {
  setError(err instanceof Error ? err : new Error('Failed to load'));
}

// In render:
if (error) return <ErrorState error={error} retry={() => refetch()} />;
```

**Estimated Time**: 1 hour for all pages

---

### 7. Implement Actual Admin User List

**Problem**: Admin panel shows mock data.

**Location**: `app/admin/page.tsx:9`

**Fix**: Create `app/api/admin/users/route.ts` that queries the `user` table with aggregated stats.

**Estimated Time**: 45 minutes

---

### 8. Add GitHub API Caching

**Problem**: Every page load fetches from GitHub API - will hit rate limits (5000/hour).

**Fix**:
- Add Redis cache (Vercel KV)
- Or use React Query with stale-while-revalidate
- Cache for 5 minutes

**Estimated Time**: 1-2 hours

---

### 9. Add Loading Skeletons to All Pages

**Problem**: Created `loading-skeleton.tsx` but never imported it into pages.

**Fix**: Replace loading spinners with skeletons:
```typescript
import { DashboardSkeleton } from "@/components/loading-skeleton";

if (loading) return <DashboardSkeleton />;
```

**Estimated Time**: 15 minutes

---

### 10. Connect Better Auth Session to Frontend

**Problem**: `useSession` is called but Better Auth client needs to be wrapped in provider.

**Fix**: Add Better Auth provider to root layout:
```typescript
import { SessionProvider } from "@/lib/auth-client";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

**Estimated Time**: 30 minutes

---

## 🟢 Nice-to-Have (Polish)

### 11. Add Empty States for No Repos
Already partially implemented but could be better.

### 12. Add Pagination
For users with 100+ repos.

### 13. Add Export Functionality
Export graphs as PNG, issues as CSV.

### 14. Add Real-time Updates
WebSocket or polling for live updates.

### 15. Add Team Features
Share dashboards, assign issues.

---

## 📊 Priority Order for Next Agent

**Phase 1: Make It Work** (4-5 hours)
1. Fix OAuth token retrieval ⚠️ CRITICAL
2. Add mobile navigation ⚠️ CRITICAL
3. Generate database migrations ⚠️ CRITICAL
4. Connect Better Auth session provider
5. Implement PAT storage in database

**Phase 2: Make It Good** (3-4 hours)
6. Add comprehensive error handling
7. Implement actual admin user queries
8. Add GitHub API caching
9. Use loading skeletons everywhere
10. Add retry logic on failures

**Phase 3: Make It Great** (4-6 hours)
11. Add export functionality
12. Implement pagination
13. Add real-time updates
14. Polish mobile UX
15. Add team collaboration features

---

## 🎯 Testing Checklist

Before considering it "production ready":

- [ ] Can user sign in with GitHub OAuth?
- [ ] Does dashboard show actual repos from GitHub?
- [ ] Does graph view render correctly?
- [ ] Can user navigate on mobile?
- [ ] Do PATs actually save to database?
- [ ] Does admin panel show real users?
- [ ] Does app handle API failures gracefully?
- [ ] Does app work after database migration?
- [ ] Can app handle 50+ repos without issues?
- [ ] Does command palette work (Cmd+K)?

---

## 💡 Files to Focus On

**Must Touch:**
1. `app/api/repos/route.ts` - Fix token retrieval
2. `app/api/issues/route.ts` - Fix token retrieval
3. `app/api/graph/route.ts` - Fix token retrieval
4. `app/api/metrics/route.ts` - Fix token retrieval
5. `components/nav.tsx` - Add mobile menu
6. `app/layout.tsx` - Add SessionProvider
7. `app/settings/page.tsx` - Add real PAT API
8. `app/admin/page.tsx` - Add real user queries

**Good to Touch:**
9. All page files - Add error handling
10. All page files - Use loading skeletons
11. Create caching layer
12. Add retry logic

---

## 🚀 Quick Wins

Want to impress users fast? Do these first:

1. **Fix OAuth token** (30 min) - Makes everything work
2. **Add mobile nav** (45 min) - Mobile users can actually use it
3. **Add error states** (1 hour) - Professional feel
4. **Use loading skeletons** (15 min) - Looks polished

Total: ~2.5 hours for 4x better product!

---

## 📚 Resources for Next Agent

- Better Auth Docs: https://www.better-auth.com/docs
- Drizzle ORM Docs: https://orm.drizzle.team/docs/overview
- Octokit (GitHub API): https://octokit.github.io/rest.js
- React Flow Docs: https://reactflow.dev/
- shadcn/ui Components: https://ui.shadcn.com/

---

**Good luck! You've got a great foundation to build on!** 🚀
