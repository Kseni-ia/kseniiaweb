import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Single Session",
      price: "400Kč",
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
      price: "1900Kč",
      duration: "(380Kč/hour)",
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
      price: "3600Kč",
      duration: "(360Kč/hour)",
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
    <section id="pricing" className="container mt-24 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-4 sm:text-4xl text-[#000080]">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-[#4169E1] mb-8 max-w-2xl mx-auto">
          Choose the package that best suits your learning journey. All packages include personalized attention and materials.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className="p-6 border border-[#4169E1]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#000080] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#000080]">{plan.price}</span>
                    <span className="text-[#4169E1] text-sm">{plan.duration}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#4169E1] mt-0.5 flex-shrink-0" />
                      <span className="text-[#000080]/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-[#000080] hover:bg-[#4169E1] transition-colors">
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}