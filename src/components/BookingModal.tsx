import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    lessonType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#000080]">Book a Lesson</DialogTitle>
          <DialogDescription className="text-[#4169E1]">
            Fill out the form below to schedule your English lesson.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lessonType">Lesson Type</Label>
            <Select
              value={formData.lessonType}
              onValueChange={(value) => setFormData({ ...formData, lessonType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General English</SelectItem>
                <SelectItem value="business">Business English</SelectItem>
                <SelectItem value="academic">Academic English</SelectItem>
                <SelectItem value="exam">Exam Preparation</SelectItem>
                <SelectItem value="conversation">Conversation Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your goals and preferences..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#000080] text-[#000080] hover:bg-[#000080]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#000080] text-white hover:bg-[#4169E1]"
            >
              Book Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
