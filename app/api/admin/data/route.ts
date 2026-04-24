import { NextResponse } from "next/server";

import { getRaffleStore } from "@/lib/raffle-store";

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

  const store = getRaffleStore();
  if (!store.isValidAdminLogin(body.email, body.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    registrations: store.listRegistrations(),
  });
}
