"use client";

import { useState, useEffect, useCallback } from "react";

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Users</h1>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <form
          onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          className="flex gap-2 flex-1 max-w-md"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 bg-cream border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder-warm-gray-light focus:outline-none focus:border-accent/40"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white text-xs font-medium rounded-xl hover:bg-foreground transition-colors"
          >
            Search
          </button>
        </form>
        {search && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="text-xs text-warm-gray hover:text-foreground px-3 py-2"
          >
            Clear
          </button>
        )}
        <span className="text-xs text-warm-gray self-center ml-auto">{total} user{total !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream/50">
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Email</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Role</th>
                <th className="text-left px-4 py-3 text-xs text-warm-gray uppercase tracking-wider font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-warm-gray">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-warm-gray">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                          <span className="text-[10px] text-white font-bold">{u.name.charAt(0)}</span>
                        </div>
                        <span className="text-foreground font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-foreground">{u.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                        u.role === "admin" ? "bg-accent/10 text-accent" : "bg-cream text-warm-gray"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-warm-gray text-xs whitespace-nowrap">{u.created_at?.split("T")[0] || u.created_at?.split(" ")[0] || "-"}</td>
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
    </div>
  );
}
