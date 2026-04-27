import { NextResponse } from "next/server";

import {
  getRaffleStore,
  MissingRegistrationsTableError,
  MissingStoreConfigError,
} from "@/lib/raffle-store";

interface AdminLoginBody {
  email: string;
  password: string;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: AdminLoginBody;

  try {
    body = (await request.json()) as AdminLoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isNonEmpty(body.email) || !isNonEmpty(body.password)) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const store = getRaffleStore();
    if (!(await store.isValidAdminLogin(body.email, body.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      registrations: await store.listRegistrations(),
    });
  } catch (error) {
    if (error instanceof MissingStoreConfigError) {
      console.error("Admin storage is not configured", error.message);
      return NextResponse.json({ error: "Admin storage is not configured" }, { status: 500 });
    }

    if (error instanceof MissingRegistrationsTableError) {
      console.error("Supabase registrations table is missing", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Failed to load admin data", error);
    return NextResponse.json({ error: "Failed to load admin data" }, { status: 500 });
  }
}
