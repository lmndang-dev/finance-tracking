"use client";

import Link from "next/link";
import { useState } from "react";

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-background text-primary placeholder-secondary/60 text-sm focus:outline-none focus:ring-2 transition";

function inputClass(error: string | null, touched: boolean) {
  if (!touched) return `${inputBase} border-background focus:ring-primary/30 focus:border-primary`;
  if (error) return `${inputBase} border-expense/60 focus:ring-expense/20 focus:border-expense`;
  return `${inputBase} border-income focus:ring-income/30 focus:border-income`;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");

  const emailError = emailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Enter a valid email address"
    : null;

  const isValid = !emailError && email !== "" && password !== "";

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

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>

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
              <Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">
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

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl transition-colors mt-1 shadow-sm
              enabled:hover:bg-[#2d2d7a] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Log In
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
