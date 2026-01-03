
import { UserSettings } from '../types';
import { STORAGE_KEY } from '../constants';

const DEFAULT_SETTINGS: UserSettings = {
  userName: undefined,
  profilePic: '🎓',
  isPremium: false,
  age: undefined,
  studyMode: 'school',
  language: 'en',
  darkMode: false,
  notificationsEnabled: true,
  privacyLockEnabled: false,
  guardianLinked: false,
  guardianCode: undefined,
  appsToBlock: [],
  selectedCompanion: 'sprout',
  customCompanionName: undefined,
  selectedHabitat: 'default',
  unlockedHabitats: ['default'],
  totalFocusTime: 0,
  currentStreak: 0,
  companionGrowth: 0,
  flashcardSets: [],
  vocabulary: [],
  calendarEvents: [],
  dailyGenCount: 0,
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadSettings = (): UserSettings => {
  const data = localStorage.getItem(STORAGE_KEY);
  const settings = data ? JSON.parse(data) : DEFAULT_SETTINGS;
  
  // Reset daily generation count if it's a new day
  const today = new Date().toISOString().split('T')[0];
  if (settings.lastGenDate !== today) {
    settings.dailyGenCount = 0;
    settings.lastGenDate = today;
  }

  // Ensure habitats are initialized
  if (!settings.unlockedHabitats) settings.unlockedHabitats = ['default'];
  if (!settings.selectedHabitat) settings.selectedHabitat = 'default';
  
  return settings;
};

export const updateStreak = (settings: UserSettings): UserSettings => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = settings.lastSessionDate;

  if (lastDate === today) return settings;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = settings.currentStreak;
  let newGrowth = settings.companionGrowth;

  if (lastDate === yesterdayStr) {
    newStreak += 1;
    newGrowth = Math.min(100, newGrowth + 5);
  } else if (!lastDate) {
    newStreak = 1;
    newGrowth = 5;
  } else {
    newStreak = 1;
    newGrowth = Math.max(0, newGrowth - 10);
  }

  const updated = {
    ...settings,
    currentStreak: newStreak,
    lastSessionDate: today,
    companionGrowth: newGrowth
  };

  saveSettings(updated);
  return updated;
};
