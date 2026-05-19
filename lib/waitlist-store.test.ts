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
    insert: async (input: { name: string; email: string }) => {
      const record: WaitlistRecord = {
        id: nextId++,
        name: input.name,
        email: input.email,
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

test("stores a waitlist entry with normalized email and name", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  const entry = await store.saveEntry({
    name: "  Ada Lovelace  ",
    email: "  ADA@EXAMPLE.COM ",
  });

  assert.equal(entry.email, "ada@example.com");
  assert.equal(entry.name, "Ada Lovelace");

  const entries = await store.listEntries();
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.email, "ada@example.com");
});

test("rejects duplicate emails case-insensitively", async () => {
  const store = createWaitlistStore({
    persistence: createInMemoryPersistence(),
  });

  await store.saveEntry({ name: "Ada Lovelace", email: "ada@example.com" });

  await assert.rejects(
    () => store.saveEntry({ name: "Ada Lovelace", email: " ADA@EXAMPLE.COM " }),
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
