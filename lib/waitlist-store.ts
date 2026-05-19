import { createClient } from "@supabase/supabase-js";

export interface WaitlistInput {
  name: string;
  email: string;
  locale?: string;
}

export interface WaitlistRecord {
  id: number;
  name: string;
  email: string;
  locale: string;
  created_at: string;
}

interface WaitlistLookup {
  id: number;
}

export interface WaitlistPersistence {
  close?: () => Promise<void> | void;
  deleteByEmail: (email: string) => Promise<void>;
  findByEmail: (email: string) => Promise<WaitlistLookup | null>;
  insert: (input: WaitlistInput) => Promise<WaitlistRecord>;
  list: () => Promise<WaitlistRecord[]>;
}

export interface WaitlistStore {
  close: () => Promise<void>;
  deleteEntry: (email: string) => Promise<void>;
  listEntries: () => Promise<WaitlistRecord[]>;
  saveEntry: (input: WaitlistInput) => Promise<WaitlistRecord>;
}

interface CreateWaitlistStoreOptions {
  persistence?: WaitlistPersistence;
}

export class DuplicateWaitlistEmailError extends Error {
  constructor(email: string) {
    super(`A waitlist entry already exists for ${email}.`);
    this.name = "DuplicateWaitlistEmailError";
  }
}

export class MissingStoreConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingStoreConfigError";
  }
}

export class MissingWaitlistTableError extends Error {
  constructor() {
    super("Supabase waiting_list table is missing. Apply supabase/waiting-list.sql.");
    this.name = "MissingWaitlistTableError";
  }
}

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function getRequiredEnv(name: string, ...fallbackNames: string[]) {
  const value = getEnvValue(name, ...fallbackNames);
  if (!value) {
    throw new MissingStoreConfigError(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeEntry(input: WaitlistInput): WaitlistInput {
  return {
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    locale: (input.locale ?? "en").trim().toLowerCase(),
  };
}

function isDuplicateConstraintError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  return "code" in error && error.code === "23505";
}

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? error.code : undefined;
  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  return code === "PGRST205" || code === "42P01" || message.includes("public.waiting_list");
}

function createSupabasePersistence(): WaitlistPersistence {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return {
    deleteByEmail: async (email) => {
      const { error } = await client.from("waiting_list").delete().eq("email", email);
      if (error) throw error;
    },
    findByEmail: async (email) => {
      const { data, error } = await client
        .from("waiting_list")
        .select("id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ? { id: data.id } : null;
    },
    insert: async (input) => {
      const { data, error } = await client
        .from("waiting_list")
        .insert(input)
        .select("id, name, email, locale, created_at")
        .single();
      if (error) throw error;
      return data as WaitlistRecord;
    },
    list: async () => {
      const { data, error } = await client
        .from("waiting_list")
        .select("id, name, email, locale, created_at")
        .order("id", { ascending: false });
      if (error) throw error;
      return (data ?? []) as WaitlistRecord[];
    },
  };
}

export function createWaitlistStore(options: CreateWaitlistStoreOptions = {}): WaitlistStore {
  const persistence = options.persistence ?? createSupabasePersistence();

  return {
    close: async () => {
      await persistence.close?.();
    },
    deleteEntry: async (email) => {
      const normalizedEmail = email.trim().toLowerCase();
      try {
        await persistence.deleteByEmail(normalizedEmail);
      } catch (error) {
        if (isMissingTableError(error)) throw new MissingWaitlistTableError();
        throw error;
      }
    },
    listEntries: async () => {
      try {
        return await persistence.list();
      } catch (error) {
        if (isMissingTableError(error)) throw new MissingWaitlistTableError();
        throw error;
      }
    },
    saveEntry: async (input) => {
      const normalized = normalizeEntry(input);
      let existing;

      try {
        existing = await persistence.findByEmail(normalized.email);
      } catch (error) {
        if (isMissingTableError(error)) throw new MissingWaitlistTableError();
        throw error;
      }

      if (existing) {
        throw new DuplicateWaitlistEmailError(normalized.email);
      }

      try {
        return await persistence.insert(normalized);
      } catch (error) {
        if (isDuplicateConstraintError(error)) {
          throw new DuplicateWaitlistEmailError(normalized.email);
        }
        if (isMissingTableError(error)) throw new MissingWaitlistTableError();
        throw error;
      }
    },
  };
}

declare global {
  var __pedagemyWaitlistStore: WaitlistStore | undefined;
}

export function getWaitlistStore() {
  if (!globalThis.__pedagemyWaitlistStore) {
    globalThis.__pedagemyWaitlistStore = createWaitlistStore();
  }
  return globalThis.__pedagemyWaitlistStore;
}
