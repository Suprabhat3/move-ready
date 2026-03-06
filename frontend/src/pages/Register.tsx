import { type FormEvent, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Register({
  onNavigate,
  onAuthSuccess,
}: {
  onNavigate: (page: string) => void;
  onAuthSuccess: () => Promise<void>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TENANT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          data?.message || "Unable to create account. Please try again.",
        );
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
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-black bg-[#ff00ff] shadow-brutal -rotate-[15deg] hidden md:block z-0"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full border-4 border-black bg-[#39ff14] shadow-brutal rotate-[10deg] hidden md:block z-0"></div>

      <div className="w-full max-w-md glass-brutal rounded-2xl p-8 relative z-10">
        <h2
          className="text-4xl font-black text-black tracking-tight mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Create an account
        </h2>
        <p className="text-text-muted font-bold">
          Join Move-Ready to find your perfect home.
        </p>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">
              I am a...
            </label>
            <div className="flex gap-4">
              <label
                className={`flex-1 flex items-center justify-center py-3 px-4 border-2 border-black rounded-xl font-black cursor-pointer transition-all duration-200 uppercase tracking-wide text-sm ${
                  role === "TENANT"
                    ? "bg-[#39ff14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5 text-black"
                    : "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-text-muted hover:text-black"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="TENANT"
                  checked={role === "TENANT"}
                  onChange={(e) => setRole(e.target.value)}
                  className="sr-only"
                />
                Tenant
              </label>
              <label
                className={`flex-1 flex items-center justify-center py-3 px-4 border-2 border-black rounded-xl font-black cursor-pointer transition-all duration-200 uppercase tracking-wide text-sm ${
                  role === "SITE_AGENT"
                    ? "bg-[#00e5ff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5 text-black"
                    : "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-text-muted hover:text-black"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="SITE_AGENT"
                  checked={role === "SITE_AGENT"}
                  onChange={(e) => setRole(e.target.value)}
                  className="sr-only"
                />
                Site Agent
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <User className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 px-3 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder-text-light focus:outline-none focus:ring-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                placeholder="Your name"
              />
            </div>
          </div>

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
                placeholder="Create a password"
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

          {error ? (
            <p className="text-sm font-bold text-black bg-[#ff00ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl px-4 py-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 mt-4 border-2 border-black rounded-xl shadow-brutal text-lg font-black text-black bg-[#39ff14] disabled:opacity-70 hover-brutal group"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            <ArrowRight
              className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform"
              strokeWidth={3}
            />
          </button>
        </form>

        <div className="mt-10 text-center text-sm flex items-center justify-center space-x-2 pb-2">
          <span className="text-text-muted font-bold">
            Already have an account?
          </span>
          <button
            onClick={() => onNavigate("/login")}
            className="font-black text-black hover:text-[#00e5ff] transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex uppercase tracking-wider underline decoration-2 underline-offset-4"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
