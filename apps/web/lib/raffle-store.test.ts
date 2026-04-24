import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createRaffleStore } from "./raffle-store";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
});

test("seeds a default admin and stores normalized registrations", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pedagemy-store-"));
  tempDirs.push(tempDir);

  const store = createRaffleStore({
    dbPath: path.join(tempDir, "test.sqlite"),
  });

  assert.equal(store.isValidAdminLogin("admin@pedagemy.com", "pedagemy2024"), true);
  assert.equal(store.isValidAdminLogin("admin@pedagemy.com", "wrong-password"), false);

  const registration = store.saveRegistration({
    name: "  Ada Lovelace  ",
    phone: "  +234 000 000 0000 ",
    email: "  ADA@EXAMPLE.COM ",
    course: "Tech Career Launchpad",
    reason: "I want to sharpen my technical skills.",
  });

  assert.equal(registration.email, "ada@example.com");
  assert.equal(registration.name, "Ada Lovelace");
  assert.equal(registration.phone, "+234 000 000 0000");

  const registrations = store.listRegistrations();
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

  store.close();
});
