"use client";

import { useState } from "react";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "url";
  placeholder?: string;
}

interface ContentFormProps {
  title: string;
  fields: Field[];
  values: Record<string, string | number>;
  onSave: (values: Record<string, string | number>) => Promise<void>;
  children?: React.ReactNode;
}

export default function ContentForm({
  title,
  fields,
  values: initialValues,
  onSave,
  children,
}: ContentFormProps) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-5">
      <h3 className="text-white font-bold text-lg border-b border-gray-800 pb-4">{title}</h3>

      {children}

      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              value={String(values[field.key] ?? "")}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600 resize-none"
            />
          ) : (
            <input
              type={field.type}
              value={String(values[field.key] ?? "")}
              onChange={(e) =>
                handleChange(
                  field.key,
                  field.type === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              placeholder={field.placeholder}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#8DC63F] text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-[#7ab535] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
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
  );
}
