"use client";

import Image from "next/image";
import { HeroContent } from "@/lib/types";

interface HeroProps {
  content: HeroContent;
}

export default function Hero({ content }: HeroProps) {
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
        {/* Dark overlay */}
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

            {/* Avatar Group + Membership */}
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
                <div className="text-[#8DC63F] font-bold text-xl">{content.membershipCount}</div>
                <div className="text-gray-400 text-sm">Membership</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#8DC63F] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#7ab535] hover:scale-105 transition-all shadow-lg shadow-[#8DC63F]/30">
                Get Started
              </button>
              <button className="flex items-center gap-2 text-white border border-white/30 hover:border-[#8DC63F] hover:text-[#8DC63F] px-8 py-3.5 rounded-full transition-all backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Video
              </button>
            </div>
          </div>

          {/* Right Side - Schedule Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[#8DC63F] text-xs font-semibold uppercase tracking-wider mb-1">
                    Schedule
                  </div>
                  <div className="text-white font-bold text-lg">{content.schedule.day}</div>
                  <div className="text-gray-400 text-sm">{content.schedule.level}</div>
                </div>
                <div className="bg-[#8DC63F]/20 border border-[#8DC63F]/30 rounded-xl p-3 text-center">
                  <div className="text-[#8DC63F] font-bold text-lg leading-none">
                    {content.schedule.time.split(":")[0]}
                  </div>
                  <div className="text-[#8DC63F] text-xs">
                    :{content.schedule.time.split(":")[1]}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">AM</div>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  {Array.from({ length: content.schedule.participants }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="text-gray-300 text-sm">
                  {content.schedule.participants} participants
                </span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-400 text-xs mb-1">Course</div>
                  <div className="text-white font-semibold text-sm">Green Valley</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-400 text-xs mb-1">Par</div>
                  <div className="text-white font-semibold text-sm">72 Holes</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Spots Available</span>
                  <span>{content.schedule.participants}/8</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-[#8DC63F] h-1.5 rounded-full"
                    style={{ width: `${(content.schedule.participants / 8) * 100}%` }}
                  />
                </div>
              </div>

              <button className="w-full mt-5 bg-[#8DC63F] text-black font-semibold py-3 rounded-xl hover:bg-[#7ab535] transition-all hover:scale-[1.02]">
                Join Session
              </button>
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
