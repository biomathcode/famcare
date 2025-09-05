import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/home/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/feature-section";
import { ProblemSolution } from "@/components/home/problem-solution";
import { CtaSection } from "@/components/home/cta-section";
import { CardCarousel } from "~/components/ui/card-carousel";
import * as React from 'react';


const StackingCardsDemo = React.lazy(() => import("~/components/home/scroll-card"));

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {

  const images = [
    { src: "https://skiper-ui.com/_next/image?url=%2Fcard%2F1.png&w=1080&q=75", alt: "Sample Image 1" },
    { src: "https://skiper-ui.com/_next/image?url=%2Fcard%2F2.png&w=1080&q=75", alt: "Sample Image 2" },
    { src: "https://skiper-ui.com/_next/image?url=%2Fcard%2F3.png&w=1080&q=75", alt: "Sample Image 3" },
    { src: "https://skiper-ui.com/_next/image?url=%2Fcard%2F1.png&w=640&q=75", alt: "Sample Image 4" },
    { src: "https://skiper-ui.com/_next/image?url=%2Fcard%2F2.png&w=640&q=75", alt: "Sample Image 5" },
    {
      src: "https://skiper-ui.com/_next/image?url=%2Fcard%2F3.png&w=640&q=75", alt: "Sample Image 6"
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex mx-auto w-full h-screen justify-center items-center">
        <HeroSection />
        <div className="flex justify-center w-full">
          <div className="w-md ">
            <CardCarousel
              images={images}
              autoplayDelay={2000}
              showPagination={true}
              showNavigation={true}
            />
          </div>
        </div>

      </div>



      <FeaturesSection />
      <ProblemSolution />
      <CtaSection />
      <StackingCardsDemo />

      {/* <Footer /> */}
    </div>
  );
}
