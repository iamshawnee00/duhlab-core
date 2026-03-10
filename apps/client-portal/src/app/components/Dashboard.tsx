import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Users,
  Star,
} from 'lucide-react';
import { ResearchTab } from '@/app/components/ResearchTab';
import { InsightsTab } from '@/app/components/InsightsTab';
import { SurveyBuilder } from '@/app/components/SurveyBuilder';
import { API_URL } from '@/utils/supabase';

interface DashboardProps {
  userData: any;
  token: string | null;
}

export function Dashboard({ userData, token }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBuilder, setShowBuilder] = useState(false);
  
  const [metrics, setMetrics] = useState({
    activeResearch: 0,
    totalInsights: 0,
    userTrustRating: 0
  });
  const [recentSurveys, setRecentSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, campaignsRes] = await Promise.all([
          fetch(`${API_URL}/client/dashboard-stats`, { headers }),
          fetch(`${API_URL}/client/campaigns`, { headers })
        ]);

        if (statsRes.ok) setMetrics(await statsRes.json());
        if (campaignsRes.ok) setRecentSurveys(await campaignsRes.json());
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'research', icon: FileText, label: 'Research' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {showBuilder ? (
        <SurveyBuilder onBack={() => setShowBuilder(false)} token={token} />
      ) : (
        <>
          {/* Sidebar */}
          <div className="flex flex-col w-[240px] bg-[#1A45FF] shadow-[4px_0px_12px_rgba(26,69,255,0.15)]">
            <div className="p-6 border-b border-white/10">
              <h1 className="tracking-tight text-white text-2xl font-bold font-heading">duhLAB</h1>
              <p className="text-[#B8C9FF] text-xs mt-1">Research Platform</p>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive ? 'bg-white/15' : 'bg-transparent'
                      } text-white`}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className={`text-sm ${isActive ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFC045]">
                  <span className="font-bold text-[#1A45FF]">{userData?.name?.charAt(0) || 'U'}</span>
                </div>
                <div className="flex-1 overflow-hidden text-white">
                  <div className="truncate text-sm font-semibold">{userData?.name || 'User'}</div>
                  <div className="truncate text-xs text-[#B8C9FF]">{userData?.job_title || 'Role'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#E5E7EB] shadow-sm">
              <div>
                <h2 className="text-3xl font-bold text-[#192A56] font-heading">
                  Welcome back, {userData?.name?.split(' ')[0] || 'there'}!
                </h2>
                <p className="text-[#6B7280] text-sm mt-1">Here's the real-time data from your lab.</p>
              </div>
              <div className="px-6 py-3 rounded-full bg-[#FFC045] shadow-[0px_4px_0px_#E1A32A]">
                <span className="font-bold text-[#1A1A1A]">Credits Remaining: 0</span>
              </div>
            </header>

            {activeTab === 'research' ? (
              <ResearchTab onCreateNew={() => setShowBuilder(true)} token={token} />
            ) : activeTab === 'settings' ? (
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 font-heading text-[#192A56]">Settings</h3>
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm max-w-2xl">
                   <p className="mb-6 text-[#6B7280]">Update your company profile and industry focus.</p>
                   <button 
                    onClick={() => {
                       alert("To edit these details, you can restart onboarding or use a settings form.");
                    }} 
                    className="px-6 py-3 bg-[#1A45FF] text-white rounded-full font-bold shadow-[0px_4px_0px_#0D2DB8] transition hover:scale-105"
                   >
                     Restart Onboarding Flow
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8">
                {/* Real Metrics Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <MetricCard icon={FileText} value={metrics.activeResearch} label="Active Research" />
                  <MetricCard icon={BarChart3} value={metrics.totalInsights} label="Total Insights" />
                  <MetricCard icon={Star} value={metrics.userTrustRating} label="User Trust Rating" isGold />
                </div>

                {/* Recent Activity Table */}
                <div className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-lg">
                  <div className="p-6 border-b border-[#E5E7EB]">
                    <h3 className="text-xl font-bold text-[#192A56] font-heading">Recent Activity</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F9FAFB]">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Survey Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Responses</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                              Loading campaigns...
                            </td>
                          </tr>
                        ) : recentSurveys.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                              No campaigns found. Start by creating a new survey!
                            </td>
                          </tr>
                        ) : (
                          recentSurveys.map((survey) => (
                            <tr key={survey.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-[#192A56]">{survey.name}</td>
                              <td className="px-6 py-4 text-gray-600">{survey.responses}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  survey.status === 'active' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {survey.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500">{survey.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, isGold }: { icon: any, value: any, label: string, isGold?: boolean }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-md p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isGold ? 'bg-[#FFF8E5]' : 'bg-[#F0F3FF]'}`}>
        <Icon size={24} style={{ color: isGold ? '#FFC045' : '#1A45FF', strokeWidth: 2 }} />
      </div>
      <div className="text-3xl font-bold text-[#192A56] font-heading">{value}</div>
      <div className="text-sm text-[#6B7280] mt-1">{label}</div>
    </div>
  );
}