export interface User {
    id: string;
    email: string;
    name: string;
    preferences: {
      learningGoal: 'casual' | 'regular' | 'intensive';
      signLanguage: 'ASL' | 'BSL';
      dailyGoal: number;
    };
    progress: {
      streak: number;
      totalLessons: number;
      completedLessons: number;
      lastPracticeDate: string;
    };
  }
  
  export interface Lesson {
    id: string;
    title: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    completed: boolean;
    feedback?: {
      rating: 1 | 2 | 3 | 4 | 5;
      timestamp: string;
    };
  }