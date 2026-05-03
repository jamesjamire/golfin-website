"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { StatsContent } from "@/lib/types";

interface StatsProps {
  content: StatsContent;
}

export default function Stats({ content }: StatsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="bg-[#0a0a0a] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="animate-on-scroll text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#8DC63F]/10 border border-[#8DC63F]/20 rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 bg-[#8DC63F] rounded-full" />
            <span className="text-[#8DC63F] text-xs font-semibold tracking-widest uppercase">Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Our Community Impact
          </h2>
        </div>

        {/* Three Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 - White/Light - Hashtags */}
          <div className="animate-on-scroll bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[320px] hover:scale-[1.02] transition-all duration-300 shadow-2xl">
            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {content.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    i === 0
                      ? "bg-[#8DC63F] text-black"
                      : i === 1
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-colors cursor-pointer`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Avatar Group */}
            <div className="flex -space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white overflow-hidden"
                  style={{
                    background: `hsl(${i * 60}, 50%, 50%)`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
                    </svg>
                  </div>
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-[#8DC63F] flex items-center justify-center">
                <span className="text-black text-xs font-bold">+</span>
              </div>
            </div>

            {/* Text */}
            <p className="text-gray-800 font-semibold text-base leading-snug">
              {content.statsText}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-gray-500 text-xs ml-1">5.0</span>
            </div>
          </div>

          {/* Card 2 - Dark with Image - Price */}
          <div className="animate-on-scroll relative bg-[#111111] rounded-2xl overflow-hidden min-h-[320px] hover:scale-[1.02] transition-all duration-300 shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1600965962102-9d260a71890d?w=600&q=80"
                alt="Golf ball"
                fill
                className="object-cover opacity-40"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between min-h-[320px]">
              {/* Top Tag */}
              <div>
                <span className="bg-[#8DC63F] text-black text-xs font-bold px-3 py-1.5 rounded-full">
                  {content.easyReachTag}
                </span>
              </div>

              {/* Bottom Content */}
              <div>
                <div className="text-gray-400 text-sm mb-1">Golf Self</div>
                <div className="text-[#8DC63F] font-black text-5xl sm:text-6xl leading-none mb-3">
                  {content.priceNumber}
                </div>
                <div className="text-gray-400 text-sm mb-4">Members Joined</div>
                <button className="w-full border border-[#8DC63F]/50 text-[#8DC63F] font-semibold py-2.5 rounded-xl hover:bg-[#8DC63F] hover:text-black transition-all text-sm">
                  View Membership
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 - Green - User Growth */}
          <div className="animate-on-scroll bg-[#8DC63F] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[320px] hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-[#8DC63F]/20">
            {/* Top */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-black/20 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                  {content.userGrowthLabel}
                </span>
                <svg className="w-5 h-5 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-black/70 text-sm font-medium">{content.userGrowthSubtext}</p>
            </div>

            {/* Big Number */}
            <div>
              <div className="text-black font-black text-5xl sm:text-6xl lg:text-7xl leading-none mb-2">
                {content.userGrowthPercent}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-black/80 text-sm font-semibold">vs previous year</span>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-900 transition-all text-sm">
              {content.userGrowthCta}
            </button>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="animate-on-scroll mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { number: "12K+", label: "Active Members" },
            { number: "50+", label: "Golf Courses" },
            { number: "200+", label: "Events Hosted" },
            { number: "98%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#8DC63F] mb-1">{stat.number}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
