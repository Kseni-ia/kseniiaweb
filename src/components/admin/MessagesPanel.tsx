import { useEffect, useState } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

export function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    // Load messages from localStorage
    const loadMessages = () => {
      const storedMessages = localStorage.getItem('contactMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };

    // Initial load
    loadMessages();

    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contactMessages') {
        loadMessages();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#000080]">Contact Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center">No messages yet</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{message.name}</h3>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-[#4169E1] hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <span className="text-sm text-gray-500">{message.date}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
