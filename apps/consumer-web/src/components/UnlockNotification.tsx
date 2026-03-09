import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';

interface UnlockNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    title: string;
    description: string;
    icon: string;
    color: string;
  };
}

export function UnlockNotification({ isOpen, onClose, achievement }: UnlockNotificationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm mx-4"
          onClick={onClose}
        >
          <div className="bg-white rounded-[20px] shadow-[0px_12px_48px_rgba(0,0,0,0.25)] overflow-hidden border-2 border-[#FFC045]">
            {/* Sparkle Effect Background */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-2 right-2"
              >
                <Sparkles className="w-6 h-6 text-[#FFC045]" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute bottom-2 left-2"
              >
                <Sparkles className="w-5 h-5 text-[#FFC045]" />
              </motion.div>
            </div>

            <div className="relative p-6 flex items-center gap-4">
              {/* Achievement Icon */}
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0px_4px_0px_#E1A32A] flex-shrink-0"
                style={{ backgroundColor: achievement.color }}
              >
                <span className="text-3xl">{achievement.icon}</span>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-[#FFC045]" />
                  <span className="text-[#FFC045] font-heading" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                    ACHIEVEMENT UNLOCKED
                  </span>
                </div>
                <h3 className="text-[#192A56] font-heading mb-1" style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}>
                  {achievement.title}
                </h3>
                <p className="text-[#636E72] font-sans" style={{ fontSize: '13px', fontWeight: 400, lineHeight: '18px' }}>
                  {achievement.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
