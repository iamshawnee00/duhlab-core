import { Home, TrendingUp, Users, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'surveys' | 'insights' | 'settings';
  onNavigateToHome: () => void;
  onNavigateToSurveys: () => void;
  onNavigateToInsights: () => void;
  onNavigateToSettings: () => void;
}

export function BottomNavigation({
  activeTab,
  onNavigateToHome,
  onNavigateToSurveys,
  onNavigateToInsights,
  onNavigateToSettings,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-white rounded-t-[24px] md:rounded-[24px] border border-[#EAEAEA] shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] px-4 py-3 z-40">
      <div className="flex items-center justify-around">
        {/* Home Tab */}
        <button 
          onClick={onNavigateToHome}
          className="flex flex-col items-center gap-1 px-4 py-2"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activeTab === 'home' ? 'bg-[#1A45FF]' : ''
          }`}>
            <Home 
              className={`w-5 h-5 ${activeTab === 'home' ? 'text-white' : 'text-[#636E72]'}`}
              fill={activeTab === 'home' ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </div>
          <span 
            className={`font-sans ${activeTab === 'home' ? 'text-[#1A45FF]' : 'text-[#636E72]'}`}
            style={{ fontSize: '12px', fontWeight: activeTab === 'home' ? 500 : 400 }}
          >
            Home
          </span>
        </button>

        {/* Surveys Tab */}
        <button 
          onClick={onNavigateToSurveys}
          className="flex flex-col items-center gap-1 px-4 py-2"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activeTab === 'surveys' ? 'bg-[#1A45FF]' : ''
          }`}>
            <TrendingUp 
              className={`w-5 h-5 ${activeTab === 'surveys' ? 'text-white' : 'text-[#636E72]'}`}
              fill={activeTab === 'surveys' ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </div>
          <span 
            className={`font-sans ${activeTab === 'surveys' ? 'text-[#1A45FF]' : 'text-[#636E72]'}`}
            style={{ fontSize: '12px', fontWeight: activeTab === 'surveys' ? 500 : 400 }}
          >
            Surveys
          </span>
        </button>

        {/* Insights Tab */}
        <button 
          onClick={onNavigateToInsights}
          className="flex flex-col items-center gap-1 px-4 py-2"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activeTab === 'insights' ? 'bg-[#1A45FF]' : ''
          }`}>
            <Users 
              className={`w-5 h-5 ${activeTab === 'insights' ? 'text-white' : 'text-[#636E72]'}`}
              fill={activeTab === 'insights' ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </div>
          <span 
            className={`font-sans ${activeTab === 'insights' ? 'text-[#1A45FF]' : 'text-[#636E72]'}`}
            style={{ fontSize: '12px', fontWeight: activeTab === 'insights' ? 500 : 400 }}
          >
            Insights
          </span>
        </button>

        {/* Settings Tab */}
        <button 
          onClick={onNavigateToSettings}
          className="flex flex-col items-center gap-1 px-4 py-2"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activeTab === 'settings' ? 'bg-[#1A45FF]' : ''
          }`}>
            <Settings 
              className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-[#636E72]'}`}
              fill={activeTab === 'settings' ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </div>
          <span 
            className={`font-sans ${activeTab === 'settings' ? 'text-[#1A45FF]' : 'text-[#636E72]'}`}
            style={{ fontSize: '12px', fontWeight: activeTab === 'settings' ? 500 : 400 }}
          >
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}