import { createClient } from "@supabase/supabase-js";

export interface RegistrationInput {
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
  locale?: string;
}

export interface RegistrationRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  reason: string;
  created_at: string;
}

interface RegistrationLookup {
  id: number;
}

export interface RegistrationPersistence {
  close?: () => Promise<void> | void;
  findByEmail: (email: string) => Promise<RegistrationLookup | null>;
  insert: (input: Omit<RegistrationInput, "locale">) => Promise<RegistrationRecord>;
  list: () => Promise<RegistrationRecord[]>;
}

export interface RaffleStore {
  close: () => Promise<void>;
  isValidAdminLogin: (email: string, password: string) => Promise<boolean>;
  listRegistrations: () => Promise<RegistrationRecord[]>;
  saveRegistration: (input: RegistrationInput) => Promise<RegistrationRecord>;
}

interface CreateRaffleStoreOptions {
  adminEmail?: string;
  adminPassword?: string;
  persistence?: RegistrationPersistence;
}

export class DuplicateRegistrationError extends Error {
  constructor(email: string) {
    super(`A registration already exists for ${email}.`);
    this.name = "DuplicateRegistrationError";
  }
}

export class MissingStoreConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingStoreConfigError";
  }
}

export class MissingRegistrationsTableError extends Error {
  constructor() {
    super("Supabase registrations table is missing. Apply supabase/registrations.sql.");
    this.name = "MissingRegistrationsTableError";
  }
}

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
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

function normalizeRegistration(input: RegistrationInput): Omit<RegistrationInput, "locale"> {
  return {
    course: input.course.trim(),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    reason: input.reason.trim(),
  };
}

function isDuplicateConstraintError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === "23505";
}

function isMissingRegistrationsTableError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  const message = "message" in error && typeof error.message === "string" ? error.message : "";

  return code === "PGRST205" || code === "42P01" || message.includes("public.registrations");
}

function createSupabasePersistence(): RegistrationPersistence {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return {
    findByEmail: async (email) => {
      const { data, error } = await client
        .from("registrations")
        .select("id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ? { id: data.id } : null;
    },
    insert: async (input) => {
      const { data, error } = await client
        .from("registrations")
        .insert(input)
        .select("id, name, phone, email, course, reason, created_at")
        .single();

      if (error) {
        throw error;
      }

      return data as RegistrationRecord;
    },
    list: async () => {
      const { data, error } = await client
        .from("registrations")
        .select("id, name, phone, email, course, reason, created_at")
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as RegistrationRecord[];
    },
  };
}

export function createRaffleStore(options: CreateRaffleStoreOptions = {}): RaffleStore {
  const adminEmail = (
    options.adminEmail ??
    process.env.PEDAGEMY_ADMIN_EMAIL ??
    "admin@pedagemy.com"
  )
    .trim()
    .toLowerCase();
  const adminPassword = options.adminPassword ?? process.env.PEDAGEMY_ADMIN_PASSWORD ?? "pedagemy2024";
  const persistence = options.persistence ?? createSupabasePersistence();

  return {
    close: async () => {
      await persistence.close?.();
    },
    isValidAdminLogin: async (email, password) => {
      return email.trim().toLowerCase() === adminEmail && password.trim() === adminPassword;
    },
    listRegistrations: async () => {
      try {
        return await persistence.list();
      } catch (error) {
        if (isMissingRegistrationsTableError(error)) {
          throw new MissingRegistrationsTableError();
        }

        throw error;
      }
    },
    saveRegistration: async (input) => {
      const normalized = normalizeRegistration(input);
      let existingRegistration;

      try {
        existingRegistration = await persistence.findByEmail(normalized.email);
      } catch (error) {
        if (isMissingRegistrationsTableError(error)) {
          throw new MissingRegistrationsTableError();
        }

        throw error;
      }

      if (existingRegistration) {
        throw new DuplicateRegistrationError(normalized.email);
      }

      try {
        return await persistence.insert(normalized);
      } catch (error) {
        if (isDuplicateConstraintError(error)) {
          throw new DuplicateRegistrationError(normalized.email);
        }

        if (isMissingRegistrationsTableError(error)) {
          throw new MissingRegistrationsTableError();
        }

        throw error;
      }
    },
  };
}

declare global {
  var __pedagemyRaffleStore: RaffleStore | undefined;
}

export function getRaffleStore() {
  if (!globalThis.__pedagemyRaffleStore) {
    globalThis.__pedagemyRaffleStore = createRaffleStore();
  }

  return globalThis.__pedagemyRaffleStore;
}
