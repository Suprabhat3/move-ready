import { Building2, Home, MapPin, Users } from "lucide-react";

const stats = [
  {
    icon: <Users className="w-8 h-8 text-[#0a5ea8]" strokeWidth={2.5} />,
    value: "10k+",
    label: "Happy Tenants",
    bgClass: "bg-[#0a5ea8]/10",
  },
  {
    icon: <Home className="w-8 h-8 text-[#28a745]" strokeWidth={2.5} />,
    value: "5,000+",
    label: "Verified Homes",
    bgClass: "bg-[#28a745]/10",
  },
  {
    icon: <Building2 className="w-8 h-8 text-[#00acc1]" strokeWidth={2.5} />,
    value: "500+",
    label: "Premium Properties",
    bgClass: "bg-[#00acc1]/10",
  },
  {
    icon: <MapPin className="w-8 h-8 text-[#d81b60]" strokeWidth={2.5} />,
    value: "50+",
    label: "Cities Covered",
    bgClass: "bg-[#d81b60]/10",
  },
];

const Stats = () => {
  return (
    <section
      className="py-10 md:py-20 bg-white border-b border-gray-100 relative z-10"
      id="stats"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-[2rem] border border-gray-100 hover:border-gray-200 transition-colors shadow-sm bg-gray-50/50"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${stat.bgClass}`}
              >
                {stat.icon}
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-[#1a1a1a] mb-2 tracking-tighter">
                {stat.value}
              </h3>
              <p className="text-gray-500 font-bold text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
