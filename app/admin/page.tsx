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
} from "./registrations-table";

export default function DefinitelyNotASpreadsheetPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredRegistrations = registrations
    ? filterRegistrations(registrations, {
        course: courseFilter,
        country: countryFilter,
        from: fromDate,
        query: deferredSearchQuery,
        to: toDate,
      })
    : null;
  const courseOptions = registrations ? buildCourseFilterOptions(registrations) : [];
  const countryOptions = registrations ? buildCountryFilterOptions(registrations) : [];
  const hasActiveFilters = Boolean(searchQuery.trim() || courseFilter || countryFilter || fromDate || toDate);

  useEffect(() => {
    if (!copiedValue) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedValue(null), 1600);

    return () => window.clearTimeout(timeout);
  }, [copiedValue]);

  useEffect(() => {
    if (!filteredRegistrations) {
      return;
    }

    const { currentPage: normalizedPage } = paginateRegistrations(filteredRegistrations, currentPage);

    if (normalizedPage !== currentPage) {
      setCurrentPage(normalizedPage);
    }
  }, [currentPage, filteredRegistrations]);

  const exportableRegistrations = filteredRegistrations ?? [];

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(label);
    } catch {
      setError("Could not copy to clipboard. Please try again.");
    }
  };

  const handleExportCsv = () => {
    if (exportableRegistrations.length === 0) {
      setError("There is no data to export.");
      return;
    }

    try {
      setError(null);

      const csv = buildRegistrationsCsv(exportableRegistrations);
      const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const downloadUrl = window.URL.createObjectURL(csvBlob);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = `pedagemy-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      setError("Could not export CSV. Please try again.");
    }
  };

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
      setCurrentPage(1);
      setCopiedValue(null);
      setSearchQuery("");
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

  if (registrations) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,91,209,0.12),transparent_28%),linear-gradient(180deg,#F8FAFD_0%,#EEF3F9_100%)] px-6 py-10 font-(family-name:--font-dm-sans) text-[#1A1A2E] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-340">
          <div className="mb-6 flex flex-col gap-5 rounded-[32px] border border-white/75 bg-white/86 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[clamp(28px,4vw,44px)] font-black tracking-[-0.04em] text-balance text-[#182032]">
                Registrations Admin
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6B7A99]">
                Showing {filteredRegistrations?.length ?? 0} of {registrations.length} {registrations.length === 1 ? "entry" : "entries"}.
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
                disabled={exportableRegistrations.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Icon name="download" className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegistrations(null);
                  setPassword("");
                  setCurrentPage(1);
                  setCopiedValue(null);
                  setSearchQuery("");
                  setCourseFilter("");
                  setCountryFilter("");
                  setFromDate("");
                  setToDate("");
                }}
                className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
              >
                Lock it back up
              </button>
            </div>
          </div>

          {registrations.length === 0 ? (
            <div className="rounded-[32px] border border-white/75 bg-white/88 px-8 py-20 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">No registrations yet</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B7A99]">
                Once someone submits the landing page form, they will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="rounded-[30px] border border-white/75 bg-white/88 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                <div className="flex flex-col gap-5">
                  {hasActiveFilters ? (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setCourseFilter("");
                          setCountryFilter("");
                          setFromDate("");
                          setToDate("");
                          setCurrentPage(1);
                        }}
                        className="rounded-full border border-[#DDE3EE] bg-white px-4 py-2 text-sm font-bold text-[#3B4557] transition hover:border-[#0056D2] hover:text-[#0056D2]"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2.2fr)_minmax(220px,1fr)_minmax(180px,1fr)_minmax(160px,0.9fr)_minmax(160px,0.9fr)]">
                    <label className="block">
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">Search</span>
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => {
                          setSearchQuery(event.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search names, emails, phone numbers, reasons..."
                        className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition placeholder:text-[#8A96AD] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">Country</span>
                      <select
                        value={countryFilter}
                        onChange={(event) => {
                          setCountryFilter(event.target.value);
                          setCurrentPage(1);
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
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">Course</span>
                      <select
                        value={courseFilter}
                        onChange={(event) => {
                          setCourseFilter(event.target.value);
                          setCurrentPage(1);
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
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">From</span>
                      <input
                        type="date"
                        value={fromDate}
                        max={toDate || undefined}
                        onChange={(event) => {
                          setFromDate(event.target.value);
                          setCurrentPage(1);
                        }}
                        className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">To</span>
                      <input
                        type="date"
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={(event) => {
                          setToDate(event.target.value);
                          setCurrentPage(1);
                        }}
                        className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                      />
                    </label>
                  </div>
                </div>
              </section>

              {filteredRegistrations && filteredRegistrations.length > 0 ? (
                <RegistrationsTable
                  registrations={filteredRegistrations}
                  currentPage={currentPage}
                  copiedValue={copiedValue}
                  onCopy={handleCopy}
                  onPageChange={setCurrentPage}
                />
              ) : (
                <div className="rounded-[32px] border border-dashed border-[#D7E0ED] bg-white/88 px-8 py-18 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">No matching registrations</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B7A99]">
                    Adjust the search terms or widen the date and country filters to bring more entries back into view.
                  </p>
                </div>
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
            Registrations Admin
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
