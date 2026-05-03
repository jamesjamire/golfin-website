"use client";

import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/content/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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

  const updateNested = (section: keyof SiteSettings, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, string>),
        [key]: value,
      },
    }));
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
        <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage social links, footer links, and site configuration
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Social Media Links */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">
            Social Media Links
          </h3>
          {Object.entries(settings.socialLinks).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 capitalize">
                {key === "twitter" ? "X (Twitter)" : key}
              </label>
              <input
                type="url"
                value={value}
                onChange={(e) => updateNested("socialLinks", key, e.target.value)}
                placeholder={`https://${key}.com/...`}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
              />
            </div>
          ))}
        </div>

        {/* Shop Links */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">Shop Links</h3>
          {Object.entries(settings.shopLinks).map(([key, value]) => {
            const labels: Record<string, string> = {
              priceList: "Price List",
              accessories: "Accessories",
              brochure: "Brochure",
              promo: "Promo",
            };
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {labels[key] || key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateNested("shopLinks", key, e.target.value)}
                  placeholder="#"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
                />
              </div>
            );
          })}
        </div>

        {/* Contact Links */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">Contact Links</h3>
          {Object.entries(settings.contactLinks).map(([key, value]) => {
            const labels: Record<string, string> = {
              community: "Community",
              knowledgeBase: "Knowledge Base",
              support: "Support",
              howToBuy: "How to Buy",
            };
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {labels[key] || key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateNested("contactLinks", key, e.target.value)}
                  placeholder="#"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
                />
              </div>
            );
          })}
        </div>

        {/* Learn Links */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold pb-3 border-b border-gray-800">Learn Links</h3>
          {Object.entries(settings.learnLinks).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 capitalize">
                {key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateNested("learnLinks", key, e.target.value)}
                placeholder="#"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
              />
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-bold pb-3 mb-4 border-b border-gray-800">Copyright</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Copyright Text</label>
            <input
              type="text"
              value={settings.copyright}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, copyright: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors"
            />
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
              "Save Settings"
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
