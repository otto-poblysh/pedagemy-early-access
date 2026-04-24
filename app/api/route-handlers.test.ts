import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { POST as adminDataPost } from "./admin/data/route";
import { POST as registerPost } from "./register/route";

const tempDirs: string[] = [];

function resetGlobalStore() {
  const globalStore = globalThis as typeof globalThis & {
    __pedagemyRaffleStore?: { close?: () => void };
  };

  globalStore.__pedagemyRaffleStore?.close?.();
  globalStore.__pedagemyRaffleStore = undefined;
}

afterEach(() => {
  resetGlobalStore();
  delete process.env.PEDAGEMY_DB_PATH;

  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
});

test("stores a registration and returns it to an authenticated admin", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pedagemy-routes-"));
  tempDirs.push(tempDir);
  process.env.PEDAGEMY_DB_PATH = path.join(tempDir, "test.sqlite");
  resetGlobalStore();

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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pedagemy-admin-"));
  tempDirs.push(tempDir);
  process.env.PEDAGEMY_DB_PATH = path.join(tempDir, "test.sqlite");
  resetGlobalStore();

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
