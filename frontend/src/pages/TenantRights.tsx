import { Shield, Home, Clock, AlertCircle } from "lucide-react";

export default function TenantRights() {
  const rights = [
    {
      icon: <Home className="w-8 h-8 text-blue-500" />,
      title: "Fair Housing",
      description:
        "You have the right to equal access to housing without discrimination.",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Safety Standards",
      description:
        "Your home must meet health and safety standards before and after move-in.",
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Quiet Enjoyment",
      description:
        "You have the right to use and enjoy your rental without constant interference.",
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
      title: "Notice & Eviction",
      description:
        "You have the right to receive proper legal notice before eviction or rent increases.",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight">
          Your <span className="text-green-600">Tenant Rights</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
          Know your rights and responsibilities during the rental process and
          stay protected.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {rights.map((right, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="mb-6 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              {right.icon}
            </div>
            <h3 className="text-xl font-black text-[#1a1a1a] mb-3">
              {right.title}
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              {right.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-green-50 rounded-[3rem] p-12 md:p-20 text-center">
        <h2 className="text-3xl font-black text-[#1a1a1a] mb-6">
          Need Legal Help?
        </h2>
        <p className="text-lg text-gray-500 font-medium mb-10 max-w-xl mx-auto">
          If you're facing issues with your landlord or a rental property, we're
          here to help you get the support you need.
        </p>
        <button className="bg-[#28a745] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-100">
          Get Support
        </button>
      </div>
    </div>
  );
}
