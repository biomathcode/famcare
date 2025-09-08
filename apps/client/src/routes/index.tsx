import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/home/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/feature-section";
import { ProblemSolution } from "@/components/home/problem-solution";
import { CtaSection } from "@/components/home/cta-section";
import * as React from 'react';



export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex mx-auto w-full h-screen justify-center items-center">
        <HeroSection />


      </div>




      <FeaturesSection />
      <ProblemSolution />
      <CtaSection />
      {/* <StackingCardsDemo /> */}

      {/* <Footer /> */}
    </div>
  );
}
