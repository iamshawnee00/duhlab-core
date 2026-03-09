import { useState } from 'react';
import { SignIn } from '@/app/components/SignIn';
import { OnboardingFlow } from '@/app/components/OnboardingFlow';
import { Dashboard } from '@/app/components/Dashboard';
import { API_URL } from '@/utils/supabase';

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

  const handleOnboardingComplete = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/client/complete-onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Use the token we saved during sign-in
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to save onboarding data");

    setUserData({ ...userData, ...data });
    setCurrentView('dashboard');
  } catch (error) {
    console.error(error);
    alert("There was an error saving your profile. Please try again.");
  }
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