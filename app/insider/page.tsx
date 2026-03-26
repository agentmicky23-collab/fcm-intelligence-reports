"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Check } from "lucide-react";

const regions = [
  "Greater London",
  "Greater Manchester",
  "West Midlands",
  "West Yorkshire",
  "South East",
  "East of England",
  "South West",
  "North West",
  "East Midlands",
  "Yorkshire and Humber",
  "North East",
  "Scotland",
];

export default function InsiderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessTypes: [] as string[],
    regions: [] as string[],
    budget: "",
    situation: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const toggleBusinessType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter((t) => t !== type)
        : [...prev.businessTypes, type],
    }));
  };

  const toggleRegion = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      form_type: "insider_newsletter",
      business_types: formData.businessTypes.join(", "),
      regions: formData.regions.join(", "),
      budget: formData.budget,
      situation: formData.situation,
    };

    try {
      const response = await fetch("https://formspree.io/f/xblgnqzj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <AppLayout>
      {/* ═══════════════════════════ HERO SECTION ═══════════════════════════ */}
      <section
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm mb-8"
            style={{
              background: "rgba(255, 215, 0, 0.15)",
              border: "1px solid #FFD700",
              color: "#FFD700",
            }}
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FFD700] animate-pulse"></span>
            Join 200+ buyers already receiving weekly alerts
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
          >
            Never Miss Your<br />
            <span style={{ color: "#FFD700" }}>Perfect Opportunity</span>
          </h1>
          <p
            className="text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: "#8b949e" }}
          >
            Get personalized Post Office listings delivered to your inbox every
            week — matched to exactly what you're looking for.
          </p>
          <button
            onClick={() => {
              const form = document.getElementById("signup-form");
              form?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started (It's Free)
          </button>
        </div>
      </section>

      {/* ═══════════════════════════ WHAT YOU'LL GET ═══════════════════════════ */}
      <section className="py-16 container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: "#FFFFFF" }}
        >
          What You'll Get Every Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "#FFD700" }}
            >
              Personalized Matches
            </h3>
            <p style={{ color: "#8b949e" }}>
              Tell us what you're looking for once. We'll scan 100+ sources
              weekly and send only the opportunities that fit.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "#FFD700" }}
            >
              Quick Intelligence
            </h3>
            <p style={{ color: "#8b949e" }}>
              Each listing includes our initial assessment: location grade,
              revenue range, and FCM Fit Score.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "#FFD700" }}
            >
              First to Know
            </h3>
            <p style={{ color: "#8b949e" }}>
              New listings hit your inbox before they're publicly listed. Move
              fast on the best opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ EMAIL PREVIEW ═══════════════════════════ */}
      <section className="py-16" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: "#FFFFFF" }}
          >
            Here's What Lands in Your Inbox
          </h2>
          <div
            className="rounded-lg p-8 shadow-2xl"
            style={{
              background: "#1A1A1A",
              border: "1px solid #333333",
            }}
          >
            <div className="mb-6 pb-4 border-b border-gray-700">
              <div
                className="text-sm mb-2"
                style={{ color: "#8b949e", fontFamily: "JetBrains Mono" }}
              >
                Subject:
              </div>
              <div className="text-lg font-semibold" style={{ color: "#FFD700" }}>
                3 New Post Offices in Greater Manchester (£50-100k)
              </div>
            </div>

            <div className="space-y-6">
              <p style={{ color: "#FFFFFF" }}>Hi [Name],</p>
              <p style={{ color: "#8b949e" }}>
                This week we found 3 Post Offices matching your criteria:
              </p>

              {/* Listing 1 */}
              <div
                className="p-4 rounded"
                style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.2)" }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  1. Stockport Main Branch - £85k asking
                </h3>
                <div
                  className="flex flex-wrap gap-3 text-sm mb-3"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  <span style={{ color: "#8b949e" }}>
                    📍 Grade A location
                  </span>
                  <span style={{ color: "#8b949e" }}>
                    💰 Est. £120k revenue
                  </span>
                  <span style={{ color: "#FFD700" }}>FCM Score: 82/100</span>
                </div>
                <Link
                  href="#"
                  className="inline-block px-4 py-2 rounded text-sm"
                  style={{
                    background: "#FFD700",
                    color: "#000000",
                    fontWeight: "600",
                  }}
                >
                  View Details →
                </Link>
              </div>

              {/* Listing 2 */}
              <div
                className="p-4 rounded"
                style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.2)" }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  2. Bolton High Street - £65k asking
                </h3>
                <div
                  className="flex flex-wrap gap-3 text-sm mb-3"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  <span style={{ color: "#8b949e" }}>
                    📍 Grade B location
                  </span>
                  <span style={{ color: "#8b949e" }}>
                    💰 Est. £95k revenue
                  </span>
                  <span style={{ color: "#FFD700" }}>FCM Score: 76/100</span>
                </div>
                <Link
                  href="#"
                  className="inline-block px-4 py-2 rounded text-sm"
                  style={{
                    background: "#FFD700",
                    color: "#000000",
                    fontWeight: "600",
                  }}
                >
                  View Details →
                </Link>
              </div>

              {/* Listing 3 */}
              <div
                className="p-4 rounded"
                style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.2)" }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  3. Altrincham Village PO - £95k asking
                </h3>
                <div
                  className="flex flex-wrap gap-3 text-sm mb-3"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  <span style={{ color: "#8b949e" }}>
                    📍 Grade A+ location
                  </span>
                  <span style={{ color: "#8b949e" }}>
                    💰 Est. £140k revenue
                  </span>
                  <span style={{ color: "#FFD700" }}>FCM Score: 88/100</span>
                </div>
                <Link
                  href="#"
                  className="inline-block px-4 py-2 rounded text-sm"
                  style={{
                    background: "#FFD700",
                    color: "#000000",
                    fontWeight: "600",
                  }}
                >
                  View Details →
                </Link>
              </div>

              <p style={{ color: "#8b949e", fontSize: "0.875rem" }}>
                Want the full intelligence report? Order an Insight or Intelligence report
                for any listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FREE TRIAL ═══════════════════════════ */}
      <section className="py-12" style={{ background: "rgba(255, 215, 0, 0.05)" }}>
        <div className="container mx-auto px-4 text-center">
          <h3
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "#FFD700" }}
          >
            First 3 Weekly Alerts FREE
          </h3>
          <p className="text-lg" style={{ color: "#8b949e" }}>
            No credit card required. Then £15/month to continue.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ SIGNUP FORM ═══════════════════════════ */}
      <section id="signup-form" className="py-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <form 
              method="POST" 
              action="https://formspree.io/f/xblgnqzj"
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-8"
                style={{ color: "#FFFFFF" }}
              >
                Get Your First Report
              </h2>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #333333",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #333333",
                  }}
                />
              </div>

              {/* Business Types */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#FFFFFF" }}>
                  What are you looking for?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Post Office", "Forecourt / Petrol Station", "Convenience Store", "Newsagent"].map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleBusinessType(type)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-all"
                        style={{
                          background: formData.businessTypes.includes(type)
                            ? "rgba(255, 215, 0, 0.15)"
                            : "#1A1A1A",
                          border: formData.businessTypes.includes(type)
                            ? "1px solid #FFD700"
                            : "1px solid #333333",
                          color: "#FFFFFF",
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
                          style={{
                            background: formData.businessTypes.includes(type)
                              ? "#FFD700"
                              : "transparent",
                            border: formData.businessTypes.includes(type)
                              ? "none"
                              : "1px solid #333333",
                          }}
                        >
                          {formData.businessTypes.includes(type) && (
                            <Check size={14} color="#000000" />
                          )}
                        </div>
                        <span className="text-sm">{type}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Regions */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#FFFFFF" }}>
                  Preferred regions
                </label>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      className="px-3 py-2 rounded-full text-sm transition-all"
                      style={{
                        background: formData.regions.includes(region)
                          ? "#FFD700"
                          : "#1A1A1A",
                        border: formData.regions.includes(region)
                          ? "1px solid #FFD700"
                          : "1px solid #333333",
                        color: formData.regions.includes(region)
                          ? "#000000"
                          : "#FFFFFF",
                      }}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#FFFFFF" }}>
                  Budget range
                </label>
                <div className="space-y-2">
                  {[
                    "Under £50k",
                    "£50k - £100k",
                    "£100k - £200k",
                    "£200k+",
                    "No limit",
                  ].map((budget) => (
                    <label
                      key={budget}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
                      style={{
                        background: formData.budget === budget
                          ? "rgba(255, 215, 0, 0.15)"
                          : "#1A1A1A",
                        border: formData.budget === budget
                          ? "1px solid #FFD700"
                          : "1px solid #333333",
                      }}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={budget}
                        checked={formData.budget === budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="w-4 h-4"
                        style={{ accentColor: "#FFD700" }}
                      />
                      <span style={{ color: "#FFFFFF" }}>{budget}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Situation */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#FFFFFF" }}>
                  Your situation
                </label>
                <div className="space-y-2">
                  {[
                    "First-time buyer",
                    "Existing operator looking to expand",
                    "Investor / Group",
                  ].map((situation) => (
                    <label
                      key={situation}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
                      style={{
                        background: formData.situation === situation
                          ? "rgba(255, 215, 0, 0.15)"
                          : "#1A1A1A",
                        border: formData.situation === situation
                          ? "1px solid #FFD700"
                          : "1px solid #333333",
                      }}
                    >
                      <input
                        type="radio"
                        name="situation"
                        value={situation}
                        checked={formData.situation === situation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            situation: e.target.value,
                          })
                        }
                        className="w-4 h-4"
                        style={{ accentColor: "#FFD700" }}
                      />
                      <span style={{ color: "#FFFFFF" }}>{situation}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-lg text-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: "#FFD700",
                  color: "#000000",
                }}
              >
                Get My First Report →
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">✅</div>
              <h3
                className="text-3xl font-bold mb-4"
                style={{ color: "#FFD700" }}
              >
                You're In!
              </h3>
              <p className="text-lg mb-6" style={{ color: "#8b949e" }}>
                Check your inbox for your first weekly report on Monday
                morning.
              </p>
              <Link href="/" className="btn-secondary">
                Browse Current Listings
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════ CONSULTATION SERVICES ═══════════════════════════ */}
      <section id="services" className="py-20" style={{ background: "#0d1117", borderTop: "1px solid rgba(255, 215, 0, 0.2)", borderBottom: "1px solid rgba(255, 215, 0, 0.2)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm mb-6"
              style={{
                background: "rgba(255, 215, 0, 0.15)",
                border: "1px solid #FFD700",
                color: "#FFD700",
              }}
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FFD700] animate-pulse"></span>
              INSIDER EXCLUSIVE: 15% OFF ALL SERVICES
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Consultation Services
            </h2>
            <p style={{ color: "#8b949e" }} className="max-w-2xl mx-auto text-lg">
              Expert support from operators who&apos;ve run 40+ Post Office branches. 
              <span style={{ color: "#FFD700", fontWeight: 600 }}> Insiders save 15% on everything.</span>
            </p>
          </div>

          {/* Not an Insider CTA */}
          <div 
            className="max-w-3xl mx-auto mb-12 p-6 rounded-lg text-center"
            style={{ 
              background: "rgba(255, 215, 0, 0.05)", 
              border: "1px solid rgba(255, 215, 0, 0.3)" 
            }}
          >
            <p style={{ color: "#8b949e", marginBottom: "8px" }}>
              Not an FCM Insider yet? You&apos;ll pay full price.
            </p>
            <p style={{ color: "#FFD700", fontWeight: 600, fontSize: "1.1rem" }}>
              Join Insider for £15/month and save 15% on all services below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Business Plan & Forecasts */}
            <div 
              className="p-6 rounded-xl flex flex-col"
              style={{ 
                background: "#161b22", 
                border: "1px solid #30363d",
              }}
            >
              <div className="text-4xl mb-4 text-center">📋</div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#FFFFFF" }}>
                Business Plan &amp; Forecasts
              </h3>
              <p className="text-sm mb-4 text-center flex-grow" style={{ color: "#8b949e" }}>
                Professional 3-year business plan with forecasted management accounts. Required for Post Office Ltd vetting and approval.
              </p>
              <div className="text-center mb-4">
                <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "1rem" }}>£850</div>
                <div className="font-mono text-3xl font-bold" style={{ color: "#FFD700" }}>£722.50</div>
                <div className="text-sm" style={{ color: "#8b949e" }}>one-time</div>
                <div 
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                >
                  Save £127.50 as Insider
                </div>
              </div>
              <Link 
                href="#contact" 
                className="w-full py-3 rounded-lg text-center font-semibold transition-all hover:opacity-90"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                Get Started
              </Link>
            </div>

            {/* Interview Preparation */}
            <div 
              className="p-6 rounded-xl flex flex-col"
              style={{ 
                background: "#161b22", 
                border: "1px solid #30363d",
              }}
            >
              <div className="text-4xl mb-4 text-center">🎤</div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#FFFFFF" }}>
                Interview Preparation
              </h3>
              <p className="text-sm mb-4 text-center flex-grow" style={{ color: "#8b949e" }}>
                Post Office Ltd vets all new operators. Get mock interviews, coaching, and preparation to ace your approval interview.
              </p>
              <div className="text-center mb-4">
                <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "1rem" }}>£599</div>
                <div className="font-mono text-3xl font-bold" style={{ color: "#FFD700" }}>£509.15</div>
                <div className="text-sm" style={{ color: "#8b949e" }}>one-time</div>
                <div 
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                >
                  Save £89.85 as Insider
                </div>
              </div>
              <Link 
                href="#contact" 
                className="w-full py-3 rounded-lg text-center font-semibold transition-all hover:opacity-90"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                Get Started
              </Link>
            </div>

            {/* Business Setup Bundle */}
            <div 
              className="p-6 rounded-xl flex flex-col"
              style={{ 
                background: "#161b22", 
                border: "1px solid #30363d",
              }}
            >
              <div className="text-4xl mb-4 text-center">🔧</div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#FFFFFF" }}>
                Business Setup Bundle
              </h3>
              <p className="text-sm mb-4 text-center flex-grow" style={{ color: "#8b949e" }}>
                Company formation, bank account, insurance, utilities, EPOS setup — everything you need to open the doors.
              </p>
              <div className="text-center mb-4">
                <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "1rem" }}>£1,750</div>
                <div className="font-mono text-3xl font-bold" style={{ color: "#FFD700" }}>£1,487.50</div>
                <div className="text-sm" style={{ color: "#8b949e" }}>one-time</div>
                <div 
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                >
                  Save £262.50 as Insider
                </div>
              </div>
              <Link 
                href="#contact" 
                className="w-full py-3 rounded-lg text-center font-semibold transition-all hover:opacity-90"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                Get Started
              </Link>
            </div>

            {/* Operator Training */}
            <div 
              className="p-6 rounded-xl flex flex-col lg:col-span-3"
              style={{ 
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(22, 27, 34, 1) 100%)", 
                border: "2px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <div className="text-4xl mb-4 text-center">🎓</div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#FFFFFF" }}>
                Operator Training
              </h3>
              <p className="text-sm mb-6 text-center max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
                Learn to run a Post Office from operators with 40+ branches. Choose your format:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
                {/* Online */}
                <div className="p-4 rounded-lg text-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #30363d" }}>
                  <div className="text-2xl mb-2">💻</div>
                  <h4 className="font-semibold mb-2" style={{ color: "#FFFFFF" }}>Online</h4>
                  <p className="text-xs mb-3" style={{ color: "#8b949e" }}>Self-paced video modules + live Q&amp;A sessions</p>
                  <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "0.9rem" }}>£750</div>
                  <div className="font-mono text-2xl font-bold" style={{ color: "#FFD700" }}>£637.50</div>
                  <div 
                    className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                  >
                    Save £112.50
                  </div>
                </div>
                {/* Offsite */}
                <div className="p-4 rounded-lg text-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #30363d" }}>
                  <div className="text-2xl mb-2">🏢</div>
                  <h4 className="font-semibold mb-2" style={{ color: "#FFFFFF" }}>Offsite</h4>
                  <p className="text-xs mb-3" style={{ color: "#8b949e" }}>2-day intensive at our training location</p>
                  <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "0.9rem" }}>£1,000</div>
                  <div className="font-mono text-2xl font-bold" style={{ color: "#FFD700" }}>£850</div>
                  <div 
                    className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                  >
                    Save £150
                  </div>
                </div>
                {/* Onsite */}
                <div className="p-4 rounded-lg text-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 215, 0, 0.3)" }}>
                  <div className="text-2xl mb-2">📍</div>
                  <h4 className="font-semibold mb-2" style={{ color: "#FFD700" }}>Onsite</h4>
                  <p className="text-xs mb-3" style={{ color: "#8b949e" }}>We come to your branch for hands-on training</p>
                  <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "0.9rem" }}>£1,250</div>
                  <div className="font-mono text-2xl font-bold" style={{ color: "#FFD700" }}>£1,062.50</div>
                  <div 
                    className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                  >
                    Save £187.50
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <Link 
                  href="#contact" 
                  className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: "#FFD700", color: "#000000" }}
                >
                  Book Training
                </Link>
              </div>
            </div>

            {/* Advisory Support */}
            <div 
              className="p-6 rounded-xl flex flex-col"
              style={{ 
                background: "#161b22", 
                border: "1px solid #30363d",
              }}
            >
              <div className="text-4xl mb-4 text-center">💬</div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#FFFFFF" }}>
                Advisory Support
              </h3>
              <p className="text-sm mb-4 text-center flex-grow" style={{ color: "#8b949e" }}>
                Ongoing email support and monthly calls. Get expert guidance as you navigate your first months of operation.
              </p>
              <div className="text-center mb-4">
                <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "1rem" }}>£200/mo</div>
                <div className="font-mono text-3xl font-bold" style={{ color: "#FFD700" }}>£170<span className="text-lg">/mo</span></div>
                <div className="text-sm" style={{ color: "#8b949e" }}>cancel anytime</div>
                <div 
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                >
                  Save £30/mo as Insider
                </div>
              </div>
              <Link 
                href="#contact" 
                className="w-full py-3 rounded-lg text-center font-semibold transition-all hover:opacity-90"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                Get Started
              </Link>
            </div>

            {/* Advisory Pro */}
            <div 
              className="p-6 rounded-xl flex flex-col relative overflow-hidden"
              style={{ 
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, #161b22 100%)", 
                border: "2px solid #FFD700",
              }}
            >
              <div 
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                POPULAR
              </div>
              <div className="text-4xl mb-4 text-center">⭐</div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#FFD700" }}>
                Advisory Pro
              </h3>
              <p className="text-sm mb-4 text-center flex-grow" style={{ color: "#8b949e" }}>
                Everything in Advisory Support plus compliance checks, management reporting, and priority response times.
              </p>
              <div className="text-center mb-4">
                <div style={{ color: "#57606a", textDecoration: "line-through", fontSize: "1rem" }}>£400/mo</div>
                <div className="font-mono text-3xl font-bold" style={{ color: "#FFD700" }}>£340<span className="text-lg">/mo</span></div>
                <div className="text-sm" style={{ color: "#8b949e" }}>cancel anytime</div>
                <div 
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                >
                  Save £60/mo as Insider
                </div>
              </div>
              <Link 
                href="#contact" 
                className="w-full py-3 rounded-lg text-center font-semibold transition-all hover:opacity-90"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                Get Started
              </Link>
            </div>

            {/* Empty spacer for grid alignment on large screens - hidden on mobile */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p style={{ color: "#8b949e" }} className="mb-4">
              Not sure which service you need? <Link href="#contact" style={{ color: "#FFD700", textDecoration: "underline" }}>Get in touch</Link> and we&apos;ll help you figure it out.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CONTACT FORM ═══════════════════════════ */}
      <section id="contact" className="py-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Get in Touch
          </h2>
          <p className="text-center mb-8" style={{ color: "#8b949e" }}>
            Questions about our services? Ready to get started? Drop us a message.
          </p>
          <form action="https://formspree.io/f/xblgnqzj" method="POST" className="space-y-4">
            <input type="hidden" name="form_type" value="insider_consultation" />
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>Name</label>
              <input 
                type="text" 
                id="contact-name" 
                name="name" 
                required 
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ background: "#1A1A1A", border: "1px solid #333333" }}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>Email</label>
              <input 
                type="email" 
                id="contact-email" 
                name="email" 
                required 
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ background: "#1A1A1A", border: "1px solid #333333" }}
              />
            </div>
            <div>
              <label htmlFor="contact-service" className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>Service of Interest</label>
              <select 
                id="contact-service" 
                name="service"
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ background: "#1A1A1A", border: "1px solid #333333" }}
              >
                <option value="general">General Enquiry</option>
                <option value="business-plan">Business Plan & Forecasts</option>
                <option value="interview-prep">Interview Preparation</option>
                <option value="training-online">Operator Training - Online</option>
                <option value="training-offsite">Operator Training - Offsite</option>
                <option value="training-onsite">Operator Training - Onsite</option>
                <option value="setup-bundle">Business Setup Bundle</option>
                <option value="advisory">Advisory Support</option>
                <option value="advisory-pro">Advisory Pro</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>Message</label>
              <textarea 
                id="contact-message" 
                name="message" 
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ background: "#1A1A1A", border: "1px solid #333333" }}
                placeholder="Tell us about your situation and how we can help..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-lg text-lg font-semibold transition-all hover:opacity-90"
              style={{ background: "#FFD700", color: "#000000" }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════ SOCIAL PROOF ═══════════════════════════ */}
      <section className="py-16" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: "#FFFFFF" }}
          >
            What Our Subscribers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <p className="mb-4" style={{ color: "#8b949e" }}>
                "Sarah T. found her Stockport branch through our alerts — closed
                the deal in 3 weeks."
              </p>
              <div style={{ color: "#FFD700", fontWeight: "600" }}>
                — Sarah T., First-time buyer
              </div>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <p className="mb-4" style={{ color: "#8b949e" }}>
                "Saved me 10 hours a week scrolling through broker sites. The
                personalized alerts are exactly what I needed."
              </p>
              <div style={{ color: "#FFD700", fontWeight: "600" }}>
                — Mark L., Expanding operator
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FAQ ═══════════════════════════ */}
      <section className="py-16 container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: "#FFFFFF" }}
        >
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div
            className="p-6 rounded-lg"
            style={{ background: "#1A1A1A", border: "1px solid #333333" }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#FFD700" }}
            >
              How often do I get emails?
            </h3>
            <p style={{ color: "#8b949e" }}>
              Once per week, every Monday morning.
            </p>
          </div>
          <div
            className="p-6 rounded-lg"
            style={{ background: "#1A1A1A", border: "1px solid #333333" }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#FFD700" }}
            >
              What if I don't find anything?
            </h3>
            <p style={{ color: "#8b949e" }}>
              Cancel anytime, no questions asked. We're confident you'll find
              value, but there's no lock-in.
            </p>
          </div>
          <div
            className="p-6 rounded-lg"
            style={{ background: "#1A1A1A", border: "1px solid #333333" }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#FFD700" }}
            >
              How do you find these listings?
            </h3>
            <p style={{ color: "#8b949e" }}>
              Daily scans of Daltons, RightBiz, BusinessesForSale, and private
              sellers across the UK.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
