"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { DEFAULT_HERO, HeroContent } from "@/lib/types";

export default function AdminHeroPage() {
  const [content, setContent] = useState<HeroContent>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/hero")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/content/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const update = (path: string, value: string | number) => {
    setContent((prev) => {
      const parts = path.split(".");
      if (parts.length === 1) {
        return { ...prev, [path]: value };
      }
      if (parts.length === 2) {
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof HeroContent] as Record<string, unknown>),
            [child]: value,
          },
        };
      }
      return prev;
    });
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Hero Content</h1>
        <p className="text-gray-500 text-sm">
          Edit the main hero section of the homepage
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Background Image */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-5 pb-3 border-b border-gray-800">
            Background Image
          </h3>
          <ImageUpload
            value={content.backgroundImage}
            onChange={(url) => update("backgroundImage", url)}
            label="Hero Background"
            folder="hero"
          />
        </div>

        {/* Main Content */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">Main Content</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Headline</label>
            <textarea
              value={content.headline}
              onChange={(e) => update("headline", e.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtext</label>
            <textarea
              value={content.subtext}
              onChange={(e) => update("subtext", e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Students Taught
            </label>
            <input
              type="text"
              value={(content as unknown as Record<string, string>).studentsCount ?? (content as unknown as Record<string, string>).membershipCount ?? ""}
              onChange={(e) => update("studentsCount", e.target.value)}
              placeholder="12k +"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Watch Video Link
            </label>
            <input
              type="url"
              value={(content as unknown as Record<string, string>).videoLink ?? ""}
              onChange={(e) => update("videoLink", e.target.value)}
              placeholder="https://youtube.com/... or https://instagram.com/..."
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">Paste a YouTube or Instagram video link. Leave blank to hide the button.</p>
          </div>
        </div>

        {/* Location Badge */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">Location Badge</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "locationBadge.city", label: "City" },
              { key: "locationBadge.address", label: "Address" },
              { key: "locationBadge.country", label: "Country" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                <input
                  type="text"
                  value={
                    (content.locationBadge as Record<string, string>)[
                      key.split(".")[1]
                    ] || ""
                  }
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">Schedule Card</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Day</label>
              <input
                type="text"
                value={content.schedule.day}
                onChange={(e) => update("schedule.day", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Level</label>
              <input
                type="text"
                value={content.schedule.level}
                onChange={(e) => update("schedule.level", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Time</label>
              <input
                type="text"
                value={content.schedule.time}
                onChange={(e) => update("schedule.time", e.target.value)}
                placeholder="10:00 AM"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Participants
              </label>
              <input
                type="number"
                value={content.schedule.participants}
                onChange={(e) => update("schedule.participants", Number(e.target.value))}
                min={1}
                max={20}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#8DC63F] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#7ab535] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          {saved && (
            <span className="text-[#8DC63F] text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
