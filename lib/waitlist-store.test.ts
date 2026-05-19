import { afterEach, test } from "node:test";
import assert from "node:assert/strict";

import {
  createWaitlistStore,
  DuplicateWaitlistEmailError,
  MissingWaitlistTableError,
  type WaitlistRecord,
} from "./waitlist-store";

function createInMemoryPersistence() {
  const entries: WaitlistRecord[] = [];
  let nextId = 1;

  return {
    deleteByEmail: async (email: string) => {
      const index = entries.findIndex((e) => e.email === email);
      if (index >= 0) entries.splice(index, 1);
    },
    findByEmail: async (email: string) => {
      const existing = entries.find((e) => e.email === email);
      return existing ? { id: existing.id } : null;
    },
    insert: async (input: { name: string; email: string; locale?: string }) => {
      const record: WaitlistRecord = {
        id: nextId++,
        name: input.name,
        email: input.email,
        locale: input.locale ?? "en",
        created_at: new Date("2026-05-19T00:00:00.000Z").toISOString(),
      };
      entries.unshift(record);
      return record;
    },
    list: async () => entries,
  };
}

function resetGlobalStore() {
  const globalStore = globalThis as typeof globalThis & {
    __pedagemyWaitlistStore?: { close?: () => Promise<void> | void };
  };
  void globalStore.__pedagemyWaitlistStore?.close?.();
  globalStore.__pedagemyWaitlistStore = undefined;
}

afterEach(() => {
  resetGlobalStore();
});

test("stores a waitlist entry with normalized email, name and locale", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  const entry = await store.saveEntry({
    name: "  Ada Lovelace  ",
    email: "  ADA@EXAMPLE.COM ",
    locale: "  FR ",
  });

  assert.equal(entry.email, "ada@example.com");
  assert.equal(entry.name, "Ada Lovelace");
  assert.equal(entry.locale, "fr");

  const entries = await store.listEntries();
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.email, "ada@example.com");
});

test("defaults locale to en when not provided", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  const entry = await store.saveEntry({
    name: "Grace Hopper",
    email: "grace@example.com",
  });

  assert.equal(entry.locale, "en");
});

test("rejects duplicate emails case-insensitively", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  await store.saveEntry({ name: "Ada Lovelace", email: "ada@example.com", locale: "fr" });

  await assert.rejects(
    () => store.saveEntry({ name: "Ada Lovelace", email: " ADA@EXAMPLE.COM ", locale: "es" }),
    DuplicateWaitlistEmailError,
  );

  assert.equal((await store.listEntries()).length, 1);
});

test("surfaces missing table as dedicated setup error", async () => {
  const store = createWaitlistStore({
    persistence: {
      deleteByEmail: async () => {},
      findByEmail: async () => null,
      insert: async () => {
        throw {
          code: "PGRST205",
          message: "Could not find the table 'public.waiting_list' in the schema cache",
        };
      },
      list: async () => [],
    },
  });

  await assert.rejects(
    () => store.saveEntry({ name: "Ada Lovelace", email: "ada@example.com" }),
    MissingWaitlistTableError,
  );
});

test("lists all entries in descending id order", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  await store.saveEntry({ name: "Ada Lovelace", email: "ada@example.com", locale: "fr" });
  await store.saveEntry({ name: "Grace Hopper", email: "grace@example.com", locale: "es" });

  const entries = await store.listEntries();
  assert.equal(entries.length, 2);
  assert.equal(entries[0]!.name, "Grace Hopper");
  assert.equal(entries[0]!.locale, "es");
  assert.equal(entries[1]!.name, "Ada Lovelace");
  assert.equal(entries[1]!.locale, "fr");
});
