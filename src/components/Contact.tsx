                                                                                                import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new message object
    const newMessage: ContactMessage = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleString(),
    };

    // Get existing messages from localStorage
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    
    // Add new message to the array
    const updatedMessages = [newMessage, ...existingMessages];
    
    // Save back to localStorage
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));

    // Reset form and show success message
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitted(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tighter text-[#000080] sm:text-4xl mb-2">
          Get in Touch
        </h2>
        <p className="text-[#4169E1] text-lg">
          Have questions? I'd love to hear from you.
        </p>
      </div>

      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-center">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition-colors"
            placeholder="Your message here..."
          />
        </div>

        <div className="text-center">
          <Button
            type="submit"
            className="bg-[#000080] text-white hover:bg-[#4169E1] px-8 py-2 text-lg transition-colors"
          >
            Send Message
          </Button>
        </div>
      </form>
    </motion.div>
  );
}