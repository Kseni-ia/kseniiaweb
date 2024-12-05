import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !studentName || !studentEmail) return;

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: selectedTime.toISOString(),
          studentName,
          studentEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(4);
      } else {
        setError(data.error || "Booking failed");
      }
    } catch (err) {
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4">
            <label className="text-sm font-medium text-gray-700">
              Select Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateSelect}
              minDate={new Date()}
              inline
              className="w-full"
              calendarClassName="!border-[#000080]"
              dayClassName={date => 
                "hover:bg-[#000080] hover:text-white transition-colors"
              }
            />
          </div>
        );

      case 2:
        return (
          <div className="grid gap-4">
            <label className="text-sm font-medium text-gray-700">
              Select Time
            </label>
            <DatePicker
              selected={selectedTime}
              onChange={handleTimeSelect}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
              placeholderText="Choose a time"
            />
            <button
              onClick={() => setStep(1)}
              className="text-sm text-[#000080] hover:underline"
            >
              Back to Date Selection
            </button>
          </div>
        );

      case 3:
        return (
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Your Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(2)}
                className="text-sm text-[#000080] hover:underline"
              >
                Back to Time Selection
              </button>
              <button
                onClick={handleBooking}
                disabled={!studentName || !studentEmail || loading}
                className="bg-[#000080] text-white px-4 py-2 rounded-md hover:bg-[#4169E1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Booking..." : "Book Trial Lesson"}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#000080]">
              Your lesson is scheduled!
            </h2>
            <p className="text-gray-600">
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
              {selectedTime && ` at ${format(selectedTime, "h:mm aa")}`}
            </p>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to {studentEmail}
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-[#000080] text-white px-4 py-2 rounded-md hover:bg-[#4169E1] transition-all duration-300"
            >
              Done
            </button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#000080]">
            Book Your Trial Lesson
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
