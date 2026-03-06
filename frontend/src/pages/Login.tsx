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
      onNavigate("/dashboard");
    } catch {
      setError("Network error. Please check your connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4 relative overflow-hidden">
      {/* Brutalist geometric background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border-4 border-black bg-[#39ff14] shadow-brutal rotate-[15deg] hidden md:block z-0"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full border-4 border-black bg-[#00e5ff] shadow-brutal -rotate-[10deg] hidden md:block z-0"></div>

      <div className="w-full max-w-md glass-brutal rounded-2xl p-8 relative z-10">
        <h2
          className="text-4xl font-black text-black tracking-tight mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back
        </h2>
        <p className="text-text-muted font-bold">
          Please enter your details to sign in.
        </p>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 px-3 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder-text-light focus:outline-none focus:ring-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 px-3 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder-text-light focus:outline-none focus:ring-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-black hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm font-bold text-black cursor-pointer group w-fit">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-black rounded-md checked:bg-[#39ff14] checked:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
              />
              <svg
                className="absolute w-3 h-3 pointer-events-none hidden peer-checked:block left-1 top-1 text-black"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 7L4.5 10.5L13 1.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Remember me
          </label>

          {error ? (
            <p className="text-sm font-bold text-black bg-[#ff00ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl px-4 py-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border-2 border-black rounded-xl shadow-brutal text-lg font-black text-black bg-[#00e5ff] disabled:opacity-70 hover-brutal group"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight
              className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform"
              strokeWidth={3}
            />
          </button>
        </form>

        <div className="mt-8 text-center text-sm flex items-center justify-center space-x-2">
          <span className="text-text-muted font-bold">
            Don't have an account?
          </span>
          <button
            onClick={() => onNavigate("/register")}
            className="font-black text-black hover:text-[#ff00ff] transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex uppercase tracking-wider underline decoration-2 underline-offset-4"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
