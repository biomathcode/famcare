import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/home/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/feature-section";
import { ProblemSolution } from "@/components/home/problem-solution";
import { StatsSection } from "@/components/home/stats-section";
import { PricingSection } from "@/components/home/pricing-section";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProblemSolution />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
