import { ArrowRight, Sparkles, Home, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

const CallToAction = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden" id="cta">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="relative group rounded-[4rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.12)] border border-white/20">
          {/* Base Layer: Deep Premium Gradient */}
          <div className="absolute inset-0 bg-[#0a0a0a]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a5ea8]/30 via-transparent to-[#28a745]/30"></div>

          {/* Mid Layer: Animated Glass Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#28a745]/10 rounded-full blur-[150px] animate-pulse duration-[8000ms] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0a5ea8]/10 rounded-full blur-[120px] animate-pulse duration-[6000ms] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          {/* Top Layer: Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <div className="relative z-20 px-8 py-20 md:px-20 md:py-32 flex flex-col xl:flex-row items-center justify-between gap-16 lg:gap-24">
            <div className="flex-1 max-w-[850px] text-center xl:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white text-xs font-black tracking-[0.2em] uppercase mb-10 shadow-2xl">
                <Sparkles size={18} className="text-[#28a745] animate-bounce" />
                Join the future of rentals
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-10 leading-[1.15] tracking-tight">
                Your next home is <br className="hidden xl:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] via-[#a1e5b1] to-emerald-400">
                  just a tap away.
                </span>
              </h2>

              <div className="flex flex-col gap-10">
                <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-[650px] leading-relaxed mx-auto xl:mx-0">
                  Join thousands of happy tenants who found their verified dream
                  properties securely through MoveReady.
                </p>

                <div className="flex items-center gap-4 justify-center xl:justify-start">
                  <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <ShieldCheck size={28} className="text-[#28a745]" />
                    <div className="text-left">
                      <p className="text-white font-black text-sm uppercase tracking-wider">
                        100% Verified
                      </p>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
                        No Scams Guaranteed
                      </p>
                    </div>
                  </div>
                </div>
              </div>  
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-6 w-full sm:w-auto mt-12 xl:mt-0">
              <Link
                to="/register"
                className="w-full sm:w-[320px] group relative flex items-center justify-between bg-[#28a745] text-white py-6 px-10 rounded-[2rem] text-2xl font-black hover:bg-[#218838] transition-all duration-500 shadow-[0_20px_50px_rgba(40,167,69,0.3)] hover:shadow-[0_25px_60px_rgba(40,167,69,0.4)] active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">Create Account</span>
                <ArrowRight
                  size={28}
                  className="relative z-10 group-hover:translate-x-2 transition-transform duration-500"
                />
              </Link>

              <Link
                to="/properties"
                className="w-full sm:w-[320px] flex items-center justify-center gap-4 bg-white/5 backdrop-blur-2xl text-white border border-white/10 py-6 px-10 rounded-[2rem] text-2xl font-black hover:bg-white/10 hover:border-white/20 transition-all duration-500 group active:scale-95"
              >
                <Home
                  size={24}
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                />
                Browse Homes
              </Link>

              <div className="pt-6 flex items-center gap-4 opacity-50">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      className="w-12 h-12 rounded-full border-2 border-black"
                      alt="user"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
                    Community
                  </p>
                  <p className="text-[#28a745] text-sm font-black italic">
                    5,000+ Joined
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
