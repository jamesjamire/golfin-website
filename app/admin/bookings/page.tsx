"use client";

import { useState, useEffect } from "react";
import { BookingSession, DEFAULT_BOOKING_SESSIONS } from "@/lib/types";

interface Booking {
  id: string;
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  bookedAt: string;
}

const EMPTY_SESSION: Omit<BookingSession, "id" | "createdAt"> = {
  type: "lesson",
  title: "",
  day: "",
  date: "",
  time: "",
  course: "",
  par: "",
  maxSpots: 8,
  bookedSpots: 0,
  price: "",
  instructor: "",
  level: "",
  active: true,
};

export default function AdminBookingsPage() {
  const [sessions, setSessions] = useState<BookingSession[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editSession, setEditSession] = useState<BookingSession | null>(null);
  const [form, setForm] = useState<Omit<BookingSession, "id" | "createdAt">>(EMPTY_SESSION);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"sessions" | "bookings">("sessions");
  const [filterSession, setFilterSession] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/bookings/list").then((r) => r.json()),
    ])
      .then(([sessData, bookData]) => {
        setSessions(Array.isArray(sessData) ? sessData : DEFAULT_BOOKING_SESSIONS);
        setBookings(Array.isArray(bookData) ? bookData : []);
        setLoading(false);
      })
      .catch(() => {
        setSessions(DEFAULT_BOOKING_SESSIONS);
        setLoading(false);
      });
  }, []);

  const openNew = () => {
    setEditSession(null);
    setForm(EMPTY_SESSION);
    setShowForm(true);
    setError("");
  };

  const openEdit = (s: BookingSession) => {
    setEditSession(s);
    setForm({ ...s });
    setShowForm(true);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = editSession ? { ...form, id: editSession.id } : form;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      const { data } = await res.json();
      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === data.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data;
          return updated;
        }
        return [data, ...prev];
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setShowForm(false);
    } catch {
      setError("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    setDeleting(id);
    try {
      await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getSessionLabel = (sessionId: string) => {
    const s = sessions.find((s) => s.id === sessionId);
    return s ? `${s.title || s.day} (${s.type})` : sessionId;
  };

  const filteredBookings =
    filterSession === "all"
      ? bookings
      : bookings.filter((b) => b.sessionId === filterSession);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Bookings Manager</h1>
          <p className="text-gray-500 text-sm">Manage sessions and see who has booked</p>
        </div>
        {activeTab === "sessions" && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#8DC63F] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-[#7ab535] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "sessions" ? "bg-[#8DC63F] text-black" : "text-gray-400 hover:text-white"
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "bookings" ? "bg-[#8DC63F] text-black" : "text-gray-400 hover:text-white"
          }`}
        >
          Who&apos;s Booking
          {bookings.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === "bookings" ? "bg-black/20 text-black" : "bg-[#8DC63F]/20 text-[#8DC63F]"
            }`}>
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {saved && (
        <div className="mb-4 bg-[#8DC63F]/10 border border-[#8DC63F]/30 text-[#8DC63F] text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Session saved successfully!
        </div>
      )}

      {/* SESSIONS TAB */}
      {activeTab === "sessions" && (
        <>
          <div className="space-y-4 mb-8">
            {sessions.length === 0 ? (
              <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
                No sessions yet. Create your first one.
              </div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    s.type === "lesson" ? "bg-blue-500/20" : "bg-[#8DC63F]/20"
                  }`}>
                    {s.type === "lesson" ? (
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[#8DC63F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-semibold text-sm truncate">{s.title || s.day}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        s.type === "lesson" ? "bg-blue-500/20 text-blue-400" : "bg-[#8DC63F]/20 text-[#8DC63F]"
                      }`}>
                        {s.type}
                      </span>
                      {!s.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">inactive</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs flex items-center gap-3">
                      <span>{s.day} · {s.time}</span>
                      <span>{s.course}</span>
                      <span>{s.bookedSpots}/{s.maxSpots} spots</span>
                      <span className="text-[#8DC63F]">{s.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { openEdit(s); setActiveTab("sessions"); }}
                      className="text-gray-400 hover:text-white text-sm border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deleting === s.id}
                      className="text-red-400 hover:text-red-300 text-sm border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                    >
                      {deleting === s.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create / Edit Form */}
          {showForm && (
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-5 pb-3 border-b border-gray-800">
                {editSession ? "Edit Session" : "New Session"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex gap-3">
                  {(["lesson", "game"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("type", t)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        form.type === t
                          ? "bg-[#8DC63F] text-black border-[#8DC63F]"
                          : "border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {t === "lesson" ? "Lesson" : "Game"}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Title</label>
                    <input type="text" required value={form.title} onChange={(e) => update("title", e.target.value)}
                      placeholder="e.g. Beginner Golf Lesson"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Day</label>
                    <input type="text" required value={form.day} onChange={(e) => update("day", e.target.value)}
                      placeholder="e.g. Saturday"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Time</label>
                    <input type="text" required value={form.time} onChange={(e) => update("time", e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Course</label>
                    <input type="text" required value={form.course} onChange={(e) => update("course", e.target.value)}
                      placeholder="e.g. Green Valley"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Level</label>
                    <input type="text" value={form.level} onChange={(e) => update("level", e.target.value)}
                      placeholder="e.g. Beginners / All Levels"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Price (TZS)</label>
                    <input type="text" required value={form.price} onChange={(e) => update("price", e.target.value)}
                      placeholder="e.g. TZS 50,000"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  {form.type === "lesson" && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Instructor</label>
                      <input type="text" value={form.instructor} onChange={(e) => update("instructor", e.target.value)}
                        placeholder="e.g. Coach Pro Dullah"
                        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                    </div>
                  )}
                  {form.type === "game" && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Par</label>
                      <input type="text" value={form.par} onChange={(e) => update("par", e.target.value)}
                        placeholder="e.g. 72 Holes"
                        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Max Spots</label>
                    <input type="number" min={1} max={50} value={form.maxSpots}
                      onChange={(e) => update("maxSpots", Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Booked Spots</label>
                    <input type="number" min={0} value={form.bookedSpots}
                      onChange={(e) => update("bookedSpots", Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F]" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => update("active", !form.active)}
                    className={`w-11 h-6 rounded-full transition-all relative ${form.active ? "bg-[#8DC63F]" : "bg-gray-700"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.active ? "left-6" : "left-1"}`} />
                  </button>
                  <span className="text-gray-300 text-sm">{form.active ? "Active (visible on website)" : "Inactive (hidden)"}</span>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-sm transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="bg-[#8DC63F] text-black font-bold px-8 py-2.5 rounded-xl hover:bg-[#7ab535] transition-all disabled:opacity-50 flex items-center gap-2 text-sm">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editSession ? "Save Changes" : "Create Session"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* WHO'S BOOKING TAB */}
      {activeTab === "bookings" && (
        <div>
          {/* Filter by session */}
          <div className="mb-5">
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="bg-[#111111] border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#8DC63F]"
            >
              <option value="all">All Sessions ({bookings.length})</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || s.day} ({bookings.filter((b) => b.sessionId === s.id).length})
                </option>
              ))}
            </select>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
              No bookings yet.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#8DC63F]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8DC63F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm mb-0.5">{b.name}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-3 flex-wrap">
                      <span>{b.email}</span>
                      {b.phone && <span>{b.phone}</span>}
                      <span className="text-[#8DC63F]">{getSessionLabel(b.sessionId)}</span>
                    </div>
                  </div>
                  <div className="text-gray-600 text-xs flex-shrink-0">
                    {b.bookedAt ? new Date(b.bookedAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    }) : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
