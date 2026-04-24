# Registration & Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing landing page form to a SQLite database, and create a hidden admin page at a funny URL that shows all registrations behind a simple email/password gate.

**Architecture:** SQLite via `better-sqlite3` (synchronous, zero config). A `lib/db.ts` singleton initialises the schema on first run. API routes handle registration writes and admin credential checks. The admin page is a client component that posts credentials to get back the registrations — no sessions, no tokens, just a single authenticated fetch.

**Tech Stack:** Next.js 16 App Router, better-sqlite3, TypeScript, Tailwind CSS (existing).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `apps/web/package.json` | modify | add `better-sqlite3` + `@types/better-sqlite3` |
| `apps/web/next.config.mjs` | modify | add `serverExternalPackages: ['better-sqlite3']` |
| `apps/web/.gitignore` (root) | modify | ignore `apps/web/data/*.sqlite` |
| `apps/web/lib/db.ts` | **create** | SQLite singleton, schema init, seed default admin |
| `apps/web/app/api/register/route.ts` | **create** | POST — validate & insert registration |
| `apps/web/app/api/admin/data/route.ts` | **create** | POST `{email,password}` → verify creds → return registrations |
| `apps/web/components/landing-page.tsx` | modify | wire form submit to `POST /api/register` |
| `apps/web/app/definitely-not-a-spreadsheet/page.tsx` | **create** | admin login wall + registrations table |
| `apps/web/data/.gitkeep` | **create** | ensure `data/` directory exists in repo |

---

### Task 1: Install better-sqlite3

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/next.config.mjs`

- [ ] **Step 1: Add better-sqlite3**

```bash
cd apps/web && bun add better-sqlite3 && bun add -D @types/better-sqlite3
```

Expected output: packages installed, `package.json` updated.

- [ ] **Step 2: Configure Next.js to treat it as a server-only external package**

Open `apps/web/next.config.mjs` and replace the entire file with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  serverExternalPackages: ["better-sqlite3"],
}

export default nextConfig
```

- [ ] **Step 3: Add SQLite file to .gitignore**

Open the root `.gitignore` and append:

```
# SQLite database
apps/web/data/*.sqlite
```

- [ ] **Step 4: Create data directory placeholder**

```bash
mkdir -p apps/web/data && touch apps/web/data/.gitkeep
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json apps/web/next.config.mjs .gitignore apps/web/data/.gitkeep && git commit -m "chore: add better-sqlite3 and data directory"
```

---

### Task 2: Create DB module

**Files:**
- Create: `apps/web/lib/db.ts`

- [ ] **Step 1: Create the file**

`apps/web/lib/db.ts`:

```ts
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.sqlite");

// Ensure data directory exists at startup
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT NOT NULL,
    course      TEXT NOT NULL,
    reason      TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_credentials (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// Seed a default admin if none exists — update manually via sqlite3 CLI
const adminCount = (db.prepare("SELECT COUNT(*) as n FROM admin_credentials").get() as { n: number }).n;
if (adminCount === 0) {
  db.prepare("INSERT INTO admin_credentials (email, password) VALUES (?, ?)").run(
    "admin@pedagemy.com",
    "pedagemy2024"
  );
}

export default db;
```

- [ ] **Step 2: Verify Next.js can import it (quick smoke test)**

```bash
cd apps/web && bun run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/db.ts && git commit -m "feat: add SQLite db module with schema and seed"
```

---

### Task 3: Create registration API route

**Files:**
- Create: `apps/web/app/api/register/route.ts`

- [ ] **Step 1: Create the route**

`apps/web/app/api/register/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

interface RegisterBody {
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
}

export async function POST(req: NextRequest) {
  let body: RegisterBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email, course, reason } = body;

  if (!name || !phone || !email || !course || !reason) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO registrations (name, phone, email, course, reason) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(name.trim(), phone.trim(), email.trim().toLowerCase(), course.trim(), reason.trim());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Registration insert failed:", err);
    return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/web && bun run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/register/route.ts && git commit -m "feat: add registration API route"
```

---

### Task 4: Wire landing page form to API

**Files:**
- Modify: `apps/web/components/landing-page.tsx`

The form currently has inputs with no `name` attributes and `handleSubmit` just calls `setSubmitted(true)`. We need to:
1. Add `name` attributes to all inputs
2. Change `handleSubmit` to POST form data to `/api/register`
3. Show a loading state while submitting
4. Show the success state on `ok: true`, or show an inline error on failure

- [ ] **Step 1: Add `submitting` state and `error` state, update handleSubmit**

Find the existing state declarations and `handleSubmit` function (around line 195–210 in the component) and replace them:

```tsx
const [selectedCourse, setSelectedCourse] = useState(courseOptions[1].value);
const [submitted, setSubmitted] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
```

Replace the existing `handleSubmit`:

```tsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitting(true);
  setSubmitError(null);

  const form = event.currentTarget;
  const data = {
    name: (form.elements.namedItem("name") as HTMLInputElement).value,
    phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    email: (form.elements.namedItem("email") as HTMLInputElement).value,
    course: selectedCourse,
    reason: (form.elements.namedItem("reason") as HTMLTextAreaElement).value,
  };

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(json.error ?? "Something went wrong. Please try again.");
    }
  } catch {
    setSubmitError("Network error. Please check your connection and try again.");
  } finally {
    setSubmitting(false);
  }
};
```

- [ ] **Step 2: Add `name` attributes to form inputs**

Update the Full Name input:
```tsx
<input
  required
  name="name"
  type="text"
  placeholder="Your full name"
  className="field-focus mt-1.5 w-full rounded border-[1.5px] border-[#DDE3EE] bg-[#F7F9FC] px-3.5 py-3 text-sm font-medium text-[#1A1A2E] outline-none transition placeholder:text-[#6B7A99]"
/>
```

Update the Phone Number input:
```tsx
<input
  required
  name="phone"
  type="tel"
  placeholder="+234 000 000 0000"
  className="field-focus mt-1.5 w-full rounded border-[1.5px] border-[#DDE3EE] bg-[#F7F9FC] px-3.5 py-3 text-sm font-medium text-[#1A1A2E] outline-none transition placeholder:text-[#6B7A99]"
/>
```

Update the Email input:
```tsx
<input
  required
  name="email"
  type="email"
  placeholder="you@email.com"
  className="field-focus mt-1.5 w-full rounded border-[1.5px] border-[#DDE3EE] bg-[#F7F9FC] px-3.5 py-3 text-sm font-medium text-[#1A1A2E] outline-none transition placeholder:text-[#6B7A99]"
/>
```

Update the textarea:
```tsx
<textarea
  required
  name="reason"
  rows={4}
  placeholder="Tell us what draws you to this program and how it aligns with your goals…"
  className="field-focus mt-1.5 w-full resize-y rounded border-[1.5px] border-[#DDE3EE] bg-[#F7F9FC] px-3.5 py-3 text-sm font-medium leading-6 text-[#1A1A2E] outline-none transition placeholder:text-[#6B7A99]"
/>
```

- [ ] **Step 3: Add error display and loading state to submit button**

Replace the submit button and add error display just before it:

```tsx
{submitError && (
  <p className="mt-3 rounded border border-[#F5C6C6] bg-[#FFF4F4] px-3 py-2 text-[13px] font-semibold text-[#C0392B]">
    {submitError}
  </p>
)}

<button
  type="submit"
  disabled={submitting}
  className="group mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#0056D2] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_2px_10px_rgba(0,86,210,0.25)] transition hover:-translate-y-0.5 hover:bg-[#003A8C] hover:shadow-[0_8px_22px_rgba(0,86,210,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting ? "Submitting…" : "Claim My Free Entry"}
  {!submitting && (
    <Icon
      name="arrowRight"
      className="h-4 w-4 transition group-hover:translate-x-1"
    />
  )}
</button>
```

- [ ] **Step 4: Remove "Edit preview entry" button from success state (it was for demo only)**

In the success state section, remove the "Edit preview entry" button entirely (it would re-show the form after a real submission, which is confusing).

- [ ] **Step 5: Type-check**

```bash
cd apps/web && bun run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/components/landing-page.tsx && git commit -m "feat: wire registration form to /api/register"
```

---

### Task 5: Create admin data API

**Files:**
- Create: `apps/web/app/api/admin/data/route.ts`

- [ ] **Step 1: Create the route**

`apps/web/app/api/admin/data/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

interface AdminBody {
  email: string;
  password: string;
}

interface Registration {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  let body: AdminBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const admin = db
    .prepare("SELECT id FROM admin_credentials WHERE email = ? AND password = ?")
    .get(email.trim().toLowerCase(), password) as { id: number } | undefined;

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const registrations = db
    .prepare("SELECT * FROM registrations ORDER BY created_at DESC")
    .all() as Registration[];

  return NextResponse.json({ ok: true, registrations });
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/web && bun run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/admin/data/route.ts && git commit -m "feat: add admin data API route"
```

---

### Task 6: Create the admin page

**Files:**
- Create: `apps/web/app/definitely-not-a-spreadsheet/page.tsx`

- [ ] **Step 1: Create the page**

`apps/web/app/definitely-not-a-spreadsheet/page.tsx`:

```tsx
"use client";

import { useState } from "react";

interface Registration {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
  created_at: string;
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        setRegistrations(json.registrations);
      } else {
        setError(json.error ?? "Access denied.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (registrations !== null) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] p-8 font-sans">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A2E]">
                Raffle Entries
              </h1>
              <p className="mt-1 text-sm text-[#6B7A99]">
                {registrations.length} total registration{registrations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setRegistrations(null)}
              className="rounded border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
            >
              Log out
            </button>
          </div>

          {registrations.length === 0 ? (
            <div className="rounded-lg border border-[#DDE3EE] bg-white p-12 text-center">
              <p className="text-4xl">🦗</p>
              <p className="mt-4 font-bold text-[#1A1A2E]">Nothing here yet.</p>
              <p className="mt-1 text-sm text-[#6B7A99]">
                Registrations will appear once people submit the form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#DDE3EE] bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DDE3EE] bg-[#F7F9FC] text-left text-[11px] font-black uppercase tracking-[0.08em] text-[#6B7A99]">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Why</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-[#DDE3EE] last:border-0 hover:bg-[#F7F9FC]"
                    >
                      <td className="px-4 py-3 text-[#6B7A99]">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-[#1A1A2E]">
                        {r.name}
                      </td>
                      <td className="px-4 py-3 text-[#3B4557]">{r.email}</td>
                      <td className="px-4 py-3 text-[#3B4557]">{r.phone}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-sm bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#0056D2]">
                          {r.course}
                        </span>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-[#6B7A99]">
                        <span
                          title={r.reason}
                          className="block max-w-[240px] truncate"
                        >
                          {r.reason}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#6B7A99]">
                        {new Date(r.created_at + "Z").toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] p-6 font-sans">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-[#DDE3EE] bg-white shadow-[0_4px_32px_rgba(0,30,80,0.08)]">
        <div className="border-b border-[#DDE3EE] bg-[#003A8C] px-7 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">
            Nothing to see here
          </p>
          <h1 className="mt-1 text-lg font-black">Definitely Not Admin</h1>
        </div>

        <form onSubmit={handleLogin} className="p-7">
          <label className="block">
            <span className="text-[12px] font-black uppercase tracking-[0.07em] text-[#1A1A2E]">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="who are you"
              className="mt-1.5 w-full rounded border-[1.5px] border-[#DDE3EE] bg-[#F7F9FC] px-3.5 py-3 text-sm font-medium text-[#1A1A2E] outline-none transition placeholder:text-[#6B7A99] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-[12px] font-black uppercase tracking-[0.07em] text-[#1A1A2E]">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded border-[1.5px] border-[#DDE3EE] bg-[#F7F9FC] px-3.5 py-3 text-sm font-medium text-[#1A1A2E] outline-none transition placeholder:text-[#6B7A99] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
            />
          </label>

          {error && (
            <p className="mt-3 rounded border border-[#F5C6C6] bg-[#FFF4F4] px-3 py-2 text-[13px] font-semibold text-[#C0392B]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded bg-[#0056D2] py-3 text-[14px] font-bold text-white transition hover:bg-[#003A8C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking…" : "Enter the void"}
          </button>
        </form>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/web && bun run typecheck
```

Expected: no errors.

- [ ] **Step 3: Smoke test in browser**

```bash
cd apps/web && bun run dev
```

Visit:
- `http://localhost:3000` — confirm landing page form submits and shows success state
- `http://localhost:3000/definitely-not-a-spreadsheet` — confirm login page loads
- Log in with `admin@pedagemy.com` / `pedagemy2024` — confirm registrations table appears

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/definitely-not-a-spreadsheet/page.tsx && git commit -m "feat: add admin page at /definitely-not-a-spreadsheet"
```

---

## How to Manage Admin Credentials

The default admin is seeded on first run:
- Email: `admin@pedagemy.com`
- Password: `pedagemy2024`

To add or change credentials, run the sqlite3 CLI from `apps/web/`:

```bash
sqlite3 data/db.sqlite

# Add a new admin
INSERT INTO admin_credentials (email, password) VALUES ('you@example.com', 'yourpassword');

# Change a password
UPDATE admin_credentials SET password = 'newpass' WHERE email = 'admin@pedagemy.com';

# Remove an admin
DELETE FROM admin_credentials WHERE email = 'old@example.com';

# List all admins
SELECT * FROM admin_credentials;

.quit
```

---

## Self-Review

**Spec coverage:**
- ✅ Registration form submits data — Task 3 + 4
- ✅ SQLite database in project — Task 1 + 2
- ✅ Admin page shows all registrants — Task 6
- ✅ Funny URL (`/definitely-not-a-spreadsheet`) — Task 6
- ✅ Email + password gate — Task 5 + 6
- ✅ Credentials stored in SQLite, manually updated — Task 2 (seed) + docs above
- ✅ No full auth library — plain DB lookup
- ✅ Users who register don't need an account — registration just saves to DB

**Placeholder scan:** No TBDs or TODO markers. All code blocks are complete.

**Type consistency:** `Registration` interface defined in Task 5 matches the `SELECT *` columns. `AdminBody` used consistently. `handleSubmit` in Task 4 matches form field `name` attributes set in same task.
