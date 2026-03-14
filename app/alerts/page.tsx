"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

const BUSINESS_TYPES = [
  { value: "post_office", label: "Post Office" },
  { value: "forecourt", label: "Forecourt" },
  { value: "convenience_store", label: "Convenience Store" },
  { value: "newsagent", label: "Newsagent" },
];

const REGIONS = [
  "East Anglia",
  "East Midlands",
  "London",
  "Midlands",
  "North East",
  "North West",
  "Scotland",
  "Shropshire",
  "South East",
  "South West",
  "West Midlands",
  "Yorkshire",
];

const BUDGET_RANGES = [
  { value: "under_50k", label: "Under £50k" },
  { value: "50_100k", label: "£50k – £100k" },
  { value: "100_200k", label: "£100k – £200k" },
  { value: "200k_plus", label: "£200k+" },
];

export default function AlertsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  function toggleRegion(region: string) {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add selected regions as a single field
    formData.set("preferred_regions", selectedRegions.join(", "));

    try {
      await fetch("https://formspree.io/f/xblgnqzj", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <AppLayout>
        <section className="pt-32 pb-20 min-h-screen">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <div
              className="mx-auto mb-8 flex items-center justify-center rounded-full"
              style={{
                width: 96,
                height: 96,
                background: "rgba(34, 197, 94, 0.15)",
                border: "2px solid #22c55e",
              }}
            >
              <span className="text-5xl">📧</span>
            </div>
            <h1 className="font-playfair text-4xl font-bold mb-4">
              You&apos;re <span style={{ color: "#22c55e" }}>Signed Up!</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "#8b949e" }}>
              We&apos;ll send you weekly alerts when new listings match your criteria.
              Keep an eye on your inbox!
            </p>
            <a href="/" className="btn-primary px-8 py-3">
              Browse Current Listings
            </a>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero */}
      <section
        className="pt-32 pb-12"
        style={{
          background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm mb-6"
            style={{
              background: "rgba(201, 162, 39, 0.15)",
              border: "1px solid #c9a227",
              color: "#c9a227",
            }}
          >
            <span className="flex h-2 w-2 rounded-full bg-[#c9a227] animate-pulse"></span>
            Free Weekly Service
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
            Weekly Listing <span style={{ color: "#c9a227" }}>Alerts</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            Never miss a new opportunity. Get hand-picked listings delivered to your
            inbox every week, matched to your exact criteria.
          </p>
        </div>
      </section>

      {/* Benefits strip */}
      <section
        style={{
          borderTop: "1px solid #30363d",
          borderBottom: "1px solid #30363d",
          background: "rgba(22, 27, 34, 0.5)",
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
            <div>
              <span className="text-2xl block mb-1">🎯</span>
              <strong className="text-white">Personalised</strong>
              <p style={{ color: "#8b949e" }}>
                Matched to your budget, region &amp; business type
              </p>
            </div>
            <div>
              <span className="text-2xl block mb-1">⚡</span>
              <strong className="text-white">First to Know</strong>
              <p style={{ color: "#8b949e" }}>
                Get alerted before listings go mainstream
              </p>
            </div>
            <div>
              <span className="text-2xl block mb-1">🆓</span>
              <strong className="text-white">Completely Free</strong>
              <p style={{ color: "#8b949e" }}>
                No cost, no spam, unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="old-contact-form">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="_subject" value="New Weekly Alerts Signup" />
              <input type="hidden" name="form_type" value="weekly_alerts" />

              {/* Name */}
              <div className="form-group">
                <label htmlFor="alert-name">Your Name *</label>
                <input
                  type="text"
                  id="alert-name"
                  name="name"
                  placeholder="Full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="alert-email">Email Address *</label>
                <input
                  type="email"
                  id="alert-email"
                  name="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Business type checkboxes */}
              <div className="form-group">
                <label>What are you looking for?</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {BUSINESS_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                      style={{
                        background: "#0d1117",
                        border: "1px solid #30363d",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="business_types"
                        value={type.value}
                        className="accent-[#c9a227] w-4 h-4"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred regions — multi-select chips */}
              <div className="form-group">
                <label>Preferred Regions</label>
                <p className="text-xs mb-2" style={{ color: "#57606a" }}>
                  Select all that apply
                </p>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((region) => {
                    const active = selectedRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                          background: active
                            ? "rgba(201, 162, 39, 0.2)"
                            : "#0d1117",
                          border: active
                            ? "1px solid #c9a227"
                            : "1px solid #30363d",
                          color: active ? "#c9a227" : "#8b949e",
                        }}
                      >
                        {active ? "✓ " : ""}
                        {region}
                      </button>
                    );
                  })}
                </div>
                {/* Hidden field for form submission */}
                <input
                  type="hidden"
                  name="preferred_regions"
                  value={selectedRegions.join(", ")}
                />
              </div>

              {/* Budget range */}
              <div className="form-group">
                <label htmlFor="alert-budget">Budget Range</label>
                <select id="alert-budget" name="budget_range">
                  <option value="">Select your budget range...</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
                style={submitting ? { opacity: 0.7, cursor: "wait" } : undefined}
              >
                {submitting ? "Signing Up..." : "📧 Get Weekly Alerts"}
              </button>

              <p
                className="text-xs text-center mt-4"
                style={{ color: "#57606a" }}
              >
                We respect your inbox. Weekly emails only, no spam, unsubscribe
                anytime.
              </p>
            </form>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
