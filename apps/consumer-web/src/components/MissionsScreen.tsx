import { ArrowLeft, Clock } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

interface MissionsScreenProps {
  onBack: () => void;
  onStartMission: () => void;
  selectedDistrict?: string;
  onNavigateToHome: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
}

const AVAILABLE_MISSIONS = [
  { title: 'Coffee Habits', duration: '5 mins', coins: 500, category: 'Residential' },
  { title: 'Morning Routine', duration: '3 mins', coins: 300, category: 'Residential' },
  { title: 'Tech Preferences', duration: '7 mins', coins: 700, category: 'Commercial' },
  { title: 'Shopping Behavior', duration: '6 mins', coins: 600, category: 'Commercial' },
  { title: 'Media Consumption', duration: '4 mins', coins: 400, category: 'Entertainment' },
  { title: 'Health & Wellness', duration: '8 mins', coins: 800, category: 'Park' },
  { title: 'Travel Preferences', duration: '5 mins', coins: 500, category: 'Transport' },
  { title: 'Food Choices', duration: '4 mins', coins: 400, category: 'Residential' },
  { title: 'Work Preferences', duration: '6 mins', coins: 600, category: 'Industrial' },
  { title: 'Banking Habits', duration: '5 mins', coins: 500, category: 'Banking' },
  { title: 'Civic Engagement', duration: '7 mins', coins: 700, category: 'Government' },
  { title: 'Learning Style', duration: '6 mins', coins: 600, category: 'Education' },
];

export function MissionsScreen({ onBack, onStartMission, selectedDistrict, onNavigateToHome, onNavigateToProfile, onNavigateToSettings }: MissionsScreenProps) {
  const filteredMissions = selectedDistrict 
    ? AVAILABLE_MISSIONS.filter(m => m.category === selectedDistrict)
    : AVAILABLE_MISSIONS;

  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col pb-[100px] md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-[#EAEAEA] px-6 py-4">
        <div className="flex items-center mb-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#EAEAEA] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#192A56]" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-[#192A56] font-heading" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
          {selectedDistrict ? `${selectedDistrict} District` : 'Available Missions'}
        </h1>
        <p className="text-[#636E72] font-sans mt-1" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
          {selectedDistrict ? `Surveys from the ${selectedDistrict} district` : 'Complete surveys to earn coins and unlock insights'}
        </p>
      </div>

      {/* Mission Cards List */}
      <div className="flex-1 overflow-auto px-6 py-6 pb-24">
        <div className="space-y-4">
          {filteredMissions.map((mission, index) => (
            <div
              key={index}
              className="bg-white rounded-[16px] border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-5"
            >
              {/* Mission Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#192A56] font-heading mb-1" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '24px' }}>
                    {mission.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#636E72]" strokeWidth={2} />
                    <span className="text-[#636E72] font-sans" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
                      {mission.duration}
                    </span>
                  </div>
                </div>

                {/* Coin Badge */}
                <div className="bg-[#FFC045] rounded-full px-4 py-2 flex items-center gap-1">
                  <span className="text-[#192A56] font-heading" style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px' }}>
                    {mission.coins}
                  </span>
                  <span className="text-[#192A56] font-sans" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '16px' }}>
                    Coins
                  </span>
                </div>
              </div>

              {/* Category Tag */}
              <div className="mb-4">
                <span className="inline-block bg-[#F5F7FA] text-[#636E72] font-sans rounded-full px-3 py-1" style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
                  {mission.category}
                </span>
              </div>

              {/* Start Button */}
              <button
                onClick={onStartMission}
                className="w-full h-14 bg-[#1A45FF] text-white font-heading rounded-full shadow-[0px_4px_0px_#0F30B5] hover:translate-y-[2px] hover:shadow-[0px_2px_0px_#0F30B5] active:translate-y-[4px] active:shadow-none transition-all"
                style={{ fontSize: '16px', fontWeight: 700, lineHeight: '22px' }}
              >
                Start Mission
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-6">
        <BottomNavigation
          activeTab="surveys"
          onNavigateToHome={onNavigateToHome}
          onNavigateToSurveys={() => {}}
          onNavigateToInsights={onNavigateToProfile}
          onNavigateToSettings={onNavigateToSettings}
        />
      </div>
    </div>
  );
}