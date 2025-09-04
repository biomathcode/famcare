import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/home/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/feature-section";
import { ProblemSolution } from "@/components/home/problem-solution";
import { StatsSection } from "@/components/home/stats-section";
import { PricingSection } from "@/components/home/pricing-section";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";
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
      <BentoGrid />
      <StackingCardsDemo />

      {/* <Footer /> */}
    </div>
  );
}


const BentoGrid = () => {
  return (
    <section className="py-20 sm:py-28">

      <div className="container mx-auto flex h-full w-full items-center justify-center">
        <div className="grid w-full max-w-6xl grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 lg:h-[800px] lg:grid-cols-4">
          <div className="relative flex flex-col gap-2 rounded-3xl border p-4 md:col-span-1">
            <div className="pointer-events-none absolute -inset-px hidden rounded-[inherit] border transition-opacity opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity opacity-100">
              <div className='glow rounded-[inherit] after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:[border:var(--glowingeffect-border-width)_solid_transparent] after:[background:var(--gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]'></div>
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-muted-foreground">#1 Block</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-help text-muted-foreground size-4"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div className="bg-muted w-full flex-1 overflow-hidden rounded-3xl">
              <img
                src="/images/block/guri3/img1.jpeg"
                alt="Quality"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Quality</h3>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consec adipisicing elit. Quisquam, quos.
            </p>
          </div>
          <div className="relative flex flex-col gap-2 rounded-3xl border p-4 lg:col-span-2">
            <div className="pointer-events-none absolute -inset-px hidden rounded-[inherit] border transition-opacity opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity opacity-100">
              <div className='glow rounded-[inherit] after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:[border:var(--glowingeffect-border-width)_solid_transparent] after:[background:var(--gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]' />
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-muted-foreground">#2 Block</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-help text-muted-foreground size-4"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div className="bg-muted w-full flex-1 overflow-hidden rounded-3xl">
              <img
                src="/images/block/guri3/img7.jpeg"
                alt="Innovation"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Innovation</h3>
            <p className="text-muted-foreground">
              Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
              Lorem ipsum dolor sit amet consec adipisicing elit.
            </p>
          </div>
          <div className="relative flex flex-col gap-2 rounded-3xl border p-4 md:col-span-1 lg:row-span-2">
            <div className="pointer-events-none absolute -inset-px hidden rounded-[inherit] border transition-opacity opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity opacity-100">
              <div className='glow rounded-[inherit] after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:[border:var(--glowingeffect-border-width)_solid_transparent] after:[background:var(--gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]' />
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-muted-foreground">#3 Block</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-help text-muted-foreground size-4"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div className="bg-muted w-full flex-1 overflow-hidden rounded-3xl">
              <img
                src="/images/block/guri3/img11.jpeg"
                alt="Performance"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              Performance
            </h3>
            <p className="text-muted-foreground">
              Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.
            </p>
          </div>
          <div className="relative flex flex-col gap-2 rounded-3xl border p-4 lg:col-span-2">
            <div className="pointer-events-none absolute -inset-px hidden rounded-[inherit] border transition-opacity opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity opacity-100">
              <div className='glow rounded-[inherit] after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:[border:var(--glowingeffect-border-width)_solid_transparent] after:[background:var(--gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]' />
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-muted-foreground">#2 Block</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-help text-muted-foreground size-4"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div className="bg-muted w-full flex-1 overflow-hidden rounded-3xl">
              <img
                src="/images/block/guri3/img2.jpeg"
                alt="Innovation"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Innovation</h3>
            <p className="text-muted-foreground">
              Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
              Lorem ipsum dolor sit amet consec adipisicing elit.
            </p>
          </div>
          <div className="relative flex flex-col gap-2 rounded-3xl border p-4 md:col-span-1">
            <div className="pointer-events-none absolute -inset-px hidden rounded-[inherit] border transition-opacity opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity opacity-100">
              <div className='glow rounded-[inherit] after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:[border:var(--glowingeffect-border-width)_solid_transparent] after:[background:var(--gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]' />
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-muted-foreground">#4 Block</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-help text-muted-foreground size-4"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div className="bg-muted w-full flex-1 overflow-hidden rounded-3xl">
              <img
                src="/images/block/guri3/img4.jpeg"
                alt="Reliability"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              Reliability
            </h3>
            <p className="text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}