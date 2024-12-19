import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase/config";

interface Plan {
  id: string;
  name: string;
  priceAmount: number;
  duration: {
    value: number;
    unit: 'minutes' | 'hours';
  };
  features: string[];
  isActive: boolean;
}

export function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    // Only fetch active plans
    const q = query(
      collection(db, 'plans'),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const planData: Plan[] = [];
      snapshot.forEach((doc) => {
        planData.push({ id: doc.id, ...doc.data() } as Plan);
      });
      setPlans(planData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="pricing" className="container mt-24 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-4 sm:text-4xl text-[#000080]">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-[#4169E1] mb-8 max-w-2xl mx-auto">
          Choose the package that best suits your learning journey. All packages include personalized attention and materials.
        </p>
        <div className={`grid gap-6 ${
          plans.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
          plans.length === 2 ? 'md:grid-cols-2' :
          'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 border border-[#4169E1]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#000080]">{plan.name}</h3>
                    <ShieldCheck className="h-6 w-6 text-[#4169E1] stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-[#000080]">{plan.priceAmount} CZK</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-between gap-2">
                      <span className="text-[#000080]/80 text-sm">{feature}</span>
                      <BadgeCheck className="h-4 w-4 text-[#4169E1] flex-shrink-0 stroke-[1.5]" />
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