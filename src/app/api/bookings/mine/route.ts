import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken } from "@/lib/auth";

interface BookingRow {
  id: number;
  court_id: number;
  date: string;
  hour: number;
  rate: number;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return NextResponse.json({ bookings: [] });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ bookings: [] });

  const type = request.nextUrl.searchParams.get("type") || "upcoming";
  const today = new Date().toISOString().split("T")[0];

  let rows: BookingRow[];
  if (type === "history") {
    rows = db.prepare(
      "SELECT id, court_id, date, hour, rate, created_at FROM bookings WHERE user_id = ? AND date < ? ORDER BY date DESC, hour DESC LIMIT 50"
    ).all(user.id, today) as BookingRow[];
  } else {
    rows = db.prepare(
      "SELECT id, court_id, date, hour, rate, created_at FROM bookings WHERE user_id = ? AND date >= ? ORDER BY date ASC, hour ASC LIMIT 50"
    ).all(user.id, today) as BookingRow[];
  }

  return NextResponse.json({ bookings: rows });
}
