export default function TermsOfService() {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content:
        "By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, you must discontinue use of the services immediately.",
    },
    {
      title: "2. Services Provided",
      content:
        "MoveReady provides a platform for discovering, verifying and renting residential properties across India. We do not own or manage properties directly.",
    },
    {
      title: "3. User Accounts",
      content:
        "You are responsible for maintaining the confidentiality of your account information. You must be at least 18 years old to create an account.",
    },
    {
      title: "4. Prohibited Uses",
      content:
        "You may not use our services for any illegal or unauthorized purpose, including violating any domestic or international laws.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "MoveReady shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the services.",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight">
          Terms of <span className="text-[#0a5ea8]">Service</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          Please read these terms carefully before using MoveReady services.
        </p>
      </div>

      <div className="space-y-12 mb-20">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm transition-all hover:shadow-lg"
          >
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-6">
              {sec.title}
            </h2>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              {sec.content}
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
