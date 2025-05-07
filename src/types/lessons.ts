export type Language = 'ASL' | 'FSL';
export type SignType = 'labelled' | 'unlabelled' | 'letter' | 'number';
export type SubLessonStatus = 'incomplete' | 'in-progress' | 'complete';
export type SubLessonType = 'practice' | 'quiz' | 'finger-spelling';

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface SubLesson {
    id: string;
    title: string;
    type: SubLessonType;
    status: SubLessonStatus;
    progress: number;
    content?: {
        signs?: string[];
        description?: string;
        signType?: SignType;
        questions?: QuizQuestion[];
    };
}

export interface Lesson {
    id: string;
    title: string;
    language: Language;
    image: any;
    sublessons: SubLesson[];
    overallProgress: number;
}

export interface ModuleTest {
    id: string;
    title: string;
    status: SubLessonStatus;
    progress: number;
    questions: Array<{
        id: string;
        question: string;
        correctAnswer: string;
        options: string[];
    }>;
} 