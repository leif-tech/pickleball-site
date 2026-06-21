import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken } from "@/lib/auth";

interface BookingRow {
  id: number;
  court_id: number;
  hour: number;
  user_id: number;
}

const VALID_COURTS = [1, 2, 3, 4];
const VALID_HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6-21
const PEAK_RATE = 400;
const STANDARD_RATE = 340;
const MAX_BOOKING_DAYS_AHEAD = 90;

function getServerRate(hour: number) {
  return hour >= 16 ? PEAK_RATE : STANDARD_RATE;
}

function isValidDate(dateStr: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

// GET, fetch booked slots for a given date
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !isValidDate(date)) {
    return NextResponse.json({ error: "Valid date (YYYY-MM-DD) required" }, { status: 400 });
  }

  const rows = db.prepare(
    "SELECT id, court_id, hour, user_id FROM bookings WHERE date = ?"
  ).all(date) as BookingRow[];

  return NextResponse.json({ bookings: rows });
}

// POST, create a booking (requires auth)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Please log in to book" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { slots, date, options } = await request.json();

    if (!slots || !Array.isArray(slots) || slots.length === 0 || !date) {
      return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }

    // Validate date format
    if (!isValidDate(date)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Prevent past-date bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date + "T00:00:00");
    if (bookingDate < today) {
      return NextResponse.json({ error: "Cannot book past dates" }, { status: 400 });
    }

    // Prevent too-far-future bookings
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + MAX_BOOKING_DAYS_AHEAD);
    if (bookingDate > maxDate) {
      return NextResponse.json({ error: `Cannot book more than ${MAX_BOOKING_DAYS_AHEAD} days ahead` }, { status: 400 });
    }

    // Validate and sanitize each slot
    const now = new Date();
    const isToday = bookingDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    for (const slot of slots) {
      if (!VALID_COURTS.includes(slot.courtId)) {
        return NextResponse.json({ error: `Invalid court: ${slot.courtId}` }, { status: 400 });
      }
      if (!VALID_HOURS.includes(slot.hour)) {
        return NextResponse.json({ error: `Invalid hour: ${slot.hour}` }, { status: 400 });
      }
      if (isToday && slot.hour <= currentHour) {
        return NextResponse.json({ error: "Cannot book past time slots" }, { status: 400 });
      }
    }

    // Limit per-booking (max 8 slots at once)
    if (slots.length > 8) {
      return NextResponse.json({ error: "Maximum 8 slots per booking" }, { status: 400 });
    }

    // Insert all slots in a transaction (server calculates rate)
    const insertBooking = db.prepare(
      `INSERT INTO bookings (user_id, court_id, date, hour, rate, need_equipment, first_time, bringing_guests, need_parking, playing_competitive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertAll = db.transaction((items: { courtId: number; hour: number }[]) => {
      for (const slot of items) {
        insertBooking.run(
          user.id,
          slot.courtId,
          date,
          slot.hour,
          getServerRate(slot.hour),
          options?.needEquipment ? 1 : 0,
          options?.firstTime ? 1 : 0,
          options?.bringingGuests ? 1 : 0,
          options?.needParking ? 1 : 0,
          options?.playingCompetitive ? 1 : 0
        );
      }
    });

    insertAll(slots);

    return NextResponse.json({ success: true, count: slots.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("UNIQUE constraint")) {
      return NextResponse.json({ error: "One or more slots are already booked" }, { status: 409 });
    }
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
