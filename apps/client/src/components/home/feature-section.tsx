import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardPlus,
  Calendar,
  Brain,
  Activity,
  Stethoscope,
  MessageSquare,
  ImagePlus,
} from "lucide-react";
import { SlidingFeatures } from "./sliding-features";

const features = [
  {
    icon: Users,
    title: "Family Member Management",
    description:
      "Easily onboard your family by creating member profiles with personal and medical details.",
    badge: "Core",
  },
  {
    icon: ClipboardPlus,
    title: "Medical Records",
    description:
      "Securely store prescriptions, reports, and health history for each family member in one place.",
    badge: "Health",
  },
  {
    icon: Calendar,
    title: "Medical Schedules & Reminders",
    description:
      "Create medicine schedules and sync them with Google Calendar so you never miss a dose.",
    badge: "Scheduler",
  },
  {
    icon: Brain,
    title: "AI Health Assistant",
    description:
      "Chat with AI to generate diet, exercise, and sleep plans personalized for each family member.",
    badge: "AI Powered",
  },
  {
    icon: Activity,
    title: "Health Tracking",
    description:
      "Monitor metrics like sleep, exercise, and diet goals. Track progress for the entire family.",
    badge: "Analytics",
  },
  {
    icon: MessageSquare,
    title: "Chat Sessions",
    description:
      "Start AI chat sessions to ask questions, store conversations, and revisit family health insights.",
    badge: "Interactive",
  },
  {
    icon: ImagePlus,
    title: "Upload & Analyze Reports",
    description:
      "Upload medical images and documents, assign them to a member, and let AI generate structured insights.",
    badge: "AI + Media",
  },
  {
    icon: Stethoscope,
    title: "Medicine Information",
    description:
      "Search medicines, check real-life side effects, and understand interactions with other medicines.",
    badge: "Research",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Organize Your Family Health with AI
          </h2>
          <p className="text-lg text-muted-foreground">
            From medical records to AI-powered health plans, everything you need
            to keep your family healthy and stress-free.
          </p>
        </div>
        <div className="py-5">
          <SlidingFeatures />

        </div>



        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 w-fit">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
