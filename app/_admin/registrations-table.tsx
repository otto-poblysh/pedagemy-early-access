"use client";

import CountryList from "country-list-with-dial-code-and-flag";

import { Icon } from "@/components/icons";

const countryListApi =
  (CountryList as typeof CountryList & { default?: typeof CountryList }).default ?? CountryList;

const countryCodeOptions = countryListApi
  .getAll()
  .map((country) => ({
    country: country.name,
    flag: country.flag,
    value: country.dialCode,
  }))
  .sort((left, right) => right.value.length - left.value.length);

export interface Registration {
  course: string;
  created_at: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  reason: string;
}

export interface RegistrationCountry {
  country: string;
  flag: string;
  value: string;
}

export interface RegistrationFilters {
  course: string;
  country: string;
  from: string;
  query: string;
  to: string;
}

interface PaginatedRegistration extends Registration {
  rowNumber: number;
}

interface RegistrationsTableProps {
  copiedValue: string | null;
  currentPage: number;
  onCopy: (label: string, value: string) => void;
  onPageChange: (page: number) => void;
  pageSize?: number;
  registrations: Registration[];
}

const REGISTRATIONS_PER_PAGE = 8;
const CSV_BYTE_ORDER_MARK = "\uFEFF";
const CSV_DELIMITER = ",";
const CSV_NEWLINE = "\r\n";

function normalizePhoneNumber(phoneNumber: string) {
  const trimmedPhoneNumber = phoneNumber.trim();
  const digitsOnly = trimmedPhoneNumber.replace(/\D/g, "");

  return trimmedPhoneNumber.startsWith("+") ? `+${digitsOnly}` : digitsOnly;
}

function getRegistrationDateKey(createdAt: string) {
  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().slice(0, 10);
}

export function getRegistrationCountry(phoneNumber: string): RegistrationCountry | null {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  return (
    countryCodeOptions.find((countryOption) =>
      normalizedPhoneNumber.startsWith(normalizePhoneNumber(countryOption.value))
    ) ?? null
  );
}

export function buildCountryFilterOptions(registrations: Registration[]) {
  const uniqueCountries = new Map<string, RegistrationCountry>();

  for (const registration of registrations) {
    const country = getRegistrationCountry(registration.phone);

    if (country && !uniqueCountries.has(country.country)) {
      uniqueCountries.set(country.country, country);
    }
  }

  return Array.from(uniqueCountries.values()).sort((left, right) => left.country.localeCompare(right.country));
}

export function buildCourseFilterOptions(registrations: Registration[]) {
  return Array.from(new Set(registrations.map((registration) => registration.course))).sort((left, right) =>
    left.localeCompare(right)
  );
}

function escapeCsvValue(value: string) {
  return `"${value.replaceAll("\"", '""')}"`;
}

export function buildRegistrationsCsv(registrations: Registration[]) {
  const headerRow = ["Name", "Email", "Phone", "Country", "Course", "Reason", "Submitted"]
    .map((value) => escapeCsvValue(value))
    .join(CSV_DELIMITER);
  const dataRows = registrations.map((registration) => {
    const registrationCountry = getRegistrationCountry(registration.phone);

    return [
      registration.name,
      registration.email,
      registration.phone,
      registrationCountry?.country ?? "",
      registration.course,
      registration.reason,
      registration.created_at,
    ]
      .map((value) => escapeCsvValue(value))
      .join(CSV_DELIMITER);
  });

  return [
    `${CSV_BYTE_ORDER_MARK}sep=${CSV_DELIMITER}`,
    headerRow,
    ...dataRows,
  ].join(CSV_NEWLINE);
}

export function filterRegistrations(registrations: Registration[], filters: RegistrationFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return registrations.filter((registration) => {
    const registrationCountry = getRegistrationCountry(registration.phone);
    const registrationDateKey = getRegistrationDateKey(registration.created_at);

    if (filters.country && registrationCountry?.country !== filters.country) {
      return false;
    }

    if (filters.course && registration.course !== filters.course) {
      return false;
    }

    if (filters.from && (!registrationDateKey || registrationDateKey < filters.from)) {
      return false;
    }

    if (filters.to && (!registrationDateKey || registrationDateKey > filters.to)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      registration.name,
      registration.email,
      registration.phone,
      registration.course,
      registration.reason,
      registrationCountry?.country ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
}

export function formatSubmissionDate(createdAt: string) {
  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid submission date";
  }

  return parsedDate.toLocaleString();
}

export function paginateRegistrations(
  registrations: Registration[],
  currentPage: number,
  pageSize = REGISTRATIONS_PER_PAGE
) {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(registrations.length / safePageSize));
  const normalizedPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (normalizedPage - 1) * safePageSize;

  return {
    currentPage: normalizedPage,
    items: registrations.slice(startIndex, startIndex + safePageSize).map((registration, index) => ({
      ...registration,
      rowNumber: startIndex + index + 1,
    })),
    totalPages,
  };
}

export function RegistrationsTable({
  copiedValue,
  currentPage,
  onCopy,
  onPageChange,
  pageSize = REGISTRATIONS_PER_PAGE,
  registrations,
}: RegistrationsTableProps) {
  const { items, totalPages } = paginateRegistrations(registrations, currentPage, pageSize);

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/75 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4F7FC] text-[11px] font-black uppercase tracking-[0.14em] text-[#62708D]">
            <tr>
              <th className="w-16 px-4 py-4">#</th>
              <th className="min-w-60 px-4 py-4">Entrant</th>
              <th className="min-w-48 px-4 py-4">Phone</th>
              <th className="min-w-50 px-4 py-4">Course</th>
              <th className="min-w-[320px] px-4 py-4">Reason</th>
              <th className="min-w-44 px-4 py-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {items.map((registration: PaginatedRegistration) => {
              const copiedName = copiedValue === `name:${registration.id}`;
              const copiedPhone = copiedValue === `phone:${registration.id}`;
              const registrationCountry = getRegistrationCountry(registration.phone);

              return (
                <tr
                  key={registration.id}
                  className="border-t border-[#E2E8F2] align-top text-[#3B4557] transition-colors hover:bg-[#F8FAFD]"
                >
                  <td className="px-4 py-5 align-top text-sm font-bold tabular-nums text-[#8A96AD]">
                    {registration.rowNumber}
                  </td>
                  <td className="px-4 py-5">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        {registrationCountry ? (
                          <span
                            aria-label={`${registrationCountry.country} flag`}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9E1EE] bg-[#F5F8FF] text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                          >
                            <span aria-hidden="true">{registrationCountry.flag}</span>
                          </span>
                        ) : null}
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#182032]">
                            {registration.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[13px] leading-5 text-[#6B7A99]">
                            <p className="min-w-0 break-all">{registration.email}</p>
                            <button
                              type="button"
                              aria-label={`Copy name ${registration.name}`}
                              onClick={() => onCopy(`name:${registration.id}`, registration.name)}
                              className="inline-flex shrink-0 items-center justify-center text-[#4F5D78] transition hover:text-[#0D5BD1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5BD1]/25"
                            >
                              <Icon name={copiedName ? "check" : "copy"} className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <p className="whitespace-nowrap text-[14px] font-medium text-[#243047]">
                        {registration.phone}
                      </p>
                      <button
                        type="button"
                        aria-label={`Copy phone number ${registration.phone}`}
                        onClick={() => onCopy(`phone:${registration.id}`, registration.phone)}
                        className="inline-flex shrink-0 items-center justify-center text-[#4F5D78] transition hover:text-[#0D5BD1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5BD1]/25"
                      >
                        <Icon name={copiedPhone ? "check" : "copy"} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="inline-flex rounded-full bg-[#EAF2FF] px-3 py-1.5 text-[12px] font-bold tracking-[0.01em] text-[#0D5BD1]">
                      {registration.course}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-[#6B7A99]">
                    <p className="max-w-136 text-[13px] leading-6 text-[#5B6985]">{registration.reason}</p>
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap text-[13px] font-medium text-[#6B7A99]">
                    {formatSubmissionDate(registration.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#E2E8F2] bg-[#FCFDFF] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-[13px] font-medium text-[#6B7A99]">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full border border-[#D9E1EE] bg-white px-4 py-2 text-[13px] font-semibold text-[#364256] transition hover:border-[#0D5BD1] hover:text-[#0D5BD1] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
                className={`h-10 min-w-10 rounded-full px-3 text-[13px] font-semibold tabular-nums transition ${
                  isActive
                    ? "bg-[#0D5BD1] text-white shadow-[0_12px_24px_rgba(13,91,209,0.22)]"
                    : "border border-[#D9E1EE] bg-white text-[#364256] hover:border-[#0D5BD1] hover:text-[#0D5BD1]"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-full border border-[#D9E1EE] bg-white px-4 py-2 text-[13px] font-semibold text-[#364256] transition hover:border-[#0D5BD1] hover:text-[#0D5BD1] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}