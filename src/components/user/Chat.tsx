import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../firebase/config';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, Paperclip, X, Image as ImageIcon, File, Loader2 } from 'lucide-react';

const MESSAGE_TOPICS = [
  { id: 'lessons', label: 'Questions Regarding Lessons' },
  { id: 'schedule', label: 'Schedule Changes' },
  { id: 'technical', label: 'Technical Issues' },
  { id: 'payment', label: 'Payment Questions' },
  { id: 'other', label: 'Other' }
];

interface Message {
  id: string;
  text: string;
  topic: string;
  timestamp: any;
  userId: string;
  userName: string;
  status: 'sending' | 'sent' | 'read' | 'error';
  readBy?: string[];
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Mark messages as read when admin views them
  useEffect(() => {
    if (!auth.currentUser?.uid || !messages.length) return;

    const isAdmin = auth.currentUser.email === 'admin@example.com'; // Replace with your admin email
    if (!isAdmin) return;

    const unreadMessages = messages.filter(
      msg => msg.userId !== auth.currentUser?.uid && (!msg.readBy || !msg.readBy.includes(auth.currentUser.uid))
    );

    unreadMessages.forEach(async (message) => {
      const messageRef = doc(db, 'messages', message.id);
      await updateDoc(messageRef, {
        status: 'read',
        readBy: [...(message.readBy || []), auth.currentUser!.uid]
      });
    });
  }, [messages]);

  const handleTopicChange = async (topicId: string) => {
    setSelectedTopic(topicId);
    setMessages([]);
    setLoading(true);
  };

  useEffect(() => {
    if (!selectedTopic) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'messages'),
      where('topic', '==', selectedTopic),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messageList);
      setLoading(false);
    }, (error) => {
      console.error("Error loading messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedTopic]);

  const scrollToBottom = (behavior: 'auto' | 'smooth' = 'auto') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && !isScrolling) {
      scrollToBottom('smooth');
    }
  }, [messages]);

  // Handle user scroll
  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messageList;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsScrolling(!isAtBottom);
    };

    messageList.addEventListener('scroll', handleScroll);
    return () => messageList.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  const uploadFile = async (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const fileName = `${auth.currentUser?.uid}_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `chat_attachments/${fileName}`);

    try {
      setIsUploading(true);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        url: downloadURL,
        type: file.type,
        name: file.name
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !auth.currentUser || !selectedTopic) return;

    const tempMessageId = Math.random().toString(36).substring(7);
    let attachmentData = null;

    const tempMessage: Message = {
      id: tempMessageId,
      text: newMessage,
      topic: selectedTopic,
      timestamp: new Date(),
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom('smooth');

    try {
      if (attachment) {
        attachmentData = await uploadFile(attachment);
      }

      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        topic: selectedTopic,
        timestamp: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        status: 'sent',
        readBy: [],
        ...(attachmentData && { attachment: attachmentData })
      });

      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => scrollToBottom('smooth'), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessageId 
            ? { ...msg, status: 'error' as const } 
            : msg
        )
      );
    }
  };

  const renderMessageStatus = (message: Message) => {
    if (message.userId !== auth.currentUser?.uid) return null;

    switch (message.status) {
      case 'sending':
        return (
          <span className="text-xs text-gray-400 ml-2 inline-flex items-center">
            <Check className="w-3 h-3" />
          </span>
        );
      case 'sent':
        return (
          <span className="text-xs text-gray-400 ml-2 inline-flex items-center">
            <Check className="w-3 h-3" />
          </span>
        );
      case 'read':
        return (
          <span className="text-xs text-[#000080] ml-2 inline-flex items-center">
            <CheckCheck className="w-3 h-3" />
          </span>
        );
      case 'error':
        return (
          <span className="text-xs text-red-500 ml-2 inline-flex items-center">
            Error sending
          </span>
        );
      default:
        return null;
    }
  };

  const renderAttachmentPreview = (attachment: Message['attachment']) => {
    if (!attachment) return null;

    const isImage = attachment.type.startsWith('image/');
    
    return (
      <div className="relative inline-block max-w-xs rounded-lg overflow-hidden border border-gray-200">
        {isImage ? (
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="max-h-48 object-contain"
          />
        ) : (
          <div className="flex items-center p-3 bg-gray-50">
            <File className="w-5 h-5 mr-2 text-[#000080]" />
            <span className="text-sm truncate">{attachment.name}</span>
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000080]"></div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p>No messages yet</p>
          {selectedTopic && (
            <p className="text-sm mt-2">
              Start the conversation by sending a message
            </p>
          )}
        </div>
      );
    }

    let currentDate = null;
    const messageGroups = [];

    messages.forEach((message) => {
      const messageDate = message.timestamp?.toDate?.() 
        ? new Date(message.timestamp.toDate()).toDateString()
        : null;

      if (messageDate && messageDate !== currentDate) {
        currentDate = messageDate;
        messageGroups.push(
          <div key={`date-${messageDate}`} className="flex items-center justify-center my-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }).format(new Date(messageDate))}
            </div>
          </div>
        );
      }

      messageGroups.push(
        <div
          key={message.id}
          className={`mb-4 ${
            message.userId === auth.currentUser?.uid
              ? 'text-right'
              : 'text-left'
          }`}
        >
          <div className="inline-block max-w-[70%]">
            <div
              className={`text-sm font-medium mb-1 ${
                message.userId === auth.currentUser?.uid
                  ? 'text-[#000080]'
                  : 'text-gray-600'
              }`}
            >
              <span>{message.userId === auth.currentUser?.uid ? 'You' : message.userName}</span>
              {renderMessageStatus(message)}
            </div>
            <div
              className={`rounded-lg px-4 py-2 ${
                message.userId === auth.currentUser?.uid
                  ? 'bg-[#000080] text-white rounded-tr-none'
                  : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-200'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.text}
              </div>
              {message.attachment && renderAttachmentPreview(message.attachment)}
            </div>
            <div
              className={`text-xs mt-1 ${
                message.userId === auth.currentUser?.uid
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              {message.timestamp?.toDate ? (
                new Intl.DateTimeFormat('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }).format(message.timestamp.toDate())
              ) : ''}
            </div>
          </div>
        </div>
      );
    });

    return messageGroups;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="pt-24 px-6">
          <h2 className="text-2xl font-bold text-[#000080] mb-4">Select Message Topic</h2>
          <div className="flex gap-3 flex-wrap">
            {MESSAGE_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic.id)}
                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 text-base font-medium ${
                  selectedTopic === topic.id
                    ? 'bg-[#000080] text-white border-[#000080] shadow-md'
                    : 'bg-white text-[#000080] border-[#000080] hover:bg-[#000080]/10'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        <div 
          ref={messageListRef}
          className="flex-1 overflow-y-auto"
        >
          {renderMessages()}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        <div>
          {attachment && (
            <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-500" />
              <span className="text-sm truncate flex-1">{attachment.name}</span>
              <button
                onClick={() => setAttachment(null)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={selectedTopic ? "Type your message..." : "Please select a topic first"}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#000080]"
              disabled={!selectedTopic || isUploading}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300 min-w-[44px] flex items-center justify-center"
                disabled={!selectedTopic || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </Button>

              <Button 
                type="submit"
                className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300 px-6"
                disabled={!selectedTopic || (!newMessage.trim() && !attachment) || isUploading}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
