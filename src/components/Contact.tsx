import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{
    email?: string;
    general?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError({});
    setSuccess(false);

    // Validate email
    if (!validateEmail(formData.email)) {
      setError(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    if (!formData.name || !formData.message) {
      setError(prev => ({ ...prev, general: "All fields are required" }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Message submitted:", {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(prev => ({ ...prev, general: "Failed to send message. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    if (email && !validateEmail(email)) {
      setError(prev => ({ ...prev, email: "Please enter a valid email address" }));
    } else {
      setError(prev => ({ ...prev, email: undefined }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-tighter text-[#000080] sm:text-4xl mb-2">
          Get in Touch
        </h2>
        <p className="text-[#4169E1] text-lg">
          Have questions? I'd love to hear from you.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}
      
      {error.general && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
              className="w-full border-[#000080]/20 focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
            />
          </div>
          <div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="Email"
              className={`w-full border-[#000080]/20 focus:border-[#000080] focus:ring-1 focus:ring-[#000080] ${
                error.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-500">{error.email}</p>
            )}
          </div>
        </div>
        <div>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Your message"
            className="w-full min-h-[100px] border-[#000080]/20 focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
          />
        </div>
        <div className="text-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#000080] text-white hover:bg-[#4169E1] px-8"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}