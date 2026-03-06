import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 pb-32 bg-bg-base relative overflow-hidden">
      {/* Background brutalist decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 border-4 border-black bg-[#ff00ff] shadow-brutal rotate-12 z-0 hidden lg:block"></div>
      <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full border-4 border-black bg-[#00e5ff] shadow-brutal -rotate-6 z-0 hidden lg:block"></div>

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10">
        {/* Softened background: Glass brutalism instead of solid neon */}
        <div className="glass-brutal rounded-2xl py-24 px-8 md:px-16 relative overflow-hidden text-center z-10">
          <div className="relative z-10 max-w-[800px] mx-auto">
            <h2
              className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tighter leading-[1.1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to find your <br />{" "}
              <span className="text-black bg-[#39ff14]/30 px-4 inline-block transform rotate-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-2">
                next home?
              </span>
            </h2>
            <p className="text-xl font-bold text-text-muted mb-12 leading-relaxed max-w-[600px] mx-auto">
              Join thousands of happy tenants who have securely and quickly
              found their verified properties through MoveReady. No hidden fees.
            </p>
            <div className="flex justify-center">
              <button className="flex items-center gap-3 bg-[#39ff14] text-black border-4 border-black py-4 px-10 rounded-xl text-xl font-black shadow-brutal-lg hover-brutal transition-all duration-200 group">
                Create Free Account
                <ArrowRight
                  size={28}
                  strokeWidth={3}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
