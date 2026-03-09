import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { API_URL, publicAnonKey } from '../../utils/supabase';

interface SignInProps {
  onSignIn: (accessToken: string, userData: any, isNewUser: boolean) => void;
}

export function SignIn({ onSignIn }: SignInProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          setIsLoading(false);
          return;
        }

        // Call our local /client/signup route
        const res = await fetch(`${API_URL}/client/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name: email.split('@')[0] }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to sign up');
        
        // After signup, log them in to get the token
        const loginRes = await fetch(`${API_URL}/client/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        });
        
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.error || 'Failed to login after signup');

        onSignIn(loginData.accessToken, loginData.user, true);

      } else {
        // Call our local /client/login route
        const res = await fetch(`${API_URL}/client/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials');

        onSignIn(data.accessToken, data.user, false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Network error connecting to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="w-[560px] bg-white rounded-2xl p-12 shadow-[0px_12px_24px_rgba(0,0,0,0.05)] border border-[#EAEAEA]">
        
        <div className="text-center mb-8">
          <h1 className="tracking-tight mb-2 font-bold text-3xl text-[#1A45FF]" style={{ fontFamily: 'Outfit, sans-serif' }}>duhLAB</h1>
          <p className="text-[#636E72]">Research Platform</p>
        </div>

        <motion.div
          key={isSignUp ? 'signup' : 'signin'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="mb-8 text-center text-[#6B7280]">
            {isSignUp ? 'Sign up to start your research journey' : 'Sign in to continue to your dashboard'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-[#374151] font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A45FF]"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[#374151] font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A45FF]"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <label className="block mb-2 text-[#374151] font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A45FF]"
                  placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>
          )}

          {!isSignUp && (
            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-[#1A45FF] hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-full font-bold text-[#1A1A1A] bg-[#FFC045] hover:scale-105 transition-all shadow-[0px_4px_0px_#E1A32A] disabled:opacity-50"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-[#6B7280]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={toggleMode} className="text-[#1A45FF] font-semibold hover:underline">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}