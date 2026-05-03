"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Event } from "@/lib/types";

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
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
    <section ref={sectionRef} id="events" className="bg-[#0d0d0d] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="animate-on-scroll text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#8DC63F]/10 border border-[#8DC63F]/20 rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 bg-[#8DC63F] rounded-full animate-pulse" />
            <span className="text-[#8DC63F] text-xs font-semibold tracking-widest uppercase">Upcoming Events</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Golf Events – Don&apos;t Miss Out!
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join the most prestigious golf tournaments and community gatherings around the world.
            Experience the thrill of competition and camaraderie.
          </p>
        </div>

        {/* Discovery Banner */}
        <div className="animate-on-scroll bg-[#111111] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Discover The Joy Of Golf At Every Level, From Community Gatherings To World-Class Tournament
              </p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Enjoy Golf From Events To Tournaments.
              </h3>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="animate-on-scroll bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#8DC63F]/30 transition-all duration-300 group"
            >
              <div className="grid md:grid-cols-3 gap-0">
                {/* Event Image */}
                <div className="relative h-48 md:h-auto md:min-h-[220px] overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111]/50 hidden md:block" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#8DC63F] text-black text-xs font-bold px-3 py-1.5 rounded-full">
                      Event {index + 1}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start gap-3 mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#8DC63F] transition-colors flex-1">
                        {event.title}
                      </h3>
                      <span className="bg-[#8DC63F]/10 border border-[#8DC63F]/30 text-[#8DC63F] text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                        {event.dateRange}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4 text-[#8DC63F] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>

                      {/* Teams */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.teamMatch}</span>
                      </div>

                      {/* Start Time */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Start: {event.startTime}</span>
                      </div>

                      {/* End Time */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>End: {event.endTime}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-800">
                    <a
                      href={event.joinLink}
                      className="bg-[#8DC63F] text-black font-semibold px-6 py-2.5 rounded-full hover:bg-[#7ab535] hover:scale-105 transition-all inline-flex items-center gap-2 text-sm"
                    >
                      Join Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <button className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="animate-on-scroll text-center mt-10">
          <button className="group flex items-center gap-2 text-[#8DC63F] font-semibold mx-auto hover:gap-3 transition-all">
            View all events
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
