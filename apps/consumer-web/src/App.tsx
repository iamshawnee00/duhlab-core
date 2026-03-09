import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { SurveyScreen } from './components/SurveyScreen';
import { InsightRewardModal } from './components/InsightRewardModal';
import { RewardsShop } from './components/RewardsShop';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MissionsScreen } from './components/MissionsScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

type Screen = 'login' | 'signup' | 'onboarding' | 'home' | 'survey' | 'shop' | 'profile' | 'settings' | 'missions';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleLogin = async (id: string, token: string, user: any, coins: number) => {
    setUserId(id);
    setAccessToken(token);
    setUserData(user);
    setUserCoins(coins);
    
    // Check if user has completed onboarding
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/user/onboarding-status`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.completed) {
          setHasCompletedOnboarding(true);
          setCurrentScreen('home');
        } else {
          setCurrentScreen('onboarding');
        }
      } else {
        // If error, show onboarding to be safe
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      setCurrentScreen('onboarding');
    }
  };

  const handleSignUp = () => {
    setCurrentScreen('home');
  };

  const handleSwitchToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentScreen('login');
  };

  const updateCoins = (newCoins: number) => {
    setUserCoins(newCoins);
  };

  const handleStartSurvey = () => {
    setCurrentScreen('survey');
  };

  const handleSurveyComplete = () => {
    setCurrentScreen('home');
    setShowRewardModal(true);
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedDistrict(undefined);
  };

  const handleOpenShop = () => {
    setCurrentScreen('shop');
  };

  const handleOpenProfile = () => {
    setCurrentScreen('profile');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleOpenMissions = () => {
    setSelectedDistrict(undefined);
    setCurrentScreen('missions');
  };

  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
    setCurrentScreen('missions');
  };

  const handleSignOut = async () => {
    const supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
    await supabase.auth.signOut();
    setUserId(null);
    setAccessToken(null);
    setUserData(null);
    setUserCoins(0);
    setCurrentScreen('login');
  };

  const handleOnboardingComplete = async () => {
    setHasCompletedOnboarding(true);
    
    // Mark onboarding as complete in backend
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/user/complete-onboarding`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
    
    setCurrentScreen('home');
  };

  return (
    <div className="w-full h-screen overflow-hidden font-sans" style={{ maxWidth: '430px', margin: '0 auto' }}>
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
      )}

      {currentScreen === 'signup' && (
        <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={handleSwitchToLogin} />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen 
          onStartSurvey={handleStartSurvey} 
          onNavigateToShop={handleOpenShop} 
          onNavigateToProfile={handleOpenProfile} 
          onNavigateToSettings={handleOpenSettings} 
          onNavigateToMissions={handleOpenMissions}
          onDistrictClick={handleDistrictClick}
          userCoins={userCoins}
        />
      )}
      
      {currentScreen === 'survey' && (
        <SurveyScreen 
          onComplete={handleSurveyComplete} 
          onBack={handleBackToHome} 
          selectedDistrict={selectedDistrict}
          accessToken={accessToken}
          onCoinsUpdate={updateCoins}
        />
      )}

      {currentScreen === 'shop' && (
        <RewardsShop 
          onBack={handleBackToHome} 
          userCoins={userCoins}
          accessToken={accessToken}
          onCoinsUpdate={updateCoins}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen 
          onBack={handleBackToHome} 
          userData={userData}
          userCoins={userCoins}
          accessToken={accessToken}
          onNavigateToHome={handleBackToHome}
          onNavigateToSurveys={handleOpenMissions}
          onNavigateToInsights={() => {}}
          onNavigateToSettings={handleOpenSettings}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen 
          onBack={handleBackToHome}
          onNavigateToHome={handleBackToHome}
          onNavigateToSurveys={handleOpenMissions}
          onNavigateToInsights={handleOpenProfile}
          onSignOut={handleSignOut}
        />
      )}

      {currentScreen === 'missions' && (
        <MissionsScreen 
          onBack={handleBackToHome} 
          onStartMission={handleStartSurvey} 
          selectedDistrict={selectedDistrict}
          onNavigateToHome={handleBackToHome}
          onNavigateToProfile={handleOpenProfile}
          onNavigateToSettings={handleOpenSettings}
        />
      )}

      <InsightRewardModal 
        isOpen={showRewardModal} 
        onClose={() => setShowRewardModal(false)} 
      />
    </div>
  );
}