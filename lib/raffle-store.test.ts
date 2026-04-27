import { afterEach, test } from "node:test";
import assert from "node:assert/strict";

import {
  createRaffleStore,
  DuplicateRegistrationError,
  MissingRegistrationsTableError,
  type RegistrationRecord,
} from "./raffle-store";

function createInMemoryPersistence() {
  const registrations: RegistrationRecord[] = [];
  let nextId = 1;

  return {
    findByEmail: async (email: string) => {
      const existing = registrations.find((registration) => registration.email === email);
      return existing ? { id: existing.id } : null;
    },
    insert: async (input: {
      course: string;
      email: string;
      name: string;
      phone: string;
      reason: string;
    }) => {
      const record: RegistrationRecord = {
        id: nextId++,
        name: input.name,
        phone: input.phone,
        email: input.email,
        course: input.course,
        reason: input.reason,
        created_at: new Date("2026-04-27T00:00:00.000Z").toISOString(),
      };

      registrations.unshift(record);
      return record;
    },
    list: async () => registrations,
  };
}

afterEach(() => {
  delete process.env.PEDAGEMY_ADMIN_EMAIL;
  delete process.env.PEDAGEMY_ADMIN_PASSWORD;
});

test("uses env-backed admin credentials and stores normalized registrations asynchronously", async () => {
  process.env.PEDAGEMY_ADMIN_EMAIL = "admin@pedagemy.com";
  process.env.PEDAGEMY_ADMIN_PASSWORD = "pedagemy2024";

  const store = createRaffleStore({
    persistence: createInMemoryPersistence(),
  });

  assert.equal(await store.isValidAdminLogin("admin@pedagemy.com", "pedagemy2024"), true);
  assert.equal(await store.isValidAdminLogin("admin@pedagemy.com", "wrong-password"), false);

  const registration = await store.saveRegistration({
    name: "  Ada Lovelace  ",
    phone: "  +234 000 000 0000 ",
    email: "  ADA@EXAMPLE.COM ",
    course: "Tech Career Launchpad",
    reason: "I want to sharpen my technical skills.",
  });

  assert.equal(registration.email, "ada@example.com");
  assert.equal(registration.name, "Ada Lovelace");
  assert.equal(registration.phone, "+234 000 000 0000");

  const registrations = await store.listRegistrations();
  assert.equal(registrations.length, 1);
  assert.deepEqual(registrations[0], {
    id: registration.id,
    name: "Ada Lovelace",
    phone: "+234 000 000 0000",
    course: "Tech Career Launchpad",
    email: "ada@example.com",
    reason: "I want to sharpen my technical skills.",
    created_at: registration.created_at,
  });
});

test("rejects duplicate registration emails case-insensitively", async () => {
  const store = createRaffleStore({
    persistence: createInMemoryPersistence(),
  });

  await store.saveRegistration({
    name: "Ada Lovelace",
    phone: "+234 000 000 0000",
    email: "ada@example.com",
    course: "Tech Career Launchpad",
    reason: "First application.",
  });

  await assert.rejects(
    () =>
      store.saveRegistration({
        name: "Ada Lovelace",
        phone: "+234 000 000 0000",
        email: " ADA@EXAMPLE.COM ",
        course: "Leadership Accelerator",
        reason: "Second application.",
      }),
    DuplicateRegistrationError,
  );

  assert.equal((await store.listRegistrations()).length, 1);
});

test("surfaces a missing registrations table as a dedicated setup error", async () => {
  const store = createRaffleStore({
    persistence: {
      findByEmail: async () => null,
      insert: async () => {
        throw {
          code: "PGRST205",
          message: "Could not find the table 'public.registrations' in the schema cache",
        };
      },
      list: async () => [],
    },
  });

  await assert.rejects(
    () =>
      store.saveRegistration({
        name: "Ada Lovelace",
        phone: "+234 000 000 0000",
        email: "ada@example.com",
        course: "Tech Career Launchpad",
        reason: "First application.",
      }),
    MissingRegistrationsTableError,
  );
});
