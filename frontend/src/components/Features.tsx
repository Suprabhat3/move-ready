import {
  Building,
  MapPin,
  Search,
  CheckCircle2,
  Navigation,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: <Search className="w-8 h-8 text-[#0a5ea8]" strokeWidth={2} />,
    title: "Smart Search",
    description:
      "Find verified listings that perfectly match your desired city, budget, and amenities with our advanced search filters.",
    iconBgClass: "bg-blue-50",
  },
  {
    icon: <Navigation className="w-8 h-8 text-[#28a745]" strokeWidth={2} />,
    title: "Visit Tracking",
    description:
      "Schedule property visits effortlessly. Our status stepper keeps you updated from Request to Final Decision.",
    iconBgClass: "bg-green-50",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-[#00b8d4]" strokeWidth={2} />,
    title: "Digital Move-in",
    description:
      "Clear checklist for smoothly securing your house: digital document upload, fast approval, and inventory review.",
    iconBgClass: "bg-cyan-50",
  },
  {
    icon: <Building className="w-8 h-8 text-[#d81b60]" strokeWidth={2} />,
    title: "Rental Management",
    description:
      "Your complete tenant dashboard. Manage stays, request extensions, and browse shortlisted properties simultaneously.",
    iconBgClass: "bg-pink-50",
  },
  {
    icon: <Activity className="w-8 h-8 text-[#5e35b1]" strokeWidth={2} />,
    title: "Support Tickets",
    description:
      "24/7 dedicated tenant support with threaded messages and priority tracking till issues get completely resolved.",
    iconBgClass: "bg-purple-50",
  },
  {
    icon: <MapPin className="w-8 h-8 text-[#fb8c00]" strokeWidth={2} />,
    title: "Real-time Approvals",
    description:
      "No more waiting weeks. Direct owner verification, immediate alerts, and straightforward status dashboards.",
    iconBgClass: "bg-orange-50",
  },
];

const Features = () => {
  return (
    <section
      className="py-24 bg-white border-t border-gray-100 relative"
      id="features"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0f9ff]/50 -skew-x-12 origin-top-right -z-10 hidden lg:block"></div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-[800px] mx-auto mb-20">
          <h2 className="text-sm font-bold text-[#0a5ea8] uppercase tracking-[0.2em] mb-4">
            Why MoveReady?
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">
            Rent housing without the <br className="hidden md:block" />
            <span className="text-[#28a745]">unnecessary complexity</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            We've overhauled the traditional rental process. Our platform
            directly connects you with curated properties and handles all the
            paperwork digitally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              className={`bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden`}
              key={index}
            >
              {/* Subtle hover background highlight */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-[#0a5ea8] group-hover:to-[#28a745] transition-all duration-500"></div>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${feature.iconBgClass} transition-transform duration-500 group-hover:scale-110 shadow-inner`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a] tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
