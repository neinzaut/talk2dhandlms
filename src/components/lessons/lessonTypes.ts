/* This file defines the types for the lessons and sublessons in the application.
 It includes interfaces for different types of sublessons, such as Alphabet, Numbers, Vocabulary, and Test.
 Each lesson contains a title, an image, and a list of sublessons with their respective progress.
 The sublessons can be of various types, and each type has its own specific content structure. */

// LANGUAGE AWARENESS TO CORE TYPES
export type SignLanguage = 'ASL' | 'FSL';

export interface Lesson {
  id: string;
  language: SignLanguage; // Explicit language marker
  title: string;
  image: any;
  sublessons: Sublesson[];
  overallProgress: number;
  languageSpecific?: {
    culturalNotes?: string;
    regionalVariants?: string[];
  };
}

// ENHANCED SUBLESSON TYPES WITH LANGUAGE-SPECIFIC CONTENT
export interface AlphabetSublesson extends SublessonBase {
    type: 'alphabet';
    content: {
      targetLetters: string[];
      referenceMedia: Array<{
        letter: string;
        image: string;
        video: string;
        // Language-specific tips
        tips: {
          ASL?: string;
          FSL?: string;
          commonMistakes: string[];
        };
      }>;
      practiceWords: Array<{
        word: string;
        signsRequired: string[]; // Letters needed
        languageSpecific?: {
          ASL?: {
            regionalVariation?: string;
          };
          FSL?: {
            localEquivalent?: string;
          };
        };
      }>;
    };
  }

// ACTIVITY TYPE DISCRIMINATORS
type ActivityType = 
  | 'camera-practice'
  | 'matching-game'
  | 'multiple-choice'
  | 'video-response';

export interface SublessonBase {
  id: string;
  title: string;
  progress: number;
  type: Sublesson;
  activityType: ActivityType; // How the sublesson will be presented
  estimatedDuration: number; // In minutes
}

// MEDIA CONFIGURATION TYPES
interface MediaRequirements {
    required: boolean;
    assetPaths: {
      ASL: string;
      FSL: string;
    };
  }
  
  export interface VocabularySublesson extends SublessonBase {
    type: 'vocabulary';
    content: {
      category: string;
      words: Array<{
        word: string;
        translations: {
          ASL: {
            image: string;
            video: string;
            notes?: string;
          };
          FSL: {
            image: string;
            video: string;
            notes?: string;
          };
        };
        activities: Array<{
          type: 'pronunciation' | 'signing';
          media: MediaRequirements;
        }>;
      }>;
    };
  }

// ENHANCED TEST SUBLESSON TYPE
export interface TestSublesson extends SublessonBase {
    type: 'test';
    content: {
      passingScore: number;
      questions: Array<{
        type: 'multiple-choice' | 'video-identification' | 'sign-production';
        languageSpecific: {
          ASL: QuestionContent;
          FSL: QuestionContent;
        };
        sharedContent?: {
          text?: string;
          images?: string[];
        };
      }>;
      feedback: {
        ASL: string[];
        FSL: string[];
      };
    };
  }
  
  interface QuestionContent {
    prompt: string;
    options?: string[];
    correctAnswer: number;
    referenceMedia?: string;
  }

// HELPER TYPES FOR GAME CONFIGURATIONS
interface GameConfig {
    timer?: number;
    attempts?: number;
    scoring: {
      perfectScore: number;
      goodScore: number;
      passingScore: number;
    };
    languageSpecificSettings?: {
      ASL?: {
        strictMode?: boolean;
      };
      FSL?: {
        accentConsiderations?: string[];
      };
    };
  }
  
  export interface MatchingGameSublesson extends SublessonBase {
    type: 'matching';
    config: {
      pairs: Array<{
        sign: string;
        media: {
          ASL: string;
          FSL: string;
        };
      }>;
      gameConfig: GameConfig;
    };
  }

// UNION TYPE WITH DISCRIMINATORS
export type Sublesson = 
  | AlphabetSublesson
  | NumbersSublesson
  | VocabularySublesson
  | TestSublesson
  | MatchingGameSublesson
  | {
      type: 'custom';
      content: any;
      activityType: ActivityType;
    };