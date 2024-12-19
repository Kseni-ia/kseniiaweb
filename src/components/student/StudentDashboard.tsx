import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, query, onSnapshot, addDoc, doc, getDoc, orderBy, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '../Logo';
import { MessageCircle, Calendar, User } from 'lucide-react';

type ActiveTab = 'messages' | 'calendar' | 'profile';

interface Message {
  id: string;
  sender: 'student' | 'admin';
  content: string;
  timestamp: string;
  status: 'sending' | 'delivered' | 'read';
  topic: string;
  studentId: string;
}

interface Topic {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  startDate?: string;
  unread?: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  subscriptionPlan?: 'none' | 'basic' | 'premium';
}

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([
    { 
      id: 'lessons', 
      name: 'Lessons Schedule',
      startDate: new Date().toISOString()
    },
    { 
      id: 'technical', 
      name: 'Technical Support',
      startDate: new Date().toISOString()
    },
    { 
      id: 'billing', 
      name: 'Billing & Subscription',
      startDate: new Date().toISOString()
    },
    { 
      id: 'general', 
      name: 'General Questions',
      startDate: new Date().toISOString()
    }
  ]);
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    // Fetch student info
    const fetchStudentInfo = async () => {
      const studentDoc = await getDoc(doc(db, 'students', studentId));
      if (studentDoc.exists()) {
        setStudentInfo({ id: studentDoc.id, ...studentDoc.data() } as Student);
      }
      setLoading(false);
    };

    // Listen for messages
    const unsubMessages = onSnapshot(
      query(
        collection(db, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        const newMessages = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message))
          .filter(msg => msg.studentId === studentId);
        setMessages(newMessages);

        // Update topics with last message info
        const topicsMap = new Map<string, Topic>();
        topics.forEach(topic => topicsMap.set(topic.id, { ...topic }));

        newMessages.forEach(message => {
          const topic = topicsMap.get(message.topic);
          if (topic) {
            if (!topic.lastMessageTime || new Date(message.timestamp) > new Date(topic.lastMessageTime)) {
              topic.lastMessage = message.content;
              topic.lastMessageTime = message.timestamp;
            }
          }
        });

        setTopics(Array.from(topicsMap.values()));
      }
    );

    fetchStudentInfo();
    return () => unsubMessages();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatOrdinalDate = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10 ? day % 10 : 0)];
    return `${day}${suffix} of ${date.toLocaleString('default', { month: 'long' })}`;
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = date.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, messages]) => ({
        date: new Date(date),
        messages: messages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || (!selectedTopic && !newTopic)) return;

    let topicId = selectedTopic;

    // If it's a new topic, create it first
    if (isNewTopic) {
      const newTopicRef = await addDoc(collection(db, 'topics'), {
        name: newTopic,
        studentId: localStorage.getItem('studentId'),
        createdAt: new Date().toISOString()
      });
      topicId = newTopicRef.id;
      setSelectedTopic(topicId);
      setIsNewTopic(false);
      setNewTopic('');

      // Add the new topic to the local state
      setTopics(prev => [...prev, {
        id: topicId,
        name: newTopic,
        startDate: new Date().toISOString()
      }]);
    }

    const messageData = {
      content: newMessage,
      sender: 'student' as const,
      timestamp: new Date().toISOString(),
      topic: topicId,
      studentId: localStorage.getItem('studentId'),
      status: 'sending' as const
    };

    // Add message to Firestore
    const messageRef = await addDoc(collection(db, 'messages'), messageData);
    
    setNewMessage('');

    // Simulate message delivery
    setTimeout(async () => {
      await updateDoc(doc(db, 'messages', messageRef.id), {
        status: 'delivered'
      });

      // Simulate message being read after delivery
      setTimeout(async () => {
        await updateDoc(doc(db, 'messages', messageRef.id), {
          status: 'read'
        });
      }, 2000); // Read after 2 seconds
    }, 1000); // Delivered after 1 second
  };

  const handleLogout = () => {
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('studentId');
    auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="bg-white border-b relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>

            <nav className="flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'messages'
                    ? 'text-[#000080] bg-blue-50'
                    : 'text-gray-600 hover:text-[#000080] hover:bg-blue-50'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Messages</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calendar'
                    ? 'text-[#000080] bg-blue-50'
                    : 'text-gray-600 hover:text-[#000080] hover:bg-blue-50'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Calendar</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-[#000080] bg-blue-50'
                    : 'text-gray-600 hover:text-[#000080] hover:bg-blue-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </button>

              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content with centered watermark */}
      <div className="flex-1 relative overflow-hidden">
        {/* Centered watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -mt-16">
          <div 
            className="font-bold font-caudex logo-text opacity-10"
            style={{ 
              transform: 'rotate(-30deg)',
              whiteSpace: 'nowrap',
              fontSize: '10rem',
              letterSpacing: '0.1em'
            }}
          >
            EDUBRIDGE
          </div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full">
          <main className="max-w-7xl mx-auto px-4 py-6">
            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-md">
                <div className="grid grid-cols-4 h-[600px]">
                  {/* Topics Sidebar */}
                  <div className="col-span-1 border-r">
                    <div className="p-4 border-b">
                      <Button
                        onClick={() => setIsNewTopic(true)}
                        className="w-full bg-[#000080] text-white hover:bg-[#4169E1]"
                      >
                        New Topic
                      </Button>
                    </div>
                    <div className="overflow-y-auto h-[calc(600px-64px)]">
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setSelectedTopic(topic.id);
                            setIsNewTopic(false);
                          }}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                            selectedTopic === topic.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="font-medium text-gray-900">{topic.name}</div>
                          {topic.lastMessage && (
                            <>
                              <div className="text-sm text-gray-500 truncate">{topic.lastMessage}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(topic.lastMessageTime!).toLocaleString()}
                              </div>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="col-span-3 flex flex-col bg-gray-50">
                    <div className="p-4 border-b bg-white shadow-sm">
                      {(selectedTopic || isNewTopic) && (
                        <div>
                          <h2 className="text-xl font-semibold text-[#000080]">
                            {isNewTopic ? 'New Topic' : topics.find(t => t.id === selectedTopic)?.name}
                          </h2>
                        </div>
                      )}
                      {!selectedTopic && !isNewTopic && (
                        <h2 className="text-xl font-semibold text-[#000080]">Select a Topic</h2>
                      )}
                    </div>

                    {(selectedTopic || isNewTopic) && (
                      <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                          {selectedTopic && groupMessagesByDate(
                            messages.filter(msg => msg.topic === selectedTopic)
                          ).map(({ date, messages }) => (
                            <div key={date.toISOString()} className="space-y-6">
                              <div className="flex items-center justify-center relative">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative">
                                  <div className="bg-white text-gray-500 px-6 py-2 rounded-full text-sm font-medium shadow-sm border">
                                    {formatOrdinalDate(date)}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {messages.map((message, index) => {
                                  const isLastInGroup = index === messages.length - 1 || 
                                    messages[index + 1]?.sender !== message.sender;
                                  const isFirstInGroup = index === 0 || 
                                    messages[index - 1]?.sender !== message.sender;
                                  
                                  return (
                                    <div
                                      key={message.id}
                                      className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                                    >
                                      <div
                                        className={`flex flex-col ${
                                          message.sender === 'student' ? 'items-end' : 'items-start'
                                        } max-w-[70%]`}
                                      >
                                        <div className={`px-4 py-2 rounded-3xl relative ${
                                          message.sender === 'student'
                                            ? 'bg-[#0b57d0] text-white'
                                            : 'bg-[#f2f2f7] text-black'
                                        } ${
                                          message.sender === 'student'
                                            ? isLastInGroup 
                                              ? 'rounded-br-md' 
                                              : ''
                                            : isLastInGroup
                                              ? 'rounded-bl-md'
                                              : ''
                                        }`}>
                                          <div className="flex items-end gap-1">
                                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                              {message.content}
                                            </p>
                                            {message.sender === 'student' && (
                                              <span className="flex items-center ml-1 mb-0.5">
                                                {message.status === 'sending' && (
                                                  <svg className="w-3 h-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                )}
                                                {message.status === 'delivered' && (
                                                  <svg className="w-3 h-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
                                                  </svg>
                                                )}
                                                {message.status === 'read' && (
                                                  <svg className="w-3 h-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
                                                  </svg>
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        {isLastInGroup && (
                                          <div 
                                            className={`text-[11px] mt-1 ${
                                              message.sender === 'student' 
                                                ? 'text-gray-500 pr-2' 
                                                : 'text-gray-500 pl-2'
                                            }`}
                                          >
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-white border-t">
                          {isNewTopic && (
                            <div className="mb-4">
                              <Input
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Enter topic name..."
                                className="mb-2 bg-white border-gray-200 focus:border-[#000080] focus:ring-[#000080] transition-colors"
                              />
                            </div>
                          )}
                          <form onSubmit={handleSendMessage} className="relative">
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-[#000080] focus-within:ring-1 focus-within:ring-[#000080] transition-all">
                              <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-0 focus:ring-0 px-2 py-1.5 shadow-none text-gray-800 placeholder:text-gray-400"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="p-2 text-gray-400 hover:text-[#000080] transition-colors"
                                  title="Attach file"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-400 hover:text-[#000080] transition-colors"
                                  title="Add emoji"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3.975 3.975 0 015.542 0 1 1 0 001.415-1.415 5.975 5.975 0 00-8.372 0 1 1 0 000 1.415z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <Button
                                  type="submit"
                                  className="bg-[#000080] text-white hover:bg-[#4169E1] rounded-xl px-6 py-2 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  disabled={isNewTopic && !newTopic.trim()}
                                >
                                  <span>Send</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </>
                    )}

                    {!selectedTopic && !isNewTopic && (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">💬</div>
                          <p>Select a topic or create a new one to start messaging</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-[#000080] mb-4">Calendar</h2>
                {/* Add calendar component here */}
                <p className="text-gray-600">Calendar functionality coming soon...</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-[#000080] mb-4">My Profile</h2>
                {studentInfo && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="mt-1 text-lg">{studentInfo.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-lg">{studentInfo.email}</p>
                    </div>
                    {studentInfo.dateOfBirth && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                        <p className="mt-1 text-lg">{studentInfo.dateOfBirth}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Subscription Plan</label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          studentInfo.subscriptionPlan === 'premium'
                            ? 'bg-[#000080] text-white'
                            : studentInfo.subscriptionPlan === 'basic'
                            ? 'bg-[#4169E1] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {studentInfo.subscriptionPlan || 'None'}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
