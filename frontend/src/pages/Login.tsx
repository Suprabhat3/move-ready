import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login({
  onNavigate,
  onAuthSuccess,
}: {
  onNavigate: (page: string) => void;
  onAuthSuccess: () => Promise<void>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Unable to sign in. Please try again.");
        return;
      }

      await onAuthSuccess();
      onNavigate("dashboard");
    } catch {
      setError("Network error. Please check your connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-md bg-bg-alt border border-border-light rounded-2xl p-6 shadow-sm">
        <h2 className="text-3xl font-extrabold text-text-main tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Please enter your details to sign in.
        </p>

        <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text-main">Email</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-light" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 px-3 py-2.5 border border-border-light rounded-xl bg-bg-alt text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-light" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 px-3 py-2.5 border border-border-light rounded-xl bg-bg-alt text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition duration-200"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text-main transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4"
            />
            Remember me
          </label>

          {error ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm shadow-primary-green/30 text-sm font-semibold text-white bg-gradient-to-br from-primary-green to-[#14b8a6] disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm flex items-center justify-center space-x-2">
          <span className="text-text-muted">Don't have an account?</span>
          <button
            onClick={() => onNavigate("register")}
            className="font-bold text-primary-blue hover:text-primary-blue-dark transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
