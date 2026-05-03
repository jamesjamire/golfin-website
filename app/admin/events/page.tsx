"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";
import { DEFAULT_EVENTS, Event } from "@/lib/types";

const EMPTY_EVENT: Omit<Event, "id" | "createdAt"> = {
  title: "",
  dateRange: "",
  startDate: "",
  endDate: "",
  location: "",
  teamMatch: "",
  startTime: "08:00 AM",
  endTime: "12:00 PM",
  description: "",
  image: "",
  joinLink: "#",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Omit<Event, "id" | "createdAt">>(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : DEFAULT_EVENTS);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      dateRange: event.dateRange,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      teamMatch: event.teamMatch,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      image: event.image,
      joinLink: event.joinLink,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingEvent(null);
    setFormData(EMPTY_EVENT);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = !!editingEvent;
      const body = isEdit
        ? { action: "update", event: { ...formData, id: editingEvent!.id } }
        : { action: "create", event: { ...formData, id: `event-${Date.now()}` } };

      const res = await fetch("/api/content/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();

      if (isEdit) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === editingEvent!.id ? { ...e, ...formData } : e
          )
        );
      } else {
        setEvents((prev) => [data.event, ...prev]);
      }

      setShowForm(false);
      setEditingEvent(null);
      setFormData(EMPTY_EVENT);
      showMessage("success", isEdit ? "Event updated!" : "Event created!");
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/content/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showMessage("success", "Event deleted!");
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Events Manager</h1>
          <p className="text-gray-500 text-sm">Manage golf events ({events.length} total)</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-[#8DC63F] text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-[#7ab535] transition-all flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-5 flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
            message.type === "success"
              ? "bg-[#8DC63F]/10 border border-[#8DC63F]/20 text-[#8DC63F]"
              : "bg-red-400/10 border border-red-400/20 text-red-400"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === "success" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-[#111111] border border-[#8DC63F]/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
            <h3 className="text-white font-bold text-lg">
              {editingEvent ? "Edit Event" : "New Event"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Date Range (display)
                </label>
                <input
                  type="text"
                  value={formData.dateRange}
                  onChange={(e) => updateForm("dateRange", e.target.value)}
                  placeholder="Sep 20 - 28 2025"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateForm("endDate", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Team Match</label>
                <input
                  type="text"
                  value={formData.teamMatch}
                  onChange={(e) => updateForm("teamMatch", e.target.value)}
                  placeholder="Team USA vs Europe"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Time</label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => updateForm("startTime", e.target.value)}
                  placeholder="08:00 AM"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">End Time</label>
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) => updateForm("endTime", e.target.value)}
                  placeholder="12:00 PM"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Join Link</label>
              <input
                type="url"
                value={formData.joinLink}
                onChange={(e) => updateForm("joinLink", e.target.value)}
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateForm("description", e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors resize-none"
              />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => updateForm("image", url)}
              label="Event Image"
              folder="events"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#8DC63F] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#7ab535] transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : editingEvent ? (
                  "Update Event"
                ) : (
                  "Create Event"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }}
                className="text-gray-400 border border-gray-700 px-6 py-2.5 rounded-xl hover:border-gray-500 hover:text-white transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-12 text-center">
            <p className="text-gray-500 mb-4">No events yet</p>
            <button
              onClick={handleNew}
              className="bg-[#8DC63F] text-black font-semibold px-5 py-2 rounded-xl hover:bg-[#7ab535] transition-all text-sm"
            >
              Add First Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-0">
                {/* Image */}
                {event.image && (
                  <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold text-base mb-1">{event.title}</h4>
                    <p className="text-[#8DC63F] text-xs font-medium mb-1">{event.dateRange}</p>
                    <p className="text-gray-500 text-xs">{event.location}</p>
                    {event.teamMatch && (
                      <p className="text-gray-600 text-xs mt-0.5">{event.teamMatch}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deleting === event.id}
                      className="text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/50 px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {deleting === event.id ? (
                        <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
