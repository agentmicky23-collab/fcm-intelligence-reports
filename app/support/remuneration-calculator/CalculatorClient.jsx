'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { AppLayout } from '@/components/layout/AppLayout';
import { parseStatement, calculateNewRates } from '@/lib/remuneration/calculator';

export default function CalculatorClient() {
  const [uploadState, setUploadState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [applyMBSP, setApplyMBSP] = useState(false);
  const [applyRSP, setApplyRSP] = useState(false);
  const [resellerPct, setResellerPct] = useState(33);
  const [showAllRows, setShowAllRows] = useState(false);
  const [showChangedOnly, setShowChangedOnly] = useState(true);

  const handleFile = useCallback((file) => {
    setUploadState('uploading');
    setErrorMessage('');

    if (!file.name.match(/\.(xlsx|csv)$/i)) {
      setErrorMessage('Please upload an Excel (.xlsx) or CSV (.csv) file');
      setUploadState('error');
      return;
    }

    if (file.size > 1024 * 1024) {
      setErrorMessage('File too large. Maximum size: 1MB');
      setUploadState('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const parsed = parseStatement(workbook);
        const calculated = calculateNewRates(parsed, {
          applyMBSP,
          applyRSP,
          resellerPct: resellerPct / 100
        });
        setResults(calculated);
        setUploadState('success');
      } catch (err) {
        console.error('Parse error:', err);
        setErrorMessage(`Failed to parse file: ${err.message}`);
        setUploadState('error');
      }
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read file');
      setUploadState('error');
    };

    reader.readAsArrayBuffer(file);
  }, [applyMBSP, applyRSP, resellerPct]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const recalculate = useCallback(() => {
    if (!results) return;
    
    const parsed = {
      branch: results.branch,
      transactionRows: results.processedRows.map(r => ({
        salesRef: r.salesRef,
        name: r.name,
        category: r.category,
        oldAmount: r.oldAmount,
        salesValue: r.salesValue,
        remunerationType: r.remunerationType
      })),
      otherPayments: results.otherPayments,
      deductions: results.deductions
    };

    const calculated = calculateNewRates(parsed, {
      applyMBSP,
      applyRSP,
      resellerPct: resellerPct / 100
    });

    setResults(calculated);
  }, [results, applyMBSP, applyRSP, resellerPct]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatCurrencyShort = (value) => {
    return '£' + Math.round(value).toLocaleString('en-GB');
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const displayRows = results ? 
    (showAllRows ? results.processedRows : (showChangedOnly ? results.processedRows.filter(r => r.changed) : results.processedRows.filter(r => Math.abs(r.delta) > 0.01)))
    : [];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0d1117]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        
        {/* MASTHEAD */}
        <header className="max-w-[1180px] mx-auto px-7 md:px-12 pt-24 pb-9">
          <div className="flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase text-[#8b949e] mb-5 font-mono">
            <span className="w-6 h-px bg-[#8b949e]"></span>
            <span className="text-[#c9a227] font-bold">Insights</span>
            <span className="text-[#30363d]">/</span>
            <span>Remuneration</span>
            <span className="text-[#30363d]">/</span>
            <span className="hidden sm:inline">06 April 2026</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl leading-tight font-medium max-w-[960px] mb-7" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.028em' }}>
            Post Office remuneration just restructured. <em className="italic font-normal text-[#7a1712]">Every listing you're looking at is already out of date.</em>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#c9d1d9] max-w-[680px] mb-9" style={{ fontFamily: "'Fraunces', serif" }}>
            On 30 March 2026 the Post Office quietly rewrote the rules on how every Mains, Local and SPSO branch in the UK gets paid. Brokers haven't updated their listings. Accountants haven't caught up. Here's what changed — and what it means if you're buying a branch this year.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-5 border-t border-[#30363d] text-[13px] text-[#8b949e] max-w-[680px]">
            <span className="text-[#c9d1d9] font-semibold">FCM Intelligence Editorial</span>
            <span className="text-[#30363d]">·</span>
            <span>~9 min read</span>
            <span className="text-[#30363d]">·</span>
            <span className="hidden md:inline">Based on POL Remuneration Rates Booklet 2026/27</span>
          </div>
        </header>

        {/* INTRODUCTION */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9]">
            <p className="mb-5">
              <span className="text-7xl font-medium float-left leading-[0.88] pr-2.5 pt-1.5 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>O</span>
              n Monday 30 March the Post Office published two documents through Branch Hub — the Branch Remuneration Rates Booklet 2026/27 and a commentary titled Remuneration Changes 2026. Both are marked "Postmaster – Confidential." Both govern how every single working Postmaster in the UK gets paid for the year ahead. And unless you're running a branch already, you've almost certainly never seen them.
            </p>
            <p className="mb-5">
              We've been through them line by line so you don't have to. What follows is the operator's read: the three structural changes that matter, the line-item moves that reshape the monthly income picture, the traps that separate informed buyers from uninformed ones, and — at the bottom of the page — a live demonstration of what the new rates do to a real, anonymised monthly statement from one of our own branches.
            </p>
            <p className="mb-5">
              None of this is in the broker listings you're reading. None of this is on the Post Office's public site. If you're evaluating a branch this year, this is the single most important hour of reading you can do.
            </p>
          </div>

          <blockquote className="text-xl md:text-2xl lg:text-3xl leading-snug text-[#c9d1d9] pl-8 border-l-4 border-[#b8231c] my-10 max-w-[820px]" style={{ fontFamily: "'Fraunces', serif" }}>
            If you're looking at a branch listing right now, three things are true. The per-transaction rates are higher than last year across most product lines. Locals and SPSO branches are finally being paid the same as Mains for the same work. And there's a temporary 4% Mains top-up running through to April 2027 that inflates current Mains figures in a way the listings don't explain. <em className="italic text-[#7a1712]">Understanding these three changes is the difference between reading a listing accurately and overpaying for a branch.</em>
          </blockquote>
        </section>

        {/* SECTION 1 */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">01</span>
            How the model actually works
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9]">
            <p className="mb-5">
              Post Office remuneration isn't a salary. It's a transaction-level piggyback system. Every counted transaction at the counter has its own rate — some a flat pence-per-transaction (auto cash deposit: 52p), some a percentage of sale value (1st class stamps: 7%), some a tiered volume fee (ATM withdrawals). The monthly income a branch receives is the weighted sum of all those transaction payments, plus any applicable fixed payments on top.
            </p>
            <p className="mb-5">
              This is why <strong className="text-white font-semibold">"what's the turnover" is the wrong first question</strong> when you're looking at a Post Office branch. The right first question is "what's the mix." Two branches showing identical £80,000-per-year Post Office income figures on a listing can represent completely different businesses if one is mostly banking and the other is mostly mails — and those two businesses move in completely different directions under the new rates.
            </p>
          </div>
        </section>

        {/* SECTION 2 - THREE STRUCTURAL CHANGES */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">02</span>
            The three structural changes
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9] mb-8">
            <p>Before any individual rate moved, POL changed three things that sit above the rate table. These are the bigger story, and they're the ones brokers won't tell you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 my-8 border-t border-l border-[#c9d1d9]">
            <div className="p-6 md:p-7 border-r border-b border-[#c9d1d9] bg-[#161b22]">
              <div className="text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-2.5 font-mono">
                Structural · <span className="text-[#c9a227] font-bold">Change #1</span>
              </div>
              <h4 className="text-xl md:text-2xl leading-tight font-semibold mb-2.5 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>
                Locals and SPSO reach parity with Mains
              </h4>
              <div className="text-5xl md:text-6xl font-medium leading-none text-[#c9a227] mt-3.5 mb-1" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em' }}>
                £0<span className="text-sm text-[#8b949e] ml-1.5 font-medium tracking-normal" style={{ fontFamily: "'Inter', sans-serif" }}>gap / per-transaction</span>
              </div>
              <p className="text-sm leading-relaxed text-[#c9d1d9]">
                For years, Locals and SPSO branches were paid less per transaction than Mains for the same work. From April 2026 that ends. All variable rates are now identical across contract types. Every Local branch listing showing last year's income figures is <strong className="font-semibold">understating</strong> current earnings — sometimes by thousands of pounds a year.
              </p>
            </div>

            <div className="p-6 md:p-7 border-r border-b border-[#c9d1d9] bg-[#161b22]">
              <div className="text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-2.5 font-mono">
                Temporary · <span className="text-[#c9a227] font-bold">Change #2</span>
              </div>
              <h4 className="text-xl md:text-2xl leading-tight font-semibold mb-2.5 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>
                4% Mains top-up until April 2027
              </h4>
              <div className="text-5xl md:text-6xl font-medium leading-none text-[#c9a227] mt-3.5 mb-1" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em' }}>
                +4%<span className="text-sm text-[#8b949e] ml-1.5 font-medium tracking-normal" style={{ fontFamily: "'Inter', sans-serif" }}>variable / 12 months</span>
              </div>
              <p className="text-sm leading-relaxed text-[#c9d1d9]">
                Every branch on a Mains contract as of 1 April 2026 receives a 4% top-up on all variable remuneration for 12 months. It is explicitly called "temporary." A listing quoting Mains income from this window is showing a figure that will <strong className="font-semibold">unwind by 4%</strong> when the top-up ends — and most sellers don't mention it.
              </p>
            </div>

            <div className="p-6 md:p-7 border-r border-b border-[#c9d1d9] bg-[#161b22]">
              <div className="text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-2.5 font-mono">
                Principle · <span className="text-[#c9a227] font-bold">Change #3</span>
              </div>
              <h4 className="text-xl md:text-2xl leading-tight font-semibold mb-2.5 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>
                POL accepted a 50% income-share floor
              </h4>
              <div className="text-5xl md:text-6xl font-medium leading-none text-[#c9a227] mt-3.5 mb-1" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em' }}>
                ≥ 50%<span className="text-sm text-[#8b949e] ml-1.5 font-medium tracking-normal" style={{ fontFamily: "'Inter', sans-serif" }}>branch share per product</span>
              </div>
              <p className="text-sm leading-relaxed text-[#c9d1d9]">
                POL established for the first time that branches should receive <strong className="font-semibold">at least half</strong> of the income generated for each product. Most products were already above that line. The ones that weren't — Airmail, Surface Mail, Redirection — got dragged up. The principle is more interesting than the numbers: POL has accepted a floor it now has to defend.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 - RATE TABLES */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">03</span>
            Where the rates actually moved
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9] mb-8">
            <p className="mb-5">
              Below are the key rate movements across Banking, Mails, Travel, Bills, and Government services. These are the actual numbers that power the calculator further down the page.
            </p>
          </div>

          {/* Banking Table */}
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>Banking Services</h3>
            <table className="w-full border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="text-left py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Product</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2025/26</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2026/27</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Δ</th>
                </tr>
              </thead>
              <tbody className="text-[#c9d1d9]">
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Automated Deposit (≤ £300)</td>
                  <td className="py-2 px-3 text-right">21p</td>
                  <td className="py-2 px-3 text-right">52p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+148%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Automated Deposit (£301-£1,000)</td>
                  <td className="py-2 px-3 text-right">42p</td>
                  <td className="py-2 px-3 text-right">71p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+69%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Automated Deposit (> £1,000)</td>
                  <td className="py-2 px-3 text-right">63p</td>
                  <td className="py-2 px-3 text-right">87p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+38%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Manual Deposit (all tiers)</td>
                  <td className="py-2 px-3 text-right">Various</td>
                  <td className="py-2 px-3 text-right">+37-69%</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">ATM Withdrawal</td>
                  <td className="py-2 px-3 text-right">36p</td>
                  <td className="py-2 px-3 text-right">56p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+56%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Personal Banking</td>
                  <td className="py-2 px-3 text-right">81p</td>
                  <td className="py-2 px-3 text-right">100p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+23%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mails/Evri Table */}
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>Mails & Parcels</h3>
            <table className="w-full border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="text-left py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Product</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2025/26</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2026/27</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Δ</th>
                </tr>
              </thead>
              <tbody className="text-[#c9d1d9]">
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">1st Class Stamp Sales</td>
                  <td className="py-2 px-3 text-right">7.0%</td>
                  <td className="py-2 px-3 text-right">7.0%</td>
                  <td className="py-2 px-3 text-right text-[#8b949e]">—</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Evri Small Parcel</td>
                  <td className="py-2 px-3 text-right">40p</td>
                  <td className="py-2 px-3 text-right">50p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+25%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Evri Medium Parcel</td>
                  <td className="py-2 px-3 text-right">45p</td>
                  <td className="py-2 px-3 text-right">65p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+44%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Evri Large Parcel</td>
                  <td className="py-2 px-3 text-right">60p</td>
                  <td className="py-2 px-3 text-right">80p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+33%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Airmail (50% floor)</td>
                  <td className="py-2 px-3 text-right">7.0%</td>
                  <td className="py-2 px-3 text-right">8.0%</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+14%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Surface Mail (50% floor)</td>
                  <td className="py-2 px-3 text-right">7.0%</td>
                  <td className="py-2 px-3 text-right">8.0%</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+14%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Travel Money Table */}
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>Travel Money</h3>
            <table className="w-full border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="text-left py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Product</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2025/26</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2026/27</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Δ</th>
                </tr>
              </thead>
              <tbody className="text-[#c9d1d9]">
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Currency Exchange</td>
                  <td className="py-2 px-3 text-right">1.0%</td>
                  <td className="py-2 px-3 text-right">1.2%</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+20%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Travel MoneyCard Top-up</td>
                  <td className="py-2 px-3 text-right">1.0%</td>
                  <td className="py-2 px-3 text-right">1.2%</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+20%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">TMC Sign-up (trial)</td>
                  <td className="py-2 px-3 text-right">—</td>
                  <td className="py-2 px-3 text-right">£5.00</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">New</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bill Payments Table */}
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>Bill Payments</h3>
            <table className="w-full border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="text-left py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Category</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2025/26</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2026/27</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Δ</th>
                </tr>
              </thead>
              <tbody className="text-[#c9d1d9]">
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Utility Billers</td>
                  <td className="py-2 px-3 text-right">11p</td>
                  <td className="py-2 px-3 text-right">12p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+9%</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Reseller Billers</td>
                  <td className="py-2 px-3 text-right">7-8p</td>
                  <td className="py-2 px-3 text-right">20p</td>
                  <td className="py-2 px-3 text-right text-[#3fb950]">+142%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Government Services Table */}
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>Government Services</h3>
            <table className="w-full border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="text-left py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Product</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2025/26</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">2026/27</th>
                  <th className="text-right py-2 px-3 text-[#8b949e] text-xs uppercase tracking-wider">Δ</th>
                </tr>
              </thead>
              <tbody className="text-[#c9d1d9]">
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Vehicle Tax</td>
                  <td className="py-2 px-3 text-right">£2.50</td>
                  <td className="py-2 px-3 text-right">£2.50</td>
                  <td className="py-2 px-3 text-right text-[#8b949e]">—</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">DVLA Services</td>
                  <td className="py-2 px-3 text-right">£8.00</td>
                  <td className="py-2 px-3 text-right">£8.00</td>
                  <td className="py-2 px-3 text-right text-[#8b949e]">—</td>
                </tr>
                <tr className="border-b border-[#21262d]">
                  <td className="py-2 px-3">Passport Check & Send</td>
                  <td className="py-2 px-3 text-right">£10.50</td>
                  <td className="py-2 px-3 text-right">£10.50</td>
                  <td className="py-2 px-3 text-right text-[#8b949e]">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4 - 4% MAINS TOP-UP */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">04</span>
            The 4% Mains top-up nobody is explaining
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9]">
            <p className="mb-5">
              This is the section that matters most if you're looking at a Mains branch right now.
            </p>
            <p className="mb-5">
              <strong className="text-white font-semibold">What it is:</strong> From April 2026 trading (May 2026 remuneration), every branch on a Mains contract as of 1 April 2026 will receive a 4% top-up applied to all variable remuneration. It runs for 12 months. POL explicitly describes it as "temporary."
            </p>
            <p className="mb-5">
              <strong className="text-white font-semibold">Why it matters for buyers:</strong> A Mains branch that changes hands during the April 2026 to April 2027 window will show 4% higher variable remuneration than its true steady-state income. If a listing quotes figures from the year to March 2027, those figures include the top-up. If the buyer assumes the top-up continues, they are overpaying by 4% on the remuneration line.
            </p>
            <p className="mb-5">
              For an average Mains branch earning £65,000 a year in variable income, that's around £2,600 a year of inflated figures. At a typical 2× earnings multiple on a Post Office branch sale, that's £5,200 of price the seller can ask for that won't exist from May 2027 onwards.
            </p>
            <p className="mb-5">
              <strong className="text-white font-semibold">What to do:</strong> When asking for trading figures, ask for them <em className="italic">excluding</em> the temporary Mains top-up. Any decent seller will have this breakdown. If they don't, that tells you something useful about how well they're running the branch.
            </p>
          </div>
        </section>

        {/* SECTION 5 - FIXED PAYMENTS */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">05</span>
            Two fixed payments most buyers don't know exist
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9]">
            <p className="mb-5">
              Two conditional fixed payments changed meaningfully. If you're evaluating a branch that qualifies for either, missing money is real money.
            </p>
            <h3 className="text-xl md:text-2xl font-semibold my-7 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>
              Major Branch Support Payment
            </h3>
            <p className="mb-5">
              For branches in large town and city centres with two or more still-operating banks within a quarter mile. From April 2026 this is no longer a fixed sum — it becomes a <strong className="text-white font-semibold">4% monthly boost to variable remuneration</strong>, in addition to any other top-ups. If you're looking at an urban branch near a couple of surviving bank branches, ask the seller whether this is being claimed.
            </p>
            <h3 className="text-xl md:text-2xl font-semibold my-7 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>
              Remote Support Payment
            </h3>
            <p className="mb-5">
              For branches with fewer than 1,500 residents within half a mile. £5,000 per year, paid in twelve monthly instalments of £416.67. Previously only available to Local branches. From April 2026 it's available to both Local and Mains contracts. If you're looking at a rural branch and this payment isn't showing up in the trading figures, that's a direct question for the seller.
            </p>
          </div>
        </section>

        {/* SECTION 6 - SIX TRAPS */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">06</span>
            Six traps most buyers walk into
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9] mb-6">
            <p>Below are the things that look straightforward in the POL documents but will cost you money if you treat them naively.</p>
          </div>

          <ul className="my-6 space-y-0">
            {[
              {
                title: "Any Local listing using pre-April 2026 figures is understating income",
                text: "This is the only trap where the mistake runs in the buyer's favour. Every Local branch listing published before April 2026 is quoting historical income calculated under the old, lower Local rates. The same branch under 2026/27 rates will earn meaningfully more for the same work — sometimes thousands of pounds a year."
              },
              {
                title: "Any Mains listing using April 2026–April 2027 figures is overstating income",
                text: "The exact opposite of the Local trap. Current Mains trading figures include the temporary 4% top-up that doesn't exist from May 2027 onwards. Always ask for figures both with and without the top-up."
              },
              {
                title: "Bill payment uplift depends entirely on client mix",
                text: "The headline \"+142% on resellers\" only applies to the third of bill payment volume that comes from non-utility billers. A branch in an area where customers pay their British Gas and Vodafone bills sees the modest 9% uplift. A branch near a lot of small local billers sees the full 142% on that subset."
              },
              {
                title: "The Travel MoneyCard sign-up is a trial rate",
                text: "The £5 Travel MoneyCard sign-up payment is explicitly described by POL as a trial that will be \"reviewed after 12 months.\" Don't assume it survives into 2027/28."
              },
              {
                title: "Major Branch Support Payment is reassessed annually",
                text: "Eligibility is checked each January and applied from April. If the bank you're relying on to qualify closes its quarter-mile branch in August, you don't lose the payment immediately — but you lose it the following April."
              },
              {
                title: "OEI is now up to 6%, but it's still a deduction scheme in disguise",
                text: "The Operational Excellence Incentive maximum rose from 5% to 6% in 2026/27. But OEI is a points-based scheme where a branch loses a point for every £1,000 of excess cash and stock. If a seller is advertising the full 6%, ask whether they've actually achieved it in the last six months."
              }
            ].map((trap, idx) => (
              <li key={idx} className="py-6 pl-12 md:pl-16 border-b border-[#30363d] relative">
                <span className="absolute left-0 top-7 text-[11px] text-[#c9a227] font-bold tracking-wider font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="absolute left-9 top-8 w-4 h-px bg-[#c9a227]"></span>
                <h4 className="text-lg md:text-xl font-semibold mb-1.5 text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif" }}>
                  {trap.title}
                </h4>
                <p className="text-[15px] text-[#c9d1d9] leading-relaxed">
                  {trap.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* SECTION 7 - CALCULATOR */}
        <section className="bg-[#0d0d0d] py-16 md:py-20" id="calculator">
          <div className="max-w-[1180px] mx-auto px-7 md:px-12">
            <div className="flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase text-[#8b949e] mb-5 font-mono">
              <span className="w-6 h-px bg-[#8b949e]"></span>
              <span className="text-[#c9a227] font-bold">Live demo</span>
              <span className="text-[#30363d]">/</span>
              <span>Upload your statement</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-white" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
              <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">07</span>
              What the new rates do to your branch
            </h2>

            <div className="max-w-[720px] text-[17px] leading-relaxed text-[#8b949e] mb-9">
              <p className="mb-5">
                Upload your ServiceNow monthly remuneration statement (Excel or CSV) and see exactly what the 2026/27 rates mean for your branch. <strong className="text-white">All processing happens in your browser</strong> — no data is uploaded, stored, or transmitted.
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="mb-9 p-4 md:p-5 bg-[#161b22] border border-[#30363d] rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-bold mb-1 text-white">100% Client-Side Processing</h3>
                  <p className="text-sm text-[#8b949e] leading-relaxed">
                    Your data is processed entirely in your browser. No upload. No server. No storage. When you close this page, your data is gone.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Zone or Results */}
            {uploadState !== 'success' ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`mb-9 p-8 md:p-12 rounded-lg border-2 border-dashed transition-all cursor-pointer text-center ${
                  dragActive 
                    ? 'border-[#c9a227] bg-[#161b22]' 
                    : 'border-[#30363d] bg-[#161b22]'
                }`}
              >
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                    {uploadState === 'uploading' ? 'Processing...' : 'Drop your statement here'}
                  </h3>
                  <p className="text-sm mb-2 text-[#8b949e]">
                    or click to browse • .xlsx or .csv • max 1MB
                  </p>
                  <div className="mt-6 p-5 rounded-lg text-left max-w-[560px] mx-auto bg-[#0d1117] border border-[#30363d]">
                    <p className="font-mono text-xs font-semibold mb-3 text-[#c9d1d9] tracking-wider uppercase">Where do I get this file?</p>
                    <ol className="text-[13px] text-[#8b949e] leading-relaxed pl-5 list-decimal space-y-1.5">
                      <li>Log in to <strong className="text-[#c9d1d9]">Branch Hub</strong> (the Post Office ServiceNow portal)</li>
                      <li>Go to <strong className="text-[#c9d1d9]">Remuneration</strong> → <strong className="text-[#c9d1d9]">Monthly Statements</strong></li>
                      <li>Select any recent month and click <strong className="text-[#c9d1d9]">Export to Excel</strong></li>
                      <li>Upload the downloaded .xlsx file here</li>
                    </ol>
                    <p className="text-[11px] mt-3 text-[#6e7681]">
                      The file is usually called something like <code className="text-[#c9a227] font-mono">sn_customerservice_rem_monthly_statement.xlsx</code>
                    </p>
                  </div>
                  {errorMessage && (
                    <div className="mt-5 p-3 md:p-4 rounded-lg bg-[#ff000015] text-[#ff6b6b] text-sm">
                      {errorMessage}
                    </div>
                  )}
                </label>
              </div>
            ) : results && (
              <div>
                {/* Branch Info Bar */}
                <div className="p-4 md:p-5 rounded-lg bg-[#161b22] border-l-4 border-[#c9a227] mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#8b949e] mb-1">Contract Type</div>
                    <div className="font-bold text-lg capitalize text-white">{results.branch.contractType}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#8b949e] mb-1">Period</div>
                    <div className="font-bold text-lg text-white">{results.branch.period}</div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadState('idle');
                      setResults(null);
                    }}
                    className="font-mono px-4 md:px-5 py-2.5 rounded bg-[#30363d] text-[#c9d1d9] border-none text-[11px] tracking-[0.1em] uppercase font-bold cursor-pointer transition-all hover:bg-[#c9a227] hover:text-[#0d1117]"
                  >
                    Upload Different File
                  </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8">
                  <div className="p-6 md:p-8 border-r border-[#30363d] bg-[#161b22]">
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-2">Paid under 2025/26 rates</div>
                    <div className="text-4xl md:text-5xl font-medium text-white leading-none mb-2" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrencyShort(results.summary.oldSubtotal)}
                    </div>
                    <div className="font-mono mt-2.5 text-xs text-[#8b949e]">As invoiced</div>
                  </div>
                  <div className="p-6 md:p-8 border-r border-[#30363d] bg-[#161b22]">
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-2">Re-priced under 2026/27 rates</div>
                    <div className="text-4xl md:text-5xl font-medium text-white leading-none mb-2" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrencyShort(results.summary.newSubtotal)}
                    </div>
                    <div className={`font-mono mt-2.5 text-xs font-bold ${results.summary.netDelta >= 0 ? 'text-[#3fb950]' : 'text-[#ff6b6b]'}`}>
                      {results.summary.netDelta >= 0 ? '+' : ''}{formatCurrencyShort(results.summary.netDelta)} vs old
                    </div>
                  </div>
                  <div className="p-6 md:p-8 bg-[#0d1117]">
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-2">Net delta</div>
                    <div className={`text-4xl md:text-5xl font-medium leading-none mb-2 ${results.summary.netDelta >= 0 ? 'text-[#3fb950]' : 'text-[#ff6b6b]'}`} style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                      {results.summary.netDelta >= 0 ? '+' : ''}{formatCurrencyShort(results.summary.netDelta)}
                    </div>
                    <div className={`font-mono mt-2.5 text-xs font-bold ${results.summary.netDelta >= 0 ? 'text-[#3fb950]' : 'text-[#ff6b6b]'}`}>
                      {formatPercent(results.summary.netDeltaPercent)} per month
                    </div>
                  </div>
                </div>

                {/* Top 10 Movers */}
                {results.topMovers && results.topMovers.length > 0 && (
                  <div className="p-6 md:p-7 border-t border-[#30363d] bg-[#161b22] mb-0 overflow-x-auto">
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-4">Top 10 line-item movers · new rate vs old</div>
                    <div className="min-w-[600px]">
                      {results.topMovers.slice(0, 10).map((row, idx) => {
                        const maxDelta = Math.abs(results.topMovers[0].delta);
                        const pctWidth = Math.max(2, Math.round((Math.abs(row.delta) / maxDelta) * 100));
                        return (
                          <div key={idx} className="grid grid-cols-[240px_1fr_110px] items-center gap-4 py-2.5 border-b border-[#21262d] text-[13px]">
                            <div className="text-[#c9d1d9] font-medium">
                              <span className="font-mono text-[#6e7681] text-[10px] mr-2">{row.salesRef}</span>
                              {row.name}
                            </div>
                            <div className="h-4 bg-[#21262d] relative rounded overflow-hidden">
                              <div style={{
                                height: '100%',
                                width: `${pctWidth}%`,
                                background: row.delta >= 0 ? 'linear-gradient(90deg, #166534, #3fb950)' : 'linear-gradient(90deg, #991b1b, #ff6b6b)',
                                borderRadius: '2px'
                              }}></div>
                            </div>
                            <div className={`font-mono text-right text-xs font-bold ${row.delta >= 0 ? 'text-[#3fb950]' : 'text-[#ff6b6b]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                              {row.delta >= 0 ? '+' : ''}{formatCurrency(row.delta)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Category Grid */}
                {results.categoryTotals && (
                  <div className="p-6 md:p-7 border-t border-[#30363d] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 bg-[#161b22]">
                    {Object.entries(results.categoryTotals).sort((a, b) => Math.abs(b[1].delta) - Math.abs(a[1].delta)).map(([category, totals], idx, arr) => (
                      <div key={category} className={`p-4 md:p-5 pr-5 ${idx !== arr.length - 1 ? 'border-r border-[#21262d]' : ''}`}>
                        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#8b949e] mb-1.5">
                          {category}
                        </div>
                        <div className="text-2xl font-medium text-white" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                          {formatCurrencyShort(totals.newTotal)}
                        </div>
                        <div className={`font-mono text-[11px] font-bold mt-1 ${totals.delta >= 0 ? 'text-[#3fb950]' : 'text-[#ff6b6b]'}`}>
                          {totals.delta >= 0 ? '+' : ''}{formatCurrency(totals.delta)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="p-5 md:p-7 border-t border-[#30363d] bg-[#161b22]">
                  <div className="mb-5">
                    <h3 className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8b949e] mb-3">Adjustments</h3>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-wrap">
                      {(results.branch.contractType === 'mains' || results.branch.contractType === 'local') && (
                        <>
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#c9d1d9]">
                            <input
                              type="checkbox"
                              checked={applyMBSP}
                              onChange={(e) => {
                                setApplyMBSP(e.target.checked);
                                setTimeout(recalculate, 0);
                              }}
                              className="w-4 h-4"
                            />
                            <span>MBSP (4% of variable)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#c9d1d9]">
                            <input
                              type="checkbox"
                              checked={applyRSP}
                              onChange={(e) => {
                                setApplyRSP(e.target.checked);
                                setTimeout(recalculate, 0);
                              }}
                              className="w-4 h-4"
                            />
                            <span>RSP (£416.67/month)</span>
                          </label>
                        </>
                      )}
                    </div>
                    <div className="mt-5">
                      <label className="block mb-2">
                        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#c9d1d9]">Bill Payment Reseller Mix: {resellerPct}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={resellerPct}
                        onChange={(e) => setResellerPct(parseInt(e.target.value))}
                        onMouseUp={recalculate}
                        onTouchEnd={recalculate}
                        className="w-full max-w-[400px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
                    <button
                      onClick={() => setShowAllRows(!showAllRows)}
                      className={`font-mono px-4 md:px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-bold cursor-pointer transition-all rounded ${
                        showAllRows 
                          ? 'bg-[#c9a227] border border-[#c9a227] text-[#0d1117]' 
                          : 'bg-transparent border border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]'
                      }`}
                    >
                      {showAllRows ? 'Hide unchanged lines' : 'Show all line items'}
                    </button>
                    {showAllRows && (
                      <button
                        onClick={() => setShowChangedOnly(!showChangedOnly)}
                        className={`font-mono px-4 md:px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-bold cursor-pointer transition-all rounded ${
                          !showChangedOnly 
                            ? 'bg-[#c9a227] border border-[#c9a227] text-[#0d1117]' 
                            : 'bg-transparent border border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]'
                        }`}
                      >
                        {showChangedOnly ? 'Changed lines only' : 'All lines'}
                      </button>
                    )}
                    <span className="font-mono text-[11px] text-[#8b949e] md:ml-auto">
                      Showing {displayRows.length} {showAllRows ? (showChangedOnly ? 'changed' : '') : 'changed'} lines
                    </span>
                  </div>
                </div>

                {/* Full Table */}
                {showAllRows && (
                  <div className="p-0 md:px-7 md:pb-7 bg-[#161b22] overflow-x-auto">
                    <table className="w-full border-collapse text-[11px] font-mono min-w-[700px]">
                      <thead>
                        <tr className="border-b border-[#30363d]">
                          <th className="text-left py-2.5 px-2 text-[#8b949e] text-[9px] tracking-[0.12em] uppercase font-bold">Ref</th>
                          <th className="text-left py-2.5 px-2 text-[#8b949e] text-[9px] tracking-[0.12em] uppercase font-bold">Product</th>
                          <th className="text-left py-2.5 px-2 text-[#8b949e] text-[9px] tracking-[0.12em] uppercase font-bold">Category</th>
                          <th className="text-right py-2.5 px-2 text-[#8b949e] text-[9px] tracking-[0.12em] uppercase font-bold">Old £</th>
                          <th className="text-right py-2.5 px-2 text-[#8b949e] text-[9px] tracking-[0.12em] uppercase font-bold">New £</th>
                          <th className="text-right py-2.5 px-2 text-[#8b949e] text-[9px] tracking-[0.12em] uppercase font-bold">Δ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayRows.map((row, idx) => (
                          <tr key={idx} className="border-b border-[#21262d]">
                            <td className="py-1.5 px-2 text-[#6e7681] text-[10px]" style={{ fontVariantNumeric: 'tabular-nums' }}>{row.salesRef}</td>
                            <td className="py-1.5 px-2 text-white text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{row.name}</td>
                            <td className="py-1.5 px-2 text-[#c9d1d9]" style={{ fontVariantNumeric: 'tabular-nums' }}>{row.category}</td>
                            <td className="py-1.5 px-2 text-[#c9d1d9] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(row.oldAmount)}</td>
                            <td className="py-1.5 px-2 text-[#c9d1d9] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(row.newAmount)}</td>
                            <td className={`py-1.5 px-2 font-bold text-right ${row.delta >= 0 ? 'text-[#3fb950]' : 'text-[#ff6b6b]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                              {row.isUncertain ? '?' : (row.delta === 0 ? '—' : (row.delta > 0 ? '+' : '') + formatCurrency(row.delta))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Uncertain Rows Warning */}
                {results.uncertainRows && results.uncertainRows.length > 0 && (
                  <div className="mt-8 p-4 md:p-5 bg-[#161b22] border border-[#c9a227] rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h3 className="font-bold mb-1 text-white">Uncertain Calculations</h3>
                        <p className="text-sm text-[#c9d1d9] leading-relaxed">
                          {results.uncertainRows.length} line(s) could not be calculated accurately and are held at old values.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="mt-8 p-5 md:p-6 bg-[#161b22] border border-[#c9a227] rounded-lg">
                  <h3 className="font-bold mb-2 text-base text-white">⚖️ ILLUSTRATION ONLY</h3>
                  <p className="text-[13px] text-[#c9d1d9] leading-relaxed">
                    This tool provides an indicative projection based on published rate changes. It is <strong className="font-semibold">not financial advice</strong>. 
                    Actual remuneration depends on your branch's specific trading patterns, OEI score, and Post Office Ltd's application of the new rates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 8 - WHAT TO DO NOW */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 max-w-[820px] text-[#c9d1d9]" style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.022em' }}>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-[#c9a227] align-middle mr-4 px-2 py-1 border border-[#c9a227] rounded font-mono">08</span>
            Five questions to ask tomorrow
          </h2>
          <div className="max-w-[720px] text-[17px] leading-relaxed text-[#c9d1d9]">
            <p className="mb-5">
              If you're actively evaluating a Post Office branch right now, these are the questions you should be putting to the seller before any offer goes in.
            </p>
            <ol className="my-5 ml-5 md:ml-6 text-base text-[#c9d1d9] list-decimal space-y-3.5">
              <li><strong className="text-white">What accounting period are these trading figures from?</strong> If they're from the year to March 2026 or earlier, they're under old rates.</li>
              <li><strong className="text-white">Can I see the transaction mix, not just the total?</strong> The same total turnover means very different things depending on whether the branch is mostly mails, banking, travel money, or government services.</li>
              <li><strong className="text-white">If it's a Mains branch, are these figures inclusive or exclusive of the temporary 4% Mains top-up?</strong> If they're inclusive, what's the like-for-like figure with the top-up stripped out?</li>
              <li><strong className="text-white">If it's a rural Local, is the £5,000/year Remote Support Payment being claimed?</strong> If not, it might be missing money you can capture.</li>
              <li><strong className="text-white">If it's a city-centre branch near surviving banks, is the 4% Major Branch Support Payment being claimed?</strong> Same logic — ask to see it on the statement.</li>
            </ol>
          </div>

          {/* CTA */}
          <div className="max-w-[720px] my-15 p-8 md:p-11 bg-[#161b22] border border-[#30363d] text-left relative">
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#30363d] pointer-events-none -z-10"></div>
            <h3 className="text-2xl md:text-3xl font-medium leading-tight mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
              Want deeper analysis on a specific branch?
            </h3>
            <p className="text-[15px] text-[#c9d1d9] mb-5">
              Our Intelligence Reports provide verified session counts, operator commentary, and strategic recommendations tailored to individual branches.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <a
                href="/intelligence"
                className="inline-block px-5 md:px-6 py-3 bg-[#b8231c] text-white no-underline text-[11px] font-bold tracking-[0.12em] uppercase border border-[#b8231c] transition-all font-mono hover:bg-[#7a1712]"
              >
                Explore Intelligence Reports
              </a>
              <a
                href="/insider"
                className="inline-block px-5 md:px-6 py-3 bg-transparent text-[#c9d1d9] no-underline text-[11px] font-bold tracking-[0.12em] uppercase border border-[#c9d1d9] transition-all font-mono hover:bg-[#c9d1d9] hover:text-[#0d1117]"
              >
                Subscribe to Insider
              </a>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="max-w-[1180px] mx-auto px-7 md:px-12 py-13 mb-12">
          <div className="max-w-[720px] text-lg md:text-xl text-[#c9d1d9] leading-relaxed" style={{ fontFamily: "'Fraunces', serif" }}>
            <p>
              The Post Office doesn't publish these rates publicly. They go out through Branch Hub, marked "Postmaster – Confidential," visible only to existing Postmasters. That's one of the reasons buyers routinely pay the wrong price for branches: the people selling them have access to information the people buying them don't. Part of what FCM Intelligence does is close that gap. If this was useful and you're looking at a branch this year, <strong className="font-semibold">subscribe to Insider</strong> — we'll send you this kind of analysis before most of the market even knows it exists.
            </p>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
