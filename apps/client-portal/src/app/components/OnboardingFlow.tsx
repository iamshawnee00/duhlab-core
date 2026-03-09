import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Building2, Store, Sparkles, CheckCircle2 } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    companyName: '',
    industry: '',
    metrics: [] as string[],
  });

  const industries = [
    { id: 'fmcg', label: 'FMCG', icon: ShoppingCart },
    { id: 'banking', label: 'Banking', icon: Building2 },
    { id: 'retail', label: 'Retail', icon: Store },
    { id: 'ai', label: 'AI', icon: Sparkles },
  ];

  const metrics = [
    'Lead Generation',
    'Market Insight',
    'Customer Retention',
    'Brand Awareness',
    'Revenue Growth',
    'Product Development',
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleIndustrySelect = (industryId: string) => {
    setFormData({ ...formData, industry: industryId });
  };

  const handleMetricToggle = (metric: string) => {
    const newMetrics = formData.metrics.includes(metric)
      ? formData.metrics.filter((m) => m !== metric)
      : [...formData.metrics, metric];
    setFormData({ ...formData, metrics: newMetrics });
  };

  const progress = ((currentStep + 1) / 3) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
      <div 
        className="relative w-[560px] bg-white rounded-2xl overflow-hidden"
        style={{ border: '1px solid #EAEAEA', boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)' }}
      >
        {/* Progress Bar */}
        <div className="h-1.5" style={{ backgroundColor: '#E0E0E0' }}>
          <motion.div
            className="h-full"
            style={{ backgroundColor: '#00D2D3' }}
            initial={{ width: '33.33%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Card Content */}
        <div className="p-12 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {currentStep === 0 && (
                <div>
                  <h1 className="mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                    Identify Yourself
                  </h1>
                  <p className="mb-8" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6B7280' }}>
                    Let's get to know you better
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#374151', fontWeight: 500 }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          borderColor: '#E5E7EB',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '16px',
                          backgroundColor: '#FAFBFC'
                        }}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#374151', fontWeight: 500 }}>
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          borderColor: '#E5E7EB',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '16px',
                          backgroundColor: '#FAFBFC'
                        }}
                        placeholder="Enter your job title"
                      />
                    </div>

                    <div>
                      <label className="block mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#374151', fontWeight: 500 }}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          borderColor: '#E5E7EB',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '16px',
                          backgroundColor: '#FAFBFC'
                        }}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h1 className="mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                    Industry Focus
                  </h1>
                  <p className="mb-8" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6B7280' }}>
                    Select your primary industry
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {industries.map((industry) => {
                      const Icon = industry.icon;
                      const isSelected = formData.industry === industry.id;
                      return (
                        <button
                          key={industry.id}
                          onClick={() => handleIndustrySelect(industry.id)}
                          className="p-6 rounded-xl border-2 transition-all hover:scale-105"
                          style={{
                            borderColor: isSelected ? '#1A45FF' : '#E5E7EB',
                            backgroundColor: isSelected ? '#F0F3FF' : '#FFFFFF',
                          }}
                        >
                          <Icon
                            size={40}
                            style={{
                              color: isSelected ? '#1A45FF' : '#6B7280',
                              strokeWidth: 2,
                              marginBottom: '12px',
                            }}
                          />
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: isSelected ? '#1A45FF' : '#1A1A1A' }}>
                            {industry.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h1 className="mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                    Success Metrics
                  </h1>
                  <p className="mb-8" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6B7280' }}>
                    Choose your business goals
                  </p>

                  <div className="space-y-3">
                    {metrics.map((metric) => {
                      const isSelected = formData.metrics.includes(metric);
                      return (
                        <button
                          key={metric}
                          onClick={() => handleMetricToggle(metric)}
                          className="w-full flex items-center gap-3 p-4 rounded-lg border transition-all hover:border-blue-300"
                          style={{
                            borderColor: isSelected ? '#1A45FF' : '#E5E7EB',
                            backgroundColor: isSelected ? '#F0F3FF' : '#FAFBFC',
                          }}
                        >
                          <div
                            className="flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center"
                            style={{
                              borderColor: isSelected ? '#1A45FF' : '#D1D5DB',
                              backgroundColor: isSelected ? '#1A45FF' : '#FFFFFF',
                            }}
                          >
                            {isSelected && <CheckCircle2 size={16} color="#FFFFFF" />}
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#374151', fontWeight: 500 }}>
                            {metric}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-12 pb-8">
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-full font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: '#FFC045',
              color: '#1A1A1A',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px',
              boxShadow: '0px 4px 0px #E1A32A',
            }}
          >
            {currentStep === 2 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
