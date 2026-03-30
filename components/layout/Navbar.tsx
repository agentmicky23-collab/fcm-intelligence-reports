"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/reports", label: "Reports" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/pro", label: "Pro Dashboard", special: true },
  { href: "/insider", label: "Insider" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo-transparent.png"
              alt="FCM Intelligence"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">Reports & Listings</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.label === "Insider"
                    ? "text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors"
                    : link.special
                    ? "text-sm font-semibold px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-black transition-colors"
                    : "text-sm text-muted-foreground hover:text-primary transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-900 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  link.label === "Insider"
                    ? "block py-2 px-4 my-2 text-sm font-semibold rounded-lg bg-primary text-black text-center"
                    : link.special
                    ? "block py-2 px-4 my-2 text-sm font-semibold rounded-lg border border-primary text-primary text-center hover:bg-primary hover:text-black transition-colors"
                    : "block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
