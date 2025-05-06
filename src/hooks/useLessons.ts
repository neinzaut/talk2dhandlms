// This hook contains Reference Data for SL Lessons. ID categories are based on the language (ASL or FSL).

// src/hooks/useLessons.ts
import { useState, useEffect } from 'react';
import { SignLanguage } from '../components/common/LanguageContext';
import { Lesson, SubLesson, SubLessonStatus } from '../types/lessons';

const calculateModuleProgress = (sublessons: Array<{ status: SubLessonStatus }>) => {
    const totalSublessons = sublessons.length;
    const completedSublessons = sublessons.filter(sub => sub.status === 'complete').length;
    const inProgressSublessons = sublessons.filter(sub => sub.status === 'in-progress').length;
    
    // Calculate progress: completed sublessons count as 100%, in-progress count as 50%
    const progress = ((completedSublessons + (inProgressSublessons * 0.5)) / totalSublessons) * 100;
    return Math.round(progress);
};

const ASL_LESSONS: Lesson[] = [
  {
    id: 'asl-1',
    title: "Lesson 1: Basics of American Sign Language",
    image: require('../assets/icons/lesson1-preview.png'),
    sublessons: [
      { id: 'asl-1-1', title: "Alphabet", type: 'practice', status: 'in-progress', progress: 70 },
      { id: 'asl-1-2', title: "ASL Numbers", type: 'practice', status: 'in-progress', progress: 30 },
      { id: 'asl-1-3', title: "ASL Finger Spelling", type: 'practice', status: 'incomplete', progress: 10 },
      { id: 'asl-1-4', title: "ASL Module Test", type: 'test', status: 'incomplete', progress: 0 }
    ],
    overallProgress: 30, 
    language: 'ASL',
  },
  {
    id: 'asl-2',
    title: "Lesson 2: Intermediate American Sign Language",
    image: require('../assets/icons/lesson2-preview.png'),
    sublessons: [
      { id: 'asl-2-1', title: "Dynamic Gestures", type: 'practice', status: 'in-progress', progress: 70 },
      { id: 'asl-2-2', title: "Common Phrases", type: 'practice', status: 'in-progress', progress: 30 },
      { id: 'asl-2-3', title: "Module Test", type: 'test', status: 'incomplete', progress: 0 },
    ],
    overallProgress: 0,
    language: 'ASL',
  },
  {
    id: 'asl-3',
    title: "Lesson 3: Advanced American Sign Language",
    image: require('../assets/icons/lesson3-preview.png'),
    sublessons: [
      { id: 'asl-3-1', title: "Grammar", type: 'theory', status: 'in-progress', progress: 70 },
      { id: 'asl-3-2', title: "Conversation Simulation", type: 'practice', status: 'in-progress', progress: 30 },
      { id: 'asl-3-3', title: "Module Test", type: 'test', status: 'incomplete', progress: 0 },
    ],
    overallProgress: 0,
    language: 'ASL',
  },
];

const FSL_LESSONS: Lesson[] = [
  {
    id: 'fsl-1',
    title: "Lesson 1: Basics of Filipino Sign Language",
    image: require('../assets/icons/lesson1-preview.png'),
    sublessons: [
      { id: 'fsl-1-1', title: "Alphabet", type: 'practice', status: 'in-progress', progress: 70 },
      { id: 'fsl-1-2', title: "Numbers", type: 'practice', status: 'in-progress', progress: 30 },
      { id: 'fsl-1-3', title: "Finger Spelling", type: 'practice', status: 'incomplete', progress: 10 },
      { id: 'fsl-1-4', title: "Module Test", type: 'test', status: 'incomplete', progress: 0 }
    ],
    overallProgress: 30,
    language: 'FSL',
  },
  {
    id: 'fsl-2',
    title: "Lesson 2: Intermediate Filipino Sign Language",
    image: require('../assets/icons/lesson2-preview.png'),
    sublessons: [
      { id: 'fsl-2-1', title: "Dynamic Gestures", type: 'practice', status: 'in-progress', progress: 70 },
      { id: 'fsl-2-2', title: "Localized Terms & Common Phrases", type: 'practice', status: 'in-progress', progress: 30 },
      { id: 'fsl-2-3', title: "Module Test", type: 'test', status: 'incomplete', progress: 0 },
    ],
    overallProgress: 0,
    language: 'FSL',
  },
  {
    id: 'fsl-3',
    title: "Lesson 3: Advanced Filipino Sign Language",
    image: require('../assets/icons/lesson3-preview.png'),
    sublessons: [
      { id: 'fsl-3-1', title: "Grammar", type: 'theory', status: 'in-progress', progress: 70 },
      { id: 'fsl-3-2', title: "Conversation Simulation", type: 'practice', status: 'in-progress', progress: 30 },
      { id: 'fsl-3-3', title: "Module Test", type: 'test', status: 'incomplete', progress: 0 },
    ],
    overallProgress: 0,
    language: 'FSL',
  },
];

// Mock data - replace with actual data from your backend
const MOCK_LESSONS: Record<SignLanguage, Lesson[]> = {
    ASL: ASL_LESSONS,
    FSL: FSL_LESSONS
};

// SWITCH BETWEEN ASL AND FSL LESSONS
export const useLessons = (language: SignLanguage) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate API call
        try {
            const lessonsWithProgress = MOCK_LESSONS[language].map(lesson => ({
                ...lesson,
                overallProgress: calculateModuleProgress(lesson.sublessons)
            }));
            setLessons(lessonsWithProgress);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    }, [language]);

    const updateProgress = (lessonId: string, sublessonId: string, progress: number, status: SubLessonStatus) => {
        setLessons(prevLessons => 
            prevLessons.map(lesson => {
                if (lesson.id === lessonId) {
                    const updatedSublessons = lesson.sublessons.map(sublesson => 
                        sublesson.id === sublessonId 
                            ? { ...sublesson, progress, status } 
                            : sublesson
                    );
                    
                    // Calculate overall progress based on status
                    const overallProgress = calculateModuleProgress(updatedSublessons);

                    return {
                        ...lesson,
                        sublessons: updatedSublessons,
                        overallProgress
                    };
                }
                return lesson;
            })
        );
    };

    return { lessons, loading, error, updateProgress };
};