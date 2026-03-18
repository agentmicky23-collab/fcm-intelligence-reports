"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") ?? null;

  const errorMessages: Record<string, { title: string; message: string }> = {
    Configuration: {
      title: "Server Error",
      message: "There's a problem with the server configuration. Please try again later.",
    },
    AccessDenied: {
      title: "Access Denied",
      message: "You don't have permission to sign in.",
    },
    Verification: {
      title: "Link Expired",
      message: "The magic link has expired or has already been used. Please request a new one.",
    },
    Default: {
      title: "Something went wrong",
      message: "An error occurred during authentication. Please try again.",
    },
  };

  const { title, message } = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div
      className="rounded-xl p-8"
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="text-5xl mb-4">⚠️</div>
      <h1
        className="text-2xl font-bold mb-3"
        style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
      >
        {title}
      </h1>
      <p className="mb-6" style={{ color: "#8b949e" }}>
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-center"
          style={{ background: "#FFD700", color: "#000000" }}
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80 text-center"
          style={{
            background: "transparent",
            color: "#8b949e",
            border: "1px solid #30363d",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)" }}
    >
      <div className="w-full max-w-md text-center">
        <Suspense
          fallback={
            <div className="text-center" style={{ color: "#8b949e" }}>
              Loading...
            </div>
          }
        >
          <ErrorContent />
        </Suspense>

        <p className="mt-6 text-sm" style={{ color: "#8b949e" }}>
          Need help?{" "}
          <a
            href="mailto:support@fcmgt.co.uk"
            className="hover:underline"
            style={{ color: "#FFD700" }}
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
