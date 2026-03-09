import { Question } from '@/app/components/SurveyBuilder';
import { AlertCircle, Shuffle, Lock, Lightbulb, ChevronRight } from 'lucide-react';

interface RightSidebarProps {
  question: Question;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function RightSidebar({ question, onUpdateQuestion, isVisible, onToggleVisibility }: RightSidebarProps) {
  return (
    <div
      className="relative bg-white transition-all duration-300"
      style={{
        width: isVisible ? '320px' : '0px',
        borderLeft: isVisible ? '1px solid #E5E7EB' : 'none',
        overflow: 'hidden',
        boxShadow: '-2px 0px 8px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleVisibility}
        className="absolute left-0 top-6 -translate-x-full bg-white rounded-l-lg transition-all hover:bg-gray-50 z-10"
        style={{
          padding: '12px 8px',
          border: '1px solid #E5E7EB',
          borderRight: 'none',
          boxShadow: '-2px 2px 8px rgba(0, 0, 0, 0.05)',
        }}
        title="Toggle sidebar"
      >
        <ChevronRight
          size={20}
          style={{
            color: '#1A45FF',
            transform: isVisible ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s',
          }}
        />
      </button>

      <div className="h-full overflow-y-auto">
        <div style={{ padding: '24px' }}>
          <h2
            className="mb-6"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              color: '#192A56',
            }}
          >
            Question Settings
          </h2>

          {/* Required Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock size={18} style={{ color: '#6B7280' }} />
                <label
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#192A56',
                  }}
                >
                  Required Question
                </label>
              </div>
              <button
                onClick={() => onUpdateQuestion(question.id, { required: !question.required })}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{
                  backgroundColor: question.required ? '#1A45FF' : '#D1D5DB',
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{
                    left: question.required ? '28px' : '4px',
                  }}
                />
              </button>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Respondents must answer this question to continue
            </p>
          </div>

          {/* Randomize Toggle */}
          {(question.type === 'multiple-choice' || question.type === 'image-select') && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shuffle size={18} style={{ color: '#6B7280' }} />
                  <label
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#192A56',
                    }}
                  >
                    Randomize Options
                  </label>
                </div>
                <button
                  onClick={() => onUpdateQuestion(question.id, { randomize: !question.randomize })}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{
                    backgroundColor: question.randomize ? '#1A45FF' : '#D1D5DB',
                  }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    style={{
                      left: question.randomize ? '28px' : '4px',
                    }}
                  />
                </button>
              </div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#6B7280',
                }}
              >
                Shuffle answer choices to reduce order bias
              </p>
            </div>
          )}

          {/* Trap Question Toggle */}
          <div
            className="mb-6 rounded-xl"
            style={{
              backgroundColor: question.isTrap ? '#FFF8E5' : '#F9FAFB',
              border: question.isTrap ? '2px solid #FFC045' : '1px solid #E5E7EB',
              padding: '16px',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb
                  size={18}
                  style={{
                    color: question.isTrap ? '#FFC045' : '#6B7280',
                    fill: question.isTrap ? '#FFC045' : 'none',
                  }}
                />
                <label
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#192A56',
                  }}
                >
                  Trap Question
                </label>
              </div>
              <button
                onClick={() => onUpdateQuestion(question.id, { isTrap: !question.isTrap })}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{
                  backgroundColor: question.isTrap ? '#FFC045' : '#D1D5DB',
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{
                    left: question.isTrap ? '28px' : '4px',
                  }}
                />
              </button>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              {question.isTrap
                ? '🎯 Active: Used to identify low-quality responses'
                : 'Use for attention checks and quality control'}
            </p>
          </div>

          <div className="h-px bg-gray-200 my-6" />

          {/* Question Info */}
          <div
            className="rounded-xl"
            style={{
              backgroundColor: '#F0F3FF',
              border: '1px solid #1A45FF',
              padding: '16px',
            }}
          >
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle size={16} style={{ color: '#1A45FF', marginTop: '2px' }} />
              <div>
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#192A56',
                  }}
                >
                  Question Type
                </div>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#6B7280',
                    textTransform: 'capitalize',
                  }}
                >
                  {question.type.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="mt-6">
            <h3
              className="mb-3"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#192A56',
              }}
            >
              Best Practices
            </h3>
            <ul
              className="space-y-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
                paddingLeft: '20px',
              }}
            >
              <li>Keep questions clear and concise</li>
              <li>Avoid leading or biased language</li>
              <li>Use trap questions strategically</li>
              <li>Test your survey flow before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}