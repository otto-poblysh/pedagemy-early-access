"use client";

import { useState } from "react";

interface Registration {
  course: string;
  created_at: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  reason: string;
}

export default function DefinitelyNotASpreadsheetPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        ok?: boolean;
        registrations?: Registration[];
      };

      if (!response.ok || !data.ok || !data.registrations) {
        setError(data.error ?? "Access denied.");
        return;
      }

      setRegistrations(data.registrations);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (registrations) {
    return (
      <main className="min-h-screen bg-[#F4F7FB] px-6 py-10 font-(family-name:--font-dm-sans) text-[#1A1A2E] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#DDE3EE] bg-white p-6 shadow-[0_8px_30px_rgba(0,30,80,0.06)] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0056D2]">
                Definitely not a spreadsheet
              </p>
              <h1 className="mt-2 text-[clamp(28px,4vw,40px)] font-black tracking-[-0.04em]">
                Registration Inbox
              </h1>
              <p className="mt-2 text-sm text-[#6B7A99]">
                {registrations.length} total {registrations.length === 1 ? "entry" : "entries"}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setRegistrations(null);
                setPassword("");
              }}
              className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
            >
              Lock it back up
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#DDE3EE] bg-white shadow-[0_8px_30px_rgba(0,30,80,0.06)]">
            {registrations.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-5xl">🦗</p>
                <h2 className="mt-4 text-xl font-black">No registrations yet</h2>
                <p className="mt-2 text-sm text-[#6B7A99]">
                  Once someone submits the landing page form, they will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#F7F9FC] text-[11px] font-black uppercase tracking-[0.12em] text-[#6B7A99]">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <tr
                        key={registration.id}
                        className="border-t border-[#DDE3EE] align-top text-[#3B4557]"
                      >
                        <td className="px-4 py-4 font-semibold text-[#1A1A2E]">
                          {registration.name}
                        </td>
                        <td className="px-4 py-4">{registration.email}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{registration.phone}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-[#EBF2FF] px-2.5 py-1 text-xs font-bold text-[#0056D2]">
                            {registration.course}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#6B7A99]">
                          <p className="max-w-md leading-6">{registration.reason}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-[#6B7A99]">
                          {new Date(`${registration.created_at}Z`).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#EBF2FF,_#F7F9FC_52%,_#EDF2F7)] px-6 py-10 font-(family-name:--font-dm-sans) text-[#1A1A2E]">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#DDE3EE] bg-white shadow-[0_24px_60px_rgba(0,30,80,0.12)]">
        <div className="bg-[#003A8C] px-7 py-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
            Absolutely normal page
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em]">
            Definitely Not A Spreadsheet
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
              onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
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
