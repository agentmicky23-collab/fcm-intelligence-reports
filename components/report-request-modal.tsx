"use client";

import { useState, useEffect } from "react";

type ReportTier = "location" | "basic" | "professional" | "premium";

interface ListingInfo {
  name: string;
  location?: string;
  source?: string;
  id?: string;
}

interface ReportRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: ReportTier;
  listing?: ListingInfo;
}

const TIER_INFO: Record<ReportTier, { name: string; price: number; description: string }> = {
  location: { name: "Location Report", price: 99, description: "Location intelligence & demographics" },
  basic: { name: "Basic Report", price: 149, description: "Quick assessment & red flags check" },
  professional: { name: "Professional Report", price: 249, description: "Financial deep dive + 30min call" },
  premium: { name: "Premium Report", price: 449, description: "Full intelligence package + 60min call" },
};

export function ReportRequestModal({ isOpen, onClose, tier, listing }: ReportRequestModalProps) {
  const [selectedTier, setSelectedTier] = useState<ReportTier>(tier);
  const [inputMode, setInputMode] = useState<"url" | "manual">(listing ? "manual" : "url");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [listingUrl, setListingUrl] = useState("");
  const [businessName, setBusinessName] = useState(listing?.name || "");
  const [postcode, setPostcode] = useState("");
  const [listingSource, setListingSource] = useState(listing?.source || "");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerQuestions, setCustomerQuestions] = useState("");

  // Pre-fill from listing if provided
  useEffect(() => {
    if (listing) {
      setBusinessName(listing.name || "");
      setListingSource(listing.source || "");
      setInputMode("manual");
    }
  }, [listing]);

  // Update selected tier when prop changes
  useEffect(() => {
    setSelectedTier(tier);
  }, [tier]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate business details
    if (!listing) {
      if (inputMode === "url") {
        if (!listingUrl.trim()) {
          newErrors.listingUrl = "Please enter a listing URL";
        } else if (!listingUrl.match(/^https?:\/\//)) {
          newErrors.listingUrl = "Please enter a valid URL starting with http:// or https://";
        }
      } else {
        if (!businessName.trim()) {
          newErrors.businessName = "Business name is required";
        }
        if (!postcode.trim()) {
          newErrors.postcode = "Postcode is required";
        }
      }
    }

    // Validate contact details
    if (!customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }

    if (!customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!customerPhone.match(/^[\d\s+()-]{10,}$/)) {
      newErrors.customerPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Build the request payload
      const payload = {
        tier: selectedTier,
        listingName: listing?.name || businessName,
        listingLocation: listing?.location || postcode,
        listingSource: listing?.source || listingSource,
        listingUrl: inputMode === "url" ? listingUrl : undefined,
        listingId: listing?.id,
        customerEmail,
        customerPhone,
        customerQuestions: customerQuestions.trim() || undefined,
      };

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout unavailable. Please try again or contact us.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tierInfo = TIER_INFO[selectedTier];
  const hasListing = !!listing;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl relative max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0d1117",
          border: "1px solid #30363d",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 border-b"
          style={{ background: "#0d1117", borderColor: "#30363d" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: "#fff" }}>
              Request a Report
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              style={{ color: "#8b949e" }}
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pre-filled listing info (if from listing) */}
          {hasListing && (
            <div
              className="p-4 rounded-lg"
              style={{ background: "rgba(201, 162, 39, 0.1)", border: "1px solid rgba(201, 162, 39, 0.3)" }}
            >
              <div className="text-sm font-medium mb-1" style={{ color: "#c9a227" }}>
                Business
              </div>
              <div className="font-bold text-white">{listing.name}</div>
              {listing.location && (
                <div className="text-sm mt-1" style={{ color: "#8b949e" }}>
                  📍 {listing.location}
                </div>
              )}
              {listing.source && (
                <div className="text-sm" style={{ color: "#8b949e" }}>
                  Source: {listing.source}
                </div>
              )}
            </div>
          )}

          {/* Business details (if NOT from listing) */}
          {!hasListing && (
            <div>
              <div className="text-sm font-semibold mb-3" style={{ color: "#c9d1d9" }}>
                Which business do you need a report for?
              </div>

              {/* Input mode toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setInputMode("url")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    inputMode === "url"
                      ? "bg-[#c9a227] text-black"
                      : "bg-[#161b22] text-[#8b949e] border border-[#30363d]"
                  }`}
                >
                  I have a listing URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("manual")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    inputMode === "manual"
                      ? "bg-[#c9a227] text-black"
                      : "bg-[#161b22] text-[#8b949e] border border-[#30363d]"
                  }`}
                >
                  Enter details manually
                </button>
              </div>

              {inputMode === "url" ? (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                    Listing URL <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="url"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    placeholder="https://rightbiz.co.uk/listing/..."
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                    style={{
                      background: "#161b22",
                      border: errors.listingUrl ? "1px solid #ef4444" : "1px solid #30363d",
                    }}
                  />
                  {errors.listingUrl && (
                    <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                      {errors.listingUrl}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                      Business Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g., Keith Post Office"
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                      style={{
                        background: "#161b22",
                        border: errors.businessName ? "1px solid #ef4444" : "1px solid #30363d",
                      }}
                    />
                    {errors.businessName && (
                      <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                        {errors.businessName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                        Postcode <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                        placeholder="AB12 3CD"
                        className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none uppercase"
                        style={{
                          background: "#161b22",
                          border: errors.postcode ? "1px solid #ef4444" : "1px solid #30363d",
                        }}
                      />
                      {errors.postcode && (
                        <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                          {errors.postcode}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                        Listing Source
                      </label>
                      <select
                        value={listingSource}
                        onChange={(e) => setListingSource(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-white outline-none"
                        style={{ background: "#161b22", border: "1px solid #30363d" }}
                      >
                        <option value="">Select...</option>
                        <option value="RightBiz">RightBiz</option>
                        <option value="Daltons">Daltons</option>
                        <option value="Christie & Co">Christie & Co</option>
                        <option value="BusinessesForSale">BusinessesForSale</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Report tier selection */}
          <div>
            <div className="text-sm font-semibold mb-3" style={{ color: "#c9d1d9" }}>
              Select Report Type
            </div>
            <div className="space-y-2">
              {(Object.keys(TIER_INFO) as ReportTier[]).map((t) => {
                const info = TIER_INFO[t];
                return (
                  <label
                    key={t}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedTier === t ? "ring-2 ring-[#c9a227]" : ""
                    }`}
                    style={{
                      background: selectedTier === t ? "rgba(201, 162, 39, 0.1)" : "#161b22",
                      border: selectedTier === t ? "1px solid #c9a227" : "1px solid #30363d",
                    }}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={t}
                      checked={selectedTier === t}
                      onChange={() => setSelectedTier(t)}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: selectedTier === t ? "#c9a227" : "#30363d",
                        background: selectedTier === t ? "#c9a227" : "transparent",
                      }}
                    >
                      {selectedTier === t && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{info.name}</div>
                      <div className="text-sm" style={{ color: "#8b949e" }}>
                        {info.description}
                      </div>
                    </div>
                    <div className="font-mono font-bold" style={{ color: "#c9a227" }}>
                      £{info.price}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Contact details */}
          <div>
            <div className="text-sm font-semibold mb-3" style={{ color: "#c9d1d9" }}>
              Your Details
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                  Email <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                  style={{
                    background: "#161b22",
                    border: errors.customerEmail ? "1px solid #ef4444" : "1px solid #30363d",
                  }}
                />
                {errors.customerEmail && (
                  <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                    {errors.customerEmail}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                  Phone <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07xxx xxxxxx"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                  style={{
                    background: "#161b22",
                    border: errors.customerPhone ? "1px solid #ef4444" : "1px solid #30363d",
                  }}
                />
                {errors.customerPhone && (
                  <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Questions (optional) */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
              Specific questions? <span style={{ color: "#8b949e" }}>(optional)</span>
            </label>
            <textarea
              value={customerQuestions}
              onChange={(e) => setCustomerQuestions(e.target.value)}
              placeholder="Any specific areas you'd like us to focus on..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none resize-none"
              style={{ background: "#161b22", border: "1px solid #30363d" }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: "#c9a227", color: "#000" }}
          >
            {loading ? "Processing..." : `Proceed to Payment — £${tierInfo.price}`}
          </button>

          <p className="text-center text-sm" style={{ color: "#8b949e" }}>
            🔒 Secure payment via Stripe. Report delivered within 48 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
