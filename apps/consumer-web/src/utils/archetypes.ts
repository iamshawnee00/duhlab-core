export interface ArchetypeProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  personality: string[];
  strengths: string[];
  traits: {
    label: string;
    value: number;
    color: string;
  }[];
  tips: string[];
  color: string;
  gradient: string;
  emoji: string;
}

export const ARCHETYPE_PROFILES: Record<string, ArchetypeProfile> = {
  'The Explorer': {
    id: 'explorer',
    name: 'The Explorer',
    tagline: 'Just Starting Your Journey',
    description: 'You\'re at the beginning of your self-discovery journey. The Explorer is curious, open-minded, and eager to learn about their digital behavior and preferences. Every survey you take reveals new insights about yourself.',
    personality: [
      'Open to new experiences',
      'Curious about patterns',
      'Building self-awareness',
      'Taking first steps'
    ],
    strengths: [
      'Willingness to learn',
      'Fresh perspective',
      'Openness to change',
      'Self-reflection'
    ],
    traits: [
      { label: 'Curiosity', value: 85, color: '#1A45FF' },
      { label: 'Adaptability', value: 70, color: '#00D2D3' },
      { label: 'Insight', value: 45, color: '#FFC045' },
      { label: 'Confidence', value: 40, color: '#FF4757' },
    ],
    tips: [
      'Take surveys regularly to build your profile',
      'Be honest with your answers',
      'Watch how your archetype evolves over time'
    ],
    color: '#1A45FF',
    gradient: 'linear-gradient(135deg, #1A45FF 0%, #4C6EF5 100%)',
    emoji: '🧭'
  },
  'The Curious': {
    id: 'curious',
    name: 'The Curious',
    tagline: 'Actively Discovering',
    description: 'You\'ve moved beyond exploration and are actively discovering patterns in your behavior. The Curious mind asks questions, seeks understanding, and begins to recognize trends in their digital consumer habits.',
    personality: [
      'Asks probing questions',
      'Recognizes patterns',
      'Seeks deeper understanding',
      'Actively engaged'
    ],
    strengths: [
      'Pattern recognition',
      'Active learning',
      'Self-inquiry',
      'Growing awareness'
    ],
    traits: [
      { label: 'Curiosity', value: 90, color: '#1A45FF' },
      { label: 'Adaptability', value: 75, color: '#00D2D3' },
      { label: 'Insight', value: 60, color: '#FFC045' },
      { label: 'Confidence', value: 55, color: '#FF4757' },
    ],
    tips: [
      'Look for patterns across your survey responses',
      'Notice what surprises you about your answers',
      'Explore different survey categories'
    ],
    color: '#00D2D3',
    gradient: 'linear-gradient(135deg, #00D2D3 0%, #00E5E5 100%)',
    emoji: '🔍'
  },
  'The Analyst': {
    id: 'analyst',
    name: 'The Analyst',
    tagline: 'Understanding Your Data',
    description: 'You\'ve gathered enough insights to start analyzing your digital consumer profile. The Analyst sees connections, understands motivations, and can articulate why they make certain choices. You\'re building a comprehensive self-model.',
    personality: [
      'Data-driven thinker',
      'Connects insights',
      'Understands motivations',
      'Systematic approach'
    ],
    strengths: [
      'Critical thinking',
      'Self-understanding',
      'Decision clarity',
      'Insight integration'
    ],
    traits: [
      { label: 'Curiosity', value: 80, color: '#1A45FF' },
      { label: 'Adaptability', value: 85, color: '#00D2D3' },
      { label: 'Insight', value: 90, color: '#FFC045' },
      { label: 'Confidence', value: 75, color: '#FF4757' },
    ],
    tips: [
      'Review your archetype evolution timeline',
      'Compare your traits with other archetypes',
      'Use insights to inform real-world decisions'
    ],
    color: '#FFC045',
    gradient: 'linear-gradient(135deg, #FFC045 0%, #FFD670 100%)',
    emoji: '📊'
  },
  'The Strategist': {
    id: 'strategist',
    name: 'The Strategist',
    tagline: 'Planning Your Path',
    description: 'You\'ve mastered self-awareness and now use your insights strategically. The Strategist doesn\'t just understand their patterns—they actively shape them. You know what drives you and how to leverage that knowledge.',
    personality: [
      'Intentional decision-maker',
      'Forward-thinking',
      'Self-directed',
      'Goal-oriented'
    ],
    strengths: [
      'Strategic planning',
      'Self-mastery',
      'Behavioral design',
      'Clear direction'
    ],
    traits: [
      { label: 'Curiosity', value: 75, color: '#1A45FF' },
      { label: 'Adaptability', value: 90, color: '#00D2D3' },
      { label: 'Insight', value: 95, color: '#FFC045' },
      { label: 'Confidence', value: 90, color: '#FF4757' },
    ],
    tips: [
      'Use your DCA insights to set personal goals',
      'Help others understand their archetypes',
      'Continue refining your self-model'
    ],
    color: '#9B59B6',
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #B07CC6 100%)',
    emoji: '🎯'
  },
  'The Visionary': {
    id: 'visionary',
    name: 'The Visionary',
    tagline: 'Master of Self-Knowledge',
    description: 'You\'ve achieved deep self-knowledge and use it to guide your life. The Visionary sees the big picture, understands how all pieces fit together, and inspires others on their self-discovery journeys. You\'ve completed yourself through Duhlab.',
    personality: [
      'Deeply self-aware',
      'Holistic thinker',
      'Mentor mindset',
      'Confident in identity'
    ],
    strengths: [
      'Complete self-knowledge',
      'Inspiring others',
      'Life integration',
      'Authentic living'
    ],
    traits: [
      { label: 'Curiosity', value: 100, color: '#1A45FF' },
      { label: 'Adaptability', value: 95, color: '#00D2D3' },
      { label: 'Insight', value: 100, color: '#FFC045' },
      { label: 'Confidence', value: 100, color: '#FF4757' },
    ],
    tips: [
      'Share your journey with new Explorers',
      'Keep taking surveys to maintain awareness',
      'Celebrate how far you\'ve come'
    ],
    color: '#FF4757',
    gradient: 'linear-gradient(135deg, #FF4757 0%, #FF6B7A 100%)',
    emoji: '✨'
  },
};

export function getArchetypeProfile(archetypeName: string): ArchetypeProfile {
  return ARCHETYPE_PROFILES[archetypeName] || ARCHETYPE_PROFILES['The Explorer'];
}

export function getAllArchetypes(): ArchetypeProfile[] {
  return Object.values(ARCHETYPE_PROFILES);
}
