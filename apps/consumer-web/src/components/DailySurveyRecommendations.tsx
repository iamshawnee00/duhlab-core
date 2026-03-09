import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SurveyRecommendation {
  id: string;
  title: string;
  district: string;
  description: string;
  estimatedTime: number;
  coinReward: number;
  category: string;
  reason: string;
}

interface DailySurveyRecommendationsProps {
  recommendations: SurveyRecommendation[];
  onStartSurvey: (district: string) => void;
}

export function DailySurveyRecommendations({ recommendations, onStartSurvey }: DailySurveyRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#FFC045]" />
        <h3 className="text-white font-heading" style={{ fontSize: '18px', fontWeight: 600 }}>
          Today's Recommendations
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[16px] overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-[#EAEAEA]"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-xs font-heading px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: '#F0F3FF',
                        color: '#1A45FF',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      {rec.category}
                    </span>
                    <span className="text-[#636E72] font-sans" style={{ fontSize: '11px', fontWeight: 400 }}>
                      {rec.estimatedTime} min
                    </span>
                  </div>
                  <h4 className="text-[#192A56] font-heading mb-1" style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>
                    {rec.title}
                  </h4>
                  <p className="text-[#636E72] font-sans" style={{ fontSize: '13px', fontWeight: 400, lineHeight: '18px' }}>
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Why Recommended */}
              <div className="bg-[#FFF9F0] rounded-[12px] p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFC045] flex-shrink-0" />
                  <span className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                    {rec.reason}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onStartSurvey(rec.district)}
                className="w-full h-10 rounded-full bg-[#1A45FF] text-white font-heading shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5] flex items-center justify-center gap-2 transition-all"
                style={{ fontSize: '14px', fontWeight: 700 }}
              >
                Start Survey
                <ArrowRight className="w-4 h-4" />
                <span className="ml-auto flex items-center gap-1">
                  <span className="text-[#FFC045]">+{rec.coinReward}</span>
                  <span className="text-sm">🪙</span>
                </span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
