"use client";

import Image from "next/image";
import { useState } from "react";
import { HeroContent, BookingSession } from "@/lib/types";

interface HeroProps {
  content: HeroContent;
  bookingSessions: BookingSession[];
}

export default function Hero({ content, bookingSessions }: HeroProps) {
  const [activeType, setActiveType] = useState<"lesson" | "game">("lesson");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const sessions = bookingSessions.filter(
    (s) => s.active && s.type === activeType
  );
  const session = sessions[0] || null;

  const spotsLeft = session ? session.maxSpots - session.bookedSpots : 0;
  const spotsPercent = session
    ? (session.bookedSpots / session.maxSpots) * 100
    : 0;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/bookings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, ...form }),
      });
      if (!res.ok) throw new Error("Booking failed");
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImage}
          alt="Golf course background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-[#8DC63F] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-sm text-white font-medium">{content.locationBadge.city}</span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-300 text-sm">{content.locationBadge.address}</span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-300 text-sm">{content.locationBadge.country}</span>
            </div>

            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 bg-[#8DC63F]/20 border border-[#8DC63F]/30 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 bg-[#8DC63F] rounded-full animate-pulse" />
              <span className="text-[#8DC63F] text-xs font-semibold tracking-widest uppercase">
                Welcome To Hole
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              {content.headline}
            </h1>

            {/* Subtext */}
            <p className="text-gray-300 text-base sm:text-lg max-w-lg leading-relaxed">
              {content.subtext}
            </p>

            {/* Avatar Group + Students Count */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-black overflow-hidden bg-gradient-to-br from-[#8DC63F] to-[#5a9e1a] flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[#8DC63F] font-bold text-xl">{content.studentsCount}</div>
                <div className="text-gray-400 text-sm">Students Taught</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setActiveType("lesson");
                  document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  setTimeout(() => setShowForm(true), 400);
                }}
                className="bg-[#8DC63F] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#7ab535] hover:scale-105 transition-all shadow-lg shadow-[#8DC63F]/30"
              >
                Get Started
              </button>
              {content.videoLink ? (
                <a
                  href={content.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white border border-white/30 hover:border-[#8DC63F] hover:text-[#8DC63F] px-8 py-3.5 rounded-full transition-all backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Video
                </a>
              ) : null}
            </div>
          </div>

          {/* Right Side - Booking Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

              {/* Type Toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-5">
                <button
                  onClick={() => { setActiveType("lesson"); setShowForm(false); setSubmitted(false); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeType === "lesson"
                      ? "bg-[#8DC63F] text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Book a Lesson
                </button>
                <button
                  onClick={() => { setActiveType("game"); setShowForm(false); setSubmitted(false); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeType === "game"
                      ? "bg-[#8DC63F] text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Book a Game
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-[#8DC63F]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#8DC63F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-bold mb-1">Booking Confirmed!</p>
                  <p className="text-gray-400 text-sm">We&apos;ll be in touch shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-[#8DC63F] text-sm underline"
                  >
                    Book another
                  </button>
                </div>
              ) : session ? (
                <>
                  {/* Session Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[#8DC63F] text-xs font-semibold uppercase tracking-wider mb-1">
                        {activeType === "lesson" ? "Lesson" : "Game"}
                      </div>
                      <div className="text-white font-bold text-lg">{session.day}</div>
                      <div className="text-gray-400 text-sm">{session.level}</div>
                      {activeType === "lesson" && session.instructor && (
                        <div className="text-gray-400 text-xs mt-0.5">with {session.instructor}</div>
                      )}
                    </div>
                    <div className="bg-[#8DC63F]/20 border border-[#8DC63F]/30 rounded-xl p-3 text-center min-w-[56px]">
                      <div className="text-[#8DC63F] font-bold text-lg leading-none">
                        {session.time.split(":")[0]}
                      </div>
                      <div className="text-[#8DC63F] text-xs">
                        :{session.time.split(":")[1]?.replace(" AM", "").replace(" PM", "")}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {session.time.includes("PM") ? "PM" : "AM"}
                      </div>
                    </div>
                  </div>

                  {/* Course + Par / Price */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-gray-400 text-xs mb-1">Course</div>
                      <div className="text-white font-semibold text-sm">{session.course}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-gray-400 text-xs mb-1">
                        {activeType === "game" ? "Par" : "Price"}
                      </div>
                      <div className="text-white font-semibold text-sm">
                        {activeType === "game" ? session.par : session.price}
                      </div>
                    </div>
                  </div>

                  {/* Spots */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Spots Available</span>
                      <span>{spotsLeft}/{session.maxSpots}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-[#8DC63F] h-1.5 rounded-full transition-all"
                        style={{ width: `${spotsPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Booking Form (inline) */}
                  {showForm ? (
                    <form onSubmit={handleBook} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/10 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#8DC63F]"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-white/10 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#8DC63F]"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-white/10 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#8DC63F]"
                      />
                      {formError && (
                        <p className="text-red-400 text-xs">{formError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || spotsLeft === 0}
                          className="flex-1 py-2.5 bg-[#8DC63F] text-black font-semibold rounded-xl text-sm hover:bg-[#7ab535] transition-all disabled:opacity-50"
                        >
                          {submitting ? "Booking..." : "Confirm"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowForm(true)}
                      disabled={spotsLeft === 0}
                      className="w-full bg-[#8DC63F] text-black font-semibold py-3 rounded-xl hover:bg-[#7ab535] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {spotsLeft === 0 ? "Fully Booked" : `Book ${activeType === "lesson" ? "Lesson" : "Game"} — ${session.price}`}
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No {activeType} sessions available right now.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs tracking-widest uppercase">Scroll Down</span>
          <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#8DC63F] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
