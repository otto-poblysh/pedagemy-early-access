"use client";

import { useDeferredValue, useEffect, useState } from "react";

import { Icon } from "@/components/icons";
import {
  buildRegistrationsCsv,
  buildCourseFilterOptions,
  buildCountryFilterOptions,
  filterRegistrations,
  paginateRegistrations,
  RegistrationsTable,
  type Registration,
} from "../_admin/registrations-table";

interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  locale: string;
  created_at: string;
}

type Tab = "raffle" | "waitlist";

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
      e.email.toLowerCase().includes(normalized) ||
      e.locale.toLowerCase().includes(normalized),
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
  const headers = ["ID", "Name", "Email", "Locale", "Created At"];
  const rows = entries.map((e) => [
    String(e.id),
    e.name,
    e.email,
    e.locale,
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

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("raffle");

  const [raffleRegistrations, setRaffleRegistrations] = useState<Registration[] | null>(null);
  const [raffleSearch, setRaffleSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rafflePage, setRafflePage] = useState(1);

  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[] | null>(null);
  const [waitlistSearch, setWaitlistSearch] = useState("");
  const [waitlistPage, setWaitlistPage] = useState(1);

  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const deferredRaffleSearch = useDeferredValue(raffleSearch);
  const deferredWaitlistSearch = useDeferredValue(waitlistSearch);

  const filteredRaffle = raffleRegistrations
    ? filterRegistrations(raffleRegistrations, {
        course: courseFilter,
        country: countryFilter,
        from: fromDate,
        query: deferredRaffleSearch,
        to: toDate,
      })
    : null;

  const filteredWaitlist = waitlistEntries
    ? filterEntries(waitlistEntries, deferredWaitlistSearch)
    : null;

  const { items: waitlistPageItems, totalPages: waitlistTotalPages, validPage: waitlistValidPage } =
    filteredWaitlist
      ? paginate(filteredWaitlist, waitlistPage, PAGE_SIZE)
      : { items: [] as WaitlistEntry[], totalPages: 1, validPage: 1 };

  const courseOptions = raffleRegistrations ? buildCourseFilterOptions(raffleRegistrations) : [];
  const countryOptions = raffleRegistrations ? buildCountryFilterOptions(raffleRegistrations) : [];
  const hasActiveRaffleFilters = Boolean(
    raffleSearch.trim() || courseFilter || countryFilter || fromDate || toDate,
  );

  useEffect(() => {
    if (!copiedValue) return;
    const t = setTimeout(() => setCopiedValue(null), 1600);
    return () => clearTimeout(t);
  }, [copiedValue]);

  useEffect(() => {
    if (filteredWaitlist && waitlistValidPage !== waitlistPage) {
      setWaitlistPage(waitlistValidPage);
    }
  }, [waitlistValidPage, waitlistPage, filteredWaitlist]);

  useEffect(() => {
    if (!filteredRaffle) return;
    const { currentPage: normalizedPage } = paginateRegistrations(filteredRaffle, rafflePage);
    if (normalizedPage !== rafflePage) {
      setRafflePage(normalizedPage);
    }
  }, [rafflePage, filteredRaffle]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [raffleRes, waitlistRes] = await Promise.all([
        fetch("/api/admin/raffle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }),
        fetch("/api/admin/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }),
      ]);

      const raffleData = (await raffleRes.json()) as {
        error?: string;
        ok?: boolean;
        registrations?: Registration[];
      };
      const waitlistData = (await waitlistRes.json()) as {
        error?: string;
        ok?: boolean;
        entries?: WaitlistEntry[];
      };

      if (!raffleRes.ok || !raffleData.ok || !raffleData.registrations) {
        setError(raffleData.error ?? waitlistData.error ?? "Access denied.");
        return;
      }

      if (!waitlistRes.ok || !waitlistData.ok || !waitlistData.entries) {
        setError(waitlistData.error ?? "Access denied.");
        return;
      }

      setRaffleRegistrations(raffleData.registrations);
      setWaitlistEntries(waitlistData.entries);
      setActiveTab("raffle");
      setRafflePage(1);
      setWaitlistPage(1);
      setRaffleSearch("");
      setWaitlistSearch("");
      setCourseFilter("");
      setCountryFilter("");
      setFromDate("");
      setToDate("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportRaffleCsv = () => {
    if (!filteredRaffle || filteredRaffle.length === 0) {
      setError("There is no data to export.");
      return;
    }
    setError(null);
    const csv = buildRegistrationsCsv(filteredRaffle);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedagemy-raffle-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportWaitlistCsv = () => {
    if (!filteredWaitlist || filteredWaitlist.length === 0) {
      setError("There is no data to export.");
      return;
    }
    setError(null);
    const csv = buildCsv(filteredWaitlist);
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

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(label);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  const handleLogout = () => {
    setRaffleRegistrations(null);
    setWaitlistEntries(null);
    setPassword("");
    setRafflePage(1);
    setWaitlistPage(1);
    setRaffleSearch("");
    setWaitlistSearch("");
    setCourseFilter("");
    setCountryFilter("");
    setFromDate("");
    setToDate("");
    setCopiedValue(null);
    setError(null);
  };

  const isLoggedIn = raffleRegistrations !== null && waitlistEntries !== null;

  if (isLoggedIn) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,91,209,0.12),transparent_28%),linear-gradient(180deg,#F8FAFD_0%,#EEF3F9_100%)] px-6 py-10 font-(family-name:--font-dm-sans) text-[#1A1A2E] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-340">
          <div className="mb-6 flex flex-col gap-5 rounded-[32px] border border-white/75 bg-white/86 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[clamp(28px,4vw,44px)] font-black tracking-[-0.04em] text-balance text-[#182032]">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6B7A99]">
                {activeTab === "raffle"
                  ? `Showing ${filteredRaffle?.length ?? 0} of ${raffleRegistrations.length} raffle ${raffleRegistrations.length === 1 ? "entry" : "entries"}.`
                  : `Showing ${filteredWaitlist?.length ?? 0} of ${waitlistEntries.length} waitlist ${waitlistEntries.length === 1 ? "entry" : "entries"}.`}
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
                onClick={activeTab === "raffle" ? handleExportRaffleCsv : handleExportWaitlistCsv}
                disabled={
                  activeTab === "raffle"
                    ? !filteredRaffle || filteredRaffle.length === 0
                    : !filteredWaitlist || filteredWaitlist.length === 0
                }
                className="inline-flex items-center gap-2 rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Icon name="download" className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
              >
                Lock it back up
              </button>
            </div>
          </div>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("raffle")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "raffle"
                  ? "bg-[#0056D2] text-white shadow-[0_12px_24px_rgba(13,91,209,0.22)]"
                  : "border border-[#DDE3EE] bg-white text-[#3B4557] hover:border-[#0056D2] hover:text-[#0056D2]"
              }`}
            >
              Raffle Registrations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("waitlist")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "waitlist"
                  ? "bg-[#0056D2] text-white shadow-[0_12px_24px_rgba(13,91,209,0.22)]"
                  : "border border-[#DDE3EE] bg-white text-[#3B4557] hover:border-[#0056D2] hover:text-[#0056D2]"
              }`}
            >
              Waitlist Registrations
            </button>
          </div>

          {activeTab === "raffle" ? (
            <div className="space-y-5">
              {raffleRegistrations.length === 0 ? (
                <div className="rounded-[32px] border border-white/75 bg-white/88 px-8 py-20 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">
                    No raffle registrations yet
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B7A99]">
                    Once someone submits the raffle form, they will show up here.
                  </p>
                </div>
              ) : (
                <>
                  <section className="rounded-[30px] border border-white/75 bg-white/88 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                    <div className="flex flex-col gap-5">
                      {hasActiveRaffleFilters ? (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setRaffleSearch("");
                              setCourseFilter("");
                              setCountryFilter("");
                              setFromDate("");
                              setToDate("");
                              setRafflePage(1);
                            }}
                            className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : null}

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2.2fr)_minmax(220px,1fr)_minmax(180px,1fr)_minmax(160px,0.9fr)_minmax(160px,0.9fr)]">
                        <label className="block">
                          <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                            Search
                          </span>
                          <input
                            type="search"
                            value={raffleSearch}
                            onChange={(event) => {
                              setRaffleSearch(event.target.value);
                              setRafflePage(1);
                            }}
                            placeholder="Search names, emails, phone numbers, reasons..."
                            className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition placeholder:text-[#8A96AD] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                            Country
                          </span>
                          <select
                            value={countryFilter}
                            onChange={(event) => {
                              setCountryFilter(event.target.value);
                              setRafflePage(1);
                            }}
                            className="mt-1.5 w-full appearance-none rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                          >
                            <option value="">All countries</option>
                            {countryOptions.map((countryOption) => (
                              <option key={countryOption.country} value={countryOption.country}>
                                {countryOption.flag} {countryOption.country}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                            Course
                          </span>
                          <select
                            value={courseFilter}
                            onChange={(event) => {
                              setCourseFilter(event.target.value);
                              setRafflePage(1);
                            }}
                            className="mt-1.5 w-full appearance-none rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                          >
                            <option value="">All courses</option>
                            {courseOptions.map((courseOption) => (
                              <option key={courseOption} value={courseOption}>
                                {courseOption}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                            From
                          </span>
                          <input
                            type="date"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={(event) => {
                              setFromDate(event.target.value);
                              setRafflePage(1);
                            }}
                            className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                            To
                          </span>
                          <input
                            type="date"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={(event) => {
                              setToDate(event.target.value);
                              setRafflePage(1);
                            }}
                            className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                          />
                        </label>
                      </div>
                    </div>
                  </section>

                  {filteredRaffle && filteredRaffle.length > 0 ? (
                    <RegistrationsTable
                      registrations={filteredRaffle}
                      currentPage={rafflePage}
                      copiedValue={copiedValue}
                      onCopy={handleCopy}
                      onPageChange={setRafflePage}
                    />
                  ) : (
                    <div className="rounded-[32px] border border-dashed border-[#D7E0ED] bg-white/88 px-8 py-18 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                      <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">
                        No matching registrations
                      </h2>
                      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B7A99]">
                        Adjust the search terms or widen the date and country filters to bring more entries back into view.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {waitlistEntries.length === 0 ? (
                <div className="rounded-[32px] border border-white/75 bg-white/88 px-8 py-20 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">
                    No waitlist entries yet
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B7A99]">
                    Once someone joins the waitlist, they will show up here.
                  </p>
                </div>
              ) : (
                <>
                  <section className="rounded-[30px] border border-white/75 bg-white/88 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <label className="block sm:max-w-md">
                        <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                          Search
                        </span>
                        <input
                          type="search"
                          value={waitlistSearch}
                          onChange={(e) => {
                            setWaitlistSearch(e.target.value);
                            setWaitlistPage(1);
                          }}
                          placeholder="Search names or emails..."
                          className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition placeholder:text-[#8A96AD] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                        />
                      </label>
                      {waitlistSearch.trim() ? (
                        <button
                          type="button"
                          onClick={() => {
                            setWaitlistSearch("");
                            setWaitlistPage(1);
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
                              Locale
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
                          {waitlistPageItems.map((entry) => (
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
                                <span className="inline-flex rounded-full bg-[#EAF2FF] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0056D2]">
                                  {entry.locale}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-[#6B7A99]">
                                {formatDate(entry.created_at)}
                              </td>
                              <td className="px-5 py-3.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(`email:${entry.id}`, entry.email)}
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

                    {waitlistTotalPages > 1 ? (
                      <div className="flex items-center justify-between border-t border-[#E8EDF5] px-5 py-4">
                        <button
                          type="button"
                          disabled={waitlistValidPage <= 1}
                          onClick={() => setWaitlistPage(waitlistValidPage - 1)}
                          className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Previous
                        </button>
                        <span className="text-sm font-semibold text-[#6B7A99]">
                          Page {waitlistValidPage} of {waitlistTotalPages}
                        </span>
                        <button
                          type="button"
                          disabled={waitlistValidPage >= waitlistTotalPages}
                          onClick={() => setWaitlistPage(waitlistValidPage + 1)}
                          className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
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
            Admin Dashboard
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
