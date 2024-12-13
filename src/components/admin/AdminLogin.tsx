import { useState } from 'react';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminLoginProps {
  onClose: () => void;
}

export function AdminLogin({ onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isAdminLoggedIn', 'true');
      onClose();
    } catch (error) {
      console.error('Error logging in:', error);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Please check your inbox.');
      onClose();
    } catch (error) {
      alert('Failed to send reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#000080]">Admin Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>

            {failedAttempts >= 2 && (
              <Button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300"
              >
                {isResetting ? '...' : 'Reset'}
              </Button>
            )}
          </div>

          <Button
            type="button"
            onClick={onClose}
            className="w-full mt-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </Button>
        </form>

        {failedAttempts >= 2 && (
          <p className="mt-4 text-sm text-red-600 text-center">
            Multiple failed login attempts detected
          </p>
        )}
      </div>
    </div>
  );
}
