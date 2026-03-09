import { useState } from 'react';
import logoImage from 'figma:asset/9a9a4a1572c149f19593b28a48b681f3a8ed70bf.png';
import { publicAnonKey } from '../utils/supabase/info';

// Pointing explicitly to our local Node.js backend
const API_URL = "http://localhost:3001/make-server-e7b4487d";

interface SignUpScreenProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

export function SignUpScreen({ onSignUp, onSwitchToLogin }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Hitting the specific CONSUMER signup door
      const response = await fetch(
        `${API_URL}/consumer/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sign up failed');
        setIsLoading(false);
        return;
      }

      console.log('Sign up successful:', data);
      // Switch to login screen after successful signup
      onSwitchToLogin();
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Failed to connect to server');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col relative overflow-y-auto">
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoImage} 
              alt="Duhlab Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-[#192A56] font-heading mb-2" style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px' }}>
              Create Account
            </h1>
            <p className="text-[#636E72] font-sans" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}>
              Join the lab and start earning insights
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white rounded-[16px] border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 mb-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-[#FF4757]/10 border border-[#FF4757] rounded-[8px]">
                  <p className="text-[#FF4757] font-sans" style={{ fontSize: '14px', fontWeight: 400 }}>
                    {error}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="name" className="block text-[#192A56] font-sans mb-2" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white rounded-[12px] border border-[#EAEAEA] px-4 py-3 text-[#192A56] font-sans focus:outline-none focus:border-[#1A45FF] focus:ring-2 focus:ring-[#1A45FF]/20 transition-all"
                  style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-[#192A56] font-sans mb-2" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white rounded-[12px] border border-[#EAEAEA] px-4 py-3 text-[#192A56] font-sans focus:outline-none focus:border-[#1A45FF] focus:ring-2 focus:ring-[#1A45FF]/20 transition-all"
                  style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-[#192A56] font-sans mb-2" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white rounded-[12px] border border-[#EAEAEA] px-4 py-3 text-[#192A56] font-sans focus:outline-none focus:border-[#1A45FF] focus:ring-2 focus:ring-[#1A45FF]/20 transition-all"
                  style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-[#192A56] font-sans mb-2" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white rounded-[12px] border border-[#EAEAEA] px-4 py-3 text-[#192A56] font-sans focus:outline-none focus:border-[#1A45FF] focus:ring-2 focus:ring-[#1A45FF]/20 transition-all"
                  style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-start gap-2 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#1A45FF] border-[#EAEAEA] rounded focus:ring-[#1A45FF]"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                  I agree to the <button type="button" className="text-[#1A45FF] hover:underline">Terms & Conditions</button> and <button type="button" className="text-[#1A45FF] hover:underline">Privacy Policy</button>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A45FF] rounded-full px-6 py-4 text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '18px', fontWeight: 700, height: '56px' }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>

          <div className="text-center">
            <span className="text-[#636E72] font-sans" style={{ fontSize: '16px', fontWeight: 400 }}>
              Already have an account?{' '}
            </span>
            <button
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="text-[#1A45FF] font-sans hover:underline disabled:opacity-50"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}