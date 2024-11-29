import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Single Session",
      price: "$45",
      duration: "per hour",
      features: [
        "One-on-one tutoring",
        "Personalized lesson plan",
        "Learning materials included",
        "Session recording available"
      ]
    },
    {
      name: "Package (5 Sessions)",
      price: "$200",
      duration: "($40/hour)",
      features: [
        "All Single Session features",
        "Progress tracking",
        "Homework assignments",
        "Email support between lessons",
        "5% discount"
      ]
    },
    {
      name: "Package (10 Sessions)",
      price: "$380",
      duration: "($38/hour)",
      features: [
        "All 5-Session features",
        "Priority scheduling",
        "Monthly progress report",
        "Custom study materials",
        "10% discount"
      ]
    }
  ];

  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-6 sm:text-4xl">Simple, Transparent Pricing</h2>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Choose the package that best suits your learning journey. All packages include personalized attention and materials.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="mt-4 mb-8">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground"> {plan.duration}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Book Now</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}