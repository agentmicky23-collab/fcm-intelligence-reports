"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fcm-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (choice: "all" | "essential") => {
    localStorage.setItem("fcm-cookie-consent", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9998] p-4"
      style={{ background: "rgba(0, 0, 0, 0.95)", borderTop: "1px solid #333", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-relaxed">
            We use essential cookies to make our site work and optional analytics cookies to help us improve it. 
            For details, see our{' '}
            <Link href="/cookies" className="underline hover:text-white transition-colors" style={{ color: "#FFD700" }}>
              Cookie Policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => handleAccept("essential")}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gray-700"
            style={{ background: "#1a1a1a", border: "1px solid #555", color: "#d1d5db" }}
          >
            Essential Only
          </button>
          <button
            onClick={() => handleAccept("all")}
            className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:opacity-90"
            style={{ background: "#FFD700", color: "#000" }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
