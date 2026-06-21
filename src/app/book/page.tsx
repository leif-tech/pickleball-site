"use client";

import { useState, useMemo, useCallback } from "react";

/* ─── Helpers ─── */
function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateFull(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isPast(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(d);
  check.setHours(0, 0, 0, 0);
  return check < today;
}

/* ─── Data ─── */
const COURTS = [
  { id: 1, name: "Court 1", type: "Indoor", color: "from-[#3a8fd4] to-[#2a6fa4]" },
  { id: 2, name: "Court 2", type: "Indoor", color: "from-[#4a9fe4] to-[#3a8fd4]" },
  { id: 3, name: "Court 3", type: "Outdoor", color: "from-[#7b4fa0] to-[#5a3d7a]" },
  { id: 4, name: "Court 4", type: "Outdoor", color: "from-[#8b5fb0] to-[#6b4f90]" },
];

const TIME_SLOTS = [
  { time: "6:00 - 7:00 AM", hour: 6 },
  { time: "7:00 - 8:00 AM", hour: 7 },
  { time: "8:00 - 9:00 AM", hour: 8 },
  { time: "9:00 - 10:00 AM", hour: 9 },
  { time: "10:00 - 11:00 AM", hour: 10 },
  { time: "11:00 - 12:00 PM", hour: 11 },
  { time: "12:00 - 1:00 PM", hour: 12 },
  { time: "1:00 - 2:00 PM", hour: 13 },
  { time: "2:00 - 3:00 PM", hour: 14 },
  { time: "3:00 - 4:00 PM", hour: 15 },
  { time: "4:00 - 5:00 PM", hour: 16 },
  { time: "5:00 - 6:00 PM", hour: 17 },
  { time: "6:00 - 7:00 PM", hour: 18 },
  { time: "7:00 - 8:00 PM", hour: 19 },
  { time: "8:00 - 9:00 PM", hour: 20 },
  { time: "9:00 - 10:00 PM", hour: 21 },
];

/* Operating hours: 6 AM - 10 PM */
const OPEN_HOUR = 6;
const CLOSE_HOUR = 22;

/* Simulated booked slots */
function getSlotStatus(
  courtId: number,
  date: Date,
  hour: number
): "available" | "booked" | "closed" {
  if (hour < OPEN_HOUR || hour >= CLOSE_HOUR) return "closed";
  const seed = courtId * 31 + date.getDate() * 7 + hour;
  if (seed % 5 === 0 || seed % 7 === 0) return "booked";
  return "available";
}

/* Rates */
const PEAK_RATE = 400;
const STANDARD_RATE = 340;

function getRate(hour: number) {
  // Peak: before 6 AM and after 4 PM. Standard: 6 AM - 4 PM
  if (hour >= 6 && hour < 16) return STANDARD_RATE;
  return PEAK_RATE;
}

/* ─── Court Preview Modal ─── */
function CourtPreview({
  court,
  onClose,
}: {
  court: (typeof COURTS)[0];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in opacity-0"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border overflow-hidden max-w-md w-full animate-reveal-up opacity-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview image */}
        <div
          className={`relative h-52 bg-gradient-to-br ${court.color}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect x="50" y="20" width="300" height="160" rx="3" fill="none" stroke="white" strokeWidth="2" />
            <line x1="200" y1="20" x2="200" y2="180" stroke="white" strokeWidth="2" />
            <rect x="150" y="20" width="100" height="160" fill="white" opacity="0.1" />
            <line x1="50" y1="100" x2="350" y2="100" stroke="white" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs font-medium">Photo coming soon</span>
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white font-serif text-2xl font-bold">{court.name}</h3>
            <p className="text-white/70 text-sm">{court.type}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-cream rounded-xl p-3 text-center">
              <p className="text-xs text-warm-gray mb-1">Standard Rate</p>
              <p className="font-serif text-xl font-bold text-foreground">&#8369;{STANDARD_RATE}</p>
              <p className="text-[10px] text-warm-gray">per hour</p>
            </div>
            <div className="bg-cream rounded-xl p-3 text-center">
              <p className="text-xs text-warm-gray mb-1">Peak Rate</p>
              <p className="font-serif text-xl font-bold text-foreground">&#8369;{PEAK_RATE}</p>
              <p className="text-[10px] text-warm-gray">per hour</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-accent text-white text-sm font-medium rounded-full btn-premium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function BookPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<
    { courtId: number; hour: number }[]
  >([]);
  const [needEquipment, setNeedEquipment] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const [bringingGuests, setBringingGuests] = useState(false);
  const [needParking, setNeedParking] = useState(false);
  const [playingCompetitive, setPlayingCompetitive] = useState(false);
  const [previewCourt, setPreviewCourt] = useState<(typeof COURTS)[0] | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [dayOffset]);

  const toggleSlot = useCallback(
    (courtId: number, hour: number) => {
      setSelectedSlots((prev) => {
        const exists = prev.find(
          (s) => s.courtId === courtId && s.hour === hour
        );
        if (exists) return prev.filter((s) => !(s.courtId === courtId && s.hour === hour));
        return [...prev, { courtId, hour }];
      });
    },
    []
  );

  const isSelected = (courtId: number, hour: number) =>
    selectedSlots.some((s) => s.courtId === courtId && s.hour === hour);

  const totalPrice = selectedSlots.reduce(
    (sum, s) => sum + getRate(s.hour),
    0
  );

  const clearAll = () => {
    setSelectedSlots([]);
    setNeedEquipment(false);
    setFirstTime(false);
    setBringingGuests(false);
    setNeedParking(false);
    setPlayingCompetitive(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-10 py-4 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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

          {/* Date nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDayOffset((d) => Math.max(0, d - 1))}
              disabled={dayOffset <= 0}
              className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl border border-border flex items-center justify-center text-warm-gray hover:text-foreground hover:border-accent/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="px-4 py-2 bg-cream rounded-xl border border-border min-w-[140px] text-center">
              <p className="text-sm font-semibold text-foreground">
                {isSameDay(selectedDate, new Date())
                  ? "Today"
                  : formatDateShort(selectedDate)}
              </p>
            </div>
            <button
              onClick={() => setDayOffset((d) => Math.min(30, d + 1))}
              disabled={dayOffset >= 30}
              className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl border border-border flex items-center justify-center text-warm-gray hover:text-foreground hover:border-accent/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Court preview button */}
          <button
            onClick={() => setPreviewCourt(COURTS[0])}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-full btn-premium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="hidden sm:inline">Court Preview</span>
          </button>
        </div>
      </header>

      {/* Main grid */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto w-full">
        <div className="animate-reveal-up opacity-0">
          {/* Scrollable table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm -mx-1 px-1">
            <table className="w-full min-w-[500px]">
              {/* Header */}
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-card px-3 sm:px-4 py-4 text-left">
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-warm-gray font-medium">
                      Time Slot
                    </span>
                  </th>
                  {COURTS.map((court) => (
                    <th key={court.id} className="px-2 sm:px-3 py-4 text-center">
                      <button
                        onClick={() => setPreviewCourt(court)}
                        className="group inline-flex flex-col items-center gap-1"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                          {court.name}
                        </span>
                        <span className="text-[10px] text-warm-gray">{court.type}</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.hour} className="border-b border-border/50 last:border-0">
                    <td className="sticky left-0 z-10 bg-card px-3 sm:px-4 py-2.5">
                      <span className="text-xs sm:text-sm text-foreground font-medium whitespace-nowrap">
                        {slot.time}
                      </span>
                    </td>
                    {COURTS.map((court) => {
                      const status = getSlotStatus(court.id, selectedDate, slot.hour);
                      const selected = isSelected(court.id, slot.hour);
                      return (
                        <td key={court.id} className="px-1.5 sm:px-2 py-1.5">
                          {status === "closed" ? (
                            <div className="h-12 rounded-xl bg-cream/60 flex items-center justify-center">
                              <span className="text-[10px] text-warm-gray-light uppercase tracking-wide">
                                Closed
                              </span>
                            </div>
                          ) : status === "booked" ? (
                            <div className="h-12 rounded-xl bg-cream border border-border flex items-center justify-center gap-1.5">
                              <svg className="w-3 h-3 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
                              </svg>
                              <span className="text-[10px] sm:text-xs font-semibold text-warm-gray uppercase tracking-wide">
                                Booked
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleSlot(court.id, slot.hour)}
                              className={`w-full h-12 rounded-xl border transition-all duration-200 ${
                                selected
                                  ? "bg-accent border-accent text-white shadow-md scale-[1.02]"
                                  : "bg-card border-border hover:border-accent/40 hover:bg-cream/50 active:scale-95"
                              }`}
                            >
                              {selected && (
                                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Other details */}
          <div className="mt-6 bg-card rounded-2xl border border-border p-5 sm:p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Other Details
            </h3>
            <div className="space-y-3">
              {[
                { checked: needEquipment, toggle: () => setNeedEquipment(!needEquipment), label: "Will you need paddles or equipment?" },
                { checked: firstTime, toggle: () => setFirstTime(!firstTime), label: "Is this your first time playing here?" },
                { checked: bringingGuests, toggle: () => setBringingGuests(!bringingGuests), label: "Are you bringing guests or extra players?" },
                { checked: needParking, toggle: () => setNeedParking(!needParking), label: "Will you need a parking spot?" },
                { checked: playingCompetitive, toggle: () => setPlayingCompetitive(!playingCompetitive), label: "Are you playing a competitive match?" },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-cream/50 border border-border cursor-pointer hover:bg-cream transition-colors">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.toggle}
                    className="w-6 h-6 sm:w-5 sm:h-5 rounded border-border text-accent focus:ring-accent/30 accent-accent"
                  />
                  <span className="text-sm text-foreground">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Court Rates */}
          <div className="mt-6 bg-card rounded-2xl border border-border p-5 sm:p-6">
            <h3 className="font-serif text-lg font-semibold text-accent mb-4">
              Court Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-sm font-medium text-accent mb-1">Peak Rate</p>
                <p className="font-serif text-2xl font-bold text-foreground">
                  &#8369;{PEAK_RATE} <span className="text-sm font-normal text-warm-gray">/ hour</span>
                </p>
                <p className="text-xs text-warm-gray mt-1">4:00 PM - 10:00 PM</p>
              </div>
              <div>
                <p className="text-sm font-medium text-accent mb-1">Standard Rate</p>
                <p className="font-serif text-2xl font-bold text-foreground">
                  &#8369;{STANDARD_RATE} <span className="text-sm font-normal text-warm-gray">/ hour</span>
                </p>
                <p className="text-xs text-warm-gray mt-1">6:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom booking bar */}
      {selectedSlots.length > 0 && (
        <div className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md animate-fade-in-up opacity-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 text-sm min-w-0">
              <button
                onClick={clearAll}
                className="text-warm-gray hover:text-foreground transition-colors text-xs underline shrink-0"
              >
                Clear
              </button>
              <div className="hidden sm:block w-px h-5 bg-border" />
              <div className="truncate">
                <span className="text-warm-gray">
                  {selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="shrink-0">
                <span className="font-serif text-lg sm:text-2xl font-bold text-foreground">
                  &#8369;{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-premium px-6 sm:px-10 py-3 bg-accent text-white text-sm font-medium rounded-full shrink-0"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* Court Preview Modal */}
      {previewCourt && (
        <CourtPreview
          court={previewCourt}
          onClose={() => setPreviewCourt(null)}
        />
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in opacity-0"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-card rounded-t-3xl sm:rounded-2xl border border-border overflow-hidden w-full sm:max-w-lg animate-reveal-up opacity-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Confirm Booking
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Date</span>
                  <span className="font-medium text-foreground">
                    {formatDateFull(selectedDate)}
                  </span>
                </div>
                <div className="h-px bg-border" />
                {/* Group by court */}
                {COURTS.filter((c) =>
                  selectedSlots.some((s) => s.courtId === c.id)
                ).map((court) => {
                  const slots = selectedSlots
                    .filter((s) => s.courtId === court.id)
                    .sort((a, b) => a.hour - b.hour);
                  return (
                    <div key={court.id}>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        {court.name}{" "}
                        <span className="text-warm-gray font-normal">
                          ({court.type})
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {slots.map((s) => {
                          const slotInfo = TIME_SLOTS.find(
                            (t) => t.hour === s.hour
                          );
                          return (
                            <span
                              key={s.hour}
                              className="px-3 py-1.5 bg-cream rounded-full text-xs font-medium text-foreground"
                            >
                              {slotInfo?.time}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="h-px bg-border" />
                {(needEquipment || firstTime || bringingGuests || needParking || playingCompetitive) && (
                  <>
                    <div className="text-sm text-warm-gray">
                      {needEquipment && <p>Needs equipment rental</p>}
                      {firstTime && <p>First-time player</p>}
                      {bringingGuests && <p>Bringing extra guests</p>}
                      {needParking && <p>Parking spot requested</p>}
                      {playingCompetitive && <p>Competitive match</p>}
                    </div>
                    <div className="h-px bg-border" />
                  </>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-warm-gray">Total</span>
                  <span className="font-serif text-3xl font-bold text-foreground">
                    &#8369;{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3.5 border border-border text-foreground text-sm font-medium rounded-full hover:border-accent transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    alert("Booking confirmed! This is a demo.");
                    clearAll();
                  }}
                  className="flex-1 py-3.5 bg-accent text-white text-sm font-medium rounded-full btn-premium"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
