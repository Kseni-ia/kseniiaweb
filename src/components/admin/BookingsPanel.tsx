import { useState, useEffect } from 'react';

interface Booking {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#000080]">Booked Lessons</h2>
      </div>
      
      <div className="flex-1 overflow-auto pr-2">
        <div className="grid gap-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.name}</h3>
                    <p className="text-gray-600 text-sm">{booking.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700">
                    Date: {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">Time: {booking.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No bookings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
