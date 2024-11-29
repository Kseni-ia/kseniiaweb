import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Olena Kovalenko",
      role: "IT Professional from Ukraine",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
      content: "After relocating to Germany, I needed to improve my English quickly for my tech job. Kseniia understood my background perfectly and focused on IT terminology. In just 3 months, I was confidently leading meetings in English!",
      rating: 5
    },
    {
      name: "Jakub Novotný",
      role: "Medical Student from Czech Republic",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
      content: "Preparing for medical school interviews in English seemed impossible until I started lessons with Kseniia. Her structured approach and focus on medical terminology helped me succeed. Now I'm studying medicine in London!",
      rating: 5
    },
    {
      name: "Mariya Petrova",
      role: "Business Owner from Ukraine",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80",
      content: "Running an online business requires perfect English communication. Kseniia helped me improve my writing and speaking skills for client calls. My business has grown internationally thanks to our lessons.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-4 sm:text-4xl">Student Success Stories</h2>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Real stories from students who transformed their English skills and achieved their goals
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={testimonial.image} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-muted-foreground flex-grow">
              "{testimonial.content}"
            </blockquote>
          </Card>
        ))}
      </div>
    </section>
  );
}