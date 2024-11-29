import { Card } from "@/components/ui/card";
import { Heart, Target, Clock, Award } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Heart,
      title: "Passionate Teaching",
      description: "I bring enthusiasm and dedication to every lesson, making learning English enjoyable and effective."
    },
    {
      icon: Target,
      title: "Personalized Approach",
      description: "Lessons are tailored to your goals, whether it's business English, academic success, or casual conversation."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Choose lesson times that work for you, with options available across different time zones."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "My students consistently achieve their language goals, from IELTS success to professional advancement."
    }
  ];

  return (
    <section id="features" className="container py-24 sm:py-32 bg-secondary/50">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl">Why Choose Me As Your Tutor</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 bg-background">
            <feature.icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}