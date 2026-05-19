import { NextResponse } from "next/server";
import {
  getWaitlistStore,
  DuplicateWaitlistEmailError,
  MissingStoreConfigError,
  MissingWaitlistTableError,
} from "@/lib/waitlist-store";

interface WaitlistBody {
  name: string;
  email: string;
  locale?: string;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: WaitlistBody;
  const store = getWaitlistStore();

  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isNonEmpty(body.name) || !isNonEmpty(body.email)) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  try {
    await store.saveEntry({ name: body.name, email: body.email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof DuplicateWaitlistEmailError) {
      return NextResponse.json(
        {
          code: "DUPLICATE_EMAIL",
          error: "This email is already on the waitlist.",
        },
        { status: 409 },
      );
    }

    if (error instanceof MissingStoreConfigError) {
      console.error("Waitlist storage is not configured", error.message);
      return NextResponse.json(
        { error: "Waitlist storage is not configured" },
        { status: 500 },
      );
    }

    if (error instanceof MissingWaitlistTableError) {
      console.error("Supabase waiting_list table is missing", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Failed to process waitlist submission", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
