"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Tab = "login" | "signup";
type SignupStep = "form" | "verify";

export default function AuthModal({
  onClose,
  initialTab = "signup",
}: {
  onClose: () => void;
  initialTab?: Tab;
}) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Signup step
  const [signupStep, setSignupStep] = useState<SignupStep>("form");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Verification code (6 individual digits)
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setError("");
    setSignupStep("form");
    setCodeDigits(["", "", "", "", "", ""]);
    setResendCooldown(0);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  // Handle individual code digit input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...codeDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setCodeDigits(newDigits);
    const focusIndex = Math.min(pasted.length, 5);
    codeInputRefs.current[focusIndex]?.focus();
  };

  // Submit signup form → create account directly (email verification disabled for now)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const err = await signup(name, email, phone, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  // Step 2: Verify code → create account
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeDigits.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Verify the code
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error || "Invalid code");
        setLoading(false);
        return;
      }

      // Code verified, create the account
      const err = await signup(name, email, phone, password);
      if (err) {
        setError(err);
      } else {
        onClose();
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  // Resend code
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend");
      } else {
        setCodeDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        codeInputRefs.current[0]?.focus();
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  // Login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const err = await login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in opacity-0"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-t-3xl sm:rounded-2xl border border-border overflow-hidden w-full sm:max-w-md animate-reveal-up opacity-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-cream flex items-center justify-center text-warm-gray hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {/* ─── Verification Step ─── */}
          {tab === "signup" && signupStep === "verify" ? (
            <>
              <button
                onClick={() => { setSignupStep("form"); setError(""); setCodeDigits(["", "", "", "", "", ""]); }}
                className="flex items-center gap-1 text-xs text-warm-gray hover:text-foreground mb-4 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
                Check Your Email
              </h2>
              <p className="text-sm text-warm-gray mb-6">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifySubmit}>
                {/* 6-digit code inputs */}
                <div className="flex gap-2 justify-center mb-6" onPaste={handleCodePaste}>
                  {codeDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeInputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-12 h-14 bg-cream border border-border rounded-xl text-center text-xl font-bold text-foreground focus:outline-none focus:border-accent/60 transition-colors"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || codeDigits.join("").length !== 6}
                  className="w-full py-3.5 bg-accent text-white text-sm font-medium rounded-full btn-premium hover:bg-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-warm-gray mt-5">
                Didn&apos;t get the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-warm-gray-light">Resend in {resendCooldown}s</span>
                ) : (
                  <button onClick={handleResend} disabled={loading} className="text-foreground underline font-medium">
                    Resend code
                  </button>
                )}
              </p>
            </>
          ) : (
            <>
              {/* ─── Form Step (Signup or Login) ─── */}
              <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
                {tab === "signup" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-warm-gray mb-6">
                {tab === "signup"
                  ? "Sign up to book courts and track your sessions."
                  : "Log in to your account to continue."}
              </p>

              {/* Tabs */}
              <div className="flex bg-cream rounded-xl p-1 mb-6">
                <button
                  onClick={() => switchTab("signup")}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    tab === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-warm-gray hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => switchTab("login")}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    tab === "login"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-warm-gray hover:text-foreground"
                  }`}
                >
                  Log In
                </button>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={tab === "signup" ? handleSignupSubmit : handleLoginSubmit} className="space-y-4">
                {tab === "signup" && (
                  <div>
                    <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {tab === "signup" && (
                  <div>
                    <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors"
                      placeholder="09XX XXX XXXX"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors"
                    placeholder={tab === "signup" ? "At least 6 characters" : "Your password"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent text-white text-sm font-medium rounded-full btn-premium hover:bg-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Please wait..."
                    : tab === "signup"
                    ? "Create Account"
                    : "Log In"}
                </button>
              </form>

              <p className="text-center text-sm text-warm-gray mt-5">
                {tab === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button onClick={() => switchTab("login")} className="text-foreground underline font-medium">
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button onClick={() => switchTab("signup")} className="text-foreground underline font-medium">
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
