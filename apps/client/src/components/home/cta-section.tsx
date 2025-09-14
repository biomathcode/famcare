import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";


export function CtaSection() {
  return (
    <section className="py-20 sm:py-2 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Take charge of your family’s health, together
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Organize medicines, track health records, and build healthier
            routines with FamCare. Start today and give your loved ones the care
            they deserve—simple, smart, and stress-free.
          </p>

          {/* CTA Form */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-lg mx-auto">
            <Input
              placeholder="Enter your email address"
              type="email"
              className="h-12 text-base flex-1"
            />
            <Link to="/app/home">
              <Button size="lg" className="h-12 px-8 sm:px-6 bg-orange-600 hover:bg-orange-700">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
