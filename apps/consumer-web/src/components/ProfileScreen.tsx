import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, User, LogOut, Shield, HelpCircle, TrendingUp, Award, BookOpen } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { BottomNavigation } from './BottomNavigation';
import { AchievementsModal } from './AchievementsModal';
import { UnlockNotification } from './UnlockNotification';
import { DCAStoryModal } from './DCAStoryModal';
import { ArchetypeComparisonModal } from './ArchetypeComparisonModal';

interface ProfileScreenProps {
  onBack: () => void;
  userData: any;
  userCoins: number;
  accessToken: string | null;
  onNavigateToHome: () => void;
  onNavigateToSurveys: () => void;
  onNavigateToInsights: () => void;
  onNavigateToSettings: () => void;
}

// Updated to 4 categories with colors matching the screenshot
const categoryData = [
  { name: 'Politics Awareness', value: 78, color: '#1A45FF' }, // Electric Blue
  { name: 'Residential', value: 45, color: '#FFC045' }, // Marigold Yellow
  { name: 'Industrial', value: 62, color: '#00D2D3' }, // Success Teal
  { name: 'Commercial', value: 88, color: '#FF4757' }, // Error Red (using for variety)
];

const SETTINGS_OPTIONS = [
  { icon: Bell, label: 'Notifications', description: 'Manage your alerts' },
  { icon: User, label: 'Account', description: 'Edit profile information' },
  { icon: Shield, label: 'Privacy', description: 'Data and security settings' },
  { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
  { icon: LogOut, label: 'Sign Out', description: 'Logout from your account', isDestructive: true },
];

interface ArchetypeEvolution {
  date: string;
  archetype: string;
  surveysCompleted: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedDate?: string;
  color: string;
}

export function ProfileScreen({ onBack, userData, userCoins, accessToken, onNavigateToHome, onNavigateToSurveys, onNavigateToInsights, onNavigateToSettings }: ProfileScreenProps) {
  const [surveyCount, setSurveyCount] = useState(0);
  const [archetypeHistory, setArchetypeHistory] = useState<ArchetypeEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  const [currentUnlock, setCurrentUnlock] = useState<Achievement | null>(null);
  const [showDCAStory, setShowDCAStory] = useState(false);
  const [showArchetypeComparison, setShowArchetypeComparison] = useState(false);
  const [selectedArchetypeForStory, setSelectedArchetypeForStory] = useState<string>('');

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!accessToken) return;
      
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/user/progress`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setSurveyCount(data.totalSurveys || 0);
          setArchetypeHistory(data.archetypeHistory || []);
          setAchievements(data.achievements || []);
          
          // Check for newly unlocked achievements
          const newUnlocks = data.achievements?.filter((a: Achievement) => 
            a.unlocked && data.newlyUnlocked?.includes(a.id)
          ) || [];
          
          if (newUnlocks.length > 0) {
            setNewlyUnlocked(newUnlocks.map((a: Achievement) => a.id));
            setCurrentUnlock(newUnlocks[0]);
            setShowUnlockNotification(true);
            
            // Auto-hide notification after 5 seconds
            setTimeout(() => {
              setShowUnlockNotification(false);
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProgress();
  }, [accessToken]);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="h-full w-full bg-[#192A56] flex flex-col overflow-auto pb-[100px] md:pb-0">
      {/* Unlock Notification */}
      {currentUnlock && (
        <UnlockNotification
          isOpen={showUnlockNotification}
          onClose={() => setShowUnlockNotification(false)}
          achievement={currentUnlock}
        />
      )}

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={achievements}
        newlyUnlocked={newlyUnlocked}
      />

      {/* DCA Story Modal */}
      <DCAStoryModal
        isOpen={showDCAStory}
        onClose={() => setShowDCAStory(false)}
        archetypeName={archetypeHistory.length > 0 ? archetypeHistory[archetypeHistory.length - 1].archetype : 'The Explorer'}
        surveyCount={surveyCount}
        onCompareArchetypes={() => setShowArchetypeComparison(true)}
      />

      {/* Archetype Comparison Modal */}
      <ArchetypeComparisonModal
        isOpen={showArchetypeComparison}
        onClose={() => setShowArchetypeComparison(false)}
        currentArchetype={archetypeHistory.length > 0 ? archetypeHistory[archetypeHistory.length - 1].archetype : 'The Explorer'}
        onSelectArchetype={(name) => {
          setSelectedArchetypeForStory(name);
          setShowDCAStory(true);
        }}
      />

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* Achievements Button */}
        <button
          onClick={() => setShowAchievementsModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFC045] rounded-full shadow-[0px_4px_0px_#E1A32A] active:translate-y-[2px] active:shadow-[0px_2px_0px_#E1A32A] transition-all"
        >
          <Award className="w-4 h-4 text-[#192A56]" strokeWidth={2.5} />
          <span className="text-[#192A56] font-heading" style={{ fontSize: '14px', fontWeight: 700 }}>
            {unlockedAchievements}/{achievements.length}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-24">
        {/* Trading Card */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0px_12px_32px_rgba(0,0,0,0.3)] mb-6">
          {/* Card Header - Gradient */}
          <div className="relative h-40 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A45FF] to-[#4C6EF5]">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255, 255, 255, 0.1) 20px,
                rgba(255, 255, 255, 0.1) 40px
              )`
            }} />

            {/* Avatar */}
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[#1A45FF] font-heading" style={{ fontSize: '32px', fontWeight: 700 }}>
                  {userData?.email?.substring(0, 2).toUpperCase() || 'JD'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 text-center">
            <h2 className="text-[#192A56] font-heading mb-2" style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px' }}>
              {archetypeHistory.length > 0 ? archetypeHistory[archetypeHistory.length - 1].archetype : 'The Explorer'}
            </h2>
            <p className="text-[#636E72] font-sans mb-4" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
              {userData?.email || 'explorer@duhlab.com'}\n            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-[#1A45FF] font-heading mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                  {loading ? '...' : surveyCount}
                </div>
                <div className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Surveys
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#FFC045] font-heading mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                  {userCoins.toLocaleString()}
                </div>
                <div className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Coins
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#00D2D3] font-heading mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                  {Math.min(87 + surveyCount * 2, 100)}%
                </div>
                <div className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Complete
                </div>
              </div>
            </div>

            {/* Your DCA Story Button */}
            <button
              onClick={() => setShowDCAStory(true)}
              className="w-full h-10 rounded-full bg-[#1A45FF] text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] flex items-center justify-center gap-2 transition-all"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              <BookOpen className="w-4 h-4" />
              Your DCA Story
            </button>
          </div>
        </div>

        {/* Archetype Evolution Timeline */}
        {archetypeHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#FFC045]" />
              <h3 className="text-white font-heading" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '24px' }}>
                Your Evolution
              </h3>
            </div>
            
            <div className="space-y-4">
              {archetypeHistory.slice().reverse().map((evolution, index) => {
                const isLatest = index === 0;
                return (
                  <div key={index} className="flex items-start gap-3">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-3 h-3 rounded-full ${isLatest ? 'bg-[#FFC045]' : 'bg-white/30'} shadow-lg`}
                      />
                      {index < archetypeHistory.length - 1 && (
                        <div className="w-px h-12 bg-white/20 mt-1" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-heading ${isLatest ? 'text-[#FFC045]' : 'text-white/70'}`} style={{ fontSize: '16px', fontWeight: 600 }}>
                          {evolution.archetype}
                        </span>
                        <span className="text-white/50 font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                          {new Date(evolution.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-white/60 font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                        After {evolution.surveysCompleted} survey{evolution.surveysCompleted !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Section with Horizontal Bars */}
        <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-6 mb-6">
          <h3 className="text-white font-heading mb-6" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '24px' }}>
            Your Profile Stats
          </h3>
          
          <div className="space-y-6">
            {categoryData.map((category) => (
              <div key={category.name}>
                {/* Category Name and Percentage */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#F5F7FA] font-sans" style={{ fontSize: '14px', fontWeight: 500 }}>
                    {category.name}
                  </span>
                  <span className="text-white font-heading" style={{ fontSize: '16px', fontWeight: 700 }}>
                    {category.value}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${category.value}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-6">
        <BottomNavigation
          activeTab="insights"
          onNavigateToHome={onNavigateToHome}
          onNavigateToSurveys={onNavigateToSurveys}
          onNavigateToInsights={() => {}}
          onNavigateToSettings={onNavigateToSettings}
        />
      </div>
    </div>
  );
}