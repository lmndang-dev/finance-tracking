"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-background text-primary placeholder-secondary/60 text-sm focus:outline-none focus:ring-2 transition";

function validatePassword(password: string) {
  if (password.length < 14) return "At least 14 characters";
  if (!/[A-Z]/.test(password)) return "At least 1 uppercase letter";
  if (!/[0-9]/.test(password)) return "At least 1 number";
  if (!/[^A-Za-z0-9]/.test(password)) return "At least 1 special character";
  return null;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwTouched, setPwTouched] = useState(false);
  const [cfTouched, setCfTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pwError = validatePassword(password);
  const cfError = cfTouched && confirm && password !== confirm ? "Passwords do not match" : null;
  const isValid = !pwError && !cfError && password !== "" && confirm !== "";

  const passwordRules = [
    { label: "14+ characters", met: password.length >= 14 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "1 number", met: /[0-9]/.test(password) },
    { label: "1 special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-surface rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-expense font-medium mb-4">Invalid or missing reset link.</p>
          <Link href="/forgot-password" className="text-primary font-semibold hover:underline text-sm">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "Something went wrong.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-primary mb-2">Password reset!</h2>
            <p className="text-secondary text-sm">Redirecting you to log in…</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-1">Set new password</h1>
            <p className="text-secondary text-sm mb-8">Choose a strong password for your account.</p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-primary">New Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPwTouched(true); }}
                  className={`${inputBase} ${
                    !pwTouched
                      ? "border-background focus:ring-primary/30 focus:border-primary"
                      : pwError
                      ? "border-expense/60 focus:ring-expense/20 focus:border-expense"
                      : "border-income focus:ring-income/30 focus:border-income"
                  }`}
                />
                {pwTouched && (
                  <ul className="flex flex-col gap-1 mt-1">
                    {passwordRules.map((rule) => (
                      <li key={rule.label} className="flex items-center gap-2 text-xs">
                        <span className={rule.met ? "text-[#1a7a52]" : "text-expense"}>{rule.met ? "✓" : "✗"}</span>
                        <span className={rule.met ? "text-[#1a7a52]" : "text-expense"}>{rule.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm" className="text-sm font-medium text-primary">Confirm Password</label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setCfTouched(true); }}
                  className={`${inputBase} ${
                    !cfTouched
                      ? "border-background focus:ring-primary/30 focus:border-primary"
                      : cfError
                      ? "border-expense/60 focus:ring-expense/20 focus:border-expense"
                      : confirm
                      ? "border-income focus:ring-income/30 focus:border-income"
                      : "border-background focus:ring-primary/30 focus:border-primary"
                  }`}
                />
                {cfError && <p className="text-xs text-expense">{cfError}</p>}
                {cfTouched && !cfError && confirm && (
                  <p className="text-xs text-[#1a7a52]">Passwords match</p>
                )}
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
                {loading ? "Saving…" : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="text-xs text-secondary mt-8">© 2026 FinTrack. All rights reserved.</p>
    </div>
  );
}
