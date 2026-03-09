import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SurveyScreenProps {
  onComplete: () => void;
  onBack: () => void;
  selectedDistrict?: string;
  accessToken: string | null;
  onCoinsUpdate: (coins: number) => void;
}

const SURVEY_QUESTIONS = [
  {
    id: 1,
    question: "Would you recommend our brand to your colleagues?",
    options: [
      "Definitely yes",
      "Probably yes",
      "Not sure",
      "Probably not",
      "Definitely not"
    ]
  },
  {
    id: 2,
    question: "What if... you could choose your next feature development? What should it be regarding your needs?",
    options: [
      "Feature A - Better analytics",
      "Feature B - Team collaboration",
      "Feature C - Advanced reporting",
      "Feature D - Mobile app"
    ]
  },
  {
    id: 3,
    question: "How would you rate your overall experience with our platform?",
    options: [
      "Excellent",
      "Good",
      "Average",
      "Below Average",
      "Poor"
    ]
  }
];

export function SurveyScreen({ onComplete, onBack, selectedDistrict, accessToken, onCoinsUpdate }: SurveyScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const progress = ((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100;
  const question = SURVEY_QUESTIONS[currentQuestion];

  const handleNext = async () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Survey complete - submit to backend
        try {
          console.log('Submitting survey with accessToken:', accessToken ? 'present' : 'missing');
          console.log('Survey data:', {
            district: selectedDistrict || 'General',
            answers: newAnswers,
          });

          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/surveys`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                district: selectedDistrict || 'General',
                answers: newAnswers,
              }),
            }
          );

          console.log('Survey response status:', response.status);
          
          const data = await response.json();
          console.log('Survey response data:', data);

          if (response.ok) {
            console.log('Survey submitted successfully:', data);
            onCoinsUpdate(data.totalCoins);
          } else {
            console.error('Survey submission error:', data.error || data || 'Unknown error');
            alert(`Survey submission failed: ${data.error || JSON.stringify(data) || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Failed to submit survey - catch block:', error);
          alert(`Failed to submit survey: ${error instanceof Error ? error.message : 'Network error'}`);
        }
        
        onComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const newAnswers = [...answers];
      const previousAnswer = newAnswers.pop();
      setAnswers(newAnswers);
      setSelectedAnswer(previousAnswer ?? null);
    } else {
      onBack();
    }
  };

  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-[#EAEAEA] relative">
        <div 
          className="h-full bg-[#1A45FF] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Question Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#636E72] font-sans" style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                Question {currentQuestion + 1} of {SURVEY_QUESTIONS.length}
              </span>
            </div>
            <h2 className="text-[#192A56] font-heading" style={{ fontSize: '20px', fontWeight: 600, lineHeight: '28px' }}>
              {question.question}
            </h2>
          </div>

          {/* Swipeable Answer Cards */}
          <div className="relative h-[400px] mb-8">
            {question.options.map((option, index) => {
              const isActive = index === (selectedAnswer ?? 0);
              const offset = index - (selectedAnswer ?? 0);
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-300 ease-out"
                  style={{
                    transform: `translateX(${offset * 100}%) scale(${isActive ? 1 : 0.9})`,
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? 'auto' : 'none',
                    zIndex: isActive ? 10 : 0,
                  }}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    (e.currentTarget as any).startX = touch.clientX;
                    (e.currentTarget as any).startY = touch.clientY;
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const startX = (e.currentTarget as any).startX || touch.clientX;
                    const startY = (e.currentTarget as any).startY || touch.clientY;
                    const deltaX = touch.clientX - startX;
                    const deltaY = touch.clientY - startY;
                    
                    // Only track horizontal swipes
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                      e.preventDefault();
                      const rotation = deltaX * 0.03;
                      e.currentTarget.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
                      
                      // Add visual feedback
                      if (deltaX > 50) {
                        e.currentTarget.style.borderColor = '#00D2D3';
                      } else if (deltaX < -50) {
                        e.currentTarget.style.borderColor = '#1A45FF';
                      } else {
                        e.currentTarget.style.borderColor = '#1A45FF';
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    const touch = e.changedTouches[0];
                    const startX = (e.currentTarget as any).startX || touch.clientX;
                    const deltaX = touch.clientX - startX;
                    
                    // Reset transform
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.borderColor = '';
                    
                    // Swipe right = Select this answer and go to next question
                    if (deltaX > 100) {
                      setSelectedAnswer(index);
                      setTimeout(() => handleNext(), 200);
                    }
                    // Swipe left = Show next option
                    else if (deltaX < -100) {
                      const nextIndex = (index + 1) % question.options.length;
                      setSelectedAnswer(nextIndex);
                    }
                  }}
                >
                  <div className="h-full bg-white rounded-[24px] border-4 border-[#1A45FF] shadow-[0px_8px_24px_rgba(26,69,255,0.15)] p-8 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing touch-none">
                    {/* Option Number */}
                    <div className="w-16 h-16 rounded-full bg-[#1A45FF] text-white font-heading mb-6 flex items-center justify-center shadow-[0px_4px_0px_#0F30B5]" style={{ fontSize: '24px', fontWeight: 700 }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    
                    {/* Option Text */}
                    <p className="text-[#192A56] font-sans mb-8" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px' }}>
                      {option}
                    </p>

                    {/* Swipe Instruction */}
                    <div className="flex items-center gap-4 text-[#636E72]">
                      <div className="flex items-center gap-2">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>Next option</span>
                      </div>
                      <div className="w-px h-4 bg-[#EAEAEA]"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans" style={{ fontSize: '12px', fontWeight: 400 }}>Select & Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Card Navigation Dots */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {question.options.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === (selectedAnswer ?? 0)
                      ? 'bg-[#1A45FF] w-6'
                      : 'bg-[#EAEAEA]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-12">
            {/* Fold/Previous Button */}
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-white border-2 border-[#EAEAEA] rounded-full text-[#636E72] font-heading shadow-sm hover:border-[#1A45FF]/30 transition-all"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {currentQuestion === 0 ? 'Fold' : 'Previous'}
            </button>

            {/* Tap to Select Button */}
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`flex-1 h-14 rounded-full text-white font-heading transition-all ${
                selectedAnswer !== null
                  ? 'bg-[#1A45FF] shadow-[0px_4px_0px_#0F30B5] active:translate-y-[2px] active:shadow-[0px_2px_0px_#0F30B5]'
                  : 'bg-[#636E72] opacity-50 cursor-not-allowed'
              }`}
              style={{ fontSize: '18px', fontWeight: 700 }}
            >
              {currentQuestion === SURVEY_QUESTIONS.length - 1 ? 'Submit' : 'Tap to Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}