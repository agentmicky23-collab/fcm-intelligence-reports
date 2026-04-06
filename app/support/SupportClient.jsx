"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import InsuranceAuditModal from "@/components/InsuranceAuditModal";

export default function SupportClient() {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  useEffect(() => {
    console.log("[Analytics] support_page_view");
  }, []);

  return (
    <AppLayout>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section 
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 mt-16"
        style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ lineHeight: 1.2 }}>
            FCM Support
          </h1>
          <p className="text-xl mb-4 max-w-2xl mx-auto" style={{ color: '#8b949e' }}>
            Tools and research for working Postmasters
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ INTRO ═══════════════════════════ */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg leading-relaxed" style={{ color: '#c9d1d9' }}>
            The Post Office insurance market is broken. Lease terms are opaque. Operational risks go uninsured. FCM Support is where we build the tools Postmasters should already have had — starting with research into what the market actually offers, and what it doesn't. Each tool here is free to use. In return, we ask Postmasters to contribute data that helps us fix the gaps we find.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ TOOL GRID ═══════════════════════════ */}
      <section className="pb-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Insurance Audit Card */}
          <div 
            className="p-6 rounded-lg border transition-all hover:border-[#c9a227] cursor-pointer group"
            style={{ background: '#161b22', borderColor: '#30363d' }}
            onClick={() => setAuditModalOpen(true)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ background: 'rgba(201, 162, 39, 0.1)' }}
              >
                🛡️
              </div>
              <h3 className="text-xl font-bold">Post Office Insurance Audit</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: '#8b949e' }}>
              A 17-question audit of your current insurance policy. Takes around 7 minutes with your policy schedule to hand. At the end you'll see where your cover holds up and where it doesn't.
            </p>
            <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#8b949e' }}>
              <span>⏱️ 7 minutes</span>
              <span>📋 17 questions</span>
              <span className="text-[#22c55e]">✓ Free</span>
            </div>
            <button 
              className="w-full px-4 py-2 rounded-lg font-semibold transition-all group-hover:bg-[#d4af37]"
              style={{ background: '#c9a227', color: '#0d1117' }}
            >
              Start audit →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ DISCLAIMER ═══════════════════════════ */}
      <section 
        className="py-8 border-t"
        style={{ background: '#0d1117', borderColor: '#30363d' }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: '#8b949e' }}>
            FCM Support is independent research by FCM Intelligence. No product is being sold from these pages.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ MODAL ═══════════════════════════ */}
      <InsuranceAuditModal 
        isOpen={auditModalOpen} 
        onClose={() => setAuditModalOpen(false)} 
      />
    </AppLayout>
  );
}
