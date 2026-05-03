"use client";

import { useState, useEffect } from "react";
import { DEFAULT_STATS, StatsContent } from "@/lib/types";

export default function AdminStatsPage() {
  const [content, setContent] = useState<StatsContent>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newHashtag, setNewHashtag] = useState("");

  useEffect(() => {
    fetch("/api/content/stats")
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
      const res = await fetch("/api/content/stats", {
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

  const update = (key: keyof StatsContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const addHashtag = () => {
    const tag = newHashtag.trim();
    if (!tag) return;
    const formatted = tag.startsWith("#") ? tag : `#${tag}`;
    setContent((prev) => ({
      ...prev,
      hashtags: [...prev.hashtags, formatted],
    }));
    setNewHashtag("");
  };

  const removeHashtag = (index: number) => {
    setContent((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index),
    }));
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
        <h1 className="text-2xl font-bold text-white mb-2">Stats Manager</h1>
        <p className="text-gray-500 text-sm">
          Update statistics cards and membership numbers
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1 - Hashtags & Text */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">
            Card 1 – Community
          </h3>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hashtags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {content.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeHashtag(i)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                placeholder="#GolfLovers"
                className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
              />
              <button
                type="button"
                onClick={addHashtag}
                className="bg-[#8DC63F] text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-[#7ab535] transition-all text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Stats Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Stats Text</label>
            <textarea
              value={content.statsText}
              onChange={(e) => update("statsText", e.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Card 2 - Price */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">
            Card 2 – Membership Price
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Price Number
              </label>
              <input
                type="text"
                value={content.priceNumber}
                onChange={(e) => update("priceNumber", e.target.value)}
                placeholder="199.00+"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Tag Label
              </label>
              <input
                type="text"
                value={content.easyReachTag}
                onChange={(e) => update("easyReachTag", e.target.value)}
                placeholder="Easy To Reach"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Card 3 - User Growth */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">
            Card 3 – User Growth
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Growth Percentage
              </label>
              <input
                type="text"
                value={content.userGrowthPercent}
                onChange={(e) => update("userGrowthPercent", e.target.value)}
                placeholder="80.99%"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Card Label
              </label>
              <input
                type="text"
                value={content.userGrowthLabel}
                onChange={(e) => update("userGrowthLabel", e.target.value)}
                placeholder="User Growth"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Subtext
            </label>
            <input
              type="text"
              value={content.userGrowthSubtext}
              onChange={(e) => update("userGrowthSubtext", e.target.value)}
              placeholder="Relative To The Previous Year"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              CTA Button Text
            </label>
            <input
              type="text"
              value={content.userGrowthCta}
              onChange={(e) => update("userGrowthCta", e.target.value)}
              placeholder="Improve Your Game Today"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-bold pb-3 mb-4 border-b border-gray-800">Preview</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4">
              <div className="flex flex-wrap gap-1 mb-3">
                {content.hashtags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 text-xs">{content.statsText.slice(0, 50)}...</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <span className="text-[#8DC63F] text-xs font-bold block mb-1">{content.easyReachTag}</span>
              <div className="text-[#8DC63F] text-2xl font-black">{content.priceNumber}</div>
            </div>
            <div className="bg-[#8DC63F] rounded-xl p-4">
              <span className="text-black text-xs font-bold block mb-1">{content.userGrowthLabel}</span>
              <div className="text-black text-2xl font-black">{content.userGrowthPercent}</div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

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
