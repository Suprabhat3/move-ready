import { type FormEvent, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "../lib/api";

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
      {/* Soft gradient background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-400/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      <div className="w-full max-w-md glass rounded-3xl p-8 relative z-10 shadow-premium">
        <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-2">
          Create an account
        </h2>
        <p className="text-gray-500 font-medium">
          Join Move-Ready to find your perfect home.
        </p>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="space-y-2.5">
            <label className="block text-sm font-bold text-gray-700">
              I am a...
            </label>
            <div className="flex gap-4">
              <label
                className={`flex-1 flex items-center justify-center py-3 px-4 border rounded-xl font-bold cursor-pointer transition-all duration-200 text-sm ${
                  role === "TENANT"
                    ? "bg-blue-50 border-[#0a5ea8] text-[#0a5ea8] shadow-sm"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700"
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
                className={`flex-1 flex items-center justify-center py-3 px-4 border rounded-xl font-bold cursor-pointer transition-all duration-200 text-sm ${
                  role === "SITE_AGENT"
                    ? "bg-green-50 border-[#28a745] text-[#28a745] shadow-sm"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700"
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
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <User className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-11 px-3 py-3 border border-gray-200 rounded-xl bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus-ring shadow-sm transition-all outline-none"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <Mail className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 px-3 py-3 border border-gray-200 rounded-xl bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus-ring shadow-sm transition-all outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-10 px-3 py-3 border border-gray-200 rounded-xl bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus-ring shadow-sm transition-all outline-none"
                placeholder="Create a password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#0a5ea8] transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 mt-4 rounded-xl shadow-md text-lg font-bold text-white bg-[#28a745] hover:bg-[#218838] disabled:opacity-70 transition-all group"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            <ArrowRight
              className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform"
              strokeWidth={2.5}
            />
          </button>
        </form>

        <div className="mt-10 text-center text-sm flex items-center justify-center space-x-2 pb-2">
          <span className="text-gray-500 font-medium">
            Already have an account?
          </span>
          <button
            onClick={() => onNavigate("/login")}
            className="font-bold text-[#0a5ea8] hover:text-[#084d8a] transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
