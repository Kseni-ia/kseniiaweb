import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc, orderBy, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarPanel } from './CalendarPanel';
import { Logo } from '../Logo';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  content: string;
  timestamp: string;
  status: 'sending' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  topic: string;
  lastMessage: string;
  time: string;
  messages: Message[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  age?: number;
  subscriptionPlan?: 'none' | 'basic' | 'premium';
  isSubscribed: boolean;
  tempPassword?: string;
  userId: string;
  passwordChanged?: boolean;
}

interface Plan {
  id: string;
  name: string;
  priceAmount: number;
  features: string[];
  isActive: boolean;
  createdAt: number;
}

type ActiveTab = 'chat' | 'calendar' | 'credits' | 'students';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentDOB, setNewStudentDOB] = useState('');
  const [newStudentPlan, setNewStudentPlan] = useState<'none' | 'basic' | 'premium'>('none');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPriceAmount, setNewPlanPriceAmount] = useState<number>(0);
  const [newPlanFeatures, setNewPlanFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'John Doe',
      topic: 'Course Registration',
      lastMessage: 'Hello, I have a question about...',
      time: '10:30 AM',
      messages: [
        {
          id: '1',
          sender: 'user',
          content: 'Hi, I would like to register for the upcoming Python course.',
          timestamp: '10:25 AM',
          status: 'read'
        },
        {
          id: '2',
          sender: 'admin',
          content: 'Hello! I can help you with that. Which level are you interested in?',
          timestamp: '10:27 AM',
          status: 'read'
        },
        {
          id: '3',
          sender: 'user',
          content: 'I have some basic experience. Would intermediate be suitable?',
          timestamp: '10:29 AM',
          status: 'read'
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      topic: 'Technical Support',
      lastMessage: 'Thank you for the help!',
      time: '09:15 AM',
      messages: [
        {
          id: '1',
          sender: 'user',
          content: "I'm having trouble accessing the course materials.",
          timestamp: '09:10 AM',
          status: 'read'
        },
        {
          id: '2',
          sender: 'admin',
          content: 'Let me help you with that. Could you describe what happens when you try to access them?',
          timestamp: '09:12 AM',
          status: 'read'
        },
        {
          id: '3',
          sender: 'user',
          content: 'Thank you for the help!',
          timestamp: '09:15 AM',
          status: 'read'
        }
      ]
    },
    {
      id: '3',
      name: 'Mike Johnson',
      topic: 'Schedule Inquiry',
      lastMessage: 'When is the next class?',
      time: 'Yesterday',
      messages: [
        {
          id: '1',
          sender: 'user',
          content: 'Could you tell me when the next JavaScript class is scheduled?',
          timestamp: 'Yesterday',
          status: 'read'
        },
        {
          id: '2',
          sender: 'admin',
          content: 'The next JavaScript class is scheduled for next Monday at 2 PM EST.',
          timestamp: 'Yesterday',
          status: 'read'
        }
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const [expandedCredentialId, setExpandedCredentialId] = useState<string | null>(null);

  const toggleCredentials = (studentId: string) => {
    setExpandedCredentialId(prevId => prevId === studentId ? null : studentId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMessageObj: Message = {
      id: Date.now().toString(),
      sender: 'admin',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      }),
      status: 'sending'
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessageObj],
              lastMessage: newMessage,
              time: newMessageObj.timestamp
            }
          : chat
      )
    );

    setNewMessage('');

    // Simulate message delivery (you would replace this with actual delivery logic)
    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newMessageObj.id
                    ? { ...msg, status: 'delivered' as const }
                    : msg
                )
              }
            : chat
        )
      );

      // Simulate message being read after delivery
      setTimeout(() => {
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === selectedChat
              ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === newMessageObj.id
                      ? { ...msg, status: 'read' as const }
                      : msg
                  )
                }
              : chat
          )
        );
      }, 2000); // Read after 2 seconds
    }, 1000); // Delivered after 1 second
  };

  useEffect(() => {
    // Listen for new messages
    const unsubMessages = onSnapshot(
      query(collection(db, 'messages'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(newMessages);
      }
    );

    // Listen for students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        const newStudents = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            dateOfBirth: data.dateOfBirth,
            age: data.age,
            subscriptionPlan: data.subscriptionPlan,
            isSubscribed: data.isSubscribed || false,
            tempPassword: data.tempPassword || '',
            userId: data.userId,
            passwordChanged: data.passwordChanged || false
          } as Student;
        });
        setStudents(newStudents);
      }
    );

    // Fetch plans from Firestore
    const unsubscribe = onSnapshot(collection(db, 'plans'), (snapshot) => {
      const planData: Plan[] = [];
      snapshot.forEach((doc) => {
        planData.push({ id: doc.id, ...doc.data() } as Plan);
      });
      setPlans(planData);
    });

    return () => {
      unsubMessages();
      unsubStudents();
      unsubscribe();
    };
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let userCredential;
    
    try {
      // Create auth user
      userCredential = await createUserWithEmailAndPassword(
        auth,
        newStudentEmail,
        newStudentPassword
      );

      // Create a document with the same ID as the auth user
      const studentRef = doc(db, 'students', userCredential.user.uid);
      await setDoc(studentRef, {
        name: newStudentName,
        email: newStudentEmail,
        userId: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        tempPassword: newStudentPassword,
        isSubscribed: false,
        subscriptionPlan: newStudentPlan,
        dateOfBirth: newStudentDOB || null,
        passwordChanged: false
      });

      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('');
      setNewStudentDOB('');
      setNewStudentPlan('none');
      setIsAddingStudent(false);
      setError('');
    } catch (error: any) {
      console.error('Error creating student:', error);
      
      // If we created the auth user but failed to create the document,
      // we should delete the auth user to maintain consistency
      if (userCredential?.user) {
        try {
          await userCredential.user.delete();
        } catch (deleteError) {
          console.error('Error cleaning up auth user:', deleteError);
        }
      }

      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Failed to create student account. Please try again.');
      }
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteDoc(doc(db, 'students', studentId));
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const studentRef = doc(db, 'students', selectedStudent.id);
      const age = newStudentDOB ? calculateAge(new Date(newStudentDOB)) : undefined;
      
      await updateDoc(studentRef, {
        name: newStudentName,
        email: newStudentEmail,
        dateOfBirth: newStudentDOB,
        age,
        subscriptionPlan: newStudentPlan,
        isSubscribed: newStudentPlan !== 'none'
      });

      setIsEditingStudent(false);
      setSelectedStudent(null);
      setError('');
    } catch (err) {
      setError('Failed to update student information');
      console.error('Error updating student:', err);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate inputs
      if (newPlanPriceAmount < 0) {
        setError('Price cannot be negative');
        return;
      }
      if (!newPlanName.trim()) {
        setError('Plan name is required');
        return;
      }

      const planData = {
        name: newPlanName.trim(),
        priceAmount: Number(newPlanPriceAmount),
        features: newPlanFeatures,
        isActive: true,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'plans'), planData);

      // Reset form
      setNewPlanName('');
      setNewPlanPriceAmount(0);
      setNewPlanFeatures([]);
      setIsEditingPlan(false);
      setError('');
    } catch (err) {
      console.error('Error adding plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to add plan');
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError('No plan selected for update');
      return;
    }

    try {
      // Validate inputs
      if (newPlanPriceAmount < 0) {
        setError('Price cannot be negative');
        return;
      }
      if (!newPlanName.trim()) {
        setError('Plan name is required');
        return;
      }

      const planData = {
        name: newPlanName.trim(),
        priceAmount: Number(newPlanPriceAmount),
        features: newPlanFeatures
      };

      const planRef = doc(db, 'plans', selectedPlan.id);
      await updateDoc(planRef, planData);

      // Reset form
      setIsEditingPlan(false);
      setSelectedPlan(null);
      setError('');
    } catch (err) {
      console.error('Error updating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to update plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deleteDoc(doc(db, 'plans', planId));
    } catch (err) {
      setError('Failed to delete plan');
      console.error('Error deleting plan:', err);
    }
  };

  const handleStartEdit = (student: Student) => {
    setSelectedStudent(student);
    setNewStudentName(student.name);
    setNewStudentEmail(student.email);
    setNewStudentDOB(student.dateOfBirth || '');
    setNewStudentPlan(student.subscriptionPlan || 'none');
    setIsEditingStudent(true);
  };

  const handleStartEditPlan = (plan: Plan) => {
    try {
      setSelectedPlan(plan);
      setNewPlanName(plan.name);
      setNewPlanPriceAmount(Number(plan.priceAmount) || 0);
      setNewPlanFeatures(Array.isArray(plan.features) ? [...plan.features] : []);
      setIsEditingPlan(true);
      setError('');
    } catch (err) {
      console.error('Error setting up plan edit:', err);
      setError('Failed to load plan data');
    }
  };

  const handleTogglePlanStatus = async (plan: Plan) => {
    try {
      const planRef = doc(db, 'plans', plan.id);
      await updateDoc(planRef, {
        isActive: !plan.isActive
      });
    } catch (err) {
      setError('Failed to update plan status');
      console.error('Error updating plan status:', err);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewPlanFeatures([...newPlanFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlanFeatures(newPlanFeatures.filter((_, i) => i !== index));
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedStudentForReset, setSelectedStudentForReset] = useState<Student | null>(null);
  const [newTempPassword, setNewTempPassword] = useState('');

  const handleResetPassword = async () => {
    if (!selectedStudentForReset || !newTempPassword) return;

    try {
      // Update the temporary password in Firestore
      await updateDoc(doc(db, 'students', selectedStudentForReset.id), {
        tempPassword: newTempPassword,
        passwordResetAt: new Date(),
        passwordChanged: false
      });

      setNewTempPassword('');
      setIsResetPasswordModalOpen(false);
      setSelectedStudentForReset(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const openResetPasswordModal = (student: Student) => {
    setSelectedStudentForReset(student);
    setIsResetPasswordModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm relative z-20 flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-none flex items-center">
              <Logo className="text-[#000080] my-auto" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex space-x-12">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab('credits')}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Credits
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Students
                </button>
              </div>
            </div>
            <div className="flex-none flex items-center">
              <Button
                onClick={() => {
                  localStorage.removeItem('isAdminLoggedIn');
                  window.location.href = '/';
                }}
                className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
          <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-full">
              {activeTab === 'chat' && (
                <div className="flex h-full">
                  {/* Chat list */}
                  <div className="w-1/3 border-r pr-4 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4 text-[#000080]">Recent Chats</h2>
                    <div className="space-y-2">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedChat === chat.id
                              ? 'bg-[#000080] text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-semibold ${
                              selectedChat === chat.id ? 'text-white' : 'text-[#000080]'
                            }`}>
                              {chat.name}
                            </h3>
                            <span className={`text-sm ${
                              selectedChat === chat.id ? 'text-gray-200' : 'text-gray-500'
                            }`}>
                              {chat.time}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${
                            selectedChat === chat.id ? 'text-gray-200' : 'text-gray-600'
                          }`}>
                            {chat.lastMessage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chat content */}
                  <div className="w-2/3 pl-4 flex flex-col h-full">
                    {selectedChat ? (
                      <>
                        {/* Chat header */}
                        <div className="pb-4 border-b mb-4">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#000080]">
                              {chats.find(chat => chat.id === selectedChat)?.name}
                            </h2>
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              {chats.find(chat => chat.id === selectedChat)?.topic}
                            </span>
                          </div>
                        </div>
                        
                        {/* Chat messages */}
                        <div className="flex-1 overflow-y-auto mb-4">
                          <div className="space-y-4">
                            {chats.find(chat => chat.id === selectedChat)?.messages.map((message) => (
                              <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg py-2 px-4 max-w-[70%] ${
                                  message.sender === 'admin' 
                                    ? 'bg-[#000080] text-white' 
                                    : 'bg-gray-100'
                                }`}>
                                  <div className="mb-1">{message.content}</div>
                                  <div className="flex items-center justify-end gap-1 text-xs">
                                    <span className={
                                      message.sender === 'admin' ? 'text-gray-200' : 'text-gray-500'
                                    }>
                                      {message.timestamp}
                                    </span>
                                    {message.sender === 'admin' && (
                                      <span className="ml-1">
                                        {message.status === 'sending' && (
                                          <svg className="w-3 h-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                        )}
                                        {message.status === 'delivered' && (
                                          <svg className="w-3 h-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                        {message.status === 'read' && (
                                          <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Message input */}
                        <div className="border-t pt-4">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Type your message..."
                              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#000080]"
                            />
                            <button 
                              onClick={handleSendMessage}
                              className="bg-[#000080] text-white px-4 py-2 rounded-lg hover:bg-[#4169E1] transition-colors duration-300"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Select a chat to start messaging
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="h-full">
                  <CalendarPanel />
                </div>
              )}

              {activeTab === 'credits' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#000080]">Plan Management</h2>
                    <Button
                      onClick={() => {
                        setSelectedPlan(null);
                        setNewPlanName('');
                        setNewPlanPriceAmount(0);
                        setNewPlanFeatures([]);
                        setIsEditingPlan(true);
                      }}
                      className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                    >
                      Add New Plan
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <div key={plan.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                          {/* Plan Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#000080]">{plan.name}</h3>
                            <div className={`px-2 py-1 rounded-full text-sm ${
                              plan.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </div>

                          {/* Plan Details */}
                          <div className="mb-4">
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-2xl font-bold text-[#000080]">{plan.priceAmount} CZK</span>
                            </div>
                          </div>

                          {/* Plan Features */}
                          <div className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4169E1] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-600 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleStartEditPlan(plan)}
                              className="flex-1 bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                              size="sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleTogglePlanStatus(plan)}
                              className={`flex-1 ${
                                plan.isActive
                                  ? 'bg-yellow-500 hover:bg-yellow-600'
                                  : 'bg-green-500 hover:bg-green-600'
                              } text-white`}
                              size="sm"
                            >
                              {plan.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              onClick={() => handleDeletePlan(plan.id)}
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#000080]">Student Management</h2>
                    <Button
                      onClick={() => setIsAddingStudent(true)}
                      className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                    >
                      Add New Student
                    </Button>
                  </div>

                  {/* Students List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="relative mb-6"
                      >
                        <div className={`bg-white rounded-xl shadow-md transition-all duration-300 ${
                          expandedCredentialId === student.id 
                            ? 'shadow-lg' 
                            : 'hover:shadow-lg'
                        }`}>
                          <div className="p-6">
                            {/* Student Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-[#000080] flex items-center justify-center text-white text-xl font-semibold">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-semibold text-[#000080]">{student.name}</h3>
                                </div>
                              </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-2 mb-4">
                              {student.dateOfBirth && (
                                <p className="text-sm text-gray-600">
                                  Date of Birth: {student.dateOfBirth}
                                </p>
                              )}
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Plan:</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  student.subscriptionPlan === 'premium' 
                                    ? 'bg-[#000080] text-white' 
                                    : student.subscriptionPlan === 'basic'
                                    ? 'bg-[#4169E1] text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {student.subscriptionPlan || 'None'}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-4">
                              <Button
                                onClick={() => handleStartEdit(student)}
                                className="flex-1 bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                                size="sm"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteStudent(student.id)}
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                              >
                                Delete
                              </Button>
                              <Button
                                onClick={() => openResetPasswordModal(student)}
                                size="sm"
                                className="flex-1 bg-[#000080] text-white hover:bg-[#4169E1]"
                              >
                                Reset Password
                              </Button>
                            </div>

                            {/* Login Credentials (Collapsible) */}
                            <div className="border-t pt-4">
                              <button
                                onClick={() => toggleCredentials(student.id)}
                                className="w-full flex items-center justify-between text-sm font-semibold text-[#4169E1] hover:text-[#000080] transition-colors duration-200"
                              >
                                <span>Login Credentials</span>
                                <svg
                                  className={`w-5 h-5 transition-transform duration-200 ${
                                    expandedCredentialId === student.id ? 'transform rotate-180' : ''
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Credentials Overlay */}
                        <div 
                          className={`absolute left-0 right-0 bg-white rounded-b-xl shadow-lg transition-all duration-300 ease-in-out ${
                            expandedCredentialId === student.id 
                              ? 'opacity-100 translate-y-0 z-10' 
                              : 'opacity-0 -translate-y-4 pointer-events-none'
                          }`}
                          style={{
                            top: '100%',
                            marginTop: '-0.5rem',
                          }}
                        >
                          <div className="p-4 border-t border-gray-100">
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                <code className="block bg-gray-50 px-3 py-2 rounded mt-1 text-sm border border-gray-200 font-mono">
                                  {student.email}
                                </code>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Password Status:</span>
                                <div className="mt-1 flex items-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    student.passwordChanged 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {student.passwordChanged ? 'Password Set by Student' : 'Using Temporary Password'}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => openResetPasswordModal(student)}
                                  className="w-full mt-2 bg-[#4169E1] hover:bg-[#000080] text-white transition-colors duration-200"
                                  size="sm"
                                >
                                  Reset Password
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#000080]">Add New Student</h2>
              <button
                onClick={() => setIsAddingStudent(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <Input
                  id="studentName"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">
                  Student Email
                </label>
                <Input
                  id="studentEmail"
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700">
                  Initial Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="studentPassword"
                    type={showPassword ? "text" : "password"}
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    required
                    className="pr-10"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="studentDOB" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <Input
                  id="studentDOB"
                  type="date"
                  value={newStudentDOB}
                  onChange={(e) => setNewStudentDOB(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="studentPlan" className="block text-sm font-medium text-gray-700">
                  Subscription Plan
                </label>
                <select
                  id="studentPlan"
                  value={newStudentPlan}
                  onChange={(e) => setNewStudentPlan(e.target.value as 'none' | 'basic' | 'premium')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#000080] focus:ring-[#000080]"
                  required
                >
                  <option value="none">No Subscription</option>
                  <option value="basic">Basic Plan</option>
                  <option value="premium">Premium Plan</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
              >
                Add Student
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditingStudent && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#000080]">Edit Student Information</h2>
              <button
                onClick={() => {
                  setIsEditingStudent(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label htmlFor="editStudentName" className="block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <Input
                  id="editStudentName"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="editStudentEmail" className="block text-sm font-medium text-gray-700">
                  Student Email
                </label>
                <Input
                  id="editStudentEmail"
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="editStudentDOB" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <Input
                  id="editStudentDOB"
                  type="date"
                  value={newStudentDOB}
                  onChange={(e) => setNewStudentDOB(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="editStudentPlan" className="block text-sm font-medium text-gray-700">
                  Subscription Plan
                </label>
                <select
                  id="editStudentPlan"
                  value={newStudentPlan}
                  onChange={(e) => setNewStudentPlan(e.target.value as 'none' | 'basic' | 'premium')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#000080] focus:ring-[#000080]"
                  required
                >
                  <option value="none">No Subscription</option>
                  <option value="basic">Basic Plan</option>
                  <option value="premium">Premium Plan</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
              >
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Plan Edit Modal */}
      {isEditingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#000080]">
                {selectedPlan ? 'Edit Plan' : 'Add New Plan'}
              </h2>
              <button
                onClick={() => {
                  setIsEditingPlan(false);
                  setSelectedPlan(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={selectedPlan ? handleUpdatePlan : handleAddPlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Plan Name
                </label>
                <Input
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="e.g., Single Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (CZK)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={newPlanPriceAmount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      setNewPlanPriceAmount(value);
                    }
                  }}
                  required
                  className="mt-1"
                  placeholder="e.g., 400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {newPlanFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        readOnly
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a new feature"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-[#000080] text-white hover:bg-[#4169E1]"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
              >
                {selectedPlan ? 'Save Changes' : 'Add Plan'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && selectedStudentForReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#000080]">Reset Password</h2>
              <button
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setSelectedStudentForReset(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Temporary Password
                </label>
                <Input
                  value={newTempPassword}
                  onChange={(e) => setNewTempPassword(e.target.value)}
                  required
                  className="mt-1"
                  type="password"
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
