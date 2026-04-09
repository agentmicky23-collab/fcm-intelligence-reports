'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';
import * as XLSX from 'xlsx';
import { AppLayout } from '@/components/layout/AppLayout';
import { parseStatement, calculateNewRates } from '@/lib/remuneration/calculator';

export default function CalculatorClient() {
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // User controls
  const [applyMBSP, setApplyMBSP] = useState(false);
  const [applyRSP, setApplyRSP] = useState(false);
  const [resellerPct, setResellerPct] = useState(33);
  const [showAllRows, setShowAllRows] = useState(false);
  const [showChangedOnly, setShowChangedOnly] = useState(true);

  const handleFile = useCallback((file) => {
    setUploadState('uploading');
    setErrorMessage('');

    // Validate file
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

    // Read and parse file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Parse statement
        const parsed = parseStatement(workbook);
        
        // Calculate new rates
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
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <AppLayout>
        <style jsx global>{`
          /* Override AppLayout background for this page */
          body {
            background: #f6f3ec !important;
          }

          /* Paper texture */
          .article-wrapper::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            background-image:
              radial-gradient(circle at 15% 20%, rgba(184,35,28,.025) 0, transparent 40%),
              radial-gradient(circle at 85% 60%, rgba(21,20,15,.02) 0, transparent 45%);
          }

          /* CSS Variables */
          .article-wrapper {
            --paper: #f6f3ec;
            --paper-2: #efeadf;
            --ink: #15140f;
            --ink-2: #3b3a32;
            --ink-3: #6e6b5d;
            --rule: #d8d2c0;
            --rule-strong: #15140f;
            --accent: #b8231c;
            --accent-dim: #7a1712;
            --positive: #166534;
            --positive-bg: #dcf0df;
            --negative: #991b1b;
            --negative-bg: #fbe2e2;
            --neutral: #6e6b5d;
            --max: 1180px;
            --col: 720px;

            /* Calculator dark frame colors */
            --dark-bg: #1f1e18;
            --dark-card: #24231c;
            --dark-text: #c9c4b3;
          }

          /* Typography utilities */
          .font-fraunces { font-family: 'Fraunces', serif; }
          .font-inter { font-family: 'Inter', -apple-system, sans-serif; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
        `}</style>

        <div className="article-wrapper" style={{ background: 'var(--paper)', color: 'var(--ink)', position: 'relative' }}>
          
          {/* MASTHEAD */}
          <header style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '56px 28px 36px', position: 'relative', zIndex: 1 }}>
            <div className="font-mono" style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '22px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--ink-3)' }}></span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Insights</span>
              <span style={{ color: 'var(--rule)' }}>/</span>
              <span>Remuneration</span>
              <span style={{ color: 'var(--rule)' }}>/</span>
              <span>06 April 2026</span>
            </div>

            <h1 className="font-fraunces" style={{ fontWeight: 500, fontSize: 'clamp(38px, 6.2vw, 76px)', lineHeight: '1.02', letterSpacing: '-0.028em', maxWidth: '960px', marginBottom: '28px', fontVariationSettings: '"opsz" 96' }}>
              Post Office remuneration just restructured. <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--accent-dim)', fontVariationSettings: '"opsz" 144' }}>Every listing you're looking at is already out of date.</em>
            </h1>

            <p className="font-fraunces" style={{ fontWeight: 400, fontSize: 'clamp(19px, 2vw, 23px)', lineHeight: '1.45', color: 'var(--ink-2)', maxWidth: '680px', marginBottom: '36px' }}>
              On 30 March 2026 the Post Office quietly rewrote the rules on how every Mains, Local and SPSO branch in the UK gets paid. Brokers haven't updated their listings. Accountants haven't caught up. Here's what changed — and what it means if you're buying a branch this year.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '22px', borderTop: '1px solid var(--rule)', fontSize: '13px', color: 'var(--ink-3)', maxWidth: '680px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>FCM Intelligence Editorial</span>
              <span style={{ color: 'var(--rule)' }}>·</span>
              <span>~9 min read</span>
              <span style={{ color: 'var(--rule)' }}>·</span>
              <span>Based on POL Remuneration Rates Booklet 2026/27 (v1.0) and Remuneration Changes 2026</span>
            </div>
          </header>

          {/* INTRODUCTION */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)' }}>
              <p style={{ marginBottom: '1.1em' }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '4.4em', fontWeight: 500, float: 'left', lineHeight: '0.88', padding: '6px 10px 0 0', color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}>O</span>
                n Monday 30 March the Post Office published two documents through Branch Hub — the Branch Remuneration Rates Booklet 2026/27 and a commentary titled Remuneration Changes 2026. Both are marked "Postmaster – Confidential." Both govern how every single working Postmaster in the UK gets paid for the year ahead. And unless you're running a branch already, you've almost certainly never seen them.
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                We've been through them line by line so you don't have to. What follows is the operator's read: the three structural changes that matter, the line-item moves that reshape the monthly income picture, the traps that separate informed buyers from uninformed ones, and — at the bottom of the page — a live demonstration of what the new rates do to a real, anonymised monthly statement from one of our own branches.
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                None of this is in the broker listings you're reading. None of this is on the Post Office's public site. If you're evaluating a branch this year, this is the single most important hour of reading you can do.
              </p>
            </div>

            <blockquote className="font-fraunces" style={{ fontWeight: 400, fontVariationSettings: '"opsz" 144', fontSize: 'clamp(22px, 2.8vw, 30px)', lineHeight: '1.38', color: 'var(--ink)', padding: '36px 0 36px 32px', borderLeft: '3px solid var(--accent)', margin: '40px 0', maxWidth: '820px' }}>
              If you're looking at a branch listing right now, three things are true. The per-transaction rates are higher than last year across most product lines. Locals and SPSO branches are finally being paid the same as Mains for the same work. And there's a temporary 4% Mains top-up running through to April 2027 that inflates current Mains figures in a way the listings don't explain. <em style={{ fontStyle: 'italic', color: 'var(--accent-dim)' }}>Understanding these three changes is the difference between reading a listing accurately and overpaying for a branch.</em>
            </blockquote>
          </section>

          {/* SECTION 1 — HOW IT WORKS */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>01</span>
              How the model actually works
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)' }}>
              <p style={{ marginBottom: '1.1em' }}>
                Post Office remuneration isn't a salary. It's a transaction-level piggyback system. Every counted transaction at the counter has its own rate — some a flat pence-per-transaction (auto cash deposit: 52p), some a percentage of sale value (1st class stamps: 7%), some a tiered volume fee (ATM withdrawals). The monthly income a branch receives is the weighted sum of all those transaction payments, plus any applicable fixed payments on top.
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                This is why <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>"what's the turnover" is the wrong first question</strong> when you're looking at a Post Office branch. The right first question is "what's the mix." Two branches showing identical £80,000-per-year Post Office income figures on a listing can represent completely different businesses if one is mostly banking and the other is mostly mails — and those two businesses move in completely different directions under the new rates.
              </p>
            </div>
          </section>

          {/* SECTION 2 — THREE STRUCTURAL CHANGES */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>02</span>
              The three structural changes
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)', marginBottom: '32px' }}>
              <p>Before any individual rate moved, POL changed three things that sit above the rate table. These are the bigger story, and they're the ones brokers won't tell you.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 0, margin: '32px 0', borderTop: '1px solid var(--rule-strong)', borderLeft: '1px solid var(--rule-strong)' }}>
              <div style={{ padding: '26px 24px 28px', borderRight: '1px solid var(--rule-strong)', borderBottom: '1px solid var(--rule-strong)', background: 'var(--paper-2)', position: 'relative' }}>
                <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '10px' }}>
                  Structural · <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Change #1</span>
                </div>
                <h4 className="font-fraunces" style={{ fontSize: '22px', lineHeight: '1.2', fontWeight: 600, marginBottom: '10px', color: 'var(--ink)' }}>
                  Locals and SPSO reach parity with Mains
                </h4>
                <div className="font-fraunces" style={{ fontVariationSettings: '"opsz" 144', fontSize: '54px', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)', marginTop: '14px', marginBottom: '4px' }}>
                  £0<span style={{ fontSize: '14px', color: 'var(--ink-3)', marginLeft: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0 }}>gap / per-transaction</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--ink-2)' }}>
                  For years, Locals and SPSO branches were paid less per transaction than Mains for the same work. From April 2026 that ends. All variable rates are now identical across contract types. Every Local branch listing showing last year's income figures is <strong>understating</strong> current earnings — sometimes by thousands of pounds a year.
                </p>
              </div>

              <div style={{ padding: '26px 24px 28px', borderRight: '1px solid var(--rule-strong)', borderBottom: '1px solid var(--rule-strong)', background: 'var(--paper-2)', position: 'relative' }}>
                <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '10px' }}>
                  Temporary · <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Change #2</span>
                </div>
                <h4 className="font-fraunces" style={{ fontSize: '22px', lineHeight: '1.2', fontWeight: 600, marginBottom: '10px', color: 'var(--ink)' }}>
                  4% Mains top-up until April 2027
                </h4>
                <div className="font-fraunces" style={{ fontVariationSettings: '"opsz" 144', fontSize: '54px', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)', marginTop: '14px', marginBottom: '4px' }}>
                  +4%<span style={{ fontSize: '14px', color: 'var(--ink-3)', marginLeft: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0 }}>variable / 12 months</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--ink-2)' }}>
                  Every branch on a Mains contract as of 1 April 2026 receives a 4% top-up on all variable remuneration for 12 months. It is explicitly called "temporary." A listing quoting Mains income from this window is showing a figure that will <strong>unwind by 4%</strong> when the top-up ends — and most sellers don't mention it.
                </p>
              </div>

              <div style={{ padding: '26px 24px 28px', borderRight: '1px solid var(--rule-strong)', borderBottom: '1px solid var(--rule-strong)', background: 'var(--paper-2)', position: 'relative' }}>
                <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '10px' }}>
                  Principle · <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Change #3</span>
                </div>
                <h4 className="font-fraunces" style={{ fontSize: '22px', lineHeight: '1.2', fontWeight: 600, marginBottom: '10px', color: 'var(--ink)' }}>
                  POL accepted a 50% income-share floor
                </h4>
                <div className="font-fraunces" style={{ fontVariationSettings: '"opsz" 144', fontSize: '54px', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)', marginTop: '14px', marginBottom: '4px' }}>
                  ≥ 50%<span style={{ fontSize: '14px', color: 'var(--ink-3)', marginLeft: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0 }}>branch share per product</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--ink-2)' }}>
                  POL established for the first time that branches should receive <strong>at least half</strong> of the income generated for each product. Most products were already above that line. The ones that weren't — Airmail, Surface Mail, Redirection — got dragged up. The principle is more interesting than the numbers: POL has accepted a floor it now has to defend.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3 — THE MOVES (rate tables omitted for brevity, focus on prose) */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>03</span>
              Where the rates actually moved
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)' }}>
              <p style={{ marginBottom: '1.1em' }}>
                The full rate table is extensive — the calculator below uses every changed rate. Key highlights: banking deposits and withdrawals moved substantially (+37% to +147% on many lines), Evri parcels jumped 25–44%, Travel Money rose 20%, and bill payments split into two tiers with reseller contracts jumping to 20p from 7–8p. The 50% income-share floor dragged up Airmail, Surface Mail, and Redirections by 15–44%. Full details are in the source POL booklet and live in the calculator.
              </p>
            </div>
          </section>

          {/* SECTION 4 — THE 4% MAINS TOP-UP */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>04</span>
              The 4% Mains top-up nobody is explaining
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)' }}>
              <p style={{ marginBottom: '1.1em' }}>
                This is the section that matters most if you're looking at a Mains branch right now.
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>What it is:</strong> From April 2026 trading (May 2026 remuneration), every branch on a Mains contract as of 1 April 2026 will receive a 4% top-up applied to all variable remuneration. It runs for 12 months. POL explicitly describes it as "temporary."
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Why it matters for buyers:</strong> A Mains branch that changes hands during the April 2026 to April 2027 window will show 4% higher variable remuneration than its true steady-state income. If a listing quotes figures from the year to March 2027, those figures include the top-up. If the buyer assumes the top-up continues, they are overpaying by 4% on the remuneration line.
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                For an average Mains branch earning £65,000 a year in variable income, that's around £2,600 a year of inflated figures. At a typical 2× earnings multiple on a Post Office branch sale, that's £5,200 of price the seller can ask for that won't exist from May 2027 onwards.
              </p>
              <p style={{ marginBottom: '1.1em' }}>
                <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>What to do:</strong> When asking for trading figures, ask for them <em>excluding</em> the temporary Mains top-up. Any decent seller will have this breakdown. If they don't, that tells you something useful about how well they're running the branch.
              </p>
            </div>
          </section>

          {/* SECTION 5 — FIXED PAYMENTS */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>05</span>
              Two fixed payments most buyers don't know exist
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)' }}>
              <p style={{ marginBottom: '1.1em' }}>
                Two conditional fixed payments changed meaningfully. If you're evaluating a branch that qualifies for either, missing money is real money.
              </p>
              <h3 className="font-fraunces" style={{ fontSize: '22px', fontWeight: 600, margin: '28px 0 10px', color: 'var(--ink)' }}>
                Major Branch Support Payment
              </h3>
              <p style={{ marginBottom: '1.1em' }}>
                For branches in large town and city centres with two or more still-operating banks within a quarter mile. From April 2026 this is no longer a fixed sum — it becomes a <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>4% monthly boost to variable remuneration</strong>, in addition to any other top-ups. If you're looking at an urban branch near a couple of surviving bank branches, ask the seller whether this is being claimed.
              </p>
              <h3 className="font-fraunces" style={{ fontSize: '22px', fontWeight: 600, margin: '28px 0 10px', color: 'var(--ink)' }}>
                Remote Support Payment
              </h3>
              <p style={{ marginBottom: '1.1em' }}>
                For branches with fewer than 1,500 residents within half a mile. £5,000 per year, paid in twelve monthly instalments of £416.67. Previously only available to Local branches. From April 2026 it's available to both Local and Mains contracts. If you're looking at a rural branch and this payment isn't showing up in the trading figures, that's a direct question for the seller.
              </p>
            </div>
          </section>

          {/* SECTION 6 — THE TRAPS */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>06</span>
              Six traps most buyers walk into
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)', marginBottom: '24px' }}>
              <p>Below are the things that look straightforward in the POL documents but will cost you money if you treat them naively.</p>
            </div>

            <ul style={{ margin: '24px 0 0', padding: 0, listStyle: 'none', counterReset: 'trap' }}>
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
                <li key={idx} style={{ counterIncrement: 'trap', padding: '24px 0 24px 64px', borderBottom: '1px solid var(--rule)', position: 'relative' }}>
                  <span className="font-mono" style={{ position: 'absolute', left: 0, top: '28px', fontSize: '11px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span style={{ position: 'absolute', left: '36px', top: '32px', width: '18px', height: '1px', background: 'var(--accent)' }}></span>
                  <h4 className="font-fraunces" style={{ fontSize: '21px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                    {trap.title}
                  </h4>
                  <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: '1.55' }}>
                    {trap.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION 7 — THE CALCULATOR (dark frame) */}
          <section style={{ background: 'var(--ink)', color: 'var(--paper)', margin: '60px calc(-1 * ((100vw - var(--max)) / 2 + 28px))', padding: '64px calc((100vw - var(--max)) / 2 + 28px)', position: 'relative', zIndex: 1 }} id="calculator">
            <div className="font-mono" style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9c4b3', marginBottom: '22px' }}>
              <span style={{ width: '24px', height: '1px', background: '#c9c4b3' }}></span>
              <span style={{ color: '#f4a09a', fontWeight: 700 }}>Live demo</span>
              <span style={{ color: 'var(--rule)' }}>/</span>
              <span>Upload your statement</span>
            </div>

            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--paper)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#f4a09a', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid #f4a09a', borderRadius: '2px' }}>07</span>
              What the new rates do to your branch
            </h2>

            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: '#c9c4b3', marginBottom: '36px' }}>
              <p style={{ marginBottom: '1.1em' }}>
                Upload your ServiceNow monthly remuneration statement (Excel or CSV) and see exactly what the 2026/27 rates mean for your branch. <strong style={{ color: 'var(--paper)' }}>All processing happens in your browser</strong> — no data is uploaded, stored, or transmitted.
              </p>
            </div>

            {/* Privacy Notice */}
            <div style={{ maxWidth: 'var(--max)', margin: '0 auto 36px', padding: '16px 20px', background: 'rgba(56, 139, 253, 0.1)', border: '1px solid rgba(56, 139, 253, 0.3)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🔒</span>
                <div>
                  <h3 className="font-bold" style={{ marginBottom: '4px', color: '#fff' }}>100% Client-Side Processing</h3>
                  <p style={{ fontSize: '14px', color: '#c9c4b3', lineHeight: '1.5' }}>
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
                style={{
                  maxWidth: 'var(--max)',
                  margin: '0 auto 36px',
                  padding: '48px 24px',
                  borderRadius: '8px',
                  border: '2px dashed',
                  borderColor: dragActive ? '#f4a09a' : '#3f3d32',
                  background: dragActive ? 'rgba(244, 160, 154, 0.1)' : 'var(--dark-bg)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>
                    {uploadState === 'uploading' ? 'Processing...' : 'Drop your statement here'}
                  </h3>
                  <p style={{ fontSize: '14px', marginBottom: '8px', color: '#8a8778' }}>
                    or click to browse • .xlsx or .csv • max 1MB
                  </p>
                  <div style={{ marginTop: '24px', padding: '20px', borderRadius: '6px', textAlign: 'left', maxWidth: '560px', margin: '24px auto 0', background: '#0d1117', border: '1px solid #30363d' }}>
                    <p className="font-mono" style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: '#c9d1d9', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Where do I get this file?</p>
                    <ol style={{ fontSize: '13px', color: '#8a8778', lineHeight: '1.6', paddingLeft: '20px', listStyleType: 'decimal' }}>
                      <li style={{ marginBottom: '6px' }}>Log in to <strong style={{ color: '#c9d1d9' }}>Branch Hub</strong> (the Post Office ServiceNow portal)</li>
                      <li style={{ marginBottom: '6px' }}>Go to <strong style={{ color: '#c9d1d9' }}>Remuneration</strong> → <strong style={{ color: '#c9d1d9' }}>Monthly Statements</strong></li>
                      <li style={{ marginBottom: '6px' }}>Select any recent month and click <strong style={{ color: '#c9d1d9' }}>Export to Excel</strong></li>
                      <li>Upload the downloaded .xlsx file here</li>
                    </ol>
                    <p style={{ fontSize: '11px', marginTop: '12px', color: '#6e7681' }}>
                      The file is usually called something like <code style={{ color: '#f4a09a', fontFamily: "'JetBrains Mono', monospace" }}>sn_customerservice_rem_monthly_statement.xlsx</code>
                    </p>
                  </div>
                  {errorMessage && (
                    <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '6px', background: 'rgba(248, 81, 73, 0.1)', color: '#f85149', fontSize: '14px' }}>
                      {errorMessage}
                    </div>
                  )}
                </label>
              </div>
            ) : results && (
              <div style={{ maxWidth: 'var(--max)', margin: '0 auto' }}>
                {/* Branch Info Bar */}
                <div style={{ padding: '16px 24px', borderRadius: '6px', background: 'var(--dark-card)', borderLeft: '4px solid #f4a09a', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '4px' }}>Contract Type</div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', textTransform: 'capitalize' }}>{results.branch.contractType}</div>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '4px' }}>Period</div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{results.branch.period}</div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadState('idle');
                      setResults(null);
                    }}
                    className="font-mono"
                    style={{ padding: '10px 18px', borderRadius: '4px', background: '#3f3d32', color: '#c9c4b3', border: 'none', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = '#f4a09a'}
                    onMouseLeave={(e) => e.target.style.background = '#3f3d32'}
                  >
                    Upload Different File
                  </button>
                </div>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: '32px' }}>
                  <div style={{ padding: '32px 28px', borderRight: '1px solid #2e2c24', background: 'var(--dark-bg)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '8px' }}>Paid under 2025/26 rates</div>
                    <div className="font-fraunces" style={{ fontVariationSettings: '"opsz" 144', fontSize: '42px', fontWeight: 500, color: 'var(--paper)', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrencyShort(results.summary.oldSubtotal)}
                    </div>
                    <div className="font-mono" style={{ marginTop: '10px', fontSize: '12px', color: '#8a8778' }}>As invoiced</div>
                  </div>
                  <div style={{ padding: '32px 28px', borderRight: '1px solid #2e2c24', background: 'var(--dark-bg)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '8px' }}>Re-priced under 2026/27 rates</div>
                    <div className="font-fraunces" style={{ fontVariationSettings: '"opsz" 144', fontSize: '42px', fontWeight: 500, color: 'var(--paper)', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrencyShort(results.summary.newSubtotal)}
                    </div>
                    <div className="font-mono" style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: results.summary.netDelta >= 0 ? '#5ec87a' : '#f4a09a' }}>
                      {results.summary.netDelta >= 0 ? '+' : ''}{formatCurrencyShort(results.summary.netDelta)} vs old
                    </div>
                  </div>
                  <div style={{ padding: '32px 28px', background: 'var(--dark-card)' }}>
                    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '8px' }}>Net delta</div>
                    <div className="font-fraunces" style={{ fontVariationSettings: '"opsz" 144', fontSize: '42px', fontWeight: 500, color: results.summary.netDelta >= 0 ? '#5ec87a' : '#f4a09a', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                      {results.summary.netDelta >= 0 ? '+' : ''}{formatCurrencyShort(results.summary.netDelta)}
                    </div>
                    <div className="font-mono" style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: results.summary.netDelta >= 0 ? '#5ec87a' : '#f4a09a' }}>
                      {formatPercent(results.summary.netDeltaPercent)} per month
                    </div>
                  </div>
                </div>

                {/* Top 10 Movers */}
                {results.topMovers && results.topMovers.length > 0 && (
                  <div style={{ padding: '28px', borderTop: '1px solid #2e2c24', background: 'var(--dark-bg)', marginBottom: '0' }}>
                    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '18px' }}>Top 10 line-item movers · new rate vs old</div>
                    <div>
                      {results.topMovers.slice(0, 10).map((row, idx) => {
                        const maxDelta = Math.abs(results.topMovers[0].delta);
                        const pctWidth = Math.max(2, Math.round((Math.abs(row.delta) / maxDelta) * 100));
                        return (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '240px 1fr 110px', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: '1px solid #2a2921', fontSize: '13px' }}>
                            <div style={{ color: '#c9c4b3', fontWeight: 500 }}>
                              <span className="font-mono" style={{ color: '#6b695b', fontSize: '10px', marginRight: '8px' }}>{row.salesRef}</span>
                              {row.name}
                            </div>
                            <div style={{ height: '16px', background: '#2a2921', position: 'relative', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${pctWidth}%`,
                                background: row.delta >= 0 ? 'linear-gradient(90deg, #166534, #5ec87a)' : 'linear-gradient(90deg, #991b1b, #f4a09a)',
                                borderRadius: '2px'
                              }}></div>
                            </div>
                            <div className="font-mono" style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: row.delta >= 0 ? '#5ec87a' : '#f4a09a', fontVariantNumeric: 'tabular-nums' }}>
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
                  <div style={{ padding: '28px', borderTop: '1px solid #2e2c24', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, background: 'var(--dark-bg)' }}>
                    {Object.entries(results.categoryTotals).sort((a, b) => Math.abs(b[1].delta) - Math.abs(a[1].delta)).map(([category, totals], idx, arr) => (
                      <div key={category} style={{ padding: '18px 20px 18px 0', borderRight: idx === arr.length - 1 ? 'none' : '1px solid #2a2921' }}>
                        <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '6px' }}>
                          {category}
                        </div>
                        <div className="font-fraunces" style={{ fontSize: '24px', fontWeight: 500, color: 'var(--paper)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                          {formatCurrencyShort(totals.newTotal)}
                        </div>
                        <div className="font-mono" style={{ fontSize: '11px', fontWeight: 700, color: totals.delta >= 0 ? '#5ec87a' : '#f4a09a', marginTop: '4px' }}>
                          {totals.delta >= 0 ? '+' : ''}{formatCurrency(totals.delta)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div style={{ padding: '20px 28px', borderTop: '1px solid #2e2c24', background: 'var(--dark-bg)' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8778', marginBottom: '12px' }}>Adjustments</h3>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      {(results.branch.contractType === 'mains' || results.branch.contractType === 'local') && (
                        <>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#c9c4b3' }}>
                            <input
                              type="checkbox"
                              checked={applyMBSP}
                              onChange={(e) => {
                                setApplyMBSP(e.target.checked);
                                setTimeout(recalculate, 0);
                              }}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>MBSP (4% of variable)</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#c9c4b3' }}>
                            <input
                              type="checkbox"
                              checked={applyRSP}
                              onChange={(e) => {
                                setApplyRSP(e.target.checked);
                                setTimeout(recalculate, 0);
                              }}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>RSP (£416.67/month)</span>
                          </label>
                        </>
                      )}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px' }}>
                        <span className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9c4b3' }}>Bill Payment Reseller Mix: {resellerPct}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={resellerPct}
                        onChange={(e) => setResellerPct(parseInt(e.target.value))}
                        onMouseUp={recalculate}
                        onTouchEnd={recalculate}
                        style={{ width: '100%', maxWidth: '400px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowAllRows(!showAllRows)}
                      className="font-mono"
                      style={{
                        background: showAllRows ? '#f4a09a' : 'transparent',
                        border: '1px solid ' + (showAllRows ? '#f4a09a' : '#3f3d32'),
                        color: showAllRows ? 'var(--ink)' : '#c9c4b3',
                        padding: '10px 18px',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all .2s',
                        borderRadius: '4px'
                      }}
                    >
                      {showAllRows ? 'Hide unchanged lines' : 'Show all line items'}
                    </button>
                    {showAllRows && (
                      <button
                        onClick={() => setShowChangedOnly(!showChangedOnly)}
                        className="font-mono"
                        style={{
                          background: !showChangedOnly ? '#f4a09a' : 'transparent',
                          border: '1px solid ' + (!showChangedOnly ? '#f4a09a' : '#3f3d32'),
                          color: !showChangedOnly ? 'var(--ink)' : '#c9c4b3',
                          padding: '10px 18px',
                          fontSize: '11px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all .2s',
                          borderRadius: '4px'
                        }}
                      >
                        {showChangedOnly ? 'Changed lines only' : 'All lines'}
                      </button>
                    )}
                    <span className="font-mono" style={{ fontSize: '11px', color: '#8a8778', marginLeft: 'auto' }}>
                      Showing {displayRows.length} {showAllRows ? (showChangedOnly ? 'changed' : '') : 'changed'} lines
                    </span>
                  </div>
                </div>

                {/* Full Table */}
                {showAllRows && (
                  <div style={{ padding: '0 28px 28px', background: 'var(--dark-bg)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }} className="font-mono">
                      <thead>
                        <tr style={{ borderBottom: '1px solid #3f3d32' }}>
                          <th style={{ textAlign: 'left', padding: '10px 8px', color: '#8a8778', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Ref</th>
                          <th style={{ textAlign: 'left', padding: '10px 8px', color: '#8a8778', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Product</th>
                          <th style={{ textAlign: 'left', padding: '10px 8px', color: '#8a8778', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Category</th>
                          <th style={{ textAlign: 'right', padding: '10px 8px', color: '#8a8778', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Old £</th>
                          <th style={{ textAlign: 'right', padding: '10px 8px', color: '#8a8778', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>New £</th>
                          <th style={{ textAlign: 'right', padding: '10px 8px', color: '#8a8778', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Δ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayRows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #2a2921' }}>
                            <td style={{ padding: '7px 8px', color: '#6b695b', fontSize: '10px', fontVariantNumeric: 'tabular-nums' }}>{row.salesRef}</td>
                            <td style={{ padding: '7px 8px', color: 'var(--paper)', fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.name}</td>
                            <td style={{ padding: '7px 8px', color: '#c9c4b3', fontVariantNumeric: 'tabular-nums' }}>{row.category}</td>
                            <td style={{ padding: '7px 8px', color: '#c9c4b3', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{formatCurrency(row.oldAmount)}</td>
                            <td style={{ padding: '7px 8px', color: '#c9c4b3', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{formatCurrency(row.newAmount)}</td>
                            <td style={{ padding: '7px 8px', color: row.delta >= 0 ? '#5ec87a' : '#f4a09a', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
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
                  <div style={{ maxWidth: 'var(--max)', margin: '32px auto 0', padding: '16px 20px', background: 'rgba(187, 128, 9, 0.1)', border: '1px solid rgba(187, 128, 9, 0.3)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>⚠️</span>
                      <div>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#fff' }}>Uncertain Calculations</h3>
                        <p style={{ fontSize: '14px', color: '#c9c4b3', lineHeight: '1.5' }}>
                          {results.uncertainRows.length} line(s) could not be calculated accurately and are held at old values.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div style={{ maxWidth: 'var(--max)', margin: '32px auto 0', padding: '20px 24px', background: 'rgba(187, 128, 9, 0.05)', border: '1px solid rgba(187, 128, 9, 0.3)', borderRadius: '6px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', color: '#fff' }}>⚖️ ILLUSTRATION ONLY</h3>
                  <p style={{ fontSize: '13px', color: '#c9c4b3', lineHeight: '1.5' }}>
                    This tool provides an indicative projection based on published rate changes. It is <strong>not financial advice</strong>. 
                    Actual remuneration depends on your branch's specific trading patterns, OEI score, and Post Office Ltd's application of the new rates.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 8 — WHAT TO DO NOW */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-fraunces" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: '1.08', letterSpacing: '-0.022em', marginBottom: '20px', maxWidth: '820px', color: 'var(--ink)', fontVariationSettings: '"opsz" 96' }}>
              <span className="font-mono" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', verticalAlign: '10px', marginRight: '16px', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: '2px' }}>08</span>
              Five questions to ask tomorrow
            </h2>
            <div style={{ maxWidth: 'var(--col)', fontSize: '17px', lineHeight: '1.65', color: 'var(--ink-2)' }}>
              <p style={{ marginBottom: '1.1em' }}>
                If you're actively evaluating a Post Office branch right now, these are the questions you should be putting to the seller before any offer goes in.
              </p>
              <ol style={{ margin: '20px 0 0 22px', fontSize: '16px', color: 'var(--ink-2)' }}>
                <li style={{ marginBottom: '14px' }}><strong style={{ color: 'var(--ink)' }}>What accounting period are these trading figures from?</strong> If they're from the year to March 2026 or earlier, they're under old rates.</li>
                <li style={{ marginBottom: '14px' }}><strong style={{ color: 'var(--ink)' }}>Can I see the transaction mix, not just the total?</strong> The same total turnover means very different things depending on whether the branch is mostly mails, banking, travel money, or government services.</li>
                <li style={{ marginBottom: '14px' }}><strong style={{ color: 'var(--ink)' }}>If it's a Mains branch, are these figures inclusive or exclusive of the temporary 4% Mains top-up?</strong> If they're inclusive, what's the like-for-like figure with the top-up stripped out?</li>
                <li style={{ marginBottom: '14px' }}><strong style={{ color: 'var(--ink)' }}>If it's a rural Local, is the £5,000/year Remote Support Payment being claimed?</strong> If not, it might be missing money you can capture.</li>
                <li style={{ marginBottom: '14px' }}><strong style={{ color: 'var(--ink)' }}>If it's a city-centre branch near surviving banks, is the 4% Major Branch Support Payment being claimed?</strong> Same logic — ask to see it on the statement.</li>
              </ol>
            </div>

            {/* CTA */}
            <div style={{ maxWidth: 'var(--col)', margin: '60px auto', padding: '44px 40px', background: 'var(--paper-2)', border: '1px solid var(--rule-strong)', textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-6px -6px 6px 6px', border: '1px solid var(--rule-strong)', pointerEvents: 'none', zIndex: -1 }}></div>
              <h3 className="font-fraunces" style={{ fontSize: '30px', fontWeight: 500, lineHeight: '1.15', marginBottom: '12px', fontVariationSettings: '"opsz" 96' }}>
                Want deeper analysis on a specific branch?
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', marginBottom: '22px' }}>
                Our Intelligence Reports provide verified session counts, operator commentary, and strategic recommendations tailored to individual branches.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="/intelligence"
                  className="font-mono"
                  style={{
                    display: 'inline-block',
                    padding: '13px 22px',
                    background: 'var(--accent)',
                    color: 'var(--paper)',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--accent)',
                    transition: 'all .2s'
                  }}
                >
                  Explore Intelligence Reports
                </a>
                <a
                  href="/insider"
                  className="font-mono"
                  style={{
                    display: 'inline-block',
                    padding: '13px 22px',
                    background: 'transparent',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--ink)',
                    transition: 'all .2s'
                  }}
                >
                  Subscribe to Insider
                </a>
              </div>
            </div>
          </section>

          {/* CLOSING */}
          <section style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
            <div className="font-fraunces" style={{ maxWidth: 'var(--col)', fontSize: '19px', color: 'var(--ink)', lineHeight: '1.55' }}>
              <p>
                The Post Office doesn't publish these rates publicly. They go out through Branch Hub, marked "Postmaster – Confidential," visible only to existing Postmasters. That's one of the reasons buyers routinely pay the wrong price for branches: the people selling them have access to information the people buying them don't. Part of what FCM Intelligence does is close that gap. If this was useful and you're looking at a branch this year, <strong>subscribe to Insider</strong> — we'll send you this kind of analysis before most of the market even knows it exists.
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ borderTop: '1px solid var(--rule)', marginTop: '80px', padding: '40px 28px 60px', fontSize: '12px', color: 'var(--ink-3)', background: 'var(--paper-2)' }}>
            <div style={{ maxWidth: 'var(--max)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
              <div>© 2026 FCM Intelligence · Reports & Listings for serious UK Post Office buyers</div>
              <div>
                <a href="/reports" style={{ color: 'var(--ink-2)', textDecoration: 'none', marginRight: '16px' }}>Reports</a>
                <a href="/opportunities" style={{ color: 'var(--ink-2)', textDecoration: 'none', marginRight: '16px' }}>Opportunities</a>
                <a href="/insider" style={{ color: 'var(--ink-2)', textDecoration: 'none', marginRight: '16px' }}>Insider</a>
                <a href="/support" style={{ color: 'var(--ink-2)', textDecoration: 'none' }}>Support</a>
              </div>
            </div>
            <div style={{ maxWidth: 'var(--max)', margin: '20px auto 0', fontSize: '11px', color: 'var(--ink-3)', lineHeight: '1.55' }}>
              This analysis is based on the Post Office Branch Remuneration Rates Booklet 2026/27 (v1.0, 30 March 2026) and the Remuneration Changes 2026 commentary document. FCM Intelligence is not affiliated with Post Office Ltd. Rates stated are facts; commentary is our interpretation. Always verify figures against the source booklet or your own Branch Hub access before making commercial decisions. This is not legal or financial advice.
            </div>
          </footer>

        </div>
      </AppLayout>
    </>
  );
}
