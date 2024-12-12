import { useState, useEffect } from 'react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
}

export function ContactsPanel() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#000080]">Contact List</h2>
      </div>
      
      <div className="flex-1 overflow-auto pr-2">
        <div className="grid gap-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-gray-600 text-sm">{contact.email}</p>
                    {contact.phone && (
                      <p className="text-gray-600 text-sm">Phone: {contact.phone}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{contact.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No contacts yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
