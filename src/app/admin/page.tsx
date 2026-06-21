"use client";

import { useState, useEffect } from "react";

interface Stats {
  revenue: { today: number; week: number; month: number; total: number };
  bookings: { today: number; week: number; month: number; total: number };
  users: { total: number; newToday: number };
}

function formatPeso(amount: number) {
  return `P${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.revenue) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Dashboard</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
              <div className="h-3 bg-cream rounded w-20 mb-3" />
              <div className="h-8 bg-cream rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-4">Dashboard</h1>
        <p className="text-warm-gray text-sm">Failed to load stats.</p>
      </div>
    );
  }

  const cards = [
    { label: "Revenue Today", value: formatPeso(stats.revenue.today), sub: `Week: ${formatPeso(stats.revenue.week)}`, color: "text-green-600" },
    { label: "Revenue This Month", value: formatPeso(stats.revenue.month), sub: `All time: ${formatPeso(stats.revenue.total)}`, color: "text-green-600" },
    { label: "Bookings Today", value: stats.bookings.today.toString(), sub: `Week: ${stats.bookings.week} | Month: ${stats.bookings.month}`, color: "text-blue-600" },
    { label: "Total Users", value: stats.users.total.toString(), sub: `New today: ${stats.users.newToday}`, color: "text-purple-600" },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-2xl border border-border p-6 hover:shadow-sm transition-shadow">
            <p className="text-xs text-warm-gray uppercase tracking-wider mb-2">{card.label}</p>
            <p className={`font-serif text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-warm-gray mt-2">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <a href="/admin/bookings" className="bg-card rounded-2xl border border-border p-6 hover:border-accent/30 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">All Bookings</p>
              <p className="text-xs text-warm-gray mt-1">{stats.bookings.total} total bookings</p>
            </div>
            <svg className="w-5 h-5 text-warm-gray group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
        <a href="/admin/users" className="bg-card rounded-2xl border border-border p-6 hover:border-accent/30 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">All Users</p>
              <p className="text-xs text-warm-gray mt-1">{stats.users.total} registered users</p>
            </div>
            <svg className="w-5 h-5 text-warm-gray group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
