import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Week start (Monday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
  const weekStartStr = weekStart.toISOString().split("T")[0];

  // Month start
  const monthStartStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;

  const notRejected = "AND payment_status != 'rejected'";

  const revenueToday = (db.prepare(
    `SELECT COALESCE(SUM(rate), 0) as total FROM bookings WHERE date = ? ${notRejected}`
  ).get(todayStr) as { total: number }).total;

  const revenueWeek = (db.prepare(
    `SELECT COALESCE(SUM(rate), 0) as total FROM bookings WHERE date >= ? ${notRejected}`
  ).get(weekStartStr) as { total: number }).total;

  const revenueMonth = (db.prepare(
    `SELECT COALESCE(SUM(rate), 0) as total FROM bookings WHERE date >= ? ${notRejected}`
  ).get(monthStartStr) as { total: number }).total;

  const bookingsToday = (db.prepare(
    `SELECT COUNT(*) as count FROM bookings WHERE date = ? ${notRejected}`
  ).get(todayStr) as { count: number }).count;

  const bookingsWeek = (db.prepare(
    `SELECT COUNT(*) as count FROM bookings WHERE date >= ? ${notRejected}`
  ).get(weekStartStr) as { count: number }).count;

  const bookingsMonth = (db.prepare(
    `SELECT COUNT(*) as count FROM bookings WHERE date >= ? ${notRejected}`
  ).get(monthStartStr) as { count: number }).count;

  const totalUsers = (db.prepare(
    "SELECT COUNT(*) as count FROM users"
  ).get() as { count: number }).count;

  const newUsersToday = (db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE date(created_at) = ?"
  ).get(todayStr) as { count: number }).count;

  const totalBookings = (db.prepare(
    `SELECT COUNT(*) as count FROM bookings WHERE 1=1 ${notRejected}`
  ).get() as { count: number }).count;

  const totalRevenue = (db.prepare(
    `SELECT COALESCE(SUM(rate), 0) as total FROM bookings WHERE 1=1 ${notRejected}`
  ).get() as { total: number }).total;

  return NextResponse.json({
    revenue: { today: revenueToday, week: revenueWeek, month: revenueMonth, total: totalRevenue },
    bookings: { today: bookingsToday, week: bookingsWeek, month: bookingsMonth, total: totalBookings },
    users: { total: totalUsers, newToday: newUsersToday },
  });
}
