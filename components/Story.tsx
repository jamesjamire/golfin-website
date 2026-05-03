"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { StoryContent } from "@/lib/types";

interface StoryProps {
  content: StoryContent;
}

export default function Story({ content }: StoryProps) {
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
    <section ref={sectionRef} id="about" className="bg-[#0a0a0a] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1 animate-on-scroll">
            <div className="space-y-6">
              <div className="text-xs text-[#8DC63F] font-semibold uppercase tracking-widest mb-8">
                Explore
              </div>
              {["Our Story", "Activity", "Find Partner"].map((item, i) => (
                <button
                  key={item}
                  className={`flex items-center gap-3 w-full text-left group transition-all ${
                    i === 0 ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-8 h-px transition-all ${
                      i === 0 ? "bg-[#8DC63F] w-12" : "bg-gray-700 group-hover:bg-gray-500"
                    }`}
                  />
                  <span className={`font-medium ${i === 0 ? "text-base" : "text-sm"}`}>
                    {item}
                  </span>
                </button>
              ))}

              {/* Decorative divider */}
              <div className="border-t border-gray-800 pt-6 mt-6">
                <div className="text-xs text-gray-600 leading-relaxed">
                  Discover the world of golf through our curated experiences and community.
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Heading */}
            <div className="animate-on-scroll">
              <div className="text-xs text-[#8DC63F] font-semibold uppercase tracking-widest mb-3">
                Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {content.heading}
              </h2>
            </div>

            {/* Two Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Card 1 - Golf For Everyone */}
              <div className="animate-on-scroll relative rounded-2xl overflow-hidden h-72 sm:h-80 group cursor-pointer">
                <Image
                  src={content.card1Image}
                  alt={content.card1Title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/70 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top badge */}
                  <div className="flex justify-end">
                    <span className="bg-[#8DC63F]/20 border border-[#8DC63F]/40 text-[#8DC63F] text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div>
                    <h3 className="text-white font-bold text-xl mb-3">{content.card1Title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      Whether you&apos;re picking up a club for the first time or refining your swing, golf has a place for everyone.
                    </p>
                    <button className="bg-[#8DC63F] text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-[#7ab535] transition-all hover:scale-105 inline-flex items-center gap-2">
                      Get Started
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 - Golf Course with Tags */}
              <div className="animate-on-scroll relative rounded-2xl overflow-hidden h-72 sm:h-80 group cursor-pointer">
                <Image
                  src={content.card2Image}
                  alt="Golf Course"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Tags */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="flex flex-wrap gap-2">
                    {content.card2Tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105 cursor-pointer ${
                          i === 0
                            ? "bg-[#8DC63F] text-black font-semibold"
                            : i % 2 === 0
                            ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                            : "bg-black/40 backdrop-blur-sm border border-[#8DC63F]/30 text-[#8DC63F] hover:border-[#8DC63F]/60"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Connect Section Preview */}
            <div className="animate-on-scroll bg-[#111111] border border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="text-xs text-[#8DC63F] font-semibold uppercase tracking-widest mb-3">
                    Community
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                    {content.connectHeading}
                  </h3>
                </div>
                <div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {content.connectSubtext.length > 120
                      ? content.connectSubtext.slice(0, 120) + "..."
                      : content.connectSubtext}
                  </p>
                  <button className="group flex items-center gap-2 text-[#8DC63F] font-semibold text-sm hover:gap-3 transition-all">
                    Read More
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
