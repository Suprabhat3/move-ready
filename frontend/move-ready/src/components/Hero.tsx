import { ArrowRight, Search, Key } from "lucide-react";
import heroMockup from "../assets/hero-mockup.png";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] mt-20 py-24 overflow-hidden bg-bg-alt">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute blur-[80px] rounded-full z-[1] opacity-15 bg-primary-green w-[600px] h-[600px] -top-[200px] -left-[200px]"></div>
        <div className="absolute blur-[80px] rounded-full z-[1] opacity-15 bg-primary-blue w-[500px] h-[500px] top-[100px] -right-[150px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-center lg:text-left">
        <div className="flex-1 max-w-[600px] flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 border border-primary-green/20 mb-6 animate-[fade-in-up_0.8s_ease-out_forwards]">
            <span>✨</span>
            <span className="text-primary-green-dark font-semibold text-sm">
              The new standard in rental housing
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-text-main leading-tight mb-6 tracking-tight animate-[fade-in-up_0.8s_ease-out_0.1s_forwards] opacity-0 [animation-fill-mode:forwards]">
            Find your perfect home, <br />
            <span className="text-gradient">Ready to move in.</span>
          </h1>

          <p className="text-lg text-text-muted leading-relaxed mb-10 max-w-[90%] animate-[fade-in-up_0.8s_ease-out_0.2s_forwards] opacity-0 [animation-fill-mode:forwards]">
            MoveReady simplifies your rental journey. From verified listings and
            seamless scheduling to digital agreements. Experience renting the
            way it should be.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full sm:w-auto animate-[fade-in-up_0.8s_ease-out_0.3s_forwards] opacity-0 [animation-fill-mode:forwards]">
            <button className="flex items-center justify-center gap-2 py-4 px-8 rounded-full font-semibold transition-all duration-300 text-lg text-white bg-gradient-to-br from-primary-green to-[#14b8a6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-green/40 shadow-md shadow-primary-green/30">
              Browse Properties <ArrowRight size={20} />
            </button>
            <button className="flex items-center justify-center py-4 px-8 rounded-full text-lg font-semibold transition-all duration-300 border border-primary-blue/30 text-primary-blue-dark glass hover:bg-primary-blue/5 hover:border-primary-blue">
              How it Works
            </button>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-8 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards] opacity-0 [animation-fill-mode:forwards]">
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-text-main leading-none mb-1">
                10k+
              </span>
              <span className="text-sm text-text-muted font-medium">
                Verified Homes
              </span>
            </div>
            <div className="w-[1px] h-10 bg-border-light"></div>
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-text-main leading-none mb-1">
                4.9/5
              </span>
              <span className="text-sm text-text-muted font-medium">
                User Reviews
              </span>
            </div>
            <div className="w-[1px] h-10 bg-border-light"></div>
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-text-main leading-none mb-1">
                24hr
              </span>
              <span className="text-sm text-text-muted font-medium">
                Avg. Approval
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center items-center animate-[fade-in-up_0.8s_ease-out_0.2s_forwards] opacity-0 [animation-fill-mode:forwards] w-full mt-10 lg:mt-0 hidden md:flex">
          <div className="relative rounded-3xl p-4 shadow-2xl shadow-black/10 transform perspective-1000 -rotate-y-5 rotate-x-5 transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0 glass">
            <img
              src={heroMockup}
              alt="MoveReady App Interface"
              className="rounded-2xl shadow-md w-full max-w-[450px]"
            />

            {/* Floating cards */}
            <div className="absolute flex items-center gap-4 p-4 rounded-2xl shadow-xl shadow-black/10 animate-[float_6s_ease-in-out_infinite] top-[10%] -left-[20%] glass">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-blue">
                <Search size={18} color="#fff" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-text-main">
                  Smart Search
                </span>
                <span className="text-xs text-text-muted">
                  Find exactly what you need
                </span>
              </div>
            </div>

            <div className="absolute flex items-center gap-4 p-4 rounded-2xl shadow-xl shadow-black/10 animate-[float_6s_ease-in-out_infinite] bottom-[20%] -right-[10%] delay-[-3s] glass">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-green">
                <Key size={18} color="#fff" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-text-main">
                  Instant Move-in
                </span>
                <span className="text-xs text-text-muted">
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
