# Waitlist Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add admin capabilities to view and export waitlist subscribers, mirroring the archived raffle admin UI pattern but simplified for the smaller waitlist schema.

**Architecture:** Create a new `/api/admin/waitlist` POST route that reuses the raffle store's admin auth and the waitlist store's data. Create a new `app/admin/page.tsx` with inline table logic (no separate component file — the schema is too small to justify the split). The old `_admin` folder stays archived; this is a fresh admin UI.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase, node:test

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `app/api/admin/waitlist/route.ts` | Create | POST endpoint: admin auth → return waitlist entries |
| `app/admin/page.tsx` | Create | Login form + waitlist table with search, copy, CSV export, pagination |
| `lib/waitlist-store.test.ts` | Modify | Add test for `listEntries` with missing table error |

---

### Task 1: Create Admin API Route for Waitlist

**Files:**
- Create: `app/api/admin/waitlist/route.ts`

- [ ] **Step 1: Write the route**

```typescript
// app/api/admin/waitlist/route.ts
import { NextResponse } from "next/server";
import { getRaffleStore } from "@/lib/raffle-store";
import {
  getWaitlistStore,
  MissingStoreConfigError,
  MissingWaitlistTableError,
} from "@/lib/waitlist-store";

interface AdminLoginBody {
  email: string;
  password: string;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: AdminLoginBody;

  try {
    body = (await request.json()) as AdminLoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isNonEmpty(body.email) || !isNonEmpty(body.password)) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  try {
    const raffleStore = getRaffleStore();
    if (!(await raffleStore.isValidAdminLogin(body.email, body.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const waitlistStore = getWaitlistStore();
    return NextResponse.json({
      ok: true,
      entries: await waitlistStore.listEntries(),
    });
  } catch (error) {
    if (error instanceof MissingStoreConfigError) {
      console.error("Admin storage is not configured", error.message);
      return NextResponse.json(
        { error: "Admin storage is not configured" },
        { status: 500 },
      );
    }

    if (error instanceof MissingWaitlistTableError) {
      console.error("Supabase waiting_list table is missing", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Failed to load waitlist data", error);
    return NextResponse.json(
      { error: "Failed to load waitlist data" },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Verify compilation**

```bash
bun run typecheck
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/waitlist/route.ts
git commit -m "feat: add admin API endpoint for waitlist entries"
```

---

### Task 2: Create Waitlist Admin UI Page

**Files:**
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Write the admin page**

```tsx
// app/admin/page.tsx
"use client";

import { useDeferredValue, useEffect, useState } from "react";

interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function filterEntries(entries: WaitlistEntry[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return entries;
  return entries.filter(
    (e) =>
      e.name.toLowerCase().includes(normalized) ||
      e.email.toLowerCase().includes(normalized),
  );
}

function paginate<T>(items: T[], page: number, size: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const start = (validPage - 1) * size;
  return {
    items: items.slice(start, start + size),
    totalPages,
    validPage,
  };
}

function buildCsv(entries: WaitlistEntry[]) {
  const bom = "\uFEFF";
  const headers = ["ID", "Name", "Email", "Created At"];
  const rows = entries.map((e) => [
    String(e.id),
    e.name,
    e.email,
    new Date(e.created_at).toISOString(),
  ]);
  const escape = (cell: string) => {
    if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };
  return (
    bom +
    [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n") +
    "\r\n"
  );
}

export default function WaitlistAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(searchQuery);
  const filtered = entries ? filterEntries(entries, deferredQuery) : null;
  const { items: pageItems, totalPages, validPage } = filtered
    ? paginate(filtered, currentPage, PAGE_SIZE)
    : { items: [] as WaitlistEntry[], totalPages: 1, validPage: 1 };

  useEffect(() => {
    if (!copiedValue) return;
    const t = setTimeout(() => setCopiedValue(null), 1600);
    return () => clearTimeout(t);
  }, [copiedValue]);

  useEffect(() => {
    if (filtered && validPage !== currentPage) {
      setCurrentPage(validPage);
    }
  }, [validPage, currentPage, filtered]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        ok?: boolean;
        entries?: WaitlistEntry[];
      };

      if (!response.ok || !data.ok || !data.entries) {
        setError(data.error ?? "Access denied.");
        return;
      }

      setEntries(data.entries);
      setCurrentPage(1);
      setSearchQuery("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!filtered || filtered.length === 0) {
      setError("There is no data to export.");
      return;
    }
    setError(null);
    const csv = buildCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedagemy-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  if (entries) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,91,209,0.12),transparent_28%),linear-gradient(180deg,#F8FAFD_0%,#EEF3F9_100%)] px-6 py-10 font-(family-name:--font-dm-sans) text-[#1A1A2E] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-5 rounded-[32px] border border-white/75 bg-white/86 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[clamp(28px,4vw,44px)] font-black tracking-[-0.04em] text-balance text-[#182032]">
                Waitlist Admin
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6B7A99]">
                Showing {filtered?.length ?? 0} of {entries.length}{" "}
                {entries.length === 1 ? "entry" : "entries"}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {copiedValue ? (
                <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-3 py-1.5 text-[12px] font-semibold text-[#0D5BD1]">
                  Copied
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!filtered || filtered.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  setEntries(null);
                  setPassword("");
                  setCurrentPage(1);
                  setSearchQuery("");
                  setCopiedValue(null);
                }}
                className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
              >
                Lock it back up
              </button>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-[32px] border border-white/75 bg-white/88 px-8 py-20 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">
                No entries yet
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B7A99]">
                Once someone joins the waitlist, they will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="rounded-[30px] border border-white/75 bg-white/88 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <label className="block sm:max-w-md">
                    <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                      Search
                    </span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search names or emails..."
                      className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition placeholder:text-[#8A96AD] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                    />
                  </label>
                  {searchQuery.trim() ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
                    >
                      Clear filters
                    </button>
                  ) : null}
                </div>
              </section>

              <div className="rounded-[30px] border border-white/75 bg-white/88 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E8EDF5]">
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                          Name
                        </th>
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                          Email
                        </th>
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                          Date
                        </th>
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-[#F0F3F8] transition hover:bg-[#F7F9FC]"
                        >
                          <td className="px-5 py-3.5 text-sm font-semibold text-[#1A1A2E]">
                            {entry.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-[#3B4557]">
                            {entry.email}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-[#6B7A99]">
                            {formatDate(entry.created_at)}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={() => handleCopy(entry.email)}
                              className="rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#0056D2] transition hover:bg-[#EAF2FF]"
                            >
                              Copy email
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-[#E8EDF5] px-5 py-4">
                    <button
                      type="button"
                      disabled={validPage <= 1}
                      onClick={() => setCurrentPage(validPage - 1)}
                      className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-semibold text-[#6B7A99]">
                      Page {validPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={validPage >= totalPages}
                      onClick={() => setCurrentPage(validPage + 1)}
                      className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#EBF2FF,#F7F9FC_52%,#EDF2F7)] px-6 py-10 font-(family-name:--font-dm-sans) text-[#1A1A2E]">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#DDE3EE] bg-white shadow-[0_24px_60px_rgba(0,30,80,0.12)]">
        <div className="bg-[#003A8C] px-7 py-6 text-white">
          <h1 className="text-2xl font-black tracking-[-0.03em]">
            Waitlist Admin
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/80">
            If you know why you are here, use the local access code and move along.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 px-7 py-7">
          <label className="block">
            <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#1A1A2E]">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pedagemy.com"
              className="mt-1.5 w-full rounded-xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#1A1A2E]">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-[#F5C6C6] bg-[#FFF4F4] px-3 py-2 text-sm font-semibold text-[#C0392B]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0056D2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#003A8C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking the vibes..." : "Open the vault"}
          </button>
        </form>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
bun run typecheck
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add waitlist admin UI with search, export, pagination"
```

---

### Task 3: Add Waitlist Store Test for `listEntries`

**Files:**
- Modify: `lib/waitlist-store.test.ts`

- [ ] **Step 1: Add the test**

Append to `lib/waitlist-store.test.ts`:

```typescript
test("lists all entries in descending id order", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  await store.saveEntry({ name: "Ada Lovelace", email: "ada@example.com" });
  await store.saveEntry({ name: "Grace Hopper", email: "grace@example.com" });

  const entries = await store.listEntries();
  assert.equal(entries.length, 2);
  assert.equal(entries[0]!.name, "Grace Hopper");
  assert.equal(entries[1]!.name, "Ada Lovelace");
});
```

- [ ] **Step 2: Run tests**

```bash
bun test lib/waitlist-store.test.ts
```
Expected: All 4 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/waitlist-store.test.ts
git commit -m "test: add listEntries coverage for waitlist store"
```

---

### Task 4: Build and Verify

- [ ] **Step 1: Run full test suite**

```bash
bun test
```
Expected: All tests pass.

- [ ] **Step 2: Run build**

```bash
bun run build
```
Expected: Build succeeds.

- [ ] **Step 3: Verify routes in build output**

Check `.next/server/app-paths-manifest.json` contains:
- `/admin/page`
- `/api/admin/waitlist/route`

```bash
cat .next/server/app-paths-manifest.json
```

- [ ] **Step 4: Smoke test admin page**

```bash
bun run start &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
curl -s -X POST http://localhost:3000/api/admin/waitlist -H "Content-Type: application/json" -d '{"email":"admin@pedagemy.com","password":"pedagemy2024"}'
pkill -f "next start"
```
Expected: `/admin` returns 200. API returns JSON with `ok: true` and `entries: []`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: verify waitlist admin build and routes"
```

---

## Self-Review

### 1. Spec Coverage

| Requirement | Task |
|-------------|------|
| DB connection exists | Already done (waitlist-store.ts uses Supabase) |
| Email list subscription table exists | Already done (waiting_list SQL) |
| Admin can view mailing list subscribers | Task 1 (API) + Task 2 (UI) |
| Admin can export subscribers | Task 2 (CSV export button) |
| Admin can search/filter subscribers | Task 2 (search input) |
| Reuses existing auth pattern | Task 1 (uses raffle store `isValidAdminLogin`) |

### 2. Placeholder Scan

No placeholders. All code is complete and copy-pasteable.

### 3. Type Consistency

- `WaitlistEntry` interface matches `WaitlistRecord` from waitlist-store.ts
- API response shape `{ ok: true, entries: WaitlistEntry[] }` matches UI expectations
- Admin auth uses same env vars as raffle store (`PEDAGEMY_ADMIN_EMAIL`, `PEDAGEMY_ADMIN_PASSWORD`)
