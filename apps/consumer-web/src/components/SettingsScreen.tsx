import { ArrowLeft, Bell, User, LogOut, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToSurveys: () => void;
  onNavigateToInsights: () => void;
  onSignOut: () => void;
}

const SETTINGS_OPTIONS = [
  { icon: Bell, label: 'Notifications', description: 'Manage your alerts' },
  { icon: User, label: 'Account', description: 'Edit profile information' },
  { icon: Shield, label: 'Privacy', description: 'Data and security settings' },
  { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
];

export function SettingsScreen({ 
  onBack, 
  onNavigateToHome, 
  onNavigateToSurveys, 
  onNavigateToInsights,
  onSignOut 
}: SettingsScreenProps) {
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
          Settings
        </h1>
        <p className="text-[#636E72] font-sans mt-1" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Options */}
      <div className="flex-1 overflow-auto px-6 py-6 pb-24">
        <div className="space-y-3">
          {SETTINGS_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                className="w-full bg-white rounded-[16px] border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4 hover:bg-[#F5F7FA] transition-colors"
              >
                <div className="w-12 h-12 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#1A45FF]" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[#192A56] font-heading mb-1" style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>
                    {option.label}
                  </h3>
                  <p className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                    {option.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#636E72]" strokeWidth={2} />
              </button>
            );
          })}
        </div>

        {/* Sign Out Button */}
        <div className="mt-6">
          <button
            onClick={onSignOut}
            className="w-full bg-white rounded-[16px] border border-[#FF4757] p-4 flex items-center gap-4 hover:bg-[#FFF0F1] transition-colors"
          >
            <div className="w-12 h-12 bg-[#FFF0F1] rounded-full flex items-center justify-center">
              <LogOut className="w-6 h-6 text-[#FF4757]" strokeWidth={2} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-[#FF4757] font-heading mb-1" style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>
                Sign Out
              </h3>
              <p className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                Logout from your account
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#FF4757]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-6">
        <BottomNavigation
          activeTab="settings"
          onNavigateToHome={onNavigateToHome}
          onNavigateToSurveys={onNavigateToSurveys}
          onNavigateToInsights={onNavigateToInsights}
          onNavigateToSettings={() => {}}
        />
      </div>
    </div>
  );
}