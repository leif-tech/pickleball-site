import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (name.trim().split(/\s+/).length < 2) {
      return NextResponse.json({ error: "Please enter your full name (first and last name)" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if email already exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);

    const result = db.prepare(
      "INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)"
    ).run(name, email.toLowerCase(), phone, password_hash);

    const user = { id: result.lastInsertRowid as number, name, email: email.toLowerCase(), phone, role: "user" };
    const token = createToken(user);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
