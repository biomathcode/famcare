import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileWarning,
  Pill,
  CalendarX,
  CheckCircle,
  Brain,
  HeartPulse,
  Users,
} from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Problem Side */}
          <div>
            <Badge variant="destructive" className="mb-4 px-3 py-1">
              The Problem
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Managing Family Health is Overwhelming
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Families struggle to keep track of medical records, medicine
              schedules, and health goals across multiple members. Important
              details are often forgotten, leading to missed doses, unmanaged
              conditions, and unnecessary stress.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileWarning className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    Scattered Medical Records
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Prescriptions, test reports, and history stored in different
                    places are hard to access when needed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Pill className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Missed Medicines</h3>
                  <p className="text-sm text-muted-foreground">
                    Missed doses and irregular schedules reduce treatment
                    effectiveness and harm recovery.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarX className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Untracked Health Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Sleep, diet, and exercise plans are rarely tracked, making
                    long-term health management nearly impossible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Side */}
          <div>
            <Badge className="mb-4 px-3 py-1">The Solution</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              AI-Powered Family Health Management
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform organizes all your family’s health data in one place
              and uses AI to generate personalized health insights, reminders,
              and care plans—so you never miss what matters most.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    Centralized Member Profiles
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage medical details, history, and schedules for each
                    family member in one dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Smart Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-driven medicine schedules and calendar integration keep
                    you on track without the stress.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    Personalized AI Health Plans
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get tailored diet, exercise, and sleep recommendations for
                    each family member.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HeartPulse className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Long-Term Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Track health goals and progress over time for a healthier
                    future.
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full sm:w-auto">
              Start Managing Family Health
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
