export type Language = 'ASL' | 'FSL';
export type SignType = 'labelled' | 'unlabelled' | 'letter';
export type SubLessonStatus = 'incomplete' | 'in-progress' | 'complete';

export interface SubLesson {
    id: string;
    title: string;
    type: 'practice' | 'test' | 'theory';
    status: SubLessonStatus;
    progress: number;
    content?: {
        signs?: string[];
        description?: string;
        signType?: SignType;
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