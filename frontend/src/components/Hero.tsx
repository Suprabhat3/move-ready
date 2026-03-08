import { Link } from "react-router";
import heroImage from "../assets/hero.webp";

const Hero = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* 1. Full-Cover Hero Visual Area */}
      <div className="relative w-full min-h-[100svh] md:min-h-screen flex items-center">
        {/* Background Image - Absolute Cover */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="MoveReady Hero Background"
            className="w-full h-full object-cover object-[70%_center] md:object-center"
          />
          {/* Stronger gradient overlay for safe text contrast on mobile without fully hiding the image */}
          <div className="absolute inset-0 bg-white/40 md:bg-transparent md:bg-gradient-to-r md:from-white/80 md:via-white/20 md:to-transparent z-10"></div>
        </div>

        {/* Content Overlay - Centered Grid (Aligned with Navbar 1400px) */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 pt-32 pb-16 md:pt-0 md:pb-0">
          <div className="max-w-[750px] p-6 sm:p-10 md:p-0 bg-white/70 sm:bg-white/50 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none rounded-3xl md:rounded-none border border-white/50 md:border-none shadow-2xl md:shadow-none mx-2 sm:mx-0">
            <h1 className="text-5xl sm:text-6xl md:text-[80px] lg:text-[90px] font-black text-[#1a1a1a] leading-[1.15] mb-8 md:mb-12 tracking-tight drop-shadow-sm md:drop-shadow-none px-2 sm:px-0">
              Your Seamless
              <br className="hidden sm:block" /> Journey Home
              <br className="hidden sm:block" /> Starts Here.
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium mb-10 md:mb-16 max-w-[650px] leading-relaxed opacity-90 drop-shadow-sm md:drop-shadow-none px-2 sm:px-0">
              Discover, schedule visits, and move in effortlessly with
              MoveReady. Manage your entire rental process on one intuitive
              platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-5">
              <Link
                to="/properties"
                className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#0a5ea8] text-white font-black rounded-xl md:rounded-2xl hover:bg-[#084d8a] transition-all shadow-lg md:shadow-2xl text-lg md:text-xl text-center"
              >
                Find Your Next Home
              </Link>
              <Link
                to="/visits"
                className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#28a745] text-white font-black rounded-xl md:rounded-2xl hover:bg-[#218838] transition-all shadow-lg md:shadow-2xl text-lg md:text-xl text-center"
              >
                Book a Visit Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
