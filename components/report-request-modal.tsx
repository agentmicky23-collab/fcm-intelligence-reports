"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ReportTier = "insight" | "intelligence";

interface ListingInfo {
  name: string;
  location?: string;
  postcode?: string;
  town?: string;
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

const TIER_INFO: Record<ReportTier, { name: string; price: number; description: string; sections: string; recommended?: boolean }> = {
  insight: { name: "Insight Report", price: 199, sections: "10 sections", description: "Is this the right business?" },
  intelligence: { name: "Intelligence Report", price: 499, sections: "15 sections + strategy call", description: "Help me buy it.", recommended: true },
};

const LISTING_SOURCES = ["Daltons", "RightBiz", "Christie & Co", "Other"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"
];
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png"
];

export function ReportRequestModal({ isOpen, onClose, tier = "intelligence", listing }: ReportRequestModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ReportTier>(tier);
  const [inputMode, setInputMode] = useState<"url" | "manual">(listing ? "manual" : "url");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Business details
  const [listingUrl, setListingUrl] = useState(listing?.url || "");
  const [businessName, setBusinessName] = useState(listing?.name || "");
  const [postcode, setPostcode] = useState(listing?.postcode || listing?.location || "");
  const [townCity, setTownCity] = useState(listing?.town || "");
  const [companyName, setCompanyName] = useState("");
  const [listingSource, setListingSource] = useState(listing?.source || "Daltons");

  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Disclaimer
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Step 3: Customer details
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Step 2: Information checkboxes
  const [hasFinancials, setHasFinancials] = useState(false);
  const [hasAskingPrice, setHasAskingPrice] = useState(false);
  const [hasLeaseTerms, setHasLeaseTerms] = useState(false);
  const [hasStaffInfo, setHasStaffInfo] = useState(false);
  const [hasTurnover, setHasTurnover] = useState(false);
  const [hasPoRemuneration, setHasPoRemuneration] = useState(false);
  const [hasNone, setHasNone] = useState(false);

  // Mount state for SSR safety - MUST be first useEffect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill from listing if provided
  useEffect(() => {
    if (listing) {
      setBusinessName(listing.name || "");
      setPostcode(listing.postcode || listing.location || "");
      setTownCity(listing.town || "");
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

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        alert(`${file.name} is not an accepted file type.`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

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
      if (!townCity.trim()) {
        newErrors.townCity = "Town/City is required";
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
      // If files are uploaded, send them via email first
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('tier', selectedTier);
        formData.append('business_name', businessName);
        formData.append('postcode', postcode);
        formData.append('town_city', townCity);
        formData.append('company_name', companyName);
        formData.append('listing_source', listingSource);
        formData.append('listing_url', listingUrl);
        formData.append('customer_email', customerEmail);
        formData.append('customer_phone', customerPhone);

        const uploadRes = await fetch('/api/upload-documents', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          console.error('Document upload error:', uploadError);
          // Continue with checkout even if upload fails - we'll note it
        }
      }

      const payload = {
        tier: selectedTier,
        listing_url: inputMode === "url" ? listingUrl : "",
        business_name: businessName,
        postcode: postcode,
        town_city: townCity,
        company_name: companyName,
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
        has_uploaded_files: files.length > 0,
        uploaded_file_names: files.map(f => f.name).join(', '),
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

  // Don't render until mounted (SSR safety) or if not open
  if (!mounted || !isOpen) return null;

  const tierInfo = TIER_INFO[selectedTier];

  // Modal content - will be portaled to document.body
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark backdrop - clicking this closes modal */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content - centered, doesn't close when clicked */}
      <div
        className="relative z-10 w-full max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0a0a0a",
          border: "1px solid #333",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
        }}
        onClick={(e) => e.stopPropagation()}
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
                      {/* Business Name */}
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
                        <p className="text-xs text-gray-500 mt-1.5 italic">
                          Exact name helps us identify the correct branch
                        </p>
                        {errors.businessName && (
                          <p className="text-sm mt-1 text-red-500">{errors.businessName}</p>
                        )}
                      </div>

                      {/* Postcode & Town/City */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Postcode <span className="text-red-500">*</span>
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
                          <p className="text-xs text-gray-500 mt-1.5 italic">
                            For demographics, crime data & competition mapping
                          </p>
                          {errors.postcode && (
                            <p className="text-sm mt-1 text-red-500">{errors.postcode}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Town/City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={townCity}
                            onChange={(e) => setTownCity(e.target.value)}
                            placeholder="e.g., Keith"
                            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                            style={{
                              background: "#1a1a1a",
                              border: errors.townCity ? "2px solid #ef4444" : "1px solid #333",
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1.5 italic">
                            Helps verify & cross-reference location
                          </p>
                          {errors.townCity && (
                            <p className="text-sm mt-1 text-red-500">{errors.townCity}</p>
                          )}
                        </div>
                      </div>

                      {/* Company Name & Listing Source */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Company Name (if Ltd)
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g., Keith Retail Ltd"
                            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                            style={{
                              background: "#1a1a1a",
                              border: "1px solid #333",
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1.5 italic">
                            Lets us pull official accounts from Companies House
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Listing Source <span className="text-red-500">*</span>
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
                          <p className="text-xs text-gray-500 mt-1.5 italic">
                            So we can find and verify the listing details
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 2: WHAT INFORMATION DO YOU HAVE? + FILE UPLOAD       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: "#FFD700", color: "#000" }}>
                2
              </span>
              <h3 className="text-lg font-semibold text-white">WHAT INFORMATION DO YOU HAVE?</h3>
            </div>
            <div className="h-px w-full mb-5" style={{ background: "#333" }} />

            <p className="text-gray-400 text-sm mb-4">
              The more you share, the more detailed your report. Tick anything you can provide:
            </p>

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

            {/* FILE UPLOAD — combined into Step 2 */}
            <div className="mt-6 pt-5" style={{ borderTop: "1px dashed #333" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📎</span>
                <h4 className="text-base font-medium text-white">UPLOAD SUPPORTING DOCUMENTS</h4>
                <span className="text-sm text-gray-500">(Optional)</span>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Have information from the broker? Upload it here for a more detailed report.
              </p>

              {/* Drop zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                  dragActive ? "border-yellow-500 bg-yellow-500/10" : "border-zinc-600 hover:border-zinc-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-zinc-400">
                  <span className="text-yellow-500 font-medium">📎 Drop files here</span> or click to upload
                </div>
                <div className="text-sm text-zinc-500 mt-2">
                  PDF, DOC, XLS, JPG, PNG (Max 10MB each)
                </div>
              </div>

              {/* Selected files list */}
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-zinc-400 mb-2">Selected files:</p>
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: "#1a1a1a", border: "1px solid #333" }}
                      >
                        <div className="flex items-center gap-2 text-sm text-white">
                          <span>{getFileIcon(file.name)}</span>
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          <span className="text-zinc-500">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-500 mt-3">
                Examples: Email correspondence, company accounts, broker info packs, lease agreements, PO remuneration statements
              </p>

              {/* Financial Data Notice — shown for both tiers (both accept uploads) */}
              {(selectedTier === "insight" || selectedTier === "intelligence") && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-base">📋</span>
                    <span className="text-sm font-medium text-white">How we handle your financial documents</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed ml-6">
                    Any documents you upload are used solely to prepare your report. 
                    We do not share your documents with any third party. All uploaded files 
                    are permanently deleted within 30 days of report delivery.
                  </p>
                  <p className="text-sm text-gray-400 mt-2 ml-6">
                    For full details, see our{' '}
                    <a href="/privacy" target="_blank" className="underline hover:text-white transition-colors" style={{ color: "#FFD700" }}>
                      Privacy Policy
                    </a>.
                  </p>
                </div>
              )}
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
          {/* STEP 4: SELECT REPORT TYPE (conversion decision point)    */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: "#FFD700", color: "#000" }}>
                4
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
                      <div className="text-sm text-gray-400 mt-0.5">
                        {info.sections} — {info.description}
                      </div>
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
          {/* DISCLAIMER CHECKBOX */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mb-6">
            <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all" style={{ border: disclaimerAccepted ? "1px solid #FFD700" : "1px solid #333", background: disclaimerAccepted ? "rgba(255, 215, 0, 0.05)" : "transparent" }}>
              <div className="mt-0.5 flex-shrink-0">
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: disclaimerAccepted ? "#FFD700" : "#555",
                    background: disclaimerAccepted ? "#FFD700" : "transparent",
                  }}
                >
                  {disclaimerAccepted && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="sr-only"
                />
              </div>
              <span className="text-sm text-gray-300 leading-relaxed">
                I confirm that I have read and agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors" style={{ color: "#FFD700" }} onClick={(e) => e.stopPropagation()}>
                  Terms of Service
                </a>{' '}
                and understand that this report is for informational purposes only. It does not constitute financial, legal, or investment advice, and I am solely responsible for my own due diligence and acquisition decisions.
              </span>
            </label>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SUBMIT BUTTON */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="pt-4 border-t" style={{ borderColor: "#333" }}>
            <button
              type="submit"
              disabled={loading || !disclaimerAccepted}
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

  // Use portal to render to document.body - bypasses stacking context issues
  return createPortal(modalContent, document.body);
}
