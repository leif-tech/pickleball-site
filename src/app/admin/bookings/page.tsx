"use client";

import { useState, useEffect, useCallback } from "react";

interface BookingRow {
  id: number;
  court_id: number;
  date: string;
  hour: number;
  rate: number;
  payment_status: string;
  receipt_path: string | null;
  reference_number: string | null;
  created_at: string;
  user_name: string;
  user_email: string;
}

function formatHour(hour: number) {
  if (hour === 0 || hour === 12) return "12:00";
  return `${hour > 12 ? hour - 12 : hour}:00`;
}

function formatAmPm(hour: number) {
  return hour >= 12 ? "PM" : "AM";
}

function formatPeso(amount: number) {
  return `P${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function statusBadge(status: string) {
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700"; // pending
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [receiptModal, setReceiptModal] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (dateFilter) params.set("date", dateFilter);
    if (courtFilter) params.set("court", courtFilter);

    try {
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotal(data.total || 0);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  }, [page, dateFilter, courtFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Bookings</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
          className="bg-cream border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/40"
        />
        <select
          value={courtFilter}
          onChange={(e) => { setCourtFilter(e.target.value); setPage(1); }}
          className="bg-cream border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/40"
        >
          <option value="">All Courts</option>
          <option value="1">Court 1</option>
          <option value="2">Court 2</option>
          <option value="3">Court 3</option>
          <option value="4">Court 4</option>
        </select>
        {(dateFilter || courtFilter) && (
          <button
            onClick={() => { setDateFilter(""); setCourtFilter(""); setPage(1); }}
            className="text-xs text-warm-gray hover:text-foreground px-3 py-2"
          >
            Clear filters
          </button>
        )}
        <span className="text-xs text-warm-gray self-center ml-auto">{total} booking{total !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream/50">
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Date</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Time</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Court</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Player</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Rate</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-warm-gray">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-warm-gray">No bookings found</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{b.date}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{formatHour(b.hour)} {formatAmPm(b.hour)}</td>
                    <td className="px-4 py-3 text-foreground">Court {b.court_id}</td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">{b.user_name}</p>
                      <p className="text-xs text-warm-gray">{b.user_email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{formatPeso(b.rate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[11px] rounded-full font-medium ${statusBadge(b.payment_status || "confirmed")}`}>
                        {b.payment_status || "confirmed"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {b.reference_number && (
                          <span className="text-[11px] text-foreground font-mono">Ref: {b.reference_number}</span>
                        )}
                        <div className="flex items-center gap-1">
                        {b.receipt_path && (
                          <button
                            onClick={() => setReceiptModal(b.receipt_path)}
                            className="text-[11px] text-blue-600 hover:text-blue-800 underline"
                          >
                            Receipt
                          </button>
                        )}
                        {b.payment_status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              className="ml-1 px-2 py-0.5 text-[11px] bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, "rejected")}
                              className="px-2 py-0.5 text-[11px] bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs text-warm-gray hover:text-foreground disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-foreground">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs text-warm-gray hover:text-foreground disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Receipt lightbox */}
      {receiptModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setReceiptModal(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img src={receiptModal} alt="Payment Receipt" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-white" />
            <button
              onClick={() => setReceiptModal(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
