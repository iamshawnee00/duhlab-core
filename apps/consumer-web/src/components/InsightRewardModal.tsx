import { X, Share2, Award, TrendingUp } from 'lucide-react';

interface InsightRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARCHETYPES = [
  {
    title: "The Risk Taker",
    description: "You're bold and adventurous, always ready to explore new opportunities.",
    color: "#1A45FF",
    icon: TrendingUp
  },
  {
    title: "The Analyst",
    description: "Data-driven and methodical, you make decisions based on careful analysis.",
    color: "#00D2D3",
    icon: Award
  }
];

export function InsightRewardModal({ isOpen, onClose }: InsightRewardModalProps) {
  if (!isOpen) return null;

  const archetype = ARCHETYPES[0]; // Using first archetype as example
  const ArchetypeIcon = archetype.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trading Card */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.3)]">
          {/* Card Header - Gradient */}
          <div 
            className="relative h-48 flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${archetype.color} 0%, ${archetype.color}dd 100%)`
            }}
          >
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

            {/* Icon Circle */}
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <ArchetypeIcon className="w-12 h-12" style={{ color: archetype.color }} />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFC045] rounded-full px-4 py-2 mb-4">
              <Award className="w-4 h-4 text-[#192A56]" />
              <span className="text-[#192A56] font-heading" style={{ fontSize: '12px', fontWeight: 600 }}>
                NEW INSIGHT UNLOCKED
              </span>
            </div>

            {/* Archetype Title */}
            <h2 className="text-[#192A56] font-heading mb-3" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
              {archetype.title}
            </h2>

            {/* Description */}
            <p className="text-[#636E72] font-sans mb-6" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}>
              {archetype.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#F5F7FA] rounded-[12px] p-3 text-center">
                <div className="text-[#1A45FF] font-heading mb-1" style={{ fontSize: '24px', fontWeight: 700 }}>
                  87%
                </div>
                <div className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Match
                </div>
              </div>
              <div className="bg-[#F5F7FA] rounded-[12px] p-3 text-center">
                <div className="text-[#1A45FF] font-heading mb-1" style={{ fontSize: '24px', fontWeight: 700 }}>
                  3/5
                </div>
                <div className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Surveys
                </div>
              </div>
              <div className="bg-[#F5F7FA] rounded-[12px] p-3 text-center">
                <div className="text-[#FFC045] font-heading mb-1" style={{ fontSize: '24px', fontWeight: 700 }}>
                  +150
                </div>
                <div className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Coins
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Share Button - Yellow */}
              <button className="w-full h-14 bg-[#FFC045] rounded-full text-[#192A56] font-heading shadow-[0px_4px_0px_#E1A32A] active:translate-y-[2px] active:shadow-[0px_2px_0px_#E1A32A] transition-all flex items-center justify-center gap-2"
                style={{ fontSize: '18px', fontWeight: 700 }}
              >
                <Share2 className="w-5 h-5" />
                Share Result
              </button>

              {/* Continue Button - Ghost */}
              <button 
                onClick={onClose}
                className="w-full h-12 bg-transparent border-2 border-[#EAEAEA] rounded-full text-[#636E72] font-heading hover:border-[#1A45FF] hover:text-[#1A45FF] transition-all"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
