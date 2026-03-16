"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

const TIER_LABELS: Record<string, { name: string; price: string; turnaround: string; isSubscription?: boolean }> = {
  location: { name: "Location Report", price: "£99", turnaround: "24-48 hours" },
  basic: { name: "Basic Report", price: "£149", turnaround: "24-48 hours" },
  professional: { name: "Professional Report", price: "£249", turnaround: "48-72 hours" },
  premium: { name: "Premium Report", price: "£449", turnaround: "3-5 business days" },
  insider: { name: "FCM Insider Subscription", price: "£15/month", turnaround: "immediate", isSubscription: true },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "premium";
  const listingName = searchParams.get("listing") || "";
  const customerEmail = searchParams.get("email") || "";
  const customerPhone = searchParams.get("phone") || "";
  const info = TIER_LABELS[tier] || TIER_LABELS.premium;

  return (
    <AppLayout>
      <section className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          {/* Success icon */}
          <div
            className="mx-auto mb-8 flex items-center justify-center rounded-full"
            style={{
              width: 96,
              height: 96,
              background: "rgba(34, 197, 94, 0.15)",
              border: "2px solid #22c55e",
            }}
          >
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Payment <span style={{ color: "#22c55e" }}>Successful</span>
          </h1>

          <p className="text-xl mb-8" style={{ color: "#8b949e" }}>
            {info.isSubscription 
              ? "Welcome to FCM Insider! Your subscription is now active." 
              : listingName 
                ? `Thank you for your order. We're preparing your report for ${listingName} now.`
                : "Thank you for your order. We're preparing your report now."}
          </p>

          {/* Order summary card */}
          <div
            className="text-left rounded-2xl p-8 mb-8"
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
            }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: "#c9a227" }}>
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "#8b949e" }}>Report Type</span>
                <span className="font-bold">{info.name}</span>
              </div>
              {listingName && (
                <div className="flex justify-between">
                  <span style={{ color: "#8b949e" }}>Business</span>
                  <span className="font-bold" style={{ color: "#c9a227" }}>{listingName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: "#8b949e" }}>{info.isSubscription ? "Subscription" : "Amount Paid"}</span>
                <span className="font-mono font-bold" style={{ color: "#c9a227" }}>
                  {info.price}
                </span>
              </div>
              {!info.isSubscription && (
                <div
                  style={{ borderTop: "1px solid #30363d", paddingTop: 12, marginTop: 12 }}
                >
                  <div className="flex justify-between">
                    <span style={{ color: "#8b949e" }}>Estimated Delivery</span>
                    <span className="font-bold" style={{ color: "#22c55e" }}>
                      {info.turnaround}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery info card */}
          {!info.isSubscription && (customerEmail || customerPhone) && (
            <div
              className="text-left rounded-2xl p-8 mb-8"
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
              }}
            >
              <h3 className="font-bold text-lg mb-4" style={{ color: "#c9a227" }}>
                Delivery Details
              </h3>
              <div className="space-y-3">
                {customerEmail && (
                  <div className="flex justify-between">
                    <span style={{ color: "#8b949e" }}>Report will be sent to</span>
                    <span className="font-bold">{customerEmail}</span>
                  </div>
                )}
                {customerPhone && (
                  <div className="flex justify-between">
                    <span style={{ color: "#8b949e" }}>We&apos;ll call if needed</span>
                    <span className="font-bold">{customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What happens next */}
          <div
            className="text-left rounded-2xl p-8 mb-8"
            style={{
              background: "rgba(201, 162, 39, 0.05)",
              border: "1px solid rgba(201, 162, 39, 0.2)",
            }}
          >
            <h3 className="font-bold text-lg mb-4">What Happens Next?</h3>
            {info.isSubscription ? (
              <ol className="space-y-3" style={{ color: "#8b949e" }}>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                  >
                    1
                  </span>
                  <span>
                    You&apos;ll receive a confirmation email with your subscription details and access instructions.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                  >
                    2
                  </span>
                  <span>
                    You now have access to exclusive weekly market insights, priority support, and early alerts on hot listings.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                  >
                    3
                  </span>
                  <span>
                    Your subscription renews automatically each month. You can cancel anytime from your account settings.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3" style={{ color: "#8b949e" }}>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                  >
                    1
                  </span>
                  <span>
                    You&apos;ll receive a confirmation email with your order details
                    {customerEmail && <> at <strong className="text-white">{customerEmail}</strong></>}.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                  >
                    2
                  </span>
                  <span>
                    Our team will begin researching and compiling your report
                    {listingName && <> for <strong className="text-white">{listingName}</strong></>}.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                  >
                    3
                  </span>
                  <span>
                    Your completed PDF report will be delivered to your email within{" "}
                    <strong className="text-white">{info.turnaround}</strong>.
                  </span>
                </li>
                {customerPhone && (
                  <li className="flex gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                    >
                      4
                    </span>
                    <span>
                      If we need any clarification, we&apos;ll call you at{" "}
                      <strong className="text-white">{customerPhone}</strong>.
                    </span>
                  </li>
                )}
                {(tier === "professional" || tier === "premium") && (
                  <li className="flex gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                    >
                      {customerPhone ? 5 : 4}
                    </span>
                    <span>
                      We&apos;ll schedule your{" "}
                      {tier === "premium" ? "60-minute" : "30-minute"} consultation
                      call.
                    </span>
                  </li>
                )}
              </ol>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary px-8 py-3">
              Browse Listings
            </Link>
            <Link href="/reports" className="btn-secondary px-8 py-3">
              View All Reports
            </Link>
          </div>

          <p className="mt-8 text-sm" style={{ color: "#57606a" }}>
            Questions? Email us at{" "}
            <a href="mailto:info@fcmgt.co.uk" style={{ color: "#c9a227" }}>
              info@fcmgt.co.uk
            </a>
          </p>
        </div>
      </section>
    </AppLayout>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">⏳</div>
              <p style={{ color: "#8b949e" }}>Loading...</p>
            </div>
          </div>
        </AppLayout>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
