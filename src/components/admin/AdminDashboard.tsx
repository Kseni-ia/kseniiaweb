import { useState } from 'react';
import { MessagesPanel } from './MessagesPanel';
import { BookingsPanel } from './BookingsPanel';
import { ContactsPanel } from './ContactsPanel';

interface Tab {
  id: 'messages' | 'bookings' | 'contacts';
  label: string;
}

const tabs: Tab[] = [
  { id: 'messages', label: 'Messages' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'contacts', label: 'Contacts' },
];

interface AdminDashboardProps {
  activeTab: 'messages' | 'bookings' | 'contacts';
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 bg-gray-50 z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
        <div className="bg-white rounded-lg shadow p-6 h-full overflow-auto">
          {activeTab === 'messages' && <MessagesPanel />}
          {activeTab === 'bookings' && <BookingsPanel />}
          {activeTab === 'contacts' && <ContactsPanel />}
        </div>
      </div>
    </div>
  );
}
