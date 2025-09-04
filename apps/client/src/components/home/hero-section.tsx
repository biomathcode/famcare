import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Shield, Zap, Sparkles } from "lucide-react";
import authClient from "~/lib/auth/auth-client";

import { LoginPopup } from "@/components/auth/login-popup";
import { Link } from "@tanstack/react-router";

export function HeroSection() {
  const { data } = authClient.useSession();

  const handleStartFree = () => {
    if (data) {
      window.location.href = "/app";
    }
  };

  return (


    <section className="relative  w-full  py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 text-sm font-medium bg-primary/5 border-primary/20 text-primary"
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Open Sourced
          </Badge>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Take care of Family Health {" "} <br />
            <span className="bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent">
              Using AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Family Health Management system powered by AI
          </p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex gap-2 w-full sm:w-auto max-w-md">

              {data ? (
                <Link to="/app/home">

                  <Button
                    size="lg"
                    className="h-11 px-6"
                    onClick={handleStartFree}
                  >
                    Start Free
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>

              ) : (
                <LoginPopup>
                  <Button size="lg" className="h-11 px-6">
                    Start Free
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </LoginPopup>
              )}
            </div>
          </div>

          {/* Features preview */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Instant File Upload</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Create Medicine Schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Understand your own health </span>
            </div>
          </div>
        </div>
      </div>
    </section>


  );
}
