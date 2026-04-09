'use client';

import { useState, useCallback } from 'react';
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

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const displayRows = results ? 
    (showAllRows ? results.processedRows : results.processedRows.filter(r => Math.abs(r.delta) > 0.01)) 
    : [];

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#c9a227' }}>
              Remuneration Calculator 2026/27
            </h1>
            <p className="text-xl" style={{ color: '#8b949e' }}>
              The Post Office rewrote every transaction rate on 30 March 2026. Upload your monthly statement and see exactly what the new rates mean for your branch.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="mb-8 p-4 rounded-lg border" style={{ background: 'rgba(56, 139, 253, 0.1)', borderColor: '#388bfd' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-bold mb-1">100% Client-Side Processing</h3>
                <p className="text-sm" style={{ color: '#8b949e' }}>
                  Your data is processed entirely in your browser. No data is uploaded, stored, or transmitted. When you close this page, your data is gone.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          {uploadState !== 'success' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="mb-8 p-12 rounded-lg border-2 border-dashed transition-all cursor-pointer"
              style={{
                background: dragActive ? 'rgba(201, 162, 39, 0.1)' : '#161b22',
                borderColor: dragActive ? '#c9a227' : '#30363d'
              }}
            >
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-2">
                  {uploadState === 'uploading' ? 'Processing...' : 'Drop your statement here'}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#8b949e' }}>
                  or click to browse • .xlsx or .csv • max 1MB
                </p>
                <div className="mt-4 p-4 rounded-lg text-left max-w-lg mx-auto" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#c9d1d9' }}>Where do I get this file?</p>
                  <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: '#8b949e' }}>
                    <li>Log in to <strong style={{ color: '#c9d1d9' }}>Branch Hub</strong> (the Post Office ServiceNow portal)</li>
                    <li>Go to <strong style={{ color: '#c9d1d9' }}>Remuneration</strong> → <strong style={{ color: '#c9d1d9' }}>Monthly Statements</strong></li>
                    <li>Select any recent month and click <strong style={{ color: '#c9d1d9' }}>Export to Excel</strong></li>
                    <li>Upload the downloaded .xlsx file here</li>
                  </ol>
                  <p className="text-xs mt-2" style={{ color: '#6e7681' }}>The file is usually called something like <code style={{ color: '#c9a227' }}>sn_customerservice_rem_monthly_statement.xlsx</code></p>
                </div>
                {errorMessage && (
                  <div className="mt-4 p-3 rounded" style={{ background: 'rgba(248, 81, 73, 0.1)', color: '#f85149' }}>
                    {errorMessage}
                  </div>
                )}
              </label>
            </div>
          )}

          {/* Results Section */}
          {results && uploadState === 'success' && (
            <div className="space-y-8">
              {/* Branch Info Bar */}
              <div className="p-4 rounded-lg" style={{ background: '#161b22', borderLeft: '4px solid #c9a227' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ color: '#8b949e' }}>Contract Type</div>
                    <div className="font-bold text-lg capitalize">{results.branch.contractType}</div>
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: '#8b949e' }}>Period</div>
                    <div className="font-bold text-lg">{results.branch.period}</div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadState('idle');
                      setResults(null);
                    }}
                    className="px-4 py-2 rounded hover:opacity-80 transition-opacity"
                    style={{ background: '#30363d' }}
                  >
                    Upload Different File
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                  <div className="text-sm mb-2" style={{ color: '#8b949e' }}>Old Total</div>
                  <div className="text-3xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {formatCurrency(results.summary.oldSubtotal)}
                  </div>
                </div>
                <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '2px solid #c9a227' }}>
                  <div className="text-sm mb-2" style={{ color: '#8b949e' }}>New Total</div>
                  <div className="text-3xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#c9a227' }}>
                    {formatCurrency(results.summary.newSubtotal)}
                  </div>
                </div>
                <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                  <div className="text-sm mb-2" style={{ color: '#8b949e' }}>Net Delta</div>
                  <div className="text-3xl font-bold" style={{ 
                    fontFamily: 'JetBrains Mono, monospace', 
                    fontVariantNumeric: 'tabular-nums',
                    color: results.summary.netDelta >= 0 ? '#3fb950' : '#f85149'
                  }}>
                    {formatCurrency(results.summary.netDelta)}
                  </div>
                  <div className="text-sm mt-1" style={{ color: '#8b949e' }}>
                    {formatPercent(results.summary.netDeltaPercent)}
                  </div>
                </div>
              </div>

              {/* Variable vs Fixed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                  <h3 className="text-lg font-bold mb-4">Variable Remuneration</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: '#8b949e' }}>Old:</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(results.summary.variableOld)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#8b949e' }}>New:</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(results.summary.variableNew)}
                      </span>
                    </div>
                    <div className="pt-2 border-t flex justify-between" style={{ borderColor: '#30363d' }}>
                      <span className="font-bold">Delta:</span>
                      <span className="font-bold" style={{ 
                        fontFamily: 'JetBrains Mono, monospace',
                        color: (results.summary.variableNew - results.summary.variableOld) >= 0 ? '#3fb950' : '#f85149'
                      }}>
                        {formatCurrency(results.summary.variableNew - results.summary.variableOld)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                  <h3 className="text-lg font-bold mb-4">Fixed Remuneration</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: '#8b949e' }}>Old:</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(results.summary.fixedOld)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#8b949e' }}>New:</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(results.summary.fixedNew)}
                      </span>
                    </div>
                    <div className="pt-2 border-t flex justify-between" style={{ borderColor: '#30363d' }}>
                      <span className="font-bold">Delta:</span>
                      <span className="font-bold" style={{ 
                        fontFamily: 'JetBrains Mono, monospace',
                        color: (results.summary.fixedNew - results.summary.fixedOld) >= 0 ? '#3fb950' : '#f85149'
                      }}>
                        {formatCurrency(results.summary.fixedNew - results.summary.fixedOld)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-lg font-bold mb-4">Adjustments</h3>
                <div className="space-y-4">
                  {(results.branch.contractType === 'mains' || results.branch.contractType === 'local') && (
                    <>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={applyMBSP}
                          onChange={(e) => {
                            setApplyMBSP(e.target.checked);
                            setTimeout(recalculate, 0);
                          }}
                          className="w-5 h-5"
                        />
                        <div>
                          <div className="font-semibold">MBSP (4% of variable)</div>
                          <div className="text-sm" style={{ color: '#8b949e' }}>Optional Member Branch Support Payment</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={applyRSP}
                          onChange={(e) => {
                            setApplyRSP(e.target.checked);
                            setTimeout(recalculate, 0);
                          }}
                          className="w-5 h-5"
                        />
                        <div>
                          <div className="font-semibold">RSP (£416.67/month)</div>
                          <div className="text-sm" style={{ color: '#8b949e' }}>Optional Rural Support Payment</div>
                        </div>
                      </label>
                    </>
                  )}
                  <div>
                    <label className="block mb-2">
                      <span className="font-semibold">Bill Payment Reseller Mix: {resellerPct}%</span>
                      <div className="text-sm mb-2" style={{ color: '#8b949e' }}>
                        Estimated % of bill payments that are reseller contracts (PayPoint, PayZone) vs direct utilities
                      </div>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={resellerPct}
                      onChange={(e) => setResellerPct(parseInt(e.target.value))}
                      onMouseUp={recalculate}
                      onTouchEnd={recalculate}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: '#8b949e' }}>
                      <span>0% (all utility)</span>
                      <span>100% (all reseller)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 10 Movers */}
              <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Top 10 Movers</h3>
                <div className="space-y-3">
                  {results.topMovers.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-8 text-right font-bold" style={{ color: '#8b949e' }}>#{idx + 1}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{row.name}</div>
                        <div className="text-sm" style={{ color: '#8b949e' }}>{row.category}</div>
                      </div>
                      <div className="w-48">
                        <div className="h-8 rounded overflow-hidden" style={{ background: '#0d1117' }}>
                          <div
                            className="h-full flex items-center justify-end px-2 text-sm font-bold transition-all"
                            style={{
                              width: `${Math.min(100, (Math.abs(row.delta) / Math.abs(results.topMovers[0].delta)) * 100)}%`,
                              background: row.delta >= 0 ? '#3fb950' : '#f85149',
                              fontFamily: 'JetBrains Mono, monospace'
                            }}
                          >
                            {formatCurrency(row.delta)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Rollup */}
              <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Category Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(results.categoryTotals)
                    .sort((a, b) => Math.abs(b[1].delta) - Math.abs(a[1].delta))
                    .map(([category, totals]) => (
                      <div key={category} className="p-4 rounded" style={{ background: '#0d1117' }}>
                        <div className="font-semibold mb-2">{category}</div>
                        <div className="text-sm space-y-1" style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                          <div className="flex justify-between" style={{ color: '#8b949e' }}>
                            <span>Old:</span>
                            <span>{formatCurrency(totals.oldTotal)}</span>
                          </div>
                          <div className="flex justify-between" style={{ color: '#8b949e' }}>
                            <span>New:</span>
                            <span>{formatCurrency(totals.newTotal)}</span>
                          </div>
                          <div className="flex justify-between font-bold" style={{ color: totals.delta >= 0 ? '#3fb950' : '#f85149' }}>
                            <span>Δ:</span>
                            <span>{formatCurrency(totals.delta)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Uncertain Rows Warning */}
              {results.uncertainRows.length > 0 && (
                <div className="p-4 rounded-lg border" style={{ background: 'rgba(187, 128, 9, 0.1)', borderColor: '#bb8009' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h3 className="font-bold mb-1">Uncertain Calculations</h3>
                      <p className="text-sm mb-3" style={{ color: '#8b949e' }}>
                        {results.uncertainRows.length} line(s) could not be calculated accurately and are held at old values. See details in the full table below.
                      </p>
                      <details>
                        <summary className="cursor-pointer text-sm font-semibold" style={{ color: '#bb8009' }}>
                          Show affected lines
                        </summary>
                        <ul className="mt-2 space-y-1 text-sm">
                          {results.uncertainRows.map((row, idx) => (
                            <li key={idx}>
                              <span className="font-semibold">{row.name}</span> — {row.uncertainNote}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Line Item Table */}
              <div className="p-6 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Line Items</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAllRows}
                      onChange={(e) => setShowAllRows(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Show unchanged lines</span>
                  </label>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #30363d' }}>
                        <th className="text-left p-2" style={{ color: '#8b949e' }}>Ref</th>
                        <th className="text-left p-2" style={{ color: '#8b949e' }}>Name</th>
                        <th className="text-left p-2" style={{ color: '#8b949e' }}>Category</th>
                        <th className="text-right p-2" style={{ color: '#8b949e' }}>Old Amount</th>
                        <th className="text-right p-2" style={{ color: '#8b949e' }}>New Amount</th>
                        <th className="text-right p-2" style={{ color: '#8b949e' }}>Delta</th>
                        <th className="text-right p-2" style={{ color: '#8b949e' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={row.isUncertain ? 'bg-yellow-900 bg-opacity-20' : ''}
                          style={{ borderBottom: '1px solid #21262d' }}
                        >
                          <td className="p-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.salesRef}</td>
                          <td className="p-2">
                            {row.name}
                            {row.isUncertain && <span className="ml-2 text-xs" style={{ color: '#bb8009' }}>⚠️</span>}
                          </td>
                          <td className="p-2 text-xs" style={{ color: '#8b949e' }}>{row.category}</td>
                          <td className="p-2 text-right" style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                            {formatCurrency(row.oldAmount)}
                          </td>
                          <td className="p-2 text-right" style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
                            {formatCurrency(row.newAmount)}
                          </td>
                          <td
                            className="p-2 text-right font-semibold"
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontVariantNumeric: 'tabular-nums',
                              color: row.delta >= 0 ? '#3fb950' : '#f85149'
                            }}
                          >
                            {formatCurrency(row.delta)}
                          </td>
                          <td
                            className="p-2 text-right text-xs"
                            style={{ color: row.delta >= 0 ? '#3fb950' : '#f85149' }}
                          >
                            {formatPercent(row.deltaPercent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!showAllRows && (
                  <div className="mt-4 text-center text-sm" style={{ color: '#8b949e' }}>
                    Showing {displayRows.length} changed lines • {results.processedRows.length - displayRows.length} unchanged
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="p-6 rounded-lg border" style={{ background: 'rgba(187, 128, 9, 0.05)', borderColor: '#bb8009' }}>
                <h3 className="font-bold mb-2 text-lg">⚖️ ILLUSTRATION ONLY</h3>
                <p className="text-sm" style={{ color: '#8b949e' }}>
                  This tool provides an indicative projection based on published rate changes. It is <strong>not financial advice</strong>. 
                  Actual remuneration depends on your branch's specific trading patterns, OEI score, and Post Office Ltd's application of the new rates.
                  For a detailed branch-specific analysis including verified session counts and operator commentary, see our Intelligence Reports.
                </p>
              </div>

              {/* CTA */}
              <div className="text-center p-8 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(201, 162, 39, 0.05))' }}>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Want a deeper analysis?
                </h3>
                <p className="mb-6" style={{ color: '#8b949e' }}>
                  Our Intelligence Reports provide verified session counts, operator commentary, and strategic recommendations tailored to your branch.
                </p>
                <a
                  href="/intelligence"
                  className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: '#c9a227', color: '#0d1117' }}
                >
                  Explore Intelligence Reports →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
