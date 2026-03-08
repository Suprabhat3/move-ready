import { HelpCircle, Book, Search, MessageSquare } from "lucide-react";

export default function HelpCenter() {
  const categories = [
    {
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: "Finding a Home",
      description: "Learn how to search, filter and find the perfect property.",
    },
    {
      icon: <Book className="w-8 h-8 text-green-500" />,
      title: "Rental Process",
      description: "Everything you need to know from visit to move-in.",
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-purple-500" />,
      title: "Account & Safety",
      description:
        "Manage your profile and learn about our verification process.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-amber-500" />,
      title: "Contact Support",
      description: "Can't find what you're looking for? Reach out to us.",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight">
          Help <span className="text-[#0a5ea8]">Center</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
          Everything you need to know about using MoveReady. Search our
          knowledge base or contact our team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="mb-6 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              {cat.icon}
            </div>
            <h3 className="text-xl font-black text-[#1a1a1a] mb-3">
              {cat.title}
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              {cat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-[3rem] p-12 md:p-20 text-center">
        <h2 className="text-3xl font-black text-[#1a1a1a] mb-6">
          Still have questions?
        </h2>
        <p className="text-lg text-gray-500 font-medium mb-10 max-w-xl mx-auto">
          Our support team is available 24/7 to help you with any issues or
          queries you might have.
        </p>
        <button className="bg-[#1a1a1a] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-black/10">
          Chat with Support
        </button>
      </div>
    </div>
  );
}
