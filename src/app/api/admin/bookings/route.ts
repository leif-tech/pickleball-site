import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(params.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(params.get("limit") || "20")));
  const date = params.get("date") || "";
  const court = params.get("court") || "";
  const offset = (page - 1) * limit;

  let where = "1=1";
  const binds: (string | number)[] = [];

  if (date) {
    where += " AND b.date = ?";
    binds.push(date);
  }
  if (court) {
    where += " AND b.court_id = ?";
    binds.push(parseInt(court));
  }

  const total = (db.prepare(
    `SELECT COUNT(*) as count FROM bookings b WHERE ${where}`
  ).get(...binds) as { count: number }).count;

  const rows = db.prepare(
    `SELECT b.id, b.court_id, b.date, b.hour, b.rate, b.payment_status, b.receipt_path, b.reference_number, b.created_at, u.name as user_name, u.email as user_email
     FROM bookings b JOIN users u ON b.user_id = u.id
     WHERE ${where}
     ORDER BY b.date DESC, b.hour ASC
     LIMIT ? OFFSET ?`
  ).all(...binds, limit, offset);

  return NextResponse.json({ bookings: rows, total, page, limit });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id, status } = await request.json();
  if (!id || !["confirmed", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  db.prepare("UPDATE bookings SET payment_status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ success: true });
}
