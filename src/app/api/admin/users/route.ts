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
  const search = params.get("search") || "";
  const offset = (page - 1) * limit;

  let where = "1=1";
  const binds: string[] = [];

  if (search) {
    where += " AND (name LIKE ? OR email LIKE ?)";
    binds.push(`%${search}%`, `%${search}%`);
  }

  const total = (db.prepare(
    `SELECT COUNT(*) as count FROM users WHERE ${where}`
  ).get(...binds) as { count: number }).count;

  const rows = db.prepare(
    `SELECT id, name, email, phone, role, created_at FROM users
     WHERE ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  ).all(...binds, limit, offset);

  return NextResponse.json({ users: rows, total, page, limit });
}
