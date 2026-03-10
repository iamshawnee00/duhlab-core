import { useState } from 'react';
import logoImage from 'figma:asset/9a9a4a1572c149f19593b28a48b681f3a8ed70bf.png';
import { publicAnonKey } from '../utils/supabase/info';

const API_URL = "http://localhost:3001/make-server-e7b4487d";

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
      const response = await fetch(`${API_URL}/consumer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (!data.accessToken) {
        setError('Authentication failed - no token received');
        setIsLoading(false);
        return;
      }

      // FIX: Save the token directly to local storage so MissionsScreen can find it!
      localStorage.setItem('duhlab_consumer_token', data.accessToken);

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
      const response = await fetch(`${API_URL}/guest-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Guest login failed');
        setIsLoading(false);
        return;
      }

      if (!data.accessToken) {
        setError('Authentication failed - no token received');
        setIsLoading(false);
        return;
      }

      // FIX: Save the token directly to local storage for Guest users too!
      localStorage.setItem('duhlab_consumer_token', data.accessToken);

      onLogin(data.userId, data.accessToken, data.user, data.coins);
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Failed to connect to server');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col relative">
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img src={logoImage} alt="Duhlab Logo" className="w-32 h-32 object-contain" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-[#192A56] font-heading mb-2 text-2xl font-bold">Welcome Back</h1>
            <p className="text-[#636E72] font-sans text-base">Sign in to continue your journey</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm p-6 mb-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-[#192A56] font-sans mb-2 text-xs">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#EAEAEA] px-4 py-3 text-[#192A56] focus:outline-none focus:border-[#1A45FF] focus:ring-2 focus:ring-[#1A45FF]/20"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#192A56] font-sans mb-2 text-xs">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#EAEAEA] px-4 py-3 text-[#192A56] focus:outline-none focus:border-[#1A45FF] focus:ring-2 focus:ring-[#1A45FF]/20"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A45FF] rounded-full px-6 py-4 text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#EAEAEA]"></div>
              <span className="text-[#636E72] text-xs">OR</span>
              <div className="flex-1 h-px bg-[#EAEAEA]"></div>
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-transparent border-2 border-[#EAEAEA] rounded-full px-6 py-4 text-[#636E72] font-heading hover:border-[#1A45FF] hover:text-[#1A45FF] hover:bg-[#F0F3FF] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Entering...' : 'Guest Enter'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-[#636E72] text-base">Don't have an account? </span>
            <button
              onClick={onSwitchToSignup}
              disabled={isLoading}
              className="text-[#1A45FF] font-semibold hover:underline disabled:opacity-50 text-base"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}