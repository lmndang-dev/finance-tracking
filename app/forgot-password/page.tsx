"use client";

import Link from "next/link";
import { useState } from "react";

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-background text-primary placeholder-secondary/60 text-sm focus:outline-none focus:ring-2 transition";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailError = touched && !EMAIL_RE.test(email) ? "Enter a valid email address" : null;
  const isValid = !emailError && email !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-base">F</span>
        </div>
        <span className="text-primary font-bold text-2xl">FinTrack</span>
      </Link>

      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg p-8">
        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-income/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#1a7a52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-primary mb-2">Check your email</h2>
            <p className="text-secondary text-sm">
              If an account exists for <span className="font-medium text-primary">{email}</span>, we sent a password reset link. Check your inbox.
            </p>
            <Link href="/login" className="inline-block mt-6 text-sm text-primary font-semibold hover:underline">
              Back to Log In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-1">Forgot password?</h1>
            <p className="text-secondary text-sm mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setTouched(true); }}
                  className={`${inputBase} ${
                    !touched
                      ? "border-background focus:ring-primary/30 focus:border-primary"
                      : emailError
                      ? "border-expense/60 focus:ring-expense/20 focus:border-expense"
                      : "border-income focus:ring-income/30 focus:border-income"
                  }`}
                />
                {emailError && <p className="text-xs text-expense">{emailError}</p>}
              </div>

              {serverError && (
                <p className="text-sm text-expense bg-expense/10 rounded-xl px-4 py-3">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl transition-colors shadow-sm
                  enabled:hover:bg-[#2d2d7a] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-secondary mt-6">
              Remember your password?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">Log In</Link>
            </p>
          </>
        )}
      </div>

      <p className="text-xs text-secondary mt-8">© 2026 FinTrack. All rights reserved.</p>
    </div>
  );
}
