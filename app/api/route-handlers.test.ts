import { afterEach, test } from "node:test";
import assert from "node:assert/strict";

import { POST as adminDataPost } from "./admin/data/route";
import { POST as registerPost } from "./register/route";
import {
  createRaffleStore,
  type RegistrationRecord,
  type RegistrationPersistence,
} from "@/lib/raffle-store";

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

function seedStore() {
  process.env.PEDAGEMY_ADMIN_EMAIL = "admin@pedagemy.com";
  process.env.PEDAGEMY_ADMIN_PASSWORD = "pedagemy2024";

  const globalStore = globalThis as typeof globalThis & {
    __pedagemyRaffleStore?: ReturnType<typeof createRaffleStore>;
  };

  globalStore.__pedagemyRaffleStore = createRaffleStore({
    persistence: createInMemoryPersistence(),
  });
}

function seedStoreWithPersistence(persistence: RegistrationPersistence) {
  process.env.PEDAGEMY_ADMIN_EMAIL = "admin@pedagemy.com";
  process.env.PEDAGEMY_ADMIN_PASSWORD = "pedagemy2024";

  const globalStore = globalThis as typeof globalThis & {
    __pedagemyRaffleStore?: ReturnType<typeof createRaffleStore>;
  };

  globalStore.__pedagemyRaffleStore = createRaffleStore({
    persistence,
  });
}

function resetGlobalStore() {
  const globalStore = globalThis as typeof globalThis & {
    __pedagemyRaffleStore?: { close?: () => Promise<void> | void };
  };

  void globalStore.__pedagemyRaffleStore?.close?.();
  globalStore.__pedagemyRaffleStore = undefined;
}

afterEach(() => {
  resetGlobalStore();
  delete process.env.PEDAGEMY_ADMIN_EMAIL;
  delete process.env.PEDAGEMY_ADMIN_PASSWORD;
  delete process.env.RESEND_API_KEY;
});

test("stores a registration and returns it to an authenticated admin", async () => {
  resetGlobalStore();
  seedStore();

  const registerResponse = await registerPost(
    new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Grace Hopper",
        phone: "+1 555 0100",
        email: "GRACE@example.com",
        course: "Leadership Accelerator Program",
        reason: "I want to get sharper at leading teams.",
      }),
    }) as never,
  );

  assert.equal(registerResponse.status, 200);
  assert.deepEqual(await registerResponse.json(), { ok: true });

  const adminResponse = await adminDataPost(
    new Request("http://localhost/api/admin/data", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "admin@pedagemy.com",
        password: "pedagemy2024",
      }),
    }) as never,
  );

  assert.equal(adminResponse.status, 200);

  const adminPayload = (await adminResponse.json()) as {
    ok: boolean;
    registrations: Array<{
      course: string;
      email: string;
      name: string;
      phone: string;
      reason: string;
    }>;
  };

  assert.equal(adminPayload.ok, true);
  assert.equal(adminPayload.registrations.length, 1);

  const [registration] = adminPayload.registrations;
  assert.equal(registration?.email, "grace@example.com");
  assert.equal(registration?.name, "Grace Hopper");
  assert.equal(registration?.course, "Leadership Accelerator Program");
  assert.equal(registration?.phone, "+1 555 0100");
  assert.equal(registration?.reason, "I want to get sharper at leading teams.");
});

test("rejects invalid admin credentials", async () => {
  resetGlobalStore();
  seedStore();

  const response = await adminDataPost(
    new Request("http://localhost/api/admin/data", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "admin@pedagemy.com",
        password: "nope",
      }),
    }) as never,
  );

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Invalid credentials" });
});

test("rejects duplicate registration emails", async () => {
  resetGlobalStore();
  seedStore();

  await registerPost(
    new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Grace Hopper",
        phone: "+1 555 0100",
        email: "grace@example.com",
        course: "Leadership Accelerator Program",
        reason: "I want to get sharper at leading teams.",
      }),
    }) as never,
  );

  const duplicateResponse = await registerPost(
    new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Grace Hopper",
        phone: "+1 555 0100",
        email: "GRACE@example.com",
        course: "Leadership Accelerator Program",
        reason: "I want to get sharper at leading teams.",
      }),
    }) as never,
  );

  assert.equal(duplicateResponse.status, 409);
  assert.deepEqual(await duplicateResponse.json(), {
    code: "DUPLICATE_EMAIL",
    error: "An application with this email has already been submitted.",
  });
});

test("rejects registrations without at least first and last name", async () => {
  resetGlobalStore();
  seedStore();

  const response = await registerPost(
    new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Prince",
        phone: "+237 600 111 222",
        email: "prince@example.com",
        course: "Leadership Accelerator",
        reason: "I want to grow as a leader.",
      }),
    }) as never,
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Full name must include at least first and last name",
  });
});

test("returns a clear setup error when the Supabase registrations table is missing", async () => {
  resetGlobalStore();
  seedStoreWithPersistence({
    findByEmail: async () => null,
    insert: async () => {
      throw {
        code: "PGRST205",
        message: "Could not find the table 'public.registrations' in the schema cache",
      };
    },
    list: async () => [],
  });

  const response = await registerPost(
    new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Grace Hopper",
        phone: "+1 555 0100",
        email: "grace@example.com",
        course: "Leadership Accelerator Program",
        reason: "I want to get sharper at leading teams.",
      }),
    }) as never,
  );

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    error: "Supabase registrations table is missing. Apply supabase/registrations.sql.",
  });
});

test("sends confirmation emails from training@icubefarm.com", async () => {
  resetGlobalStore();
  seedStore();
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;
  let sentPayload: { from?: string } = {};

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as {
      from?: string;
    };

    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {
    const response = await registerPost(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Grace Hopper",
          phone: "+1 555 0100",
          email: "grace@example.com",
          course: "Leadership Accelerator Program",
          reason: "I want to get sharper at leading teams.",
        }),
      }) as never,
    );

    assert.equal(response.status, 200);
    assert.equal(sentPayload.from, "Pedagemy <training@icubefarm.com>");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
