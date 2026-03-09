import { Question } from '@/app/components/SurveyBuilder';
import { QuestionCard } from '@/app/components/builder/QuestionCard';
import { useCallback } from 'react';

interface CenterCanvasProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onReorderQuestions: (startIndex: number, endIndex: number) => void;
}

export function CenterCanvas({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
}: CenterCanvasProps) {
  const moveQuestion = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      onReorderQuestions(dragIndex, hoverIndex);
    },
    [onReorderQuestions]
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {questions.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px dashed #E5E7EB',
            }}
          >
            <div
              className="mb-2"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#192A56',
              }}
            >
              Start Building Your Survey
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: '#6B7280',
              }}
            >
              Select a question type from the left sidebar to begin
            </p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question.id}>
              <QuestionCard
                question={question}
                index={index}
                isSelected={selectedQuestionId === question.id}
                onSelect={() => onSelectQuestion(question.id)}
                onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                onDelete={() => onDeleteQuestion(question.id)}
                allQuestions={questions}
                onMoveQuestion={moveQuestion}
              />

              {/* Logic Connector Lines */}
              {question.logic && question.logic.length > 0 && (
                <div className="relative h-12">
                  {question.logic.map((logicRule, logicIndex) => {
                    const targetIndex = questions.findIndex((q) => q.id === logicRule.nextQuestionId);
                    if (targetIndex > index) {
                      return (
                        <svg
                          key={logicIndex}
                          className="absolute left-1/2 top-0"
                          style={{
                            width: '4px',
                            height: '48px',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <line
                            x1="2"
                            y1="0"
                            x2="2"
                            y2="48"
                            stroke="#1A45FF"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                          />
                        </svg>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}