import { useState } from 'react';
import { SignIn } from '@/app/components/SignIn';
import { OnboardingFlow } from '@/app/components/OnboardingFlow';
import { Dashboard } from '@/app/components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'signin' | 'onboarding' | 'dashboard'>('signin');
  const [userData, setUserData] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null); // NEW: Store the auth token

  // Updated to accept the token and real user data
  const handleSignIn = (accessToken: string, user: any, isNewUser: boolean) => {
    setToken(accessToken);
    setUserData(user);
    
    if (isNewUser) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleOnboardingComplete = (data: any) => {
    // In a full build, you would send this 'data' back to Supabase to update the user profile
    setUserData({ ...userData, ...data });
    setCurrentView('dashboard');
  };

  return (
    <div className="size-full">
      {currentView === 'signin' && <SignIn onSignIn={handleSignIn} />}
      {currentView === 'onboarding' && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      
      {/* Pass the token to the Dashboard so it can make authenticated requests */}
      {currentView === 'dashboard' && <Dashboard userData={userData} token={token} />}
    </div>
  );
}