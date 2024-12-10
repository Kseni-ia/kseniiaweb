import { Heart, Target, Clock, Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "../styles/logo.css";

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
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-16 sm:text-4xl text-[#000080]">
        Why Choose <span className="logo-text">EDUBRIDGE</span> as your platform for learning
      </h2>
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div className="mb-6 p-2 cursor-pointer">
                    <feature.icon className="h-24 w-24 text-[#000080] transition-all duration-300 hover:text-[#4169E1] hover:scale-110" strokeWidth={2} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white p-3 rounded-lg shadow-lg max-w-[200px] border border-[#4169E1]/20">
                  <p className="text-[#4169E1] text-sm">{feature.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h3 className="font-semibold text-xl mb-3 text-[#000080]">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}