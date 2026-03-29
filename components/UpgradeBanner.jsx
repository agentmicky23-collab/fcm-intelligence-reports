// components/UpgradeBanner.jsx
// Sticky bottom banner for Insight tier users
// Shows upgrade CTA with locked section count

import { useState } from 'react';
import { T } from './fcm-report-components-v2';

export default function UpgradeBanner({ orderId, lockedCount = 5 }) {
  const [upgrading, setUpgrading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/upgrade/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      setUpgrading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: T.navy, borderTop: `2px solid ${T.gold}`,
      padding: "14px 24px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
      zIndex: 1000, boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    }}>
      <div style={{ fontFamily: T.body, fontSize: 13, color: T.white }}>
        <span style={{ fontWeight: 600 }}>{lockedCount} sections</span>
        <span style={{ color: "rgba(255,255,255,0.7)" }}> locked — unlock Financial Analysis, Profit Plan & more</span>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={upgrading}
        style={{
          padding: "10px 24px", borderRadius: 6, border: "none",
          background: T.gold, color: T.navy, fontFamily: T.body, fontSize: 12, fontWeight: 700,
          cursor: upgrading ? "not-allowed" : "pointer", whiteSpace: "nowrap",
        }}
      >
        {upgrading ? "Redirecting..." : "Upgrade to Intelligence — £300"}
      </button>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.5)",
          cursor: "pointer", fontFamily: T.body, fontSize: 11, padding: "4px 8px",
        }}
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
