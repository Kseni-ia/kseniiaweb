import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export function Contact() {
  return (
    <section id="contact" className="container py-24 sm:py-32">
      <Card className="max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Get in Touch</h2>
        <form className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <Textarea id="message" placeholder="Tell us about your learning goals..." className="min-h-[120px]" />
          </div>
          <Button className="w-full">Send Message</Button>
        </form>
      </Card>
    </section>
  );
}