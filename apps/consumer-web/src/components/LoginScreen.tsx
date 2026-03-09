import { useState } from 'react';
import logoImage from 'figma:asset/9a9a4a1572c149f19593b28a48b681f3a8ed70bf.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginScreenProps {
  onLogin: (userId: string, accessToken: string, userData: any, coins: number) => void;
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (!data.accessToken) {
        console.error('No access token received:', data);
        setError('Authentication failed - no token received');
        setIsLoading(false);
        return;
      }

      console.log('Login successful:', {
        userId: data.userId,
        hasToken: !!data.accessToken,
        coins: data.coins
      });
      
      onLogin(data.userId, data.accessToken, data.user, data.coins);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting guest login...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/guest-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('Guest login response status:', response.status);
      const data = await response.json();
      console.log('Guest login response data:', data);

      if (!response.ok) {
        setError(data.error || 'Guest login failed');
        setIsLoading(false);
        return;
      }

      if (!data.accessToken) {
        console.error('No access token received:', data);
        setError('Authentication failed - no token received');
        setIsLoading(false);
        return;
      }

      console.log('Guest login successful:', {
        userId: data.userId,
        hasToken: !!data.accessToken,
        coins: data.coins
      });
      
      onLogin(data.userId, data.accessToken, data.user, data.coins);
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Failed to connect to server');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col relative">
      {/* Main Content */}
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
              Welcome Back
            </h1>
            <p className="text-[#636E72] font-sans" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}>
              Sign in to continue your journey
            </p>
          </div>

          {/* Login Card */}
          <div 
            className="bg-white rounded-[16px] border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 mb-6"
          >
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-[#FF4757]/10 border border-[#FF4757] rounded-[8px]">
                  <p className="text-[#FF4757] font-sans" style={{ fontSize: '14px', fontWeight: 400 }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Email Input */}
              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className="block text-[#192A56] font-sans mb-2" 
                  style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}
                >
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

              {/* Password Input */}
              <div className="mb-6">
                <label 
                  htmlFor="password" 
                  className="block text-[#192A56] font-sans mb-2" 
                  style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}
                >
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

              {/* Forgot Password Link */}
              <div className="text-right mb-6">
                <button
                  type="button"
                  className="text-[#1A45FF] font-sans hover:underline"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A45FF] rounded-full px-6 py-4 text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '18px', fontWeight: 700, height: '56px' }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#EAEAEA]"></div>
              <span className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                OR
              </span>
              <div className="flex-1 h-px bg-[#EAEAEA]"></div>
            </div>

            {/* Guest Login Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-transparent border-2 border-[#EAEAEA] rounded-full px-6 py-4 text-[#636E72] font-heading hover:border-[#1A45FF] hover:text-[#1A45FF] hover:bg-[#F0F3FF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: '18px', fontWeight: 700, height: '56px' }}
            >
              {isLoading ? 'Entering...' : 'Guest Enter'}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-[#636E72] font-sans" style={{ fontSize: '16px', fontWeight: 400 }}>
              Don't have an account?{' '}
            </span>
            <button
              onClick={onSwitchToSignup}
              disabled={isLoading}
              className="text-[#1A45FF] font-sans hover:underline disabled:opacity-50"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
