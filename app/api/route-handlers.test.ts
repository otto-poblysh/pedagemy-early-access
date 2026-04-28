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
    deleteByEmail: async (email: string) => {
      const index = registrations.findIndex((registration) => registration.email === email);

      if (index >= 0) {
        registrations.splice(index, 1);
      }
    },
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
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {

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
  } finally {
    globalThis.fetch = originalFetch;
  }
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
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {

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
  } finally {
    globalThis.fetch = originalFetch;
  }
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
    deleteByEmail: async () => {},
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

test("sends the approved English confirmation email with the selected programme", async () => {
  resetGlobalStore();
  seedStore();
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;
  let sentPayload: {
    from?: string;
    cc?: string[];
    html?: string;
    subject?: string;
    text?: string;
  } = {};

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as typeof sentPayload;

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
          locale: "en",
          reason: "I want to get sharper at leading teams.",
        }),
      }) as never,
    );

    assert.equal(response.status, 200);
    assert.equal(sentPayload.from, "Pedagemy <info@pedagemy.com>");
    assert.deepEqual(sentPayload.cc, ["info@pedagemy.com"]);
    assert.equal(sentPayload.subject, "You're In! Pedagemy Raffle Entry Confirmed");
    assert.match(sentPayload.text ?? "", /^Hi Grace,/);
    assert.match(
      sentPayload.text ?? "",
      /Your Selected Programme:\nLeadership Accelerator Program/
    );
    assert.match(sentPayload.html ?? "", /Leadership Accelerator Program/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sends the approved French confirmation email when locale is fr", async () => {
  resetGlobalStore();
  seedStore();
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;
  let sentPayload: { subject?: string; text?: string; html?: string } = {};

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as typeof sentPayload;

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
          name: "Marie Curie",
          phone: "+237 600 111 222",
          email: "marie@example.com",
          course: "Accélérateur de leadership",
          locale: "fr",
          reason: "Je veux renforcer mon leadership.",
        }),
      }) as never,
    );

    assert.equal(response.status, 200);
    assert.equal(sentPayload.subject, "Votre participation est confirmée ! Tirage Pedagemy");
    assert.match(sentPayload.text ?? "", /^Bonjour Marie,/);
    assert.match(
      sentPayload.text ?? "",
      /Le programme que vous avez sélectionné :\nAccélérateur de leadership/
    );
    assert.match(sentPayload.html ?? "", /Accélérateur de leadership/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("normalizes regional Spanish locales before sending the approved Spanish email", async () => {
  resetGlobalStore();
  seedStore();
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;
  let sentPayload: { subject?: string; text?: string; html?: string } = {};

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as typeof sentPayload;

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
          name: "Ada Lovelace",
          phone: "+240 555 79 65 52",
          email: "ada@example.com",
          course: "Acelerador de liderazgo",
          locale: "es-MX",
          reason: "Quiero fortalecer mi perfil profesional.",
        }),
      }) as never,
    );

    assert.equal(response.status, 200);
    assert.equal(
      sentPayload.subject,
      "¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada"
    );
    assert.match(sentPayload.text ?? "", /^Hola Ada,/);
    assert.match(
      sentPayload.text ?? "",
      /Tu programa seleccionado:\nAcelerador de liderazgo/
    );
    assert.match(sentPayload.html ?? "", /Acelerador de liderazgo/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("returns an email delivery error and does not keep the registration when resend rejects the send", async () => {
  resetGlobalStore();
  seedStore();
  process.env.RESEND_API_KEY = "re_test_key";

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    return new Response(
      JSON.stringify({
        message: "The pedagemy.com domain is not verified.",
        name: "validation_error",
        statusCode: 403,
      }),
      {
        status: 403,
        headers: { "content-type": "application/json" },
      },
    );
  };

  try {
    const registerResponse = await registerPost(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Grace Hopper",
          phone: "+1 555 0100",
          email: "grace@example.com",
          course: "Leadership Accelerator Program",
          locale: "en",
          reason: "I want to get sharper at leading teams.",
        }),
      }) as never,
    );

    assert.equal(registerResponse.status, 502);
    assert.deepEqual(await registerResponse.json(), {
      code: "EMAIL_SEND_FAILED",
      error: "Confirmation email could not be sent. Please try again.",
    });

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

    const adminPayload = (await adminResponse.json()) as {
      ok: boolean;
      registrations: RegistrationRecord[];
    };

    assert.equal(adminResponse.status, 200);
    assert.equal(adminPayload.ok, true);
    assert.equal(adminPayload.registrations.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
