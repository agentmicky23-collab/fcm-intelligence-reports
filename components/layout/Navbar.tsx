"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/reports", label: "Reports" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/support", label: "Support" },
];

const actionLinks = [
  { href: "/pro", label: "Pro Dashboard" },
  { href: "/my-reports", label: "My Reports" },
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
              alt="FCM Intelligence logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">Reports & Listings</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-end">
            {/* Main links - plain text */}
            <div className="flex items-center gap-6 mr-auto ml-12">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Action links - gold buttons, right side */}
            <div className="flex items-center gap-3">
              {actionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
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
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-900 space-y-2">
              {actionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 px-4 text-sm font-semibold rounded-lg bg-primary text-black text-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
