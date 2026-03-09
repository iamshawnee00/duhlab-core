import { useState, useRef } from 'react';
import { Question } from '@/app/components/SurveyBuilder';
import {
  GripVertical,
  Trash2,
  Lightbulb,
  GitBranch,
  ListChecks,
  Star,
  MessageSquare,
  Images,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDrag, useDrop } from 'react-dnd';

interface QuestionCardProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  allQuestions: Question[];
  onMoveQuestion: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = 'QUESTION_CARD';

export function QuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  allQuestions,
  onMoveQuestion,
}: QuestionCardProps) {
  const [showLogicPopup, setShowLogicPopup] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [selectedNextQuestion, setSelectedNextQuestion] = useState<string>('');

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMoveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const getIcon = () => {
    switch (question.type) {
      case 'multiple-choice':
        return ListChecks;
      case 'rating':
        return Star;
      case 'open-text':
        return MessageSquare;
      case 'image-select':
        return Images;
    }
  };

  const Icon = getIcon();

  const handleAddLogic = () => {
    if (selectedAnswer && selectedNextQuestion) {
      const newLogic = question.logic || [];
      newLogic.push({ answerId: selectedAnswer, nextQuestionId: selectedNextQuestion });
      onUpdate({ logic: newLogic });
      setShowLogicPopup(false);
      setSelectedAnswer('');
      setSelectedNextQuestion('');
    }
  };

  const handleRemoveLogic = (index: number) => {
    const newLogic = [...(question.logic || [])];
    newLogic.splice(index, 1);
    onUpdate({ logic: newLogic });
  };

  return (
    <>
      <div
        ref={ref}
        onClick={onSelect}
        className="relative rounded-2xl bg-white transition-all cursor-pointer"
        style={{
          border: isSelected ? '2px solid #1A45FF' : '1px solid #E5E7EB',
          boxShadow: isSelected
            ? '0px 12px 24px rgba(26, 69, 255, 0.15)'
            : '0px 12px 24px rgba(0, 0, 0, 0.05)',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {/* Question Number Badge */}
        <div
          className="absolute -left-4 -top-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: '#1A45FF',
            boxShadow: '0px 4px 8px rgba(26, 69, 255, 0.25)',
          }}
        >
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            {index + 1}
          </span>
        </div>

        {/* Trap Indicator */}
        {question.isTrap && (
          <div
            className="absolute -right-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#FFC045',
              boxShadow: '0px 3px 6px rgba(255, 192, 69, 0.3)',
            }}
          >
            <Lightbulb size={16} style={{ color: '#FFFFFF', fill: '#FFFFFF' }} />
          </div>
        )}

        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
              <GripVertical size={20} style={{ color: '#9CA3AF' }} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F0F3FF' }}
                >
                  <Icon size={16} style={{ color: '#1A45FF', strokeWidth: 2 }} />
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'capitalize',
                  }}
                >
                  {question.type.replace('-', ' ')}
                </span>
              </div>

              <input
                type="text"
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full border-none outline-none bg-transparent"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#192A56',
                }}
                placeholder="Enter your question"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} style={{ color: '#EF4444' }} />
            </button>
          </div>

          {/* Options */}
          {(question.type === 'multiple-choice' || question.type === 'image-select') && (
            <div className="space-y-2 mb-4">
              {question.options?.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2"
                    style={{ borderColor: '#D1D5DB' }}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[optionIndex] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                    className="flex-1 bg-transparent border-none outline-none"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      color: '#192A56',
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                  onUpdate({ options: newOptions });
                }}
                className="text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1A45FF',
                }}
              >
                + Add Option
              </button>
            </div>
          )}

          {question.type === 'rating' && (
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: '#F0F3FF',
                    border: '2px solid #1A45FF',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1A45FF',
                    }}
                  >
                    {num}
                  </span>
                </div>
              ))}
            </div>
          )}

          {question.type === 'open-text' && (
            <div
              className="p-4 rounded-lg mb-4"
              style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontStyle: 'italic',
                }}
              >
                Respondents will enter their answer here...
              </p>
            </div>
          )}

          {/* Logic Display */}
          {question.logic && question.logic.length > 0 && (
            <div className="mb-4 space-y-2">
              {question.logic.map((logicRule, logicIndex) => {
                const targetQuestion = allQuestions.find((q) => q.id === logicRule.nextQuestionId);
                return (
                  <div
                    key={logicIndex}
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{
                      backgroundColor: '#F0F3FF',
                      border: '1px solid #1A45FF',
                    }}
                  >
                    <GitBranch size={14} style={{ color: '#1A45FF' }} />
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: '#192A56',
                      }}
                    >
                      If "{logicRule.answerId}" → Jump to Q{allQuestions.findIndex((q) => q.id === logicRule.nextQuestionId) + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLogic(logicIndex);
                      }}
                      className="ml-auto p-1 rounded hover:bg-white"
                    >
                      <X size={14} style={{ color: '#6B7280' }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Logic Split Button */}
          {(question.type === 'multiple-choice' || question.type === 'image-select') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogicPopup(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-blue-50"
              style={{
                border: '1px solid #1A45FF',
                color: '#1A45FF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <GitBranch size={16} strokeWidth={2} />
              Add Logic Split
            </button>
          )}
        </div>
      </div>

      {/* Logic Popup */}
      <AnimatePresence>
        {showLogicPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowLogicPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] bg-white rounded-2xl p-6 z-50"
              style={{
                border: '1px solid #E5E7EB',
                boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#192A56',
                  }}
                >
                  Add Logic Branching
                </h3>
                <button onClick={() => setShowLogicPopup(false)}>
                  <X size={20} style={{ color: '#6B7280' }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    IF answer is
                  </label>
                  <select
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      borderColor: '#E5E7EB',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                    }}
                  >
                    <option value="">Select an answer</option>
                    {question.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    THEN go to
                  </label>
                  <select
                    value={selectedNextQuestion}
                    onChange={(e) => setSelectedNextQuestion(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      borderColor: '#E5E7EB',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                    }}
                  >
                    <option value="">Select a question</option>
                    {allQuestions
                      .filter((q) => q.id !== question.id)
                      .map((q, idx) => (
                        <option key={q.id} value={q.id}>
                          Question {allQuestions.findIndex((aq) => aq.id === q.id) + 1}: {q.title}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={handleAddLogic}
                  disabled={!selectedAnswer || !selectedNextQuestion}
                  className="w-full py-3 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#1A45FF',
                    color: '#FFFFFF',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '15px',
                    fontWeight: 700,
                    boxShadow: '0px 4px 0px #0D2DB8',
                  }}
                >
                  Add Logic Rule
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}