import { X, Award, Lock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  newlyUnlocked?: string[];
}

export function AchievementsModal({ isOpen, onClose, achievements, newlyUnlocked = [] }: AchievementsModalProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-[24px] shadow-[0px_12px_48px_rgba(0,0,0,0.3)] z-50 max-h-[80vh] flex flex-col"
            style={{ maxWidth: '400px' }}
          >
            {/* Header */}
            <div className="relative px-6 py-6 border-b border-[#EAEAEA]">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#EAEAEA] transition-colors"
              >
                <X className="w-4 h-4 text-[#636E72]" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FFC045] rounded-full flex items-center justify-center shadow-[0px_4px_0px_#E1A32A]">
                  <Award className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-[#192A56] font-heading" style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px' }}>
                    Achievements
                  </h2>
                  <p className="text-[#636E72] font-sans" style={{ fontSize: '14px', fontWeight: 400 }}>
                    {unlockedCount} of {totalCount} unlocked
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-[#FFC045] rounded-full"
                />
              </div>
            </div>

            {/* Achievement List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {achievements.map((achievement) => {
                  const isNewlyUnlocked = newlyUnlocked.includes(achievement.id);
                  const progressPercent = (achievement.progress / achievement.requirement) * 100;

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={isNewlyUnlocked ? { scale: 1.05, boxShadow: '0px 0px 20px rgba(255, 192, 69, 0.5)' } : {}}
                      animate={{ scale: 1, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)' }}
                      transition={{ duration: 0.5 }}
                      className={`bg-white rounded-[16px] border p-4 ${
                        achievement.unlocked
                          ? 'border-[#FFC045] bg-[#FFF9F0]'
                          : 'border-[#EAEAEA]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            achievement.unlocked
                              ? 'shadow-[0px_4px_0px_#E1A32A]'
                              : 'bg-[#F5F7FA]'
                          }`}
                          style={{
                            backgroundColor: achievement.unlocked ? achievement.color : '#F5F7FA',
                          }}
                        >
                          {achievement.unlocked ? (
                            <span className="text-2xl">{achievement.icon}</span>
                          ) : (
                            <Lock className="w-5 h-5 text-[#636E72]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3
                              className={`font-heading ${
                                achievement.unlocked ? 'text-[#192A56]' : 'text-[#636E72]'
                              }`}
                              style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}
                            >
                              {achievement.title}
                            </h3>
                            {achievement.unlocked && (
                              <Check className="w-5 h-5 text-[#00D2D3] flex-shrink-0" strokeWidth={3} />
                            )}
                          </div>

                          <p
                            className="text-[#636E72] font-sans mb-2"
                            style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}
                          >
                            {achievement.description}
                          </p>

                          {/* Progress */}
                          {!achievement.unlocked && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[#636E72] font-sans" style={{ fontSize: '11px', fontWeight: 500 }}>
                                  {achievement.progress} / {achievement.requirement}
                                </span>
                                <span className="text-[#1A45FF] font-heading" style={{ fontSize: '11px', fontWeight: 700 }}>
                                  {Math.floor(progressPercent)}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-[#F5F7FA] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#1A45FF] rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {achievement.unlocked && achievement.unlockedDate && (
                            <p className="text-[#00D2D3] font-sans mt-1" style={{ fontSize: '11px', fontWeight: 500 }}>
                              Unlocked {new Date(achievement.unlockedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
