import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { db } from '../../firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  time: string;
  studentName: string;
  teacherName: string;
}

export function CalendarPanel() {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedBookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedBookings.push({
            id: doc.id,
            date: data.date,
            time: data.time,
            studentName: data.studentName,
            teacherName: data.teacherName,
          });
        });

        // Sort bookings by date and time
        fetchedBookings.sort((a, b) => {
          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateCompare === 0) {
            return a.time.localeCompare(b.time);
          }
          return dateCompare;
        });

        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="h-full flex">
      {/* Left side - Bookings List */}
      <div className="w-1/4 border-r border-gray-200 bg-white">
        <div className="p-3">
          <h2 className="text-lg font-semibold text-[#000080] mb-2">Booked Lessons</h2>
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-2 bg-white rounded-lg shadow border border-gray-100 hover:border-[#000080] hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-[#000080] text-sm">
                    {format(new Date(booking.date), 'MMM d')}
                  </div>
                  <div className="text-gray-600 font-medium text-sm">{booking.time}</div>
                </div>
                <div className="text-xs mt-1">
                  <div className="text-[#000080]/80">Student: <span className="font-medium">{booking.studentName}</span></div>
                  <div className="text-[#000080]/80">Teacher: <span className="font-medium">{booking.teacherName}</span></div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="text-center text-gray-500 py-2 text-sm">
                No bookings found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Calendar */}
      <div className="w-3/4 bg-gray-50">
        <div className="h-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-[#000080]" />
              </button>
              <h2 className="text-lg font-semibold text-[#000080]">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-[#000080]" />
              </button>
            </div>

            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                month={currentMonth}
                fromMonth={new Date(2024, 0)}
                toMonth={new Date(2024, 11)}
                fixedWeeks
                showOutsideDays
                className="rounded-lg border-none [&_.rdp]:p-1 [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-day]:w-14 [&_.rdp-day]:h-12 [&_.rdp-day]:text-base [&_.rdp-day_focus]:bg-[#000080] [&_.rdp-day_hover]:bg-[#000080]/10 [&_.rdp-day_active]:bg-[#000080] [&_.rdp-day_selected]:bg-[#000080] [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:hover:bg-[#4169E1] [&_.rdp-day_today]:bg-[#000080]/5 [&_.rdp-button_focus]:shadow-[#000080] [&_.rdp-caption]:hidden [&_.rdp-months]:justify-center [&_.rdp-head_cell]:text-base [&_.rdp-head_cell]:font-normal [&_.rdp-head_cell]:text-[#000080] [&_.rdp-tbody_tr]:mb-[8px] [&_.rdp-tbody]:space-y-[8px] [&_.rdp-tbody_tr:not(:last-child)]:mb-[8px] [&_.rdp-cell]:p-0 [&_.rdp-head_cell]:p-0 [&_.rdp-head_row]:mb-[8px] [&_.rdp-table]:mx-auto [&_.rdp-cell]:w-14 [&_.rdp-head_cell]:w-14"
                classNames={{
                  day_today: "font-bold text-[#000080] ring-1 ring-[#000080] ring-offset-1",
                  day_selected: "bg-[#000080] text-white hover:bg-[#4169E1] focus:bg-[#4169E1] transition-colors duration-200",
                  day_outside: "text-gray-300 hover:bg-gray-50",
                  button: "hover:bg-[#000080]/10 transition-all duration-200",
                  head_cell: "text-[#000080] font-normal text-base uppercase tracking-wide w-14 p-0",
                  cell: "text-center relative [&:has([aria-selected])]:bg-[#000080]/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-14 p-0",
                  table: "w-full border-collapse mx-auto",
                  tbody: "space-y-[8px]",
                  head_row: "mb-[8px]",
                  row: "mb-[8px]",
                  caption: "hidden",
                  months: "justify-center"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
