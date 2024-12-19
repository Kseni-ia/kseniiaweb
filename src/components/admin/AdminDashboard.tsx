import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarPanel } from './CalendarPanel';

interface Message {
  id: string;
  text: string;
  studentId: string;
  timestamp: any;
  studentName: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

type ActiveTab = 'chat' | 'calendar' | 'credits' | 'students';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for new messages
    const unsubMessages = onSnapshot(
      query(collection(db, 'messages'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(newMessages);
      }
    );

    // Listen for students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        const newStudents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Student));
        setStudents(newStudents);
      }
    );

    return () => {
      unsubMessages();
      unsubStudents();
    };
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newStudentEmail,
        newStudentPassword
      );

      // Add to students collection
      await addDoc(collection(db, 'students'), {
        name: newStudentName,
        email: newStudentEmail,
        userId: userCredential.user.uid,
        createdAt: new Date()
      });

      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('');
      setIsAddingStudent(false);
    } catch (error: any) {
      setError(error.message);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('chat')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activeTab === 'chat' 
                    ? 'text-[#000080] border-b-2 border-[#000080]'
                    : 'text-gray-500 hover:text-[#000080]'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activeTab === 'calendar'
                    ? 'text-[#000080] border-b-2 border-[#000080]'
                    : 'text-gray-500 hover:text-[#000080]'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('credits')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activeTab === 'credits'
                    ? 'text-[#000080] border-b-2 border-[#000080]'
                    : 'text-gray-500 hover:text-[#000080]'
                }`}
              >
                Credits
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activeTab === 'students'
                    ? 'text-[#000080] border-b-2 border-[#000080]'
                    : 'text-gray-500 hover:text-[#000080]'
                }`}
              >
                Students
              </button>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1 p-4">
          {activeTab === 'chat' && (
            <div className="flex h-full">
              {/* Chat list */}
              <div className="w-1/3 border-r pr-4">
                <h2 className="text-xl font-bold mb-4">Recent Chats</h2>
                {/* Add chat list here */}
              </div>
              
              {/* Chat content */}
              <div className="w-2/3 pl-4 relative">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div 
                    className="text-gray-200 text-6xl font-bold transform rotate-45"
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-45deg)'
                    }}
                  >
                    EduBridge
                  </div>
                </div>
                
                {/* Chat messages will go here */}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <CalendarPanel />
          )}

          {activeTab === 'credits' && (
            <div>Credits content</div>
          )}

          {activeTab === 'students' && (
            <div className="h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#000080]">Student Management</h2>
                <Button
                  onClick={() => setIsAddingStudent(true)}
                  className="bg-[#000080] text-white hover:bg-[#4169E1]"
                >
                  Add New Student
                </Button>
              </div>

              {/* Student list */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <p className="text-gray-600">{student.email}</p>
                      </div>
                      <Button
                        onClick={() => handleDeleteStudent(student.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <Input
                  id="studentPassword"
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  required
                  className="mt-1"
                  minLength={6}
                />
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
    </div>
  );
}
