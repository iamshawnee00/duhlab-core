import image_226fd493f4d8b169f18a231dc64593654b9dfe3e from 'figma:asset/226fd493f4d8b169f18a231dc64593654b9dfe3e.png';
import { Coins } from 'lucide-react';
import islandImage from 'figma:asset/18e3b9fb8ae2b9c77aa833be4eef9974b7cbf7e6.png';
import { BottomNavigation } from './BottomNavigation';

interface HomeScreenProps {
  onStartSurvey: () => void;
  onNavigateToShop: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onNavigateToMissions: () => void;
  onDistrictClick: (district: string) => void;
  userCoins: number;
}

export function HomeScreen({ onStartSurvey, onNavigateToShop, onNavigateToProfile, onNavigateToSettings, onNavigateToMissions, onDistrictClick, userCoins }: HomeScreenProps) {
  return (
    <div className="h-full w-full bg-gradient-to-b from-[#4A90E2] via-[#5BA3E8] to-[#6FB5ED] flex flex-col relative pb-[100px] md:pb-0">
      {/* Top Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A45FF] to-[#4C6EF5] flex items-center justify-center border-2 border-white shadow-md">
          <span className="text-white font-heading" style={{ fontSize: '18px', fontWeight: 700 }}>
            JD
          </span>
        </div>

        {/* Coin Balance Pill */}
        <button 
          onClick={onNavigateToShop}
          className="bg-[#FFC045] rounded-full px-4 py-2 flex items-center gap-2 shadow-[0px_4px_0px_#E1A32A] active:translate-y-[2px] active:shadow-[0px_2px_0px_#E1A32A] transition-all"
        >
          <Coins className="w-5 h-5 text-[#192A56]" />
          <span className="text-[#192A56] font-heading" style={{ fontSize: '16px', fontWeight: 700 }}>
            {userCoins}
          </span>
        </button>
      </div>

      {/* Main Content - The Island Placeholder */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[rgba(0,0,0,0)]">
          {/* Island Map Placeholder */}
          <div className="mb-6">
            <div className="aspect-square flex items-center justify-center relative overflow-hidden group bg-transparent">
              {/* Isometric Island Image */}
              <img 
                src={image_226fd493f4d8b169f18a231dc64593654b9dfe3e} 
                alt="Data Island with Districts"
                className="w-[120%] h-[120%] object-contain scale-110"
              />
              
              {/* Clickable District Overlays - 9 areas in a 3x3 grid pattern */}
              {/* Top Row */}
              <button
                onClick={() => onDistrictClick('Residential')}
                className="absolute top-[10%] left-[15%] w-[25%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Residential District"
              />
              <button
                onClick={() => onDistrictClick('Education')}
                className="absolute top-[8%] left-[40%] w-[25%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Education District"
              />
              <button
                onClick={() => onDistrictClick('Park')}
                className="absolute top-[12%] right-[12%] w-[25%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Park & Wellness"
              />
              
              {/* Middle Row */}
              <button
                onClick={() => onDistrictClick('Commercial')}
                className="absolute top-[35%] left-[8%] w-[28%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Commercial District"
              />
              <button
                onClick={() => onDistrictClick('Government')}
                className="absolute top-[35%] left-[38%] w-[25%] h-[28%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Government District"
              />
              <button
                onClick={() => onDistrictClick('Banking')}
                className="absolute top-[38%] right-[10%] w-[25%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Banking District"
              />
              
              {/* Bottom Row */}
              <button
                onClick={() => onDistrictClick('Industrial')}
                className="absolute bottom-[15%] left-[12%] w-[25%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Industrial District"
              />
              <button
                onClick={() => onDistrictClick('Transport')}
                className="absolute bottom-[12%] left-[38%] w-[26%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Transport District"
              />
              <button
                onClick={() => onDistrictClick('Entertainment')}
                className="absolute bottom-[18%] right-[8%] w-[28%] h-[25%] hover:bg-[#1A45FF]/20 transition-colors rounded-lg group-hover:border group-hover:border-[#1A45FF]/30"
                title="Entertainment District"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="px-6 pb-6">
        <BottomNavigation
          activeTab="home"
          onNavigateToHome={() => {}}
          onNavigateToSurveys={onNavigateToMissions}
          onNavigateToInsights={onNavigateToProfile}
          onNavigateToSettings={onNavigateToSettings}
        />
      </div>
    </div>
  );
}