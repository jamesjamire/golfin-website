"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
              <Image
                src="/pro-dulla-logo.jpeg"
                alt="Pro Dulla Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {/* Language */}
            <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ENG
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Nav Links */}
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link href="#collection" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
              Our Collection
            </Link>
            <Link href="#about" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
              About Us
            </Link>
            <Link href="#blog" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
              Blog
            </Link>

            {/* Contact Us */}
            <Link
              href="#contact"
              className="bg-[#8DC63F] text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#7ab535] hover:scale-105 transition-all"
            >
              Contact Us
            </Link>

            {/* Sign In */}
            <Link href="/admin/login" className="text-sm text-gray-300 hover:text-white transition-colors font-medium border border-gray-600 hover:border-[#8DC63F] px-4 py-2 rounded-full">
              Sign In
            </Link>

            {/* Cart */}
            <button className="relative text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#8DC63F] text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800 py-4 px-2 space-y-3 animate-fade-in">
            <Link href="/" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              Home
            </Link>
            <Link href="#collection" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              Our Collection
            </Link>
            <Link href="#about" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              About Us
            </Link>
            <Link href="#blog" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              Blog
            </Link>
            <div className="pt-2 flex flex-col gap-2 px-4">
              <Link href="#contact" className="bg-[#8DC63F] text-black font-semibold px-5 py-2 rounded-full text-center hover:bg-[#7ab535] transition-all">
                Contact Us
              </Link>
              <Link href="/admin/login" className="text-gray-300 hover:text-white border border-gray-600 px-4 py-2 rounded-full text-center">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
