import { Star } from "lucide-react";
import arjunImg from "../assets/arjun.png";
import priyaImg from "../assets/priya.png";
import vikramImg from "../assets/vikram.png";

const testimonials = [
  {
    author: "Arjun Sharma",
    role: "Relocated from Delhi to Bangalore",
    image: arjunImg,
    content:
      "MoveReady made my relocation from Delhi to Bangalore incredibly smooth. Finding a house without high brokerage and dealing with everything online saved me so much time and money.",
    rating: 5,
  },
  {
    author: "Priya Iyer",
    role: "Software Engineer, Mumbai",
    image: priyaImg,
    content:
      "The verified listings in Mumbai are a lifesaver. No more fake photos or bait-and-switch. What I saw on the app was exactly what I got. Highly recommended for busy professionals!",
    rating: 5,
  },
  {
    author: "Vikram Malhotra",
    role: "Tech Lead, Pune",
    image: vikramImg,
    content:
      "I love the support ticket feature! Getting maintenance in my previous Gurgaon flat was a nightmare. Here, every request is tracked and resolved within 24 hours. Truly professional.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section
      className="py-12 md:py-24 bg-[#f9fafb] border-t border-gray-100"
      id="testimonials"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <h2 className="text-sm font-bold text-[#0a5ea8] uppercase tracking-[0.2em] mb-4">
            Tenant Stories
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a1a] mb-6 leading-tight tracking-tight">
            Don't just take <br className="hidden md:block" />
            <span className="text-[#0a5ea8]">our word for it</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-6 h-6 fill-[#fb8c00] text-[#fb8c00]"
                  />
                ))}
              </div>
              <p className="text-xl text-[#1a1a1a] font-medium leading-relaxed mb-8 flex-1">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={t.image}
                  alt={t.author}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-[#1a1a1a]">{t.author}</h4>
                  <p className="text-sm text-gray-500 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
