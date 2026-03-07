import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

const CallToAction = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="cta">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a5ea8] to-[#1a1a1a]"></div>

          {/* Abstract Shapes for visual interest */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#28a745] opacity-20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-wide uppercase mb-8 shadow-sm">
                <Sparkles size={18} className="text-[#28a745]" />
                Start Your Journey
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                Ready to find your <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a1e5b1] to-[#28a745]">
                  perfect next home?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 font-medium max-w-[600px] leading-relaxed mx-auto lg:mx-0">
                Join thousands of happy tenants who have securely and quickly
                found their verified properties through MoveReady.
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#28a745] text-white py-5 px-10 rounded-2xl text-xl font-black hover:bg-[#218838] hover:-translate-y-1 transition-all duration-300 shadow-xl group border border-[#28a745]"
              >
                Get Started
                <ArrowRight
                  size={24}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/properties"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 py-5 px-10 rounded-2xl text-xl font-bold hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
