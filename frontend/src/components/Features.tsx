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
    icon: <Search className="w-7 h-7 text-primary-blue" />,
    title: "Smart Search",
    description:
      "Find verified listings that perfectly match your desired city, budget, and amenities with our advanced search filters.",
    colorClass: "hover:border-primary-blue/30",
    iconBgClass: "bg-primary-blue/10",
  },
  {
    icon: <Navigation className="w-7 h-7 text-primary-green" />,
    title: "Visit Tracking",
    description:
      "Schedule property visits effortlessly. Our status stepper keeps you updated from Request to Final Decision.",
    colorClass: "hover:border-primary-green/30",
    iconBgClass: "bg-primary-green/10",
  },
  {
    icon: <CheckCircle2 className="w-7 h-7 text-primary-blue" />,
    title: "Digital Move-in",
    description:
      "Clear checklist for smoothly securing your house: digital document upload, fast approval, and inventory review.",
    colorClass: "hover:border-primary-blue/30",
    iconBgClass: "bg-primary-blue/10",
  },
  {
    icon: <Building className="w-7 h-7 text-primary-green" />,
    title: "Rental Management",
    description:
      "Your complete tenant dashboard. Manage stays, request extensions, and browse shortlisted properties simultaneously.",
    colorClass: "hover:border-primary-green/30",
    iconBgClass: "bg-primary-green/10",
  },
  {
    icon: <Activity className="w-7 h-7 text-primary-blue" />,
    title: "Support Tickets",
    description:
      "24/7 dedicated tenant support with threaded messages and priority tracking till issues get completely resolved.",
    colorClass: "hover:border-primary-blue/30",
    iconBgClass: "bg-primary-blue/10",
  },
  {
    icon: <MapPin className="w-7 h-7 text-primary-green" />,
    title: "Real-time Approvals",
    description:
      "No more waiting weeks. Direct owner verification, immediate alerts, and straightforward status dashboards.",
    colorClass: "hover:border-primary-green/30",
    iconBgClass: "bg-primary-green/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-bg-base" id="features">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="text-center max-w-[700px] mx-auto mb-20">
          <span className="inline-block text-primary-green-dark font-bold tracking-wider uppercase text-sm mb-4">
            Why MoveReady?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-5 leading-tight">
            Rent housing without the headache
          </h2>
          <p className="text-lg text-text-muted">
            We overhauled the traditional rental process. Our platform directly
            connects you with curated properties and handles all the paperwork
            dynamically online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              className={`bg-bg-alt rounded-3xl p-10 transition-all duration-300 border border-border-light shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5 ${feature.colorClass}`}
              key={index}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.iconBgClass}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-main">
                {feature.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
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
