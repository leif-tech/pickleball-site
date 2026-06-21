"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";

/* ─── Types ─── */
interface Booking {
  id: number;
  court_id: number;
  date: string;
  hour: number;
  rate: number;
}

/* ─── Helpers ─── */
function formatDateISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDayName(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getMonthDay(d: Date) {
  return d.getDate();
}

function formatDateFull(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatHour(hour: number) {
  if (hour === 0 || hour === 12) return "12";
  return `${hour > 12 ? hour - 12 : hour}`;
}

function formatAmPm(hour: number) {
  return hour >= 12 ? "PM" : "AM";
}

function getMonthName(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short" });
}

function formatDateNice(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getCourtName(id: number) {
  const names: Record<number, string> = { 1: "Court 1", 2: "Court 2", 3: "Court 3", 4: "Court 4" };
  return names[id] || `Court ${id}`;
}

function getCourtType(id: number) {
  return id <= 2 ? "Indoor" : "Outdoor";
}

/* ─── Data ─── */
const COURTS = [
  { id: 1, name: "Court 1", type: "Indoor", photo: "/court-1.png", tagline: "Climate controlled" },
  { id: 2, name: "Court 2", type: "Indoor", photo: "/court-2.png", tagline: "LED lighting" },
  { id: 3, name: "Court 3", type: "Outdoor", photo: "/court-5.png", tagline: "Natural light" },
  { id: 4, name: "Court 4", type: "Outdoor", photo: "/court-6.png", tagline: "Shaded seating" },
];

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

const PEAK_RATE = 400;
const STANDARD_RATE = 340;

function getRate(hour: number) {
  return hour >= 6 && hour < 16 ? STANDARD_RATE : PEAK_RATE;
}

function isPeak(hour: number) {
  return hour >= 16;
}

/* ─── Mock Events ─── */
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Weekend Smash",
    description: "Casual games for all skill levels. Great way to meet other players!",
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split("T")[0]; })(),
    time: "4:00 PM - 7:00 PM",
    courts: "Court 1, Court 2",
    price: 200,
    spotsLeft: 14,
    totalSpots: 24,
    level: "All Levels",
  },
  {
    id: 2,
    title: "Morning Drills",
    description: "Structured drills and coaching to sharpen your game.",
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })(),
    time: "7:00 AM - 9:00 AM",
    courts: "Court 3",
    price: 150,
    spotsLeft: 6,
    totalSpots: 12,
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Friday Night Lights",
    description: "Competitive doubles under the lights. Bring your A-game.",
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })(),
    time: "6:00 PM - 9:00 PM",
    courts: "Court 1, Court 2, Court 3, Court 4",
    price: 250,
    spotsLeft: 22,
    totalSpots: 40,
    level: "Advanced",
  },
];

type TabKey = "book" | "events" | "bookings" | "rentals" | "activity" | "history";

const TAB_NAV: { key: TabKey; label: string; icon: string }[] = [
  { key: "book", label: "Book", icon: "M12 4v16m8-8H4" },
  { key: "events", label: "Events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "bookings", label: "Bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "rentals", label: "Rentals", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { key: "activity", label: "Activity", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { key: "history", label: "History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

/* ─── Page ─── */
export default function BookPage() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("book");

  // Booking state
  const [dayOffset, setDayOffset] = useState(0);
  const [weekStart, setWeekStart] = useState(0);
  const [selectedCourt, setSelectedCourt] = useState<number>(1);
  const [selectedSlots, setSelectedSlots] = useState<{ courtId: number; hour: number }[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ court_id: number; hour: number }[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Court lightbox
  const [courtLightbox, setCourtLightbox] = useState<{ photo: string; name: string } | null>(null);

  // Dashboard state
  const [eventFilter, setEventFilter] = useState<"upcoming" | "completed">("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);

  // Generate visible week
  const visibleDates = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + weekStart + i);
      d.setHours(0, 0, 0, 0);
      arr.push(d);
    }
    return arr;
  }, [weekStart]);

  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [dayOffset]);

  // Clear selected slots when date changes
  useEffect(() => {
    setSelectedSlots([]);
  }, [dayOffset]);

  // Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (courtLightbox) setCourtLightbox(null);
        else if (showConfirm && !bookingSuccess) { setShowConfirm(false); setBookingError(""); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [courtLightbox, showConfirm, bookingSuccess]);

  // Fetch booked slots for booking tab
  useEffect(() => {
    if (activeTab !== "book") return;
    const dateStr = formatDateISO(selectedDate);
    fetch(`/api/bookings?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(data.bookings || []))
      .catch(() => setBookedSlots([]));
  }, [selectedDate, activeTab]);

  // Fetch user bookings for dashboard tabs
  useEffect(() => {
    if (!user) return;
    fetch("/api/bookings/mine?type=upcoming")
      .then((r) => r.json())
      .then((d) => setUpcomingBookings(d.bookings || []))
      .catch(() => {});
    fetch("/api/bookings/mine?type=history")
      .then((r) => r.json())
      .then((d) => setHistoryBookings(d.bookings || []))
      .catch(() => {});
  }, [user, bookingSuccess]);

  const isBooked = useCallback(
    (courtId: number, hour: number) =>
      bookedSlots.some((b) => b.court_id === courtId && b.hour === hour),
    [bookedSlots]
  );

  const isSelected = (courtId: number, hour: number) =>
    selectedSlots.some((s) => s.courtId === courtId && s.hour === hour);

  const toggleSlot = useCallback(
    (courtId: number, hour: number) => {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      setSelectedSlots((prev) => {
        const exists = prev.find((s) => s.courtId === courtId && s.hour === hour);
        if (exists) return prev.filter((s) => !(s.courtId === courtId && s.hour === hour));
        return [...prev, { courtId, hour }];
      });
    },
    [user]
  );

  const isToday = dayOffset === 0;
  const currentHour = new Date().getHours();
  const availableHours = isToday ? HOURS.filter((h) => h > currentHour) : HOURS;

  const totalPrice = selectedSlots.reduce((sum, s) => sum + getRate(s.hour), 0);
  const clearAll = () => setSelectedSlots([]);
  const slotsForCourt = selectedSlots.filter((s) => s.courtId === selectedCourt).length;

  function groupByDate(bookings: Booking[]) {
    const groups: Record<string, Booking[]> = {};
    for (const b of bookings) {
      if (!groups[b.date]) groups[b.date] = [];
      groups[b.date].push(b);
    }
    return Object.entries(groups);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <span className="font-serif text-lg font-semibold tracking-wide text-foreground hidden sm:inline">
              PICKLEBALL
            </span>
          </a>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cream rounded-full">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <span className="text-xs text-foreground font-medium">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs text-warm-gray hover:text-foreground transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="group flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-full btn-premium shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Sign Up / Log In
                <svg className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Tab Navigation ─── */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2 -mb-px">
            {TAB_NAV.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-300 click-bounce ${
                  activeTab === tab.key
                    ? "bg-accent text-white shadow-sm scale-[1.02]"
                    : "text-warm-gray hover:text-foreground hover:bg-cream"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* ════════════════════════════════════════════ */}
        {/* ─── BOOK TAB ─── */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "book" && (
          <div>
            {/* Step 1: Pick a Date */}
            <div className="mb-8 animate-reveal-up opacity-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-warm-gray uppercase tracking-wider font-medium">Select Date</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-foreground mr-2">
                    {getMonthName(visibleDates[0])} {visibleDates[0].getFullYear()}
                  </span>
                  <button
                    onClick={() => { const newWeek = Math.max(0, weekStart - 7); setWeekStart(newWeek); setDayOffset(newWeek); }}
                    disabled={weekStart <= 0}
                    className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-warm-gray hover:text-foreground hover:border-accent/30 transition-all disabled:opacity-30"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { const newWeek = weekStart + 7; setWeekStart(newWeek); setDayOffset(newWeek); }}
                    className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-warm-gray hover:text-foreground hover:border-accent/30 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {visibleDates.map((date) => {
                  const offset = Math.round((date.getTime() - new Date(new Date().setHours(0, 0, 0, 0)).getTime()) / 86400000);
                  const isToday = offset === 0;
                  const active = offset === dayOffset;
                  return (
                    <button
                      key={offset}
                      onClick={() => setDayOffset(offset)}
                      className={`flex flex-col items-center py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 click-bounce ${
                        active
                          ? "bg-accent text-white border-accent shadow-lg scale-[1.02]"
                          : "bg-card border-border hover:border-accent/30 hover:bg-cream/50 hover:scale-[1.04]"
                      }`}
                    >
                      <span className={`text-[9px] sm:text-[10px] font-medium uppercase ${active ? "text-white/70" : "text-warm-gray"}`}>
                        {isToday ? "Today" : getDayName(date)}
                      </span>
                      <span className={`text-base sm:text-lg font-bold mt-0.5 ${active ? "text-white" : "text-foreground"}`}>
                        {getMonthDay(date)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pick a Court */}
            <div className="mb-8 animate-reveal-up opacity-0 delay-100">
              <p className="text-xs text-warm-gray uppercase tracking-wider mb-3 font-medium">Select Court</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COURTS.map((court) => {
                  const active = selectedCourt === court.id;
                  const courtSlotCount = selectedSlots.filter((s) => s.courtId === court.id).length;
                  return (
                    <button
                      key={court.id}
                      onClick={() => setSelectedCourt(court.id)}
                      className={`relative rounded-2xl overflow-hidden transition-all duration-300 text-left group click-bounce ${
                        active
                          ? "ring-2 ring-accent ring-offset-2 shadow-lg scale-[1.02]"
                          : "ring-1 ring-border hover:ring-accent/30 hover:shadow-md hover-tilt"
                      }`}
                    >
                      <div
                        className="relative h-20 sm:h-28 overflow-hidden cursor-zoom-in"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCourtLightbox({ photo: court.photo, name: court.name });
                        }}
                      >
                        <img
                          src={court.photo}
                          alt={court.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 z-10">
                          <div className="w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                        {courtSlotCount > 0 && (
                          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-white">
                            {courtSlotCount} selected
                          </span>
                        )}
                        {active && (
                          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-card">
                        <p className="text-sm font-semibold text-foreground">{court.name}</p>
                        <p className="text-[11px] text-warm-gray">{court.type} &middot; {court.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Pick Time Slots */}
            <div className="animate-reveal-up opacity-0 delay-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-warm-gray uppercase tracking-wider font-medium">Select Time</p>
                <div className="flex items-center gap-3 text-[10px] text-warm-gray">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cream-dark border border-border inline-block" />
                    Standard &#8369;{STANDARD_RATE}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/20 border border-accent/30 inline-block" />
                    Peak &#8369;{PEAK_RATE}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {availableHours.map((hour) => {
                  const booked = isBooked(selectedCourt, hour);
                  const selected = isSelected(selectedCourt, hour);
                  const peak = isPeak(hour);

                  if (booked) {
                    return (
                      <div
                        key={hour}
                        className="relative px-4 py-3.5 rounded-xl bg-cream/60 border border-border/50 text-center opacity-50"
                      >
                        <p className="text-xs text-warm-gray line-through">
                          {formatHour(hour)}:00 {formatAmPm(hour)}
                        </p>
                        <p className="text-[10px] text-warm-gray mt-0.5">Booked</p>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={hour}
                      onClick={() => toggleSlot(selectedCourt, hour)}
                      className={`relative px-4 py-3.5 rounded-xl border transition-all duration-300 group click-bounce ${
                        selected
                          ? "bg-accent border-accent text-white shadow-md scale-[1.02]"
                          : peak
                          ? "bg-card border-accent/20 hover:border-accent/40 hover:shadow-sm hover:scale-[1.02]"
                          : "bg-card border-border hover:border-accent/30 hover:shadow-sm hover:scale-[1.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className={`text-sm font-semibold ${selected ? "text-white" : "text-foreground"}`}>
                            {formatHour(hour)}:00
                            <span className={`text-[10px] font-normal ml-0.5 ${selected ? "text-white/70" : "text-warm-gray"}`}>
                              {formatAmPm(hour)}
                            </span>
                          </p>
                          <p className={`text-[10px] mt-0.5 ${selected ? "text-white/60" : "text-warm-gray"}`}>
                            &#8369;{getRate(hour)} {peak ? "peak" : "standard"}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected
                            ? "border-white bg-white/20"
                            : "border-border group-hover:border-accent/40"
                        }`}>
                          {selected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {slotsForCourt > 0 && (
                <p className="text-center text-xs text-warm-gray mt-4">
                  {slotsForCourt} slot{slotsForCourt > 1 ? "s" : ""} selected for {COURTS.find((c) => c.id === selectedCourt)?.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/* ─── EVENTS TAB ─── */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "events" && (
          <div className="animate-reveal-up opacity-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-foreground">Community Events</h2>
              <div className="flex bg-cream rounded-xl p-1">
                <button
                  onClick={() => setEventFilter("upcoming")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    eventFilter === "upcoming" ? "bg-card text-foreground shadow-sm" : "text-warm-gray"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setEventFilter("completed")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    eventFilter === "completed" ? "bg-card text-foreground shadow-sm" : "text-warm-gray"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {eventFilter === "completed" ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <p className="text-sm text-warm-gray">No completed events yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {MOCK_EVENTS.map((event) => (
                  <div key={event.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                          <p className="text-xs text-warm-gray mt-0.5">{event.level}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-xl font-bold text-foreground">&#8369;{event.price}</p>
                          <p className="text-[10px] text-warm-gray">per player</p>
                        </div>
                      </div>
                      <p className="text-sm text-warm-gray mb-4">{event.description}</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-cream rounded-xl p-3">
                          <p className="text-[10px] text-warm-gray uppercase tracking-wider mb-1">Date & Time</p>
                          <p className="text-sm font-semibold text-foreground">{formatDateNice(event.date)}</p>
                          <p className="text-xs text-warm-gray">{event.time}</p>
                        </div>
                        <div className="bg-cream rounded-xl p-3">
                          <p className="text-[10px] text-warm-gray uppercase tracking-wider mb-1">Courts</p>
                          <p className="text-sm font-semibold text-foreground">{event.courts}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-cream-dark rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-warm-gray">{event.spotsLeft} spots left</span>
                        </div>
                        <button
                          onClick={() => {
                            if (!user) { setShowAuthModal(true); return; }
                            alert("Registration for this event is coming soon!");
                          }}
                          className="px-5 py-2.5 bg-accent text-white text-xs font-medium rounded-full btn-premium"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/* ─── BOOKINGS TAB ─── */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "bookings" && (
          <div className="animate-reveal-up opacity-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-foreground">Your Bookings</h2>
              <button onClick={() => setActiveTab("book")} className="text-xs text-accent font-medium hover:underline">+ New Booking</button>
            </div>
            {!user ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <p className="text-sm text-warm-gray mb-4">Sign in to view your bookings.</p>
                <button onClick={() => setShowAuthModal(true)} className="px-6 py-2.5 bg-accent text-white text-xs font-medium rounded-full btn-premium">
                  Sign Up / Log In
                </button>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-warm-gray mb-4">No upcoming bookings.</p>
                <button onClick={() => setActiveTab("book")} className="inline-block px-6 py-2.5 bg-accent text-white text-xs font-medium rounded-full btn-premium">
                  Book a Court
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {groupByDate(upcomingBookings).map(([date, slots]) => (
                  <div key={date} className="bg-card rounded-2xl border border-border p-5">
                    <p className="text-sm font-semibold text-foreground mb-3">{formatDateNice(date)}</p>
                    <div className="space-y-2">
                      {slots.sort((a, b) => a.hour - b.hour).map((b) => (
                        <div key={b.id} className="flex items-center justify-between py-2 px-3 bg-cream rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-accent">{b.court_id}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{getCourtName(b.court_id)}</p>
                              <p className="text-[11px] text-warm-gray">{getCourtType(b.court_id)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {formatHour(b.hour)}:00 {formatAmPm(b.hour)}
                            </p>
                            <p className="text-[11px] text-warm-gray">&#8369;{b.rate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/* ─── RENTALS TAB ─── */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "rentals" && (
          <div className="animate-reveal-up opacity-0">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Equipment Rentals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Paddle", price: 50, desc: "Pro-grade composite paddle" },
                { name: "Ball Pack (3)", price: 30, desc: "Outdoor pickleballs, set of 3" },
                { name: "Shoes", price: 80, desc: "Court shoes, various sizes" },
                { name: "Full Kit", price: 120, desc: "Paddle + balls + shoes bundle" },
              ].map((item) => (
                <div key={item.name} className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-[11px] text-warm-gray">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg font-bold text-foreground">&#8369;{item.price}</p>
                    <p className="text-[10px] text-warm-gray">per session</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-warm-gray text-center mt-4">Rental reservations coming soon. For now, request at the front desk.</p>
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/* ─── ACTIVITY TAB ─── */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "activity" && (
          <div className="animate-reveal-up opacity-0">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Recent Activity</h2>
            {!user ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <p className="text-sm text-warm-gray mb-4">Sign in to view your activity.</p>
                <button onClick={() => setShowAuthModal(true)} className="px-6 py-2.5 bg-accent text-white text-xs font-medium rounded-full btn-premium">
                  Sign Up / Log In
                </button>
              </div>
            ) : upcomingBookings.length === 0 && historyBookings.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <p className="text-sm text-warm-gray">No activity yet. Book a court to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...upcomingBookings, ...historyBookings]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((b) => {
                    const isPast = new Date(b.date) < new Date(new Date().toDateString());
                    return (
                      <div key={b.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${isPast ? "bg-warm-gray-light" : "bg-green-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            {isPast ? "Played at" : "Booked"}{" "}
                            <span className="font-semibold">{getCourtName(b.court_id)}</span>
                          </p>
                          <p className="text-[11px] text-warm-gray">
                            {formatDateNice(b.date)} &middot; {formatHour(b.hour)}:00 {formatAmPm(b.hour)}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          isPast ? "bg-cream text-warm-gray" : "bg-green-50 text-green-700"
                        }`}>
                          {isPast ? "Completed" : "Upcoming"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/* ─── HISTORY TAB ─── */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="animate-reveal-up opacity-0">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Booking History</h2>
            {!user ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <p className="text-sm text-warm-gray mb-4">Sign in to view your history.</p>
                <button onClick={() => setShowAuthModal(true)} className="px-6 py-2.5 bg-accent text-white text-xs font-medium rounded-full btn-premium">
                  Sign Up / Log In
                </button>
              </div>
            ) : historyBookings.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <p className="text-sm text-warm-gray">No past bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupByDate(historyBookings).map(([date, slots]) => (
                  <div key={date} className="bg-card rounded-2xl border border-border p-5">
                    <p className="text-sm font-semibold text-foreground mb-3">{formatDateNice(date)}</p>
                    <div className="space-y-2">
                      {slots.sort((a, b) => a.hour - b.hour).map((b) => (
                        <div key={b.id} className="flex items-center justify-between py-2 px-3 bg-cream rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-warm-gray-light/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-warm-gray">{b.court_id}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{getCourtName(b.court_id)}</p>
                              <p className="text-[11px] text-warm-gray">
                                {formatHour(b.hour)}:00 - {formatHour(b.hour + 1)}:00 {formatAmPm(b.hour)}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-warm-gray">&#8369;{b.rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ─── Footer: About & Support ─── */}
      <footer className="border-t border-border bg-cream/50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* About */}
            <div>
              <h3 className="font-serif text-base font-bold text-foreground mb-3">About Us</h3>
              <p className="text-sm text-warm-gray leading-relaxed mb-4">
                A premier pickleball facility with 4 professional-grade courts, 2 indoor and 2 outdoor.
                Open 6:00 AM - 10:00 PM daily.
              </p>
              <div className="flex gap-3">
                <div className="bg-card rounded-xl px-4 py-2.5 border border-border text-center">
                  <p className="font-serif text-lg font-bold text-foreground">4</p>
                  <p className="text-[10px] text-warm-gray">Courts</p>
                </div>
                <div className="bg-card rounded-xl px-4 py-2.5 border border-border text-center">
                  <p className="font-serif text-lg font-bold text-foreground">&#8369;340</p>
                  <p className="text-[10px] text-warm-gray">Standard</p>
                </div>
                <div className="bg-card rounded-xl px-4 py-2.5 border border-border text-center">
                  <p className="font-serif text-lg font-bold text-foreground">&#8369;400</p>
                  <p className="text-[10px] text-warm-gray">Peak</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-serif text-base font-bold text-foreground mb-3">Support</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-warm-gray">Email</p>
                    <p className="text-sm font-medium text-foreground">support@pickleball.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-warm-gray">Phone</p>
                    <p className="text-sm font-medium text-foreground">(02) 8123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-warm-gray">Visit Us</p>
                    <p className="text-sm font-medium text-foreground">123 Sports Ave, Makati City</p>
                  </div>
                </div>
              </div>
              <a href="/#faq" className="inline-block mt-3 text-xs text-accent font-medium hover:underline">View FAQ &rarr;</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Bottom Booking Bar (only on book tab) ─── */}
      {activeTab === "book" && selectedSlots.length > 0 && (
        <div className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md safe-bottom">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button onClick={clearAll} className="text-warm-gray hover:text-foreground text-xs underline shrink-0">
                Clear
              </button>
              <div className="w-px h-5 bg-border" />
              <span className="text-xs text-warm-gray shrink-0">
                {selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""}
              </span>
              <span className="hidden sm:inline text-xs text-warm-gray">
                across {new Set(selectedSlots.map((s) => s.courtId)).size} court{new Set(selectedSlots.map((s) => s.courtId)).size > 1 ? "s" : ""}
              </span>
              <div className="w-px h-5 bg-border" />
              <span className="font-serif text-lg sm:text-2xl font-bold text-foreground shrink-0">
                &#8369;{totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-premium click-bounce animate-soft-float px-5 sm:px-10 py-3 bg-accent text-white text-sm font-medium rounded-full shrink-0"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* ─── Court Lightbox ─── */}
      {courtLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md animate-fade-in opacity-0"
          onClick={() => setCourtLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full animate-scale-in opacity-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={courtLightbox.photo}
              alt={courtLightbox.name}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                {courtLightbox.name}
              </span>
            </div>
            <button
              onClick={() => setCourtLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors click-bounce"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Prev/Next */}
            <button
              onClick={() => {
                const idx = COURTS.findIndex((c) => c.photo === courtLightbox.photo);
                const prev = COURTS[(idx - 1 + COURTS.length) % COURTS.length];
                setCourtLightbox({ photo: prev.photo, name: prev.name });
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors click-bounce"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const idx = COURTS.findIndex((c) => c.photo === courtLightbox.photo);
                const next = COURTS[(idx + 1) % COURTS.length];
                setCourtLightbox({ photo: next.photo, name: next.name });
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors click-bounce"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─── Auth Modal ─── */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} initialTab="signup" />
      )}

      {/* ─── Confirm Modal ─── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in opacity-0"
          onClick={() => { if (!bookingSuccess) { setShowConfirm(false); setBookingError(""); } }}
        >
          <div
            className="bg-card rounded-t-3xl sm:rounded-2xl border border-border overflow-hidden w-full sm:max-w-md animate-reveal-up opacity-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">You&apos;re Booked!</h3>
                  <p className="text-sm text-warm-gray mb-8">See you on the court.</p>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setBookingSuccess(false);
                      clearAll();
                    }}
                    className="w-full py-3.5 bg-accent text-white text-sm font-medium rounded-full btn-premium"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Confirm Booking</h2>
                  <p className="text-sm text-warm-gray mb-6">{formatDateFull(selectedDate)}</p>

                  <div className="space-y-4 mb-6">
                    {COURTS.filter((c) => selectedSlots.some((s) => s.courtId === c.id)).map((court) => {
                      const slots = selectedSlots.filter((s) => s.courtId === court.id).sort((a, b) => a.hour - b.hour);
                      const subtotal = slots.reduce((sum, s) => sum + getRate(s.hour), 0);
                      return (
                        <div key={court.id} className="bg-cream rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-foreground">{court.name}</p>
                            <span className="text-[10px] text-warm-gray">{court.type}</span>
                          </div>
                          <div className="space-y-1">
                            {slots.map((s) => (
                              <div key={s.hour} className="flex items-center justify-between text-xs">
                                <span className="text-foreground">
                                  {formatHour(s.hour)}:00 - {formatHour(s.hour + 1)}:00 {formatAmPm(s.hour + 1 === 12 ? 12 : s.hour)}
                                </span>
                                <span className="text-warm-gray">&#8369;{getRate(s.hour)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-2 pt-2 border-t border-border/50">
                            <span className="text-xs font-semibold text-foreground">&#8369;{subtotal.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-sm text-warm-gray">Total</span>
                      <span className="font-serif text-3xl font-bold text-foreground">
                        &#8369;{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                      {bookingError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowConfirm(false); setBookingError(""); }}
                      className="flex-1 py-3.5 border border-border text-foreground text-sm font-medium rounded-full hover:border-accent transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      disabled={bookingLoading}
                      onClick={async () => {
                        setBookingError("");
                        setBookingLoading(true);
                        try {
                          const res = await fetch("/api/bookings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              date: formatDateISO(selectedDate),
                              slots: selectedSlots.map((s) => ({
                                courtId: s.courtId,
                                hour: s.hour,
                                rate: getRate(s.hour),
                              })),
                              options: {},
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok) {
                            setBookingError(data.error || "Booking failed");
                          } else {
                            setBookingSuccess(true);
                            const dateStr = formatDateISO(selectedDate);
                            fetch(`/api/bookings?date=${dateStr}`)
                              .then((r) => r.json())
                              .then((d) => setBookedSlots(d.bookings || []));
                          }
                        } catch {
                          setBookingError("Network error");
                        }
                        setBookingLoading(false);
                      }}
                      className="flex-1 py-3.5 bg-accent text-white text-sm font-medium rounded-full btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? "Booking..." : "Confirm Booking"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
