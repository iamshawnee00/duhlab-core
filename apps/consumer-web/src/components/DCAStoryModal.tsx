import { X, Sparkles, Award, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getArchetypeProfile, getAllArchetypes } from '../utils/archetypes';

interface DCAStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  archetypeName: string;
  surveyCount: number;
  onCompareArchetypes: () => void;
}

export function DCAStoryModal({ isOpen, onClose, archetypeName, surveyCount, onCompareArchetypes }: DCAStoryModalProps) {
  const profile = getArchetypeProfile(archetypeName);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-[24px] shadow-[0px_12px_48px_rgba(0,0,0,0.3)] z-50 max-h-[85vh] flex flex-col overflow-hidden"
            style={{ maxWidth: '400px' }}
          >
            {/* Header with Gradient */}
            <div 
              className="relative px-6 pt-6 pb-16 text-white overflow-hidden"
              style={{ background: profile.gradient }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <X className="w-4 h-4 text-white" />
              </button>

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

              <div className="relative z-10">
                {/* Icon */}
                <div className="text-6xl mb-4">{profile.emoji}</div>
                
                {/* Title */}
                <h2 className="font-heading mb-16" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
                  {profile.name}
                </h2>
                <p className="font-sans opacity-90" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {profile.tagline}
                </p>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="relative -mt-12 mx-6 mb-4 z-10">
              <div className="bg-white rounded-[16px] shadow-[0px_8px_24px_rgba(0,0,0,0.15)] p-4 border border-[#EAEAEA]">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-[#1A45FF] font-heading mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                      {surveyCount}
                    </div>
                    <div className="text-[#636E72] font-sans" style={{ fontSize: '11px', fontWeight: 400 }}>
                      Surveys
                    </div>
                  </div>
                  <div>
                    <div className="text-[#FFC045] font-heading mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                      {Math.min(40 + surveyCount * 2, 100)}%
                    </div>
                    <div className="text-[#636E72] font-sans" style={{ fontSize: '11px', fontWeight: 400 }}>
                      Complete
                    </div>
                  </div>
                  <div>
                    <div className="text-[#00D2D3] font-heading mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
                      {Object.keys(getAllArchetypes()).indexOf(archetypeName) + 1}/5
                    </div>
                    <div className="text-[#636E72] font-sans" style={{ fontSize: '11px', fontWeight: 400 }}>
                      Level
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-[#192A56] font-heading mb-3" style={{ fontSize: '18px', fontWeight: 600 }}>
                  Your Story
                </h3>
                <p className="text-[#636E72] font-sans leading-relaxed" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '22px' }}>
                  {profile.description}
                </p>
              </div>

              {/* Personality Traits */}
              <div className="mb-6">
                <h3 className="text-[#192A56] font-heading mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Personality
                </h3>
                <div className="space-y-2">
                  {profile.personality.map((trait, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: profile.color }} />
                      <span className="text-[#636E72] font-sans" style={{ fontSize: '13px', fontWeight: 400 }}>
                        {trait}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-6">
                <h3 className="text-[#192A56] font-heading mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Your Strengths
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {profile.strengths.map((strength, index) => (
                    <div 
                      key={index}
                      className="bg-[#F5F7FA] rounded-[12px] px-3 py-2 text-center"
                    >
                      <span className="text-[#192A56] font-sans" style={{ fontSize: '12px', fontWeight: 500 }}>
                        {strength}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trait Bars */}
              <div className="mb-6">
                <h3 className="text-[#192A56] font-heading mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Core Traits
                </h3>
                <div className="space-y-4">
                  {profile.traits.map((trait, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#636E72] font-sans" style={{ fontSize: '13px', fontWeight: 500 }}>
                          {trait.label}
                        </span>
                        <span className="text-[#192A56] font-heading" style={{ fontSize: '14px', fontWeight: 700 }}>
                          {trait.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${trait.value}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: trait.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#FFC045]" />
                  <h3 className="text-[#192A56] font-heading" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Tips for Growth
                  </h3>
                </div>
                <div className="space-y-2">
                  {profile.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-1.5 w-1 h-1 rounded-full bg-[#FFC045] flex-shrink-0" />
                      <span className="text-[#636E72] font-sans" style={{ fontSize: '13px', fontWeight: 400, lineHeight: '20px' }}>
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  onClose();
                  onCompareArchetypes();
                }}
                className="w-full h-12 rounded-full bg-[#1A45FF] text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] flex items-center justify-center gap-2 transition-all"
                style={{ fontSize: '16px', fontWeight: 700 }}
              >
                <Users className="w-5 h-5" />
                Compare with Other Archetypes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}