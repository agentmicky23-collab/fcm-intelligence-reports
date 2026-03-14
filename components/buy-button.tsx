"use client";

import { useState } from "react";

interface BuyButtonProps {
  tier: "location" | "basic" | "professional" | "premium" | "insider";
  label?: string;
  className?: string;
  listingName?: string;
}

export function BuyButton({ tier, label, className = "btn-primary w-full mt-4", listingName }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const defaultLabels: Record<string, string> = {
    location: "Buy Location Report",
    basic: "Buy Basic Report",
    professional: "Buy Professional Report",
    premium: "Buy Premium Report",
    insider: "Become an Insider",
  };

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, listingName }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback: Stripe not configured, go to contact form
        alert(data.error || "Checkout unavailable. Redirecting to contact form.");
        window.location.href = "#contact";
      }
    } catch {
      // Fallback to contact form
      window.location.href = "#contact";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      style={loading ? { opacity: 0.7, cursor: "wait" } : undefined}
    >
      {loading ? "Processing..." : label || defaultLabels[tier]}
    </button>
  );
}
