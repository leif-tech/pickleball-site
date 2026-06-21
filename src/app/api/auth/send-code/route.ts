import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendVerificationCode } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email is already registered
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Invalidate any previous unused codes for this email
    db.prepare("UPDATE verification_codes SET used = 1 WHERE email = ? AND used = 0").run(email.toLowerCase());

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Expires in 10 minutes
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare(
      "INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)"
    ).run(email.toLowerCase(), code, expires_at);

    await sendVerificationCode(email, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send code error:", err);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
