import { useState } from 'react';
import { ChevronRight, Sparkles, Target, Brain } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const ONBOARDING_SCREENS = [
  {
    id: 1,
    icon: Sparkles,
    title: 'Explore Yourself',
    description: 'Take surveys across different categories to discover hidden patterns about your digital behavior, preferences, and habits.',
    color: '#1A45FF',
    bgColor: '#F0F3FF',
  },
  {
    id: 2,
    icon: Target,
    title: 'Complete Yourself',
    description: 'Each survey you complete adds to your profile. Build a comprehensive picture of who you are as you unlock new insights.',
    color: '#00D2D3',
    bgColor: '#F0FEFF',
  },
  {
    id: 3,
    icon: Brain,
    title: 'Know Your DCA',
    description: 'Your Digital Consumer Archetype (DCA) reveals what kind of person you are. Watch it evolve as you grow with Duhlab.',
    color: '#FFC045',
    bgColor: '#FFF9F0',
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const screen = ONBOARDING_SCREENS[currentScreen];
  const Icon = screen.icon;
  const isLastScreen = currentScreen === ONBOARDING_SCREENS.length - 1;

  const handleNext = () => {
    if (isLastScreen) {
      onComplete();
    } else {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swiped left - go to next screen
      if (!isLastScreen) {
        setCurrentScreen(currentScreen + 1);
      }
    }
    if (touchStart - touchEnd < -100) {
      // Swiped right - go to previous screen
      if (currentScreen > 0) {
        setCurrentScreen(currentScreen - 1);
      }
    }
  };

  return (
    <div 
      className="h-full w-full flex flex-col bg-[#F5F7FA] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip Button */}
      <div className="p-6 flex justify-end">
        <button
          onClick={onComplete}
          className="text-[#636E72] font-sans"
          style={{ fontSize: '14px', fontWeight: 500 }}
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        {/* Icon Circle */}
        <div 
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-[0px_8px_24px_rgba(0,0,0,0.1)] transition-all duration-500"
          style={{ backgroundColor: screen.bgColor }}
        >
          <Icon 
            className="w-16 h-16 transition-all duration-500" 
            style={{ color: screen.color }}
            strokeWidth={2.5}
          />
        </div>

        {/* Title */}
        <h1 
          className="text-[#192A56] font-heading text-center mb-4 transition-all duration-500"
          style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}
        >
          {screen.title}
        </h1>

        {/* Description */}
        <p 
          className="text-[#636E72] font-sans text-center max-w-sm mb-12 transition-all duration-500"
          style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
        >
          {screen.description}
        </p>

        {/* Visual Metaphor */}
        <div className="flex items-center gap-3 mb-8">
          {ONBOARDING_SCREENS.map((s, index) => (
            <div
              key={s.id}
              className="transition-all duration-300"
              style={{
                width: index === currentScreen ? '40px' : '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: index === currentScreen ? screen.color : '#EAEAEA',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6">
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-full text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] flex items-center justify-center gap-2 transition-all"
          style={{ 
            backgroundColor: screen.color,
            fontSize: '18px', 
            fontWeight: 700 
          }}
        >
          {isLastScreen ? "Let's Begin" : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Progress Text */}
        <p className="text-center text-[#636E72] font-sans mt-4" style={{ fontSize: '12px', fontWeight: 400 }}>
          {currentScreen + 1} of {ONBOARDING_SCREENS.length}
        </p>
      </div>
    </div>
  );
}
