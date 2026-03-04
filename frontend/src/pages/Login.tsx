import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex font-sans bg-bg-base text-text-main">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[50%] xl:w-[40%] bg-bg-alt relative z-10 border-r border-border-light shadow-sm">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-text-main tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-text-main">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-light" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 px-3 py-2.5 border border-border-light rounded-xl bg-bg-alt text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-light" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 px-3 py-2.5 border border-border-light rounded-xl bg-bg-alt text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition duration-200"
                    placeholder="••••••••"
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
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-green focus:ring-primary-green border border-border-dark rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-text-muted cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-primary-blue hover:text-primary-blue-dark transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm shadow-primary-green/30 text-sm font-semibold text-white bg-gradient-to-br from-primary-green to-[#14b8a6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-green/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-300 cursor-pointer"
                >
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-light" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-bg-alt text-text-light font-medium rounded-full border border-border-light">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="cursor-pointer w-full flex justify-center items-center py-2.5 px-4 border border-border-light rounded-xl shadow-sm bg-bg-alt text-sm font-medium text-text-main hover:bg-bg-base hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-dark transition-all duration-300"
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </div>

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
      </div>

      {/* Right side - Image/Decoration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-bg-base overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          {/* Abstract aesthetic background using brand colors */}
          <div className="absolute inset-0 bg-bg-alt opacity-90"></div>

          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-blue/15 blur-[100px] pointer-events-none mix-blend-multiply"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-green/10 blur-[100px] pointer-events-none mix-blend-multiply"></div>

          <button
            onClick={() => onNavigate("home")}
            className="absolute top-8 left-8 text-text-muted hover:text-text-main bg-white/50 hover:bg-white/80 border border-border-light backdrop-blur-md px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer z-20 font-medium text-sm flex items-center"
          >
            ← Back to Home
          </button>

          {/* Abstract Decorative overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-16 relative z-10 w-full h-full max-w-2xl mx-auto">
            <h3 className="text-4xl font-extrabold text-text-main leading-tight mb-6 drop-shadow-sm tracking-tight text-center lg:text-left">
              Unlock the door to your new life.
            </h3>
            <p className="text-text-muted text-lg leading-relaxed text-center lg:text-left mb-10 max-w-lg">
              Move-Ready provides a seamless verified rental experience. Access
              dynamic dashboards, sign digital leases, and move in effortlessly
              without brokerage fees.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="bg-white/60 backdrop-blur-sm border border-border-light p-4 rounded-2xl flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h4 className="font-bold text-text-main">Verified listings</h4>
                <p className="text-xs text-text-muted">
                  Every property is physically verified.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm border border-border-light p-4 rounded-2xl flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                </div>
                <h4 className="font-bold text-text-main">Digital visits</h4>
                <p className="text-xs text-text-muted">
                  Schedule seamless physical visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
