"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-background text-primary placeholder-secondary/60 text-sm focus:outline-none focus:ring-2 transition";

function inputClass(error: string | null, touched: boolean) {
  if (!touched) return `${inputBase} border-background focus:ring-primary/30 focus:border-primary`;
  if (error) return `${inputBase} border-expense/60 focus:ring-expense/20 focus:border-expense`;
  return `${inputBase} border-income focus:ring-income/30 focus:border-income`;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailError = emailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Enter a valid email address"
    : null;

  const isValid = !emailError && email !== "" && password !== "";

  const verified = searchParams.get("verified") === "1";
  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setServerError(null);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (!result || result.error) {
      const check = await fetch("/api/auth/check-verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const { status } = await check.json();
      if (status === "unverified") {
        setServerError("Your email is not verified. Please check your inbox for the verification link.");
      } else {
        setServerError("Invalid email or password.");
      }
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-base">F</span>
        </div>
        <span className="text-primary font-bold text-2xl">FinTrack</span>
      </Link>

      {/* Card */}
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>
        <p className="text-secondary text-sm mb-8">Log in to your FinTrack account</p>

        {verified && (
          <p className="text-sm text-[#1a7a52] bg-income/20 rounded-xl px-4 py-3 mb-2">
            Email verified! You can now log in.
          </p>
        )}
        {urlError === "CredentialsSignin" && !serverError && (
          <p className="text-sm text-expense bg-expense/10 rounded-xl px-4 py-3 mb-2">
            Invalid email or password.
          </p>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }}
              className={inputClass(emailError, emailTouched)}
            />
            {emailError && (
              <p className="text-xs text-expense">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-primary">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-secondary hover:text-primary transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} border-background focus:ring-primary/30 focus:border-primary`}
            />
          </div>

          {serverError && (
            <p className="text-sm text-expense bg-expense/10 rounded-xl px-4 py-3">{serverError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl transition-colors mt-1 shadow-sm
              enabled:hover:bg-[#2d2d7a] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>

        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      <p className="text-xs text-secondary mt-8">© 2026 FinTrack. All rights reserved.</p>

    </div>
  );
}
