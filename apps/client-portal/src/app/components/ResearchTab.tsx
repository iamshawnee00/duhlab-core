import { useState } from 'react';
import { Plus, FileText, Calendar, Users, TrendingUp } from 'lucide-react';

interface ResearchTabProps {
  onCreateNew: () => void;
}

export function ResearchTab({ onCreateNew }: ResearchTabProps) {
  const surveys = [
    {
      id: 1,
      title: 'Consumer Banking Trends Q1 2026',
      questions: 24,
      responses: 1247,
      status: 'active',
      lastEdited: '2 hours ago',
      completion: 87,
    },
    {
      id: 2,
      title: 'F&B Customer Preferences Study',
      questions: 18,
      responses: 892,
      status: 'active',
      lastEdited: '1 day ago',
      completion: 92,
    },
    {
      id: 3,
      title: 'FMCG Sunscreen Product Testing',
      questions: 32,
      responses: 654,
      status: 'draft',
      lastEdited: '3 days ago',
      completion: 0,
    },
    {
      id: 4,
      title: 'AI Adoption in Enterprise',
      questions: 28,
      responses: 1523,
      status: 'completed',
      lastEdited: '1 week ago',
      completion: 100,
    },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#192A56',
              }}
            >
              Research & Surveys
            </h1>
            <p
              className="mt-1"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Manage and create your research projects
            </p>
          </div>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105"
            style={{
              backgroundColor: '#1A45FF',
              color: '#FFFFFF',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0px 4px 0px #0D2DB8',
            }}
          >
            <Plus size={20} strokeWidth={2.5} />
            Create New Survey
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Surveys', value: '47', icon: FileText, color: '#1A45FF' },
            { label: 'Active Research', value: '12', icon: TrendingUp, color: '#00D2D3' },
            { label: 'Total Responses', value: '24.5K', icon: Users, color: '#FFC045' },
            { label: 'This Month', value: '8', icon: Calendar, color: '#1A45FF' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-xl bg-white"
                style={{
                  border: '1px solid #E5E7EB',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.03)',
                  padding: '24px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon size={20} style={{ color: stat.color, strokeWidth: 2 }} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#192A56',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Survey List */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="rounded-2xl bg-white transition-all hover:shadow-lg cursor-pointer"
              style={{
                border: '1px solid #E5E7EB',
                boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
                padding: '24px',
              }}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      survey.status === 'active'
                        ? '#00D2D315'
                        : survey.status === 'completed'
                        ? '#1A45FF15'
                        : '#FFC04515',
                    color:
                      survey.status === 'active'
                        ? '#00D2D3'
                        : survey.status === 'completed'
                        ? '#1A45FF'
                        : '#FFC045',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {survey.status}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}
                >
                  {survey.lastEdited}
                </div>
              </div>

              {/* Title */}
              <h3
                className="mb-3"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#192A56',
                }}
              >
                {survey.title}
              </h3>

              {/* Metrics */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: '#6B7280' }} />
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: '#6B7280',
                    }}
                  >
                    {survey.questions} questions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: '#6B7280' }} />
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: '#6B7280',
                    }}
                  >
                    {survey.responses.toLocaleString()} responses
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {survey.status !== 'draft' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                      }}
                    >
                      Completion Rate
                    </span>
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
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#E5E7EB' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: '#1A45FF',
                        width: `${survey.completion}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}