import { useState, useEffect } from 'react';
import { BarChart3, PieChart, MessageSquare, Loader2, FileText, ChevronDown } from 'lucide-react';
import { API_URL } from '@/utils/supabase';

interface InsightsTabProps {
  token: string | null;
}

export function InsightsTab({ token }: InsightsTabProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  const [resultsData, setResultsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  // 1. Fetch available campaigns for the dropdown
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/client/campaigns`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
          if (data.length > 0) {
            setSelectedCampaignId(data[0].id); // Auto-select the first one
          }
        }
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [token]);

  // 2. Fetch specific results when a campaign is selected
  useEffect(() => {
    const fetchResults = async () => {
      if (!token || !selectedCampaignId) return;
      setLoadingResults(true);
      try {
        const res = await fetch(`${API_URL}/client/campaign-results/${selectedCampaignId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setResultsData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, [token, selectedCampaignId]);

  // Data Processor: Turns raw DB answers into Chart Data
  const getProcessedData = () => {
    if (!resultsData || !resultsData.schema || !resultsData.responses) return [];
    
    const { schema, responses } = resultsData;
    const totalResponses = responses.length;

    return schema.questions.map((q: any) => {
      if (q.type === 'multiple_choice') {
        const counts: Record<string, number> = {};
        q.options.forEach((opt: string) => counts[opt] = 0);
        
        responses.forEach((res: any) => {
          const answer = res.payload.answers[q.id];
          if (answer && counts[answer] !== undefined) {
            counts[answer]++;
          }
        });

        // Convert to array with percentages for rendering bars
        const optionsData = q.options.map((opt: string) => {
          const count = counts[opt] || 0;
          const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
          return { label: opt, count, percentage };
        });

        return { ...q, optionsData, totalResponses };
      } else {
        // Text Questions
        const textAnswers = responses
          .map((res: any) => res.payload.answers[q.id])
          .filter(Boolean);
        return { ...q, textAnswers, totalResponses };
      }
    });
  };

  const processedQuestions = getProcessedData();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F7FA]">
        <Loader2 className="animate-spin text-[#1A45FF] mb-4" size={40} />
        <p className="text-[#6B7280]">Loading your insights...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex-1 p-8 bg-[#F5F7FA]">
        <h2 className="text-3xl font-bold text-[#192A56] font-heading mb-8">Data Insights</h2>
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-16 text-center shadow-sm">
          <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#192A56] mb-2">No Data Available Yet</h3>
          <p className="text-[#6B7280]">Publish a survey in the Research tab to start gathering insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F5F7FA]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#192A56] font-heading mb-1">Data Insights</h2>
          <p className="text-[#6B7280] text-sm">Real-time analysis of your consumer data</p>
        </div>
        
        {/* Campaign Selector Dropdown */}
        <div className="relative min-w-[300px]">
          <select 
            value={selectedCampaignId || ''}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-xl px-4 py-3 pr-10 text-[#192A56] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A45FF] shadow-sm cursor-pointer"
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      {loadingResults ? (
         <div className="flex justify-center py-20">
           <Loader2 className="animate-spin text-[#1A45FF]" size={32} />
         </div>
      ) : processedQuestions.length === 0 ? (
         <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-[#EAEAEA]">
           No questions found for this campaign.
         </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {processedQuestions.map((q: any, index: number) => (
            <div key={q.id} className="bg-white rounded-2xl border border-[#EAEAEA] p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A45FF] font-bold flex items-center justify-center shrink-0">
                  Q{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#192A56] font-heading">{q.text}</h3>
                  <p className="text-sm text-gray-500 mt-1">{q.totalResponses} Responses</p>
                </div>
              </div>

              {/* RENDER BARS FOR MULTIPLE CHOICE */}
              {q.type === 'multiple_choice' && (
                <div className="space-y-4 mt-6">
                  {q.optionsData.map((opt: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-[#374151]">{opt.label}</span>
                        <span className="text-[#192A56]">{opt.percentage}% ({opt.count})</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1A45FF] rounded-full transition-all duration-1000" 
                          style={{ width: `${opt.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RENDER LIST FOR TEXT ANSWERS */}
              {q.type === 'text' && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-60 overflow-y-auto space-y-3">
                  {q.textAnswers.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No text responses yet.</p>
                  ) : (
                    q.textAnswers.map((answer: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <MessageSquare size={16} className="text-[#1A45FF] shrink-0 mt-0.5" />
                        <span className="text-[#374151] italic">"{answer}"</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}