import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 pb-32 bg-bg-base">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-primary-green to-primary-blue rounded-[32px] py-20 px-12 relative overflow-hidden text-center shadow-2xl shadow-primary-green/25">
          <div className="relative z-10 max-w-[700px] mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to find your next home?
            </h2>
            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              Join thousands of happy tenants who have securely and quickly
              found their verified properties through MoveReady. No hidden fees.
            </p>
            <div className="flex justify-center">
              <button className="flex items-center gap-2 bg-white text-primary-blue-dark py-4 px-10 rounded-full text-lg font-bold shadow-lg shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/15 transition-all duration-300">
                Create Free Account <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute rounded-full bg-white/10 z-[1] w-[400px] h-[400px] -top-[150px] -left-[100px]"></div>
          <div className="absolute rounded-full bg-white/10 z-[1] w-[300px] h-[300px] -bottom-[100px] -right-[50px]"></div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
