import { NextResponse } from "next/server";

import { getRaffleStore } from "@/lib/raffle-store";

interface RegisterBody {
  course: string;
  email: string;
  name: string;
  phone: string;
  reason: string;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !isNonEmpty(body.name) ||
    !isNonEmpty(body.phone) ||
    !isNonEmpty(body.email) ||
    !isNonEmpty(body.course) ||
    !isNonEmpty(body.reason)
  ) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    getRaffleStore().saveRegistration(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save registration", error);
    return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
  }
}
