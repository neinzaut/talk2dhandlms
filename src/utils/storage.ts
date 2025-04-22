import { User } from '../types';

const STORAGE_KEYS = {
  USER: 'sign_language_user',
  AUTH: 'sign_language_auth',
  REGISTERED_USERS: 'sign_language_registered_users',
  LEARNING_TIME: 'sign_language_learning_time',
  LESSON_PROGRESS: 'sign_language_lesson_progress'
};

export const storage = {
  setUser: (user: User) => {
    if (!user) {
      storage.clearUser();
      return;
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      storage.clearUser();
      return null;
    }
  },
  
  setAuth: (token: string | null) => {
    if (!token) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.AUTH, token);
  },
  
  getAuth: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH);
  },

  addRegisteredUser: (user: User) => {
    if (!user.email) return;
    const users = storage.getRegisteredUsers();
    if (!users.some(u => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    }
  },

  getRegisteredUsers: (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error parsing registered users:', error);
      return [];
    }
  },

  clearAll: () => {
    // Only remove authentication data, preserve learning progress
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  clearUser: () => {
    // Only remove user session data, preserve learning progress
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  updateStreak: () => {
    const user = storage.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastPractice = user.progress.lastPracticeDate.split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (lastPractice === yesterday) {
      // Increment streak if user practiced yesterday
      user.progress.streak += 1;
    } else if (lastPractice !== today) {
      // Reset streak if user missed a day
      user.progress.streak = 1;
    }

    user.progress.lastPracticeDate = today;
    storage.setUser(user);
  },

  updateLearningTime: (timeSpent: number) => {
    const user = storage.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    let learningTime = {};

    try {
      const storedTime = localStorage.getItem(STORAGE_KEYS.LEARNING_TIME);
      learningTime = storedTime ? JSON.parse(storedTime) : {};
    } catch (error) {
      console.error('Error parsing learning time:', error);
    }

    learningTime[today] = (learningTime[today] || 0) + timeSpent;
    localStorage.setItem(STORAGE_KEYS.LEARNING_TIME, JSON.stringify(learningTime));
  },

  getDailyLearningTime: () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const storedTime = localStorage.getItem(STORAGE_KEYS.LEARNING_TIME);
      const learningTime = storedTime ? JSON.parse(storedTime) : {};
      return learningTime[today] || 0;
    } catch (error) {
      console.error('Error getting daily learning time:', error);
      return 0;
    }
  },

  saveLessonProgress: (userId: string, lessonId: string, progress: { completed: boolean; score?: number }) => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      const allProgress = storedProgress ? JSON.parse(storedProgress) : {};
      
      if (!allProgress[userId]) {
        allProgress[userId] = {};
      }
      
      // Check if the lesson was already completed
      const existingProgress = allProgress[userId][lessonId];
      if (existingProgress?.completed && progress.completed) {
        // Update only the score and timestamp if lesson was already completed
        allProgress[userId][lessonId] = {
          ...existingProgress,
          score: progress.score !== undefined ? progress.score : existingProgress.score,
          lastUpdated: new Date().toISOString()
        };
      } else {
        // Save new progress for first-time completion or incomplete lesson
        allProgress[userId][lessonId] = {
          ...existingProgress,
          ...progress,
          lastUpdated: new Date().toISOString()
        };
      }
      
      localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving lesson progress:', error);
    }
  },

  getLessonProgress: (userId: string, lessonId: string) => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      const allProgress = storedProgress ? JSON.parse(storedProgress) : {};
      return allProgress[userId]?.[lessonId] || { completed: false };
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return { completed: false };
    }
  },

  getAllLessonProgress: (userId: string) => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      const allProgress = storedProgress ? JSON.parse(storedProgress) : {};
      return allProgress[userId] || {};
    } catch (error) {
      console.error('Error getting all lesson progress:', error);
      return {};
    }
  },

  initializeProgress: () => {
    const user = storage.getUser();
    if (!user) return null;
    
    const progress = storage.getAllLessonProgress(user.id);
    if (Object.keys(progress).length > 0) {
      return {
        lessonProgress: progress,
        userId: user.id
      };
    }
    return null;
  },
  updateLearningTime: (timeSpent: number) => {
    const user = storage.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    let learningTime = {};

    try {
      const storedTime = localStorage.getItem(STORAGE_KEYS.LEARNING_TIME);
      learningTime = storedTime ? JSON.parse(storedTime) : {};
    } catch (error) {
      console.error('Error parsing learning time:', error);
    }

    learningTime[today] = (learningTime[today] || 0) + timeSpent;
    localStorage.setItem(STORAGE_KEYS.LEARNING_TIME, JSON.stringify(learningTime));
  },

  getDailyLearningTime: (): number => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const storedTime = localStorage.getItem(STORAGE_KEYS.LEARNING_TIME);
      const learningTime = storedTime ? JSON.parse(storedTime) : {};
      return learningTime[today] || 0;
    } catch (error) {
      console.error('Error getting daily learning time:', error);
      return 0;
    }
  },

  findRegisteredUser: (email: string): User | undefined => {
    if (!email) return undefined;
    const users = storage.getRegisteredUsers();
    return users.find(u => u.email === email);
  },
  
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  clearAll: () => {
    storage.clearUser();
    // Don't clear registered users on logout as they represent the local database
  },
};