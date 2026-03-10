import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Send, X } from 'lucide-react';
import { API_URL } from '@/utils/supabase';

interface SurveyBuilderProps {
  onBack: () => void;
  token: string | null; // Receive the token securely from the Dashboard
}

// Define our powerful Question structure
interface Question {
  id: number;
  text: string;
  type: 'multiple_choice' | 'text';
  options: string[];
}

export function SurveyBuilder({ onBack, token }: SurveyBuilderProps) {
  const [title, setTitle] = useState('');
  const [targetDemographic, setTargetDemographic] = useState('18-35');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: '', type: 'multiple_choice', options: ['Option 1', 'Option 2'] }
  ]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', type: 'multiple_choice', options: ['Option 1', 'Option 2'] }
    ]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuestionTextChange = (id: number, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleQuestionTypeChange = (id: number, type: 'multiple_choice' | 'text') => {
    setQuestions(questions.map(q => q.id === id ? { ...q, type } : q));
  };

  const handleOptionChange = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleAddOption = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const handleRemoveOption = (questionId: number, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = q.options.filter((_, idx) => idx !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handlePublish = async () => {
    if (!token) {
      setError("You must be logged in to publish a survey. Session expired.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a survey title.");
      return;
    }

    // Validate questions
    for (const q of questions) {
      if (!q.text.trim()) {
        setError("All questions must have text.");
        return;
      }
    }

    setIsPublishing(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/client/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          target_audience: { demographic: targetDemographic },
          survey_schema: { questions },
          status: "active",
          budget_coins: 500
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to publish survey");

      alert("Success! Your survey has been published to the Consumer app.");
      onBack();
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F5F7FA]">
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#192A56]" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#192A56] font-heading">Survey Builder</h2>
            <p className="text-[#6B7280] text-sm mt-1">Design your research campaign</p>
          </div>
        </div>
        
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 bg-[#1A45FF] text-white px-8 py-3 rounded-full font-bold shadow-[0px_4px_0px_#0D2DB8] transition-all hover:translate-y-[2px] hover:shadow-[0px_2px_0px_#0D2DB8] disabled:opacity-50"
        >
          {isPublishing ? 'Publishing...' : (
            <>
              <Send size={18} /> Publish to Consumers
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <h3 className="text-xl font-bold text-[#192A56] font-heading mb-6">Campaign Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Survey Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Gen Z Coffee Preferences"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A45FF] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Target Demographic</label>
                <select 
                  value={targetDemographic}
                  onChange={(e) => setTargetDemographic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A45FF] focus:outline-none bg-white"
                >
                  <option value="All Ages">All Ages</option>
                  <option value="18-24">Gen Z (18-24)</option>
                  <option value="25-34">Millennials (25-34)</option>
                  <option value="35-44">Gen X (35-44)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#192A56] font-heading">Questions</h3>
              <span className="text-sm font-bold text-[#1A45FF] bg-blue-50 px-3 py-1 rounded-full">
                {questions.length} / 10
              </span>
            </div>

            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="flex gap-4 items-start p-5 border border-gray-100 bg-gray-50 rounded-xl">
                  
                  {/* Question Number */}
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#1A45FF] shrink-0">
                    {index + 1}
                  </div>
                  
                  {/* Question Content */}
                  <div className="flex-1 space-y-4">
                    {/* Input & Type Row */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                        placeholder="Enter your question here..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A45FF] focus:outline-none"
                      />
                      <select
                        value={q.type}
                        onChange={(e) => handleQuestionTypeChange(q.id, e.target.value as 'multiple_choice' | 'text')}
                        className="w-48 px-3 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A45FF] text-sm text-gray-700"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="text">Short Answer (Text)</option>
                      </select>
                    </div>

                    {/* Options Builder (Only show if multiple choice) */}
                    {q.type === 'multiple_choice' && (
                      <div className="pl-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Answers Options</label>
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(q.id, optIndex, e.target.value)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#1A45FF]"
                            />
                            {q.options.length > 2 && (
                              <button 
                                onClick={() => handleRemoveOption(q.id, optIndex)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddOption(q.id)}
                          className="text-sm font-semibold text-[#1A45FF] hover:underline flex items-center gap-1 mt-2"
                        >
                          <Plus size={14} /> Add Option
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Question Button */}
                  <button 
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddQuestion}
              disabled={questions.length >= 10}
              className="mt-6 w-full py-4 border-2 border-dashed border-[#1A45FF] text-[#1A45FF] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> Add Another Question
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}