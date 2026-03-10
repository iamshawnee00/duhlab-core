import { useState, useEffect } from 'react';
import { ClipboardList, Coins, ChevronRight, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

const API_URL = "http://localhost:3001/make-server-e7b4487d";

interface MissionsScreenProps {
  onBack?: () => void;
  onCoinsEarned?: (newTotal: number) => void;
  token?: string | null; // Made optional so it won't break if the parent forgets it
}

export function MissionsScreen({ onBack, onCoinsEarned, token }: MissionsScreenProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Survey Taking State
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);

  // Helper to safely get token
  const getActiveToken = () => {
    if (token) return token;
    
    // Fallback 1: Look for the custom token we save during login
    const customToken = localStorage.getItem('duhlab_consumer_token');
    if (customToken) return customToken;

    // Fallback 2: Grab it straight from Supabase's local storage
    const authData = localStorage.getItem('sb-ygszeafbdrhhommcjevq-auth-token');
    if (authData) {
      try {
        return JSON.parse(authData).access_token;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // 1. Fetch Active Campaigns on Load
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const activeToken = getActiveToken();

        if (!activeToken) {
          throw new Error("Authentication token missing. Please log in again.");
        }

        const res = await fetch(`${API_URL}/consumer/campaigns`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });

        const data = await res.json();
        if (res.ok) {
          setCampaigns(data.campaigns || []);
        } else {
          throw new Error(data.error);
        }
      } catch (err: any) {
        console.error("Failed to fetch missions:", err);
        setError(err.message || "Failed to load available missions.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [token]);

  // 2. Handle Answer Input
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // 3. Submit Survey
  const handleSubmitSurvey = async () => {
    if (!selectedCampaign) return;
    
    setSubmitting(true);
    setError('');

    try {
      const activeToken = getActiveToken();
      if (!activeToken) throw new Error("Authentication token missing.");

      const res = await fetch(`${API_URL}/consumer/submit-survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          answers: answers,
          rewardCoins: selectedCampaign.budget_coins || 100
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit survey");

      // Success! Update UI
      setCompletedSurveys(prev => [...prev, selectedCampaign.id]);
      if (onCoinsEarned) {
        onCoinsEarned(data.newBalance); // Tell the parent App to update the coin counter in the header
      }
      
      alert(`Success! You earned ${data.coinsEarned} DUH Coins!`);
      setSelectedCampaign(null);
      setAnswers({});
      
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong submitting your answers.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER SURVEY TAKING VIEW ---
  if (selectedCampaign) {
    const questions = selectedCampaign.survey_schema?.questions || [];

    return (
      <div className="h-full w-full bg-[#F5F7FA] flex flex-col relative overflow-y-auto p-6">
        <button onClick={() => setSelectedCampaign(null)} className="flex items-center gap-2 text-[#6B7280] font-semibold mb-6 hover:text-[#192A56] transition-colors w-max">
          <ArrowLeft size={20} /> Back to Missions
        </button>

        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 shadow-sm max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-[#192A56] font-heading">{selectedCampaign.title}</h2>
            <div className="flex items-center gap-2 bg-[#FFF8E5] px-4 py-2 rounded-full border border-[#FFC045]">
              <Coins size={18} className="text-[#FFC045]" />
              <span className="font-bold text-[#1A1A1A]">+{selectedCampaign.budget_coins || 100}</span>
            </div>
          </div>

          {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl">{error}</div>}

          <div className="space-y-8 mb-8">
            {questions.length === 0 ? (
              <p className="text-gray-500 italic">This survey has no questions configured.</p>
            ) : (
              questions.map((q: any, index: number) => (
                <div key={q.id} className="space-y-3">
                  <label className="block text-lg font-semibold text-[#192A56]">
                    {index + 1}. {q.text}
                  </label>
                  
                  {/* Handle Multiple Choice vs Text Questions dynamically */}
                  {q.type === 'multiple_choice' && q.options && q.options.length > 0 ? (
                    <div className="space-y-2 mt-3">
                      {q.options.map((opt: string, optIdx: number) => (
                        <label key={optIdx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-4 h-4 text-[#1A45FF] focus:ring-[#1A45FF]"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A45FF] focus:outline-none"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleSubmitSurvey}
            disabled={submitting || questions.length === 0}
            className="w-full bg-[#1A45FF] text-white py-4 rounded-full font-bold shadow-[0px_4px_0px_#0D2DB8] transition-all hover:translate-y-[2px] hover:shadow-[0px_2px_0px_#0D2DB8] disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit & Earn Coins'}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER MISSIONS LIST VIEW ---
  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col relative overflow-y-auto">
      <div className="p-6">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-[#6B7280] font-semibold mb-6 hover:text-[#192A56]">
            <ArrowLeft size={20} /> Back
          </button>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#192A56] font-heading mb-2">Available Missions</h1>
          <p className="text-[#636E72]">Complete surveys from top brands to earn DUH coins!</p>
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#1A45FF] mb-4" size={40} />
            <p className="text-[#6B7280] font-medium">Scanning for new missions...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center shadow-sm">
            <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#192A56] mb-2">No Missions Available</h3>
            <p className="text-[#6B7280]">Check back later! Brands are always adding new research opportunities.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const isCompleted = completedSurveys.includes(campaign.id);

              return (
                <div 
                  key={campaign.id} 
                  className={`bg-white rounded-2xl border ${isCompleted ? 'border-green-200 bg-green-50' : 'border-[#EAEAEA]'} p-5 shadow-sm transition-all hover:shadow-md flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-green-100' : 'bg-blue-50'}`}>
                      {isCompleted ? <CheckCircle size={24} className="text-green-500" /> : <ClipboardList size={24} className="text-[#1A45FF]" />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg font-heading ${isCompleted ? 'text-green-800' : 'text-[#192A56]'}`}>
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-[#6B7280] flex items-center gap-1">
                        {isCompleted ? 'Completed' : 'Takes about 2 mins'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 bg-[#FFF8E5] px-3 py-1.5 rounded-full border border-[#FFC045]">
                      <Coins size={16} className="text-[#FFC045]" />
                      <span className="font-bold text-[#1A1A1A] text-sm">+{campaign.budget_coins || 100}</span>
                    </div>
                    
                    <button 
                      onClick={() => !isCompleted && setSelectedCampaign(campaign)}
                      disabled={isCompleted}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted ? 'bg-green-200 text-green-600' : 'bg-[#1A45FF] text-white hover:bg-[#0D2DB8]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}