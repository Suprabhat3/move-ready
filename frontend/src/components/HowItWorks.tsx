import { Search, UserPlus, Calendar, Key } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-10 h-10 text-white" strokeWidth={2} />,
    title: "Create Account",
    description:
      "Sign up in seconds and complete a brief profile to help us understand what you are looking for.",
    colorClass: "bg-[#0a5ea8] border-[#0a5ea8] text-white",
    isLight: false,
  },
  {
    icon: <Search className="w-10 h-10 text-white" strokeWidth={2} />,
    title: "Find Your Match",
    description:
      "Browse curated, verified listings and filter by amenities, budget, and exact location.",
    colorClass: "bg-[#00b8d4] border-[#00b8d4] text-white",
    isLight: false,
  },
  {
    icon: <Calendar className="w-10 h-10 text-white" strokeWidth={2} />,
    title: "Schedule a Visit",
    description:
      "Book an guided property tour that works seamlessly with your schedule without the back-and-forth.",
    colorClass: "bg-[#fb8c00] border-[#fb8c00] text-white",
    isLight: false,
  },
  {
    icon: <Key className="w-10 h-10 text-white" strokeWidth={2} />,
    title: "Move In",
    description:
      "Sign your lease digitally and get the keys to your new home. MoveReady handles all the paperwork.",
    colorClass: "bg-[#28a745] border-[#28a745] text-white",
    isLight: false,
  },
];

const HowItWorks = () => {
  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="how-it-works"
    >
      {/* Decorative blurred background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-[#f0f9ff] rounded-full blur-[100px] opacity-60 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-[#f0fdf4] rounded-full blur-[100px] opacity-60 z-0 pointer-events-none"></div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-sm font-bold text-[#0a5ea8] uppercase tracking-[0.2em] mb-4">
              Simple Process
            </h2>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">
              Four simple steps to your <br className="hidden md:block" />
              <span className="text-[#28a745]">perfect new home</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-[600px] mx-auto lg:mx-0 mb-10">
              We have completely streamlined the rental journey so you can focus
              on finding a space you love instead of wrestling with outdated
              processes.
            </p>
            <div className="inline-flex items-center gap-4 bg-gray-50 rounded-2xl p-4 pr-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-[#1a1a1a]">3x Faster</p>
                <p className="text-sm text-gray-500 font-medium">
                  Than traditional renting
                </p>
              </div>
            </div>
          </div>

          {/* Right Cards Column */}
          <div className="flex-1 w-full max-w-[600px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative p-8 rounded-3xl border-2 hover:-translate-y-2 transition-transform duration-300 shadow-xl ${step.colorClass} ${index % 2 !== 0 ? "sm:translate-y-12" : ""}`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${
                      step.isLight
                        ? "bg-blue-50"
                        : "bg-white/20 backdrop-blur-md"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-3 tracking-tight ${
                      step.isLight ? "text-[#1a1a1a]" : "text-white"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`font-medium leading-relaxed ${
                      step.isLight ? "text-gray-500" : "text-white/80"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Step Number Tag */}
                  <div
                    className={`absolute top-6 right-6 text-5xl font-black opacity-10 ${
                      step.isLight ? "text-[#1a1a1a]" : "text-white"
                    }`}
                  >
                    0{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
