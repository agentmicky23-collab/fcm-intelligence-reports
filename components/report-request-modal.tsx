"use client";

import { useState, useEffect } from "react";

type ReportTier = "location" | "basic" | "professional" | "premium";

interface ListingInfo {
  name: string;
  location?: string;
  postcode?: string;
  source?: string;
  id?: string;
  url?: string;
}

interface ReportRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier?: ReportTier;
  listing?: ListingInfo;
}

const TIER_INFO: Record<ReportTier, { name: string; price: number; description: string; recommended?: boolean }> = {
  location: { name: "Location Report", price: 99, description: "Location intelligence only" },
  basic: { name: "Basic Report", price: 149, description: "Quick assessment & red flags" },
  professional: { name: "Professional Report", price: 249, description: "Full financial analysis" },
  premium: { name: "Premium Report", price: 449, description: "Complete intelligence package", recommended: true },
};

const LISTING_SOURCES = ["Daltons", "RightBiz", "Christie & Co", "Other"];

export function ReportRequestModal({ isOpen, onClose, tier = "professional", listing }: ReportRequestModalProps) {
  const [selectedTier, setSelectedTier] = useState<ReportTier>(tier);
  const [inputMode, setInputMode] = useState<"url" | "manual">(listing ? "manual" : "url");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Business details
  const [listingUrl, setListingUrl] = useState(listing?.url || "");
  const [businessName, setBusinessName] = useState(listing?.name || "");
  const [postcode, setPostcode] = useState(listing?.postcode || listing?.location || "");
  const [listingSource, setListingSource] = useState(listing?.source || "Daltons");

  // Step 3: Customer details
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Step 4: Information checkboxes (Pro & Premium only)
  const [hasFinancials, setHasFinancials] = useState(false);
  const [hasAskingPrice, setHasAskingPrice] = useState(false);
  const [hasLeaseTerms, setHasLeaseTerms] = useState(false);
  const [hasStaffInfo, setHasStaffInfo] = useState(false);
  const [hasTurnover, setHasTurnover] = useState(false);
  const [hasPoRemuneration, setHasPoRemuneration] = useState(false);
  const [hasNone, setHasNone] = useState(false);

  // Pre-fill from listing if provided
  useEffect(() => {
    if (listing) {
      setBusinessName(listing.name || "");
      setPostcode(listing.postcode || listing.location || "");
      setListingSource(listing.source || "Daltons");
      if (listing.url) setListingUrl(listing.url);
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

  // Handle "None" checkbox toggling off other checkboxes
  const handleNoneChange = (checked: boolean) => {
    setHasNone(checked);
    if (checked) {
      setHasFinancials(false);
      setHasAskingPrice(false);
      setHasLeaseTerms(false);
      setHasStaffInfo(false);
      setHasTurnover(false);
      setHasPoRemuneration(false);
    }
  };

  // Handle other checkbox toggling off "None"
  const handleOtherCheckbox = (setter: (v: boolean) => void, value: boolean) => {
    setter(value);
    if (value) setHasNone(false);
  };

  const showStep4 = selectedTier === "professional" || selectedTier === "premium";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate business details (Step 1)
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

    // Validate contact details (Step 3)
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
      const payload = {
        tier: selectedTier,
        listing_url: inputMode === "url" ? listingUrl : "",
        business_name: businessName,
        postcode: postcode,
        listing_source: listingSource,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        has_financials: hasFinancials,
        has_asking_price: hasAskingPrice,
        has_lease_terms: hasLeaseTerms,
        has_staff_info: hasStaffInfo,
        has_turnover: hasTurnover,
        has_po_remuneration: hasPoRemuneration,
        listing_id: listing?.id,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl relative max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0a0a0a",
          border: "1px solid #333",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b"
          style={{ background: "#0a0a0a", borderColor: "#333" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              REQUEST A REPORT
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 1: WHICH BUSINESS? */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: "#FFD700", color: "#000" }}>
                1
              </span>
              <h3 className="text-lg font-semibold text-white">WHICH BUSINESS?</h3>
            </div>
            <div className="h-px w-full mb-5" style={{ background: "#333" }} />

            {/* Radio: URL or Manual */}
            <div className="space-y-4">
              {/* Option: URL */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1">
                  <input
                    type="radio"
                    name="inputMode"
                    checked={inputMode === "url"}
                    onChange={() => setInputMode("url")}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: inputMode === "url" ? "#FFD700" : "#555",
                      background: inputMode === "url" ? "#FFD700" : "transparent",
                    }}
                  >
                    {inputMode === "url" && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium">I have a listing URL:</span>
                  {inputMode === "url" && (
                    <div className="mt-3">
                      <input
                        type="url"
                        value={listingUrl}
                        onChange={(e) => setListingUrl(e.target.value)}
                        placeholder="https://daltonsbusiness.com/listing/..."
                        className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                        style={{
                          background: "#1a1a1a",
                          border: errors.listingUrl ? "2px solid #ef4444" : "1px solid #333",
                        }}
                      />
                      {errors.listingUrl && (
                        <p className="text-sm mt-2 text-red-500">{errors.listingUrl}</p>
                      )}
                    </div>
                  )}
                </div>
              </label>

              {/* Option: Manual */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1">
                  <input
                    type="radio"
                    name="inputMode"
                    checked={inputMode === "manual"}
                    onChange={() => setInputMode("manual")}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: inputMode === "manual" ? "#FFD700" : "#555",
                      background: inputMode === "manual" ? "#FFD700" : "transparent",
                    }}
                  >
                    {inputMode === "manual" && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium">I&apos;ll enter details manually:</span>
                  {inputMode === "manual" && (
                    <div className="mt-3 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g., Keith Post Office"
                          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                          style={{
                            background: "#1a1a1a",
                            border: errors.businessName ? "2px solid #ef4444" : "1px solid #333",
                          }}
                        />
                        {errors.businessName && (
                          <p className="text-sm mt-2 text-red-500">{errors.businessName}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Postcode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                            placeholder="AB12 3CD"
                            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none uppercase transition-all"
                            style={{
                              background: "#1a1a1a",
                              border: errors.postcode ? "2px solid #ef4444" : "1px solid #333",
                            }}
                          />
                          {errors.postcode && (
                            <p className="text-sm mt-2 text-red-500">{errors.postcode}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Listing Source
                          </label>
                          <select
                            value={listingSource}
                            onChange={(e) => setListingSource(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg text-white outline-none cursor-pointer"
                            style={{ background: "#1a1a1a", border: "1px solid #333" }}
                          >
                            {LISTING_SOURCES.map((source) => (
                              <option key={source} value={source}>{source}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 2: SELECT REPORT TYPE */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: "#FFD700", color: "#000" }}>
                2
              </span>
              <h3 className="text-lg font-semibold text-white">SELECT REPORT TYPE</h3>
            </div>
            <div className="h-px w-full mb-5" style={{ background: "#333" }} />

            <div className="space-y-3">
              {(Object.keys(TIER_INFO) as ReportTier[]).map((t) => {
                const info = TIER_INFO[t];
                const isSelected = selectedTier === t;
                return (
                  <label
                    key={t}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: isSelected ? "rgba(255, 215, 0, 0.1)" : "#1a1a1a",
                      border: isSelected ? "2px solid #FFD700" : "1px solid #333",
                    }}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={t}
                      checked={isSelected}
                      onChange={() => setSelectedTier(t)}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: isSelected ? "#FFD700" : "#555",
                        background: isSelected ? "#FFD700" : "transparent",
                      }}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{info.name}</span>
                        {info.recommended && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#FFD700", color: "#000" }}>
                            ⭐ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5">{info.description}</div>
                    </div>
                    <div className="font-mono font-bold text-lg" style={{ color: "#FFD700" }}>
                      £{info.price}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 3: YOUR DETAILS */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: "#FFD700", color: "#000" }}>
                3
              </span>
              <h3 className="text-lg font-semibold text-white">YOUR DETAILS</h3>
            </div>
            <div className="h-px w-full mb-5" style={{ background: "#333" }} />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                  style={{
                    background: "#1a1a1a",
                    border: errors.customerEmail ? "2px solid #ef4444" : "1px solid #333",
                  }}
                />
                {errors.customerEmail && (
                  <p className="text-sm mt-2 text-red-500">{errors.customerEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07xxx xxxxxx"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                  style={{
                    background: "#1a1a1a",
                    border: errors.customerPhone ? "2px solid #ef4444" : "1px solid #333",
                  }}
                />
                {errors.customerPhone && (
                  <p className="text-sm mt-2 text-red-500">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 4: INFORMATION YOU HAVE (Pro & Premium only) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {showStep4 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: "#FFD700", color: "#000" }}>
                  4
                </span>
                <h3 className="text-lg font-semibold text-white">INFORMATION YOU HAVE</h3>
              </div>
              <div className="h-px w-full mb-5" style={{ background: "#333" }} />

              <p className="text-gray-400 text-sm mb-4">Help us prepare a better report:</p>

              <div className="space-y-3">
                {[
                  { label: "I have company financials/accounts", checked: hasFinancials, onChange: (v: boolean) => handleOtherCheckbox(setHasFinancials, v) },
                  { label: "I have confirmed asking price", checked: hasAskingPrice, onChange: (v: boolean) => handleOtherCheckbox(setHasAskingPrice, v) },
                  { label: "I have lease terms/rent details", checked: hasLeaseTerms, onChange: (v: boolean) => handleOtherCheckbox(setHasLeaseTerms, v) },
                  { label: "I have staff/payroll information", checked: hasStaffInfo, onChange: (v: boolean) => handleOtherCheckbox(setHasStaffInfo, v) },
                  { label: "I have current turnover figures", checked: hasTurnover, onChange: (v: boolean) => handleOtherCheckbox(setHasTurnover, v) },
                  { label: "I have PO remuneration details", checked: hasPoRemuneration, onChange: (v: boolean) => handleOtherCheckbox(setHasPoRemuneration, v) },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: item.checked ? "#FFD700" : "#555",
                        background: item.checked ? "#FFD700" : "transparent",
                      }}
                    >
                      {item.checked && (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-white">{item.label}</span>
                  </label>
                ))}

                {/* None option */}
                <label className="flex items-center gap-3 cursor-pointer group mt-2 pt-2 border-t border-gray-800">
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: hasNone ? "#FFD700" : "#555",
                      background: hasNone ? "#FFD700" : "transparent",
                    }}
                  >
                    {hasNone && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={hasNone}
                    onChange={(e) => handleNoneChange(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-gray-400">None — I just have the listing</span>
                </label>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SUBMIT BUTTON */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="pt-4 border-t" style={{ borderColor: "#333" }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: "#FFD700", color: "#000" }}
            >
              {loading ? "Processing..." : `PROCEED TO PAYMENT — £${tierInfo.price}`}
            </button>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span>🔒</span> Secure payment via Stripe
              </span>
              <span className="flex items-center gap-2">
                <span>📧</span> Report delivered within 48 hours
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
