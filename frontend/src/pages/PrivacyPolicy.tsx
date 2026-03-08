export default function PrivacyPolicy() {
  const policies = [
    {
      title: "Data We Collect",
      content:
        "We collect personal information such as name, email address, phone number, and location to provide you with a tailored rental experience.",
    },
    {
      title: "How We Use Data",
      content:
        "Your data is used to verify listings, facilitate communication with agents, and improve our services to meet your needs.",
    },
    {
      title: "Sharing Information",
      content:
        "We do not sell your personal data. We only share information with third parties who help us provide our services and comply with legal requirements.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information at any time. Contact us for any privacy-related queries.",
    },
    {
      title: "Data Security",
      content:
        "We implement robust security measures to protect your personal information from unauthorized access, loss, or misuse.",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight">
          Privacy <span className="text-[#0a5ea8]">Policy</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          Learn how we protect your personal information and maintain your
          privacy.
        </p>
      </div>

      <div className="space-y-12 mb-20">
        {policies.map((p, idx) => (
          <div
            key={idx}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm transition-all hover:shadow-lg"
          >
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-6">
              {p.title}
            </h2>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              {p.content}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center bg-gray-50 p-12 rounded-[2rem]">
        <p className="text-gray-400 font-black uppercase text-xs tracking-widest mb-2">
          Last Updated
        </p>
        <p className="text-xl font-black text-[#1a1a1a]">March 08, 2026</p>
      </div>
    </div>
  );
}
