import { ListChecks, Star, MessageSquare, Images, ChevronLeft } from 'lucide-react';

interface LeftSidebarProps {
  onAddQuestion: (type: 'multiple-choice' | 'rating' | 'open-text' | 'image-select') => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function LeftSidebar({ onAddQuestion, isVisible, onToggleVisibility }: LeftSidebarProps) {
  const questionTypes = [
    {
      type: 'multiple-choice' as const,
      label: 'Multiple Choice',
      icon: ListChecks,
      description: 'Single or multiple answers',
    },
    {
      type: 'rating' as const,
      label: 'Rating Scale',
      icon: Star,
      description: '1-5 or 1-10 scale',
    },
    {
      type: 'open-text' as const,
      label: 'Open Text',
      icon: MessageSquare,
      description: 'Free-form text response',
    },
    {
      type: 'image-select' as const,
      label: 'Image Select',
      icon: Images,
      description: 'Visual choice options',
    },
  ];

  return (
    <div
      className="relative bg-white transition-all duration-300"
      style={{
        width: isVisible ? '288px' : '0px',
        borderRight: isVisible ? '1px solid #E5E7EB' : 'none',
        overflow: 'hidden',
        boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleVisibility}
        className="absolute right-0 top-6 translate-x-full bg-white rounded-r-lg transition-all hover:bg-gray-50 z-10"
        style={{
          padding: '12px 8px',
          border: '1px solid #E5E7EB',
          borderLeft: 'none',
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.05)',
        }}
        title="Toggle sidebar"
      >
        <ChevronLeft
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
            className="mb-2"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              color: '#192A56',
            }}
          >
            The Lab Tools
          </h2>
          <p
            className="mb-6"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#6B7280',
            }}
          >
            Drag components to build your survey
          </p>

          <div className="space-y-3">
            {questionTypes.map((questionType) => {
              const Icon = questionType.icon;
              return (
                <button
                  key={questionType.type}
                  onClick={() => onAddQuestion(questionType.type)}
                  className="w-full rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg cursor-grab active:cursor-grabbing text-left"
                  style={{
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FAFBFC',
                    padding: '16px',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F0F3FF' }}
                    >
                      <Icon size={20} style={{ color: '#1A45FF', strokeWidth: 2 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#192A56',
                          marginBottom: '2px',
                        }}
                      >
                        {questionType.label}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          color: '#6B7280',
                        }}
                      >
                        {questionType.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tips Section */}
          <div
            className="mt-8 rounded-xl"
            style={{
              backgroundColor: '#FFF8E5',
              border: '1px solid #FFC045',
              padding: '16px',
            }}
          >
            <div
              className="mb-2"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#192A56',
              }}
            >
              💡 Pro Tips
            </div>
            <ul
              className="space-y-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              <li>• Use trap questions to ensure quality</li>
              <li>• Add logic branching for personalized flows</li>
              <li>• Randomize options to reduce bias</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}