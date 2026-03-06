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
    icon: <Search className="w-8 h-8 text-black" strokeWidth={2.5} />,
    title: "Smart Search",
    description:
      "Find verified listings that perfectly match your desired city, budget, and amenities with our advanced search filters.",
    colorClass: "hover-brutal",
    iconBgClass:
      "bg-[#00e5ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  },
  {
    icon: <Navigation className="w-8 h-8 text-black" strokeWidth={2.5} />,
    title: "Visit Tracking",
    description:
      "Schedule property visits effortlessly. Our status stepper keeps you updated from Request to Final Decision.",
    colorClass: "hover-brutal",
    iconBgClass:
      "bg-[#39ff14] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-black" strokeWidth={2.5} />,
    title: "Digital Move-in",
    description:
      "Clear checklist for smoothly securing your house: digital document upload, fast approval, and inventory review.",
    colorClass: "hover-brutal",
    iconBgClass:
      "bg-[#ff00ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  },
  {
    icon: <Building className="w-8 h-8 text-black" strokeWidth={2.5} />,
    title: "Rental Management",
    description:
      "Your complete tenant dashboard. Manage stays, request extensions, and browse shortlisted properties simultaneously.",
    colorClass: "hover-brutal",
    iconBgClass:
      "bg-[#39ff14] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  },
  {
    icon: <Activity className="w-8 h-8 text-black" strokeWidth={2.5} />,
    title: "Support Tickets",
    description:
      "24/7 dedicated tenant support with threaded messages and priority tracking till issues get completely resolved.",
    colorClass: "hover-brutal",
    iconBgClass:
      "bg-[#00e5ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  },
  {
    icon: <MapPin className="w-8 h-8 text-black" strokeWidth={2.5} />,
    title: "Real-time Approvals",
    description:
      "No more waiting weeks. Direct owner verification, immediate alerts, and straightforward status dashboards.",
    colorClass: "hover-brutal",
    iconBgClass:
      "bg-[#ff00ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  },
];

const Features = () => {
  return (
    <section
      className="py-24 border-b-4 border-black relative overflow-hidden"
      id="features"
    >
      <div className="absolute top-40 right-10 w-32 h-32 bg-[#ff00ff] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-[#00e5ff] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-[700px] mx-auto mb-20">
          <span className="inline-block px-4 py-2 bg-[#39ff14] border-2 border-black text-black font-extrabold tracking-widest uppercase text-xs mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Why MoveReady?
          </span>
          <h2
            className="text-5xl md:text-6xl font-black text-black mb-6 leading-[1.1]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Rent housing without the{" "}
            <span className="text-white bg-black px-2 inline-block -rotate-1">
              headache
            </span>
          </h2>
          <p className="text-xl font-medium text-text-muted">
            We overhauled the traditional rental process. Our platform directly
            connects you with curated properties and handles all the paperwork
            dynamically online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              className={`glass-brutal rounded-2xl p-8 transition-transform duration-300 ${feature.colorClass}`}
              key={index}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-8 ${feature.iconBgClass}`}
              >
                {feature.icon}
              </div>
              <h3
                className="text-2xl font-black mb-4 text-black tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {feature.title}
              </h3>
              <p className="text-text-muted font-medium leading-relaxed">
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
