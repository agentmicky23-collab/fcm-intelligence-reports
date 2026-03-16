"use client";

import { useState } from "react";
import { ReportRequestModal } from "./report-request-modal";

type ReportTier = "location" | "basic" | "professional" | "premium" | "insider";

interface ListingInfo {
  name: string;
  location?: string;
  source?: string;
  id?: string;
}

interface BuyButtonProps {
  tier: ReportTier;
  label?: string;
  className?: string;
  listing?: ListingInfo;
}

export function BuyButton({ tier, label, className = "btn-primary w-full mt-4", listing }: BuyButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultLabels: Record<string, string> = {
    location: "Buy Location Report",
    basic: "Buy Basic Report",
    professional: "Buy Professional Report",
    premium: "Buy Premium Report",
    insider: "Become an Insider",
  };

  // For Insider subscription, go directly to Stripe (no report modal needed)
  async function handleInsiderCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-insider-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout unavailable. Redirecting to contact form.");
        window.location.href = "#contact";
      }
    } catch {
      window.location.href = "#contact";
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (tier === "insider") {
      // Insider subscription - go directly to Stripe
      handleInsiderCheckout();
    } else {
      // Report tiers - open the modal to collect business details first
      setModalOpen(true);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
        style={loading ? { opacity: 0.7, cursor: "wait" } : undefined}
      >
        {loading ? "Processing..." : label || defaultLabels[tier]}
      </button>

      {/* Report Request Modal (only for non-insider tiers) */}
      {tier !== "insider" && (
        <ReportRequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tier={tier}
          listing={listing}
        />
      )}
    </>
  );
}
