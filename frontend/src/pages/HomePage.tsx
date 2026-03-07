import Hero from "../components/Hero";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CallToAction />
    </>
  );
}
