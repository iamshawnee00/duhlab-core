import { X, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllArchetypes, getArchetypeProfile, ArchetypeProfile } from '../utils/archetypes';

interface ArchetypeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentArchetype: string;
  onSelectArchetype: (archetypeName: string) => void;
}

export function ArchetypeComparisonModal({ isOpen, onClose, currentArchetype, onSelectArchetype }: ArchetypeComparisonModalProps) {
  const allArchetypes = getAllArchetypes();
  const currentProfile = getArchetypeProfile(currentArchetype);

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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-[24px] shadow-[0px_12px_48px_rgba(0,0,0,0.3)] z-50 max-h-[85vh] flex flex-col"
            style={{ maxWidth: '400px' }}
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-[#EAEAEA]">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#EAEAEA] transition-colors"
              >
                <X className="w-4 h-4 text-[#636E72]" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-[#1A45FF] rounded-full flex items-center justify-center shadow-[0px_4px_0px_#0F30B5]">
                  <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-[#192A56] font-heading" style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px' }}>
                    All Archetypes
                  </h2>
                  <p className="text-[#636E72] font-sans" style={{ fontSize: '14px', fontWeight: 400 }}>
                    Compare with others
                  </p>
                </div>
              </div>
            </div>

            {/* Archetype List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {allArchetypes.map((archetype, index) => {
                  const isCurrent = archetype.name === currentArchetype;
                  
                  return (
                    <motion.button
                      key={archetype.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onSelectArchetype(archetype.name);
                        onClose();
                      }}
                      className={`w-full rounded-[16px] p-4 text-left transition-all ${
                        isCurrent
                          ? 'bg-[#F0F3FF] border-2 border-[#1A45FF]'
                          : 'bg-[#F5F7FA] border-2 border-transparent hover:border-[#1A45FF]/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
                          style={{ background: archetype.gradient }}
                        >
                          {archetype.emoji}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[#192A56] font-heading" style={{ fontSize: '16px', fontWeight: 600 }}>
                              {archetype.name}
                            </h3>
                            {isCurrent && (
                              <span 
                                className="text-xs font-heading px-2 py-0.5 rounded-full bg-[#1A45FF] text-white"
                                style={{ fontSize: '10px', fontWeight: 700 }}
                              >
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[#636E72] font-sans mb-2" style={{ fontSize: '13px', fontWeight: 400, lineHeight: '18px' }}>
                            {archetype.tagline}
                          </p>

                          {/* Trait Preview */}
                          <div className="flex gap-2">
                            {archetype.traits.slice(0, 3).map((trait, i) => (
                              <div key={i} className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[#636E72] font-sans" style={{ fontSize: '10px', fontWeight: 500 }}>
                                    {trait.label}
                                  </span>
                                  <span className="text-[#192A56] font-heading" style={{ fontSize: '10px', fontWeight: 700 }}>
                                    {trait.value}%
                                  </span>
                                </div>
                                <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{ 
                                      width: `${trait.value}%`,
                                      backgroundColor: trait.color 
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!isCurrent && (
                          <ArrowRight className="w-5 h-5 text-[#636E72] flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#EAEAEA]">
              <p className="text-center text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '18px' }}>
                Your archetype evolves as you complete more surveys. Keep exploring to unlock new levels!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
