"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  folder = "uploads",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${
          dragOver
            ? "border-[#8DC63F] bg-[#8DC63F]/10"
            : "border-gray-700 hover:border-gray-500"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <div className="relative h-48 rounded-xl overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-3 text-gray-500">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-400">Drop image here or click to upload</p>
                  <p className="text-xs text-gray-600 mt-1">JPEG, PNG, WebP up to 5MB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#8DC63F] transition-colors placeholder-gray-600"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-gray-500 hover:text-red-400 px-3 py-2 border border-gray-700 rounded-lg hover:border-red-400/50 transition-all text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
