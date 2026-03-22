"use client";

import Link from "next/link";
import { useState } from "react";

const NAME_MAX = 60;

function validateName(name: string) {
  if (name.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer`;
  return null;
}

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Enter a valid email address";
  return null;
}

function validatePassword(password: string) {
  if (password.length < 14) return "At least 14 characters";
  if (!/[A-Z]/.test(password)) return "At least 1 uppercase letter";
  if (!/[0-9]/.test(password)) return "At least 1 number";
  if (!/[^A-Za-z0-9]/.test(password)) return "At least 1 special character";
  return null;
}

function validateConfirm(password: string, confirm: string) {
  if (confirm && password !== confirm) return "Passwords do not match";
  return null;
}

type Fields = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

type Touched = Record<keyof Fields, boolean>;

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-background text-primary placeholder-secondary/60 text-sm focus:outline-none focus:ring-2 transition";

function inputClass(error: string | null, touched: boolean) {
  if (!touched) return `${inputBase} border-background focus:ring-primary/30 focus:border-primary`;
  if (error) return `${inputBase} border-expense/60 focus:ring-expense/20 focus:border-expense`;
  return `${inputBase} border-income focus:ring-income/30 focus:border-income`;
}

export default function SignupPage() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState<Touched>({ name: false, email: false, password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const errors = {
    name: validateName(fields.name),
    email: validateEmail(fields.email),
    password: validatePassword(fields.password),
    confirm: validateConfirm(fields.password, fields.confirm),
  };

  const isValid = !errors.name && !errors.email && !errors.password && !errors.confirm &&
    fields.name.trim() !== "" && fields.email !== "" && fields.password !== "" && fields.confirm !== "";

  function handleChange(field: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields.name.trim(), email: fields.email, password: fields.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordRules = [
    { label: "14+ characters", met: fields.password.length >= 14 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(fields.password) },
    { label: "1 number", met: /[0-9]/.test(fields.password) },
    { label: "1 special character", met: /[^A-Za-z0-9]/.test(fields.password) },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-base">F</span>
        </div>
        <span className="text-primary font-bold text-2xl">FinTrack</span>
      </Link>

      {/* Card */}
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Create your account</h1>
        <p className="text-secondary text-sm mb-8">Start tracking your finances for free</p>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-income/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#1a7a52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-primary mb-2">Check your inbox</h2>
            <p className="text-secondary text-sm">We sent a verification link to <span className="font-medium text-primary">{fields.email}</span>. Click it to activate your account.</p>
            <Link href="/login" className="inline-block mt-6 text-sm text-primary font-semibold hover:underline">Back to Log In</Link>
          </div>
        ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <label htmlFor="name" className="text-sm font-medium text-primary">Full Name</label>
              <span className={`text-xs ${fields.name.length > NAME_MAX ? "text-expense" : "text-secondary"}`}>
                {fields.name.length}/{NAME_MAX}
              </span>
            </div>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={fields.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputClass(errors.name, touched.name)}
            />
            {touched.name && errors.name && (
              <p className="text-xs text-expense">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputClass(errors.email, touched.email)}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-expense">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-primary">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={fields.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={inputClass(errors.password, touched.password)}
            />
            {/* Password rules checklist */}
            {touched.password && (
              <ul className="flex flex-col gap-1 mt-1">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className="flex items-center gap-2 text-xs">
                    <span className={rule.met ? "text-[#1a7a52]" : "text-expense"}>
                      {rule.met ? "✓" : "✗"}
                    </span>
                    <span className={rule.met ? "text-[#1a7a52]" : "text-expense"}>{rule.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-password" className="text-sm font-medium text-primary">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={fields.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              className={inputClass(errors.confirm, touched.confirm)}
            />
            {touched.confirm && errors.confirm && (
              <p className="text-xs text-expense">{errors.confirm}</p>
            )}
            {touched.confirm && !errors.confirm && fields.confirm && (
              <p className="text-xs text-[#1a7a52]">Passwords match</p>
            )}
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
            {loading ? "Creating account…" : "Create Account"}
          </button>

        </form>
        )}

        {!success && (
          <p className="text-center text-sm text-secondary mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        )}
      </div>

      <p className="text-xs text-secondary mt-8">© 2026 FinTrack. All rights reserved.</p>

    </div>
  );
}
