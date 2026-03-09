import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Users,
  Star,
  CreditCard,
  Coffee,
  Sparkles,
  ShoppingCart,
} from 'lucide-react';
import { ResearchTab } from '@/app/components/ResearchTab';
import { SurveyBuilder } from '@/app/components/SurveyBuilder';

interface DashboardProps {
  userData: any;
}

export function Dashboard({ userData }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBuilder, setShowBuilder] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'research', icon: FileText, label: 'Research' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const recentSurveys = [
    {
      id: 1,
      name: 'Consumer Banking Trends Q1 2026',
      industry: 'banking',
      icon: CreditCard,
      responses: 1247,
      completion: 87,
      date: 'Jan 10, 2026',
    },
    {
      id: 2,
      name: 'F&B Customer Preferences Study',
      industry: 'fmcg',
      icon: Coffee,
      responses: 892,
      completion: 92,
      date: 'Jan 8, 2026',
    },
    {
      id: 3,
      name: 'FMCG Sunscreen Product Testing',
      industry: 'fmcg',
      icon: ShoppingCart,
      responses: 654,
      completion: 78,
      date: 'Jan 5, 2026',
    },
    {
      id: 4,
      name: 'AI Adoption in Enterprise',
      industry: 'ai',
      icon: Sparkles,
      responses: 1523,
      completion: 95,
      date: 'Jan 3, 2026',
    },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Show builder if active */}
      {showBuilder ? (
        <SurveyBuilder onBack={() => setShowBuilder(false)} />
      ) : (
        <>
          {/* Sidebar */}
          <div
            className="flex flex-col"
            style={{
              width: '240px',
              backgroundColor: '#1A45FF',
              boxShadow: '4px 0px 12px rgba(26, 69, 255, 0.15)',
            }}
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <h1
                className="tracking-tight"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                duhLAB
              </h1>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#B8C9FF',
                  marginTop: '4px',
                }}
              >
                Research Platform
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        color: '#FFFFFF',
                      }}
                    >
                      <Icon
                        size={20}
                        style={{
                          strokeWidth: 2,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FFC045' }}
                >
                  <span
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#1A45FF',
                    }}
                  >
                    {userData.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div
                    className="truncate"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    {userData.fullName || 'User'}
                  </div>
                  <div
                    className="truncate"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: '#B8C9FF',
                    }}
                  >
                    {userData.jobTitle || 'Role'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between px-8 py-6"
              style={{
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E5E7EB',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#192A56',
                  }}
                >
                  Welcome back, {userData.fullName?.split(' ')[0] || 'there'}!
                </h2>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#6B7280',
                    marginTop: '4px',
                  }}
                >
                  Here's what's happening with your research
                </p>
              </div>

              <div
                className="px-6 py-3 rounded-full"
                style={{
                  backgroundColor: '#FFC045',
                  boxShadow: '0px 4px 0px #E1A32A',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1A1A1A',
                  }}
                >
                  Credits Remaining: 2,450
                </span>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'research' ? (
              <ResearchTab onCreateNew={() => setShowBuilder(true)} />
            ) : (
              <div className="flex-1 overflow-y-auto p-8">
                {/* Top Metrics */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div
                    className="rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
                      padding: '24px',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#F0F3FF' }}
                      >
                        <FileText size={24} style={{ color: '#1A45FF', strokeWidth: 2 }} />
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#192A56',
                      }}
                    >
                      12
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginTop: '4px',
                      }}
                    >
                      Active Research
                    </div>
                  </div>

                  <div
                    className="rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
                      padding: '24px',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#F0F3FF' }}
                      >
                        <BarChart3 size={24} style={{ color: '#1A45FF', strokeWidth: 2 }} />
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#192A56',
                      }}
                    >
                      4,316
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginTop: '4px',
                      }}
                    >
                      Total Insights
                    </div>
                  </div>

                  <div
                    className="rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
                      padding: '24px',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#FFF8E5' }}
                      >
                        <Star size={24} style={{ color: '#FFC045', strokeWidth: 2, fill: '#FFC045' }} />
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#192A56',
                      }}
                    >
                      4.8
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginTop: '4px',
                      }}
                    >
                      User Trust Rating
                    </div>
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
                    <h3
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#192A56',
                      }}
                    >
                      Recent Activity
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: '#F9FAFB' }}>
                          <th
                            className="px-6 py-4 text-left"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            Survey Name
                          </th>
                          <th
                            className="px-6 py-4 text-left"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            Responses
                          </th>
                          <th
                            className="px-6 py-4 text-left"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            Completion
                          </th>
                          <th
                            className="px-6 py-4 text-left"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSurveys.map((survey, index) => {
                          const Icon = survey.icon;
                          return (
                            <tr
                              key={survey.id}
                              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: '#F0F3FF' }}
                                  >
                                    <Icon size={20} style={{ color: '#1A45FF', strokeWidth: 2 }} />
                                  </div>
                                  <span
                                    style={{
                                      fontFamily: 'Inter, sans-serif',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      color: '#192A56',
                                    }}
                                  >
                                    {survey.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '14px',
                                    color: '#374151',
                                  }}
                                >
                                  {survey.responses.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="flex-1 h-2 rounded-full overflow-hidden"
                                    style={{ backgroundColor: '#E5E7EB', maxWidth: '120px' }}
                                  >
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        backgroundColor: '#1A45FF',
                                        width: `${survey.completion}%`,
                                      }}
                                    />
                                  </div>
                                  <span
                                    style={{
                                      fontFamily: 'Inter, sans-serif',
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#1A45FF',
                                    }}
                                  >
                                    {survey.completion}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '14px',
                                    color: '#6B7280',
                                  }}
                                >
                                  {survey.date}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
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