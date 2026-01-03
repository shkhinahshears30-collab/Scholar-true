
export type CompanionType = 'sprout' | 'kitten' | 'robot' | 'dragon' | 'phoenix' | string;
export type StudyMode = 'school' | 'university' | '18plus';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
  addedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  date: string;
  category: 'study' | 'break' | 'exam' | 'other';
}

export interface SponsorOffer {
  id: string;
  name: string;
  discount: string;
  image: string;
  link: string;
}

export interface UserSettings {
  userName?: string;
  profilePic?: string;
  isPremium: boolean;
  age?: number;
  studyMode: StudyMode;
  language: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  privacyLockEnabled: boolean;
  guardianLinked: boolean;
  guardianCode?: string;
  appsToBlock: string[];
  selectedCompanion: CompanionType;
  customCompanionName?: string; 
  selectedAccessory?: string;
  selectedHabitat?: string;
  unlockedHabitats: string[];
  totalFocusTime: number; 
  currentStreak: number;
  lastSessionDate?: string;
  companionGrowth: number;
  flashcardSets: {
    id: string;
    title: string;
    cards: Flashcard[];
    createdAt: string;
  }[];
  vocabulary: VocabularyWord[];
  calendarEvents: CalendarEvent[];
  dailyGenCount: number;
  lastGenDate?: string;
}

export interface FocusSession {
  isActive: boolean;
  timeLeft: number; 
  duration: number; 
  startTime: number | null;
}

export enum AppRoute {
  WELCOME = 'WELCOME',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  FOCUS = 'FOCUS',
  SETTINGS = 'SETTINGS',
  GUARDIAN = 'GUARDIAN',
  PRIVACY = 'PRIVACY',
  GALLERY = 'GALLERY',
  FLASHCARDS = 'FLASHCARDS',
  PLANNER = 'PLANNER',
  LEADERBOARD = 'LEADERBOARD',
  PREMIUM = 'PREMIUM',
  ACADEMY = 'ACADEMY',
  LANGUAGE_TUTOR = 'LANGUAGE_TUTOR',
  BREAK = 'BREAK',
  AI_LAB = 'AI_LAB',
  LIVE_CHAT = 'LIVE_CHAT',
  DESIGN_STUDIO = 'DESIGN_STUDIO'
}
