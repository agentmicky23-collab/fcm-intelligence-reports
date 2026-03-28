"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

const gold = "#c9a227";
const goldLight = "#d4b84a";
const navy = "#0B1D3A";
const font = "'Inter', -apple-system, sans-serif";

const TIERS: Record<string, { name: string; price: string; amount: string; sections: string; turnaround: string; tagline: string }> = {
  insight: {
    name: "Insight Report",
    price: "£199",
    amount: "199",
    sections: "10 sections",
    turnaround: "24–48 hours",
    tagline: "Should I risk my savings on this?",
  },
  intelligence: {
    name: "Intelligence Report",
    price: "£499",
    amount: "499",
    sections: "15 sections + consultation call",
    turnaround: "3–5 business days",
    tagline: "Give me the power to control this deal.",
  },
};

function OrderFormContent() {
  const searchParams = useSearchParams();
  const tierParam = searchParams?.get("tier") || "insight";
  const [tier, setTier] = useState(tierParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    listing_url: "",
    business_name: "",
    postcode: "",
    town_city: "",
    listing_source: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    notes: "",
  });

  useEffect(() => {
    if (tierParam && TIERS[tierParam]) setTier(tierParam);
  }, [tierParam]);

  const info = TIERS[tier] || TIERS.insight;

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.business_name.trim() && !form.listing_url.trim()) {
      setError("Please provide at least a business name or listing URL so we know which business to report on.");
      return;
    }
    if (!form.customer_email.trim()) {
      setError("We need your email to deliver the report.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          listing_url: form.listing_url,
          business_name: form.business_name,
          postcode: form.postcode,
          town_city: form.town_city,
          listing_source: form.listing_source,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again or contact us directly.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontFamily: font,
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: font,
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
          FCM Intelligence
        </div>
        <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Order your report
        </h1>
        <p style={{ fontFamily: font, fontSize: 15, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>
          Tell us which business you're looking at. We'll do the rest.
        </p>
      </div>

      {/* Tier selector */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        {(["insight", "intelligence"] as const).map((t) => {
          const selected = tier === t;
          const ti = TIERS[t];
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              style={{
                flex: 1,
                padding: "16px 14px",
                borderRadius: 14,
                border: selected
                  ? t === "intelligence"
                    ? `2px solid ${gold}`
                    : "2px solid rgba(255,255,255,0.25)"
                  : "1.5px solid rgba(255,255,255,0.08)",
                background: selected
                  ? t === "intelligence"
                    ? "rgba(201,162,39,0.06)"
                    : "rgba(255,255,255,0.04)"
                  : "transparent",
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
                transition: "all 0.2s",
              }}
            >
              {t === "intelligence" && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: navy,
                  fontFamily: font, fontSize: 9, fontWeight: 700, padding: "2px 10px",
                  borderRadius: "0 0 6px 6px", textTransform: "uppercase", letterSpacing: 1,
                }}>
                  Most popular
                </div>
              )}
              <div style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: selected ? "#fff" : "rgba(255,255,255,0.5)", marginBottom: 2 }}>
                {ti.name}
              </div>
              <div style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: t === "intelligence" && selected ? gold : selected ? "#fff" : "rgba(255,255,255,0.3)" }}>
                {ti.price}
              </div>
              <div style={{ fontFamily: font, fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                {ti.sections} · {ti.turnaround}
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section: Business details */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: gold, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            Which business?
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Listing URL</label>
            <input
              type="url"
              placeholder="https://www.daltonsbusiness.com/..."
              value={form.listing_url}
              onChange={update("listing_url")}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <div style={{ fontFamily: font, fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
              Paste the listing link from Daltons, Rightbiz, BusinessesForSale, etc.
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Business name <span style={{ color: "rgba(255,255,255,0.25)" }}>*</span></label>
            <input
              type="text"
              placeholder="e.g. Wombwell Post Office & Convenience"
              value={form.business_name}
              onChange={update("business_name")}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Postcode</label>
              <input
                type="text"
                placeholder="S73 8AA"
                value={form.postcode}
                onChange={update("postcode")}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Town / City</label>
              <input
                type="text"
                placeholder="Barnsley"
                value={form.town_city}
                onChange={update("town_city")}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Where did you find this listing?</label>
            <select
              value={form.listing_source}
              onChange={update("listing_source")}
              style={{ ...inputStyle, appearance: "none" as const, cursor: "pointer" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <option value="" style={{ background: navy }}>Select source...</option>
              <option value="Daltons" style={{ background: navy }}>Daltons Business</option>
              <option value="Rightbiz" style={{ background: navy }}>Rightbiz</option>
              <option value="BusinessesForSale" style={{ background: navy }}>BusinessesForSale.com</option>
              <option value="Christie" style={{ background: navy }}>Christie &amp; Co</option>
              <option value="Agent" style={{ background: navy }}>Broker / agent</option>
              <option value="Direct" style={{ background: navy }}>Direct from seller</option>
              <option value="Other" style={{ background: navy }}>Other</option>
            </select>
          </div>
        </div>

        {/* Section: Your details */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: gold, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            Your details
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.customer_name}
              onChange={update("customer_name")}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email address <span style={{ color: "rgba(255,255,255,0.25)" }}>*</span></label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.customer_email}
              onChange={update("customer_email")}
              required
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <div style={{ fontFamily: font, fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
              Your report will be delivered here.
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Phone number <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>(optional)</span></label>
            <input
              type="tel"
              placeholder="07..."
              value={form.customer_phone}
              onChange={update("customer_phone")}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          <div>
            <label style={labelStyle}>Anything else we should know? <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>(optional)</span></label>
            <textarea
              placeholder="Specific concerns, questions you want answered, information you already have..."
              value={form.notes}
              onChange={update("notes")}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontFamily: font, fontSize: 14, color: "#ff6b6b", background: "rgba(255,107,107,0.08)",
            border: "1px solid rgba(255,107,107,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Summary + submit */}
        <div style={{
          background: "rgba(201,162,39,0.04)", border: "1.5px solid rgba(201,162,39,0.15)",
          borderRadius: 14, padding: "20px 22px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: "#fff" }}>{info.name}</div>
            <div style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: gold }}>{info.price}</div>
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
            {info.sections} · Delivered in {info.turnaround} · Upgrade anytime
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px 24px",
            borderRadius: 12,
            border: "none",
            background: loading
              ? "rgba(201,162,39,0.3)"
              : `linear-gradient(135deg, ${gold}, ${goldLight})`,
            color: navy,
            fontFamily: font,
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            letterSpacing: 0.5,
          }}
        >
          {loading ? "Redirecting to payment..." : `Continue to payment · ${info.price}`}
        </button>

        <div style={{ fontFamily: font, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
          Secure payment via Stripe. Your card details never touch our servers.
        </div>
      </form>
    </div>
  );
}

export default function OrderPage() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.3)", fontFamily: font }}>
          Loading order form...
        </div>
      }>
        <OrderFormContent />
      </Suspense>
    </AppLayout>
  );
}
