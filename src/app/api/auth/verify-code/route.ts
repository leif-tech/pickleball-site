import { NextResponse } from "next/server";
import db from "@/lib/db";

interface CodeRow {
  id: number;
  expires_at: string;
}

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const row = db.prepare(
      "SELECT id, expires_at FROM verification_codes WHERE email = ? AND code = ? AND used = 0 ORDER BY id DESC LIMIT 1"
    ).get(email.toLowerCase(), code) as CodeRow | undefined;

    if (!row) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (new Date(row.expires_at) < new Date()) {
      return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
    }

    // Mark as used
    db.prepare("UPDATE verification_codes SET used = 1 WHERE id = ?").run(row.id);

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("Verify code error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
