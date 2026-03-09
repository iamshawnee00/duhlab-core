import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftSidebar } from '@/app/components/builder/LeftSidebar';
import { CenterCanvas } from '@/app/components/builder/CenterCanvas';
import { RightSidebar } from '@/app/components/builder/RightSidebar';
import { FlowBuilder } from '@/app/components/builder/FlowBuilder';
import { ArrowLeft, Eye, Rocket, LayoutList, Network } from 'lucide-react';

interface SurveyBuilderProps {
  onBack: () => void;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'rating' | 'open-text' | 'image-select';
  title: string;
  description?: string;
  options?: string[];
  required: boolean;
  randomize: boolean;
  isTrap: boolean;
  logic?: { answerId: string; nextQuestionId: string }[];
}

export function SurveyBuilder({ onBack }: SurveyBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'multiple-choice',
      title: 'What is your primary reason for using our service?',
      options: ['Price', 'Quality', 'Convenience', 'Recommendation'],
      required: true,
      randomize: false,
      isTrap: false,
    },
  ]);
  
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>('1');
  const [viewMode, setViewMode] = useState<'linear' | 'flow'>('linear');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: 'New Question',
      options: type === 'multiple-choice' || type === 'image-select' ? ['Option 1', 'Option 2'] : undefined,
      required: false,
      randomize: false,
      isTrap: false,
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (selectedQuestionId === id) {
      setSelectedQuestionId(null);
    }
  };

  const reorderQuestions = (startIndex: number, endIndex: number) => {
    const result = Array.from(questions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setQuestions(result);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-4 bg-white"
          style={{
            borderBottom: '1px solid #E5E7EB',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} style={{ color: '#192A56' }} />
            </button>
            <div>
              <h1
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#192A56',
                }}
              >
                Untitled Survey
              </h1>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#6B7280',
                }}
              >
                {questions.length} questions • Auto-saved 2 min ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div
              className="flex items-center rounded-full p-1"
              style={{
                backgroundColor: '#F0F3FF',
                border: '1px solid #E5E7EB',
              }}
            >
              <button
                onClick={() => setViewMode('flow')}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{
                  backgroundColor: viewMode === 'flow' ? '#1A45FF' : 'transparent',
                  color: viewMode === 'flow' ? '#FFFFFF' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <Network size={16} strokeWidth={2} />
                Flow
              </button>
              <button
                onClick={() => setViewMode('linear')}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{
                  backgroundColor: viewMode === 'linear' ? '#1A45FF' : 'transparent',
                  color: viewMode === 'linear' ? '#FFFFFF' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <LayoutList size={16} strokeWidth={2} />
                Outline
              </button>
            </div>

            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:bg-gray-50"
              style={{
                border: '2px solid #1A45FF',
                color: '#1A45FF',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              <Eye size={18} strokeWidth={2} />
              Test Flow
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-full transition-all hover:scale-105"
              style={{
                backgroundColor: '#1A45FF',
                color: '#FFFFFF',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '15px',
                fontWeight: 700,
                boxShadow: '0px 4px 0px #0D2DB8',
              }}
            >
              <Rocket size={18} strokeWidth={2} />
              Publish
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {viewMode === 'linear' ? (
            <>
              {/* Left Sidebar */}
              <LeftSidebar 
                onAddQuestion={addQuestion}
                isVisible={isLeftSidebarVisible}
                onToggleVisibility={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}
              />

              {/* Center Canvas */}
              <CenterCanvas
                questions={questions}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={setSelectedQuestionId}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
                onReorderQuestions={reorderQuestions}
              />

              {/* Right Sidebar */}
              {selectedQuestion && (
                <RightSidebar 
                  question={selectedQuestion} 
                  onUpdateQuestion={updateQuestion}
                  isVisible={isSidebarVisible}
                  onToggleVisibility={() => setIsSidebarVisible(!isSidebarVisible)}
                />
              )}
            </>
          ) : (
            <>
              {/* Left Sidebar for Flow Mode */}
              <LeftSidebar 
                onAddQuestion={addQuestion}
                isVisible={isLeftSidebarVisible}
                onToggleVisibility={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}
              />

              {/* Flow Builder Canvas */}
              <div className="flex-1 relative">
                <FlowBuilder
                  questions={questions}
                  selectedQuestionId={selectedQuestionId}
                  onSelectQuestion={setSelectedQuestionId}
                  onUpdateQuestion={updateQuestion}
                  onDeleteQuestion={deleteQuestion}
                />
              </div>

              {/* Right Sidebar */}
              {selectedQuestion && (
                <RightSidebar 
                  question={selectedQuestion} 
                  onUpdateQuestion={updateQuestion}
                  isVisible={isSidebarVisible}
                  onToggleVisibility={() => setIsSidebarVisible(!isSidebarVisible)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
}