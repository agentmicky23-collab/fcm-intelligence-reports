"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams?.get("token");
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found.");
      return;
    }

    // Sign in with the magic link token
    signIn("magic-link", {
      token,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        setStatus("error");
        setErrorMessage("This link has expired or is invalid. Please request a new one.");
      } else {
        setStatus("success");
        // Redirect to opportunities after successful sign-in
        setTimeout(() => {
          router.push("/opportunities");
        }, 1500);
      }
    }).catch(() => {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    });
  }, [searchParams, router]);

  return (
    <div
      className="rounded-xl p-8"
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
    >
      {status === "verifying" && (
        <div className="text-center py-4">
          <div className="text-5xl mb-4 animate-pulse">🔐</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
            Verifying your link...
          </h2>
          <p style={{ color: "#8b949e" }}>Please wait a moment.</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
            You&apos;re signed in!
          </h2>
          <p style={{ color: "#8b949e" }}>
            Redirecting to opportunities...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
            Verification failed
          </h2>
          <p className="mb-6" style={{ color: "#8b949e" }}>
            {errorMessage}
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#FFD700", color: "#000000" }}
          >
            Request New Link
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)" }}
    >
      <div className="w-full max-w-md text-center">
        <Suspense
          fallback={
            <div className="text-center py-8" style={{ color: "#8b949e" }}>
              Loading...
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
