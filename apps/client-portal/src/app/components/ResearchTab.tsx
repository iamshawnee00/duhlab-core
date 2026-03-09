import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Users, Calendar, Plus, Loader2 } from 'lucide-react';
import { API_URL } from '@/utils/supabase';

interface ResearchTabProps {
  onCreateNew: () => void;
  token: string | null;
}

export function ResearchTab({ onCreateNew, token }: ResearchTabProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalSurveys: 0,
    activeResearch: 0,
    totalResponses: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/client/campaigns`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
          
          // Compute metrics locally based on fetched campaigns
          const active = data.filter((c: any) => c.status === 'active').length;
          const responses = data.reduce((acc: number, c: any) => acc + (c.responses || 0), 0);
          
          setMetrics({
            totalSurveys: data.length,
            activeResearch: active,
            totalResponses: responses,
            thisMonth: data.length // Simplified for MVP: counting all recent as this month
          });
        }
      } catch (error) {
        console.error("Failed to fetch research data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, [token]);

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#192A56] font-heading mb-1">Research & Surveys</h2>
          <p className="text-[#6B7280] text-sm">Manage and create your research projects</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-[#1A45FF] text-white px-6 py-3 rounded-full font-bold shadow-[0px_4px_0px_#0D2DB8] transition-all hover:translate-y-[2px] hover:shadow-[0px_2px_0px_#0D2DB8]"
        >
          <Plus size={20} strokeWidth={3} />
          Create New Survey
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <FileText size={24} className="text-[#1A45FF]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#192A56] font-heading">{metrics.totalSurveys}</div>
            <div className="text-sm text-[#6B7280]">Total Surveys</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
            <TrendingUp size={24} className="text-teal-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#192A56] font-heading">{metrics.activeResearch}</div>
            <div className="text-sm text-[#6B7280]">Active Research</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <Users size={24} className="text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#192A56] font-heading">
              {metrics.totalResponses >= 1000 ? `${(metrics.totalResponses / 1000).toFixed(1)}K` : metrics.totalResponses}
            </div>
            <div className="text-sm text-[#6B7280]">Total Responses</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Calendar size={24} className="text-purple-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#192A56] font-heading">{metrics.thisMonth}</div>
            <div className="text-sm text-[#6B7280]">This Month</div>
          </div>
        </div>
      </div>

      {/* Survey Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#1A45FF] mb-4" size={40} />
          <p className="text-[#6B7280]">Loading your research data...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-[#192A56] font-heading mb-2">No research projects yet</h3>
          <p className="text-[#6B7280] max-w-md mx-auto mb-8">
            Create your first survey to start gathering insights and data from your target audience.
          </p>
          <button
            onClick={onCreateNew}
            className="bg-[#1A45FF] text-white px-8 py-4 rounded-full font-bold shadow-[0px_4px_0px_#0D2DB8] transition-all hover:translate-y-[2px] hover:shadow-[0px_2px_0px_#0D2DB8]"
          >
            Create New Survey
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {campaigns.map((survey) => (
            <div key={survey.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  survey.status === 'active' ? 'bg-teal-50 text-teal-600' : 
                  survey.status === 'completed' ? 'bg-purple-50 text-purple-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                </span>
                <span className="text-xs text-[#6B7280]">{survey.date}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#192A56] font-heading mb-4 truncate">
                {survey.name}
              </h3>
              
              <div className="flex items-center gap-6 mb-6 text-sm text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>0 questions</span> {/* Backend needs updating to return actual question count later */}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{survey.responses.toLocaleString()} responses</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#6B7280]">Completion Rate</span>
                  <span className="font-bold text-[#1A45FF]">{survey.completion || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1A45FF] rounded-full transition-all duration-1000" 
                    style={{ width: `${survey.completion || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}