import { ArrowRight, Search, Key } from "lucide-react";
import heroMockup from "../assets/hero-mockup.png";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] mt-20 py-24 overflow-hidden border-b-4 border-black bg-bg-base">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Playful bold background blobs */}
        <div className="absolute rounded-full z-[1] opacity-30 bg-[#39ff14] blur-[100px] w-[500px] h-[500px] -top-[100px] -left-[100px]"></div>
        <div className="absolute rounded-full z-[1] opacity-30 bg-[#00e5ff] blur-[100px] w-[600px] h-[600px] top-[20%] -right-[200px]"></div>
        <div className="absolute rounded-full z-[1] opacity-20 bg-[#ff00ff] blur-[100px] w-[400px] h-[400px] bottom-0 left-[20%]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-center lg:text-left">
        <div className="flex-1 max-w-[600px] flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black shadow-brutal mb-8 animate-[fade-in-up_0.8s_ease-out_forwards]">
            <span className="text-xl">⚡</span>
            <span className="text-black font-extrabold text-sm uppercase tracking-wider">
              The new standard in rental housing
            </span>
          </div>

          <h1
            className="text-6xl lg:text-7xl font-extrabold text-black leading-[1.1] mb-6 tracking-tighter animate-[fade-in-up_0.8s_ease-out_0.1s_forwards] opacity-0 [animation-fill-mode:forwards]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find your <br /> perfect home, <br />
            <span className="relative inline-block">
              <span className="relative z-10">Ready to move in.</span>
              <span className="absolute bottom-2 left-0 w-full h-8 bg-[#39ff14] -z-10 -rotate-2"></span>
            </span>
          </h1>

          <p className="text-xl text-text-muted font-medium leading-relaxed mb-10 max-w-[90%] animate-[fade-in-up_0.8s_ease-out_0.2s_forwards] opacity-0 [animation-fill-mode:forwards]">
            MoveReady simplifies your rental journey. From verified listings and
            seamless scheduling to digital agreements. Experience renting the
            way it should be.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-16 w-full sm:w-auto animate-[fade-in-up_0.8s_ease-out_0.3s_forwards] opacity-0 [animation-fill-mode:forwards]">
            <button className="flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold transition-all duration-300 text-lg text-black bg-[#39ff14] border-2 border-black shadow-brutal-lg hover-brutal">
              Browse Properties <ArrowRight size={24} strokeWidth={3} />
            </button>
            <button className="flex items-center justify-center py-4 px-8 rounded-xl text-lg font-bold transition-all duration-300 border-2 border-black text-black bg-white shadow-brutal hover-brutal">
              How it Works
            </button>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-10 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards] opacity-0 [animation-fill-mode:forwards]">
            <div className="flex flex-col items-center lg:items-start glass-brutal px-6 py-4 rounded-xl">
              <span
                className="text-3xl font-black text-black mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                10k+
              </span>
              <span className="text-xs text-black font-bold uppercase tracking-widest">
                Verified
              </span>
            </div>
            <div className="flex flex-col items-center lg:items-start glass-brutal px-6 py-4 rounded-xl">
              <span
                className="text-3xl font-black text-black mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                4.9/5
              </span>
              <span className="text-xs text-black font-bold uppercase tracking-widest">
                Reviews
              </span>
            </div>
            <div className="flex flex-col items-center lg:items-start glass-brutal px-6 py-4 rounded-xl">
              <span
                className="text-3xl font-black text-black mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                24h
              </span>
              <span className="text-xs text-black font-bold uppercase tracking-widest">
                Approval
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center items-center animate-[fade-in-up_0.8s_ease-out_0.2s_forwards] opacity-0 [animation-fill-mode:forwards] w-full mt-10 lg:mt-0 hidden md:flex">
          <div className="relative rounded-3xl p-4 glass-brutal shadow-brutal-lg transform transition-transform duration-500 hover:-translate-y-2">
            <img
              src={heroMockup}
              alt="MoveReady App Interface"
              className="rounded-2xl border-2 border-black shadow-brutal w-full max-w-[450px]"
            />

            {/* Floating cards */}
            <div className="absolute flex items-center gap-4 p-4 rounded-xl glass-brutal animate-[float_6s_ease-in-out_infinite] top-[5%] -left-[15%]">
              <div className="w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center bg-[#00e5ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Search size={24} color="#000" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-black uppercase tracking-wide">
                  Smart Search
                </span>
                <span className="text-xs font-semibold text-text-muted">
                  Find exactly what you need
                </span>
              </div>
            </div>

            <div className="absolute flex items-center gap-4 p-4 rounded-xl glass-brutal animate-[float_6s_ease-in-out_infinite] bottom-[10%] -right-[15%] delay-[-3s]">
              <div className="w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center bg-[#ff00ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Key size={24} color="#000" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-black uppercase tracking-wide">
                  Instant Move-in
                </span>
                <span className="text-xs font-semibold text-text-muted">
                  Digital agreements
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
