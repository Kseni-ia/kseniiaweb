import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BookOpen, Video, Globe } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Conversation Practice",
      description: "Improve your speaking skills with natural conversations and real-world scenarios."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Grammar & Writing",
      description: "Master English grammar and develop strong writing skills for academic or professional success."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Online Classes",
      description: "Flexible online lessons that fit your schedule, from anywhere in the world."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Business English",
      description: "Specialized courses for professionals looking to excel in international business."
    }
  ];

  return (
    <section id="services" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of specialized English tutoring services designed to help you achieve your language goals.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="text-primary mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}