// src/hooks/useLessons.ts
import { useState } from 'react';
import type { Lesson, Sublesson } from '../../src/components/lessons/lessonTypes';

const ASL_LESSONS: Lesson[] = [
  {
    id: 'asl-1',
    title: "Lesson 1: Basics of American Sign Language",
    image: require('../assets/icons/lesson1-preview.png'),
    sublessons: [
      { id: 'asl-1-1', title: "ASL Alphabet", progress: 70 },
      { id: 'asl-1-2', title: "ASL Numbers", progress: 30 },
      { id: 'asl-1-3', title: "ASL Finger Spelling", progress: 10 },
      { id: 'asl-1-4', title: "ASL Module Test", progress: 0 }
    ],
    overallProgress: 30
  },
  // Add more ASL lessons...
];

const FSL_LESSONS: Lesson[] = [
  {
    id: 'fsl-1',
    title: "Lesson 1: Basics of Filipino Sign Language",
    image: require('../assets/icons/lesson1-preview.png'),
    sublessons: [
      { id: 'fsl-1-1', title: "FSL Alphabet", progress: 40 },
      { id: 'fsl-1-2', title: "FSL Numbers", progress: 20 },
      { id: 'fsl-1-3', title: "FSL Basic Signs", progress: 5 },
      { id: 'fsl-1-4', title: "FSL Module Test", progress: 0 }
    ],
    overallProgress: 20
  },
  // Add more FSL lessons...
];

export const useLessons = (language: 'ASL' | 'FSL') => {
  const [lessons, setLessons] = useState<Lesson[]>(
    language === 'ASL' ? ASL_LESSONS : FSL_LESSONS
  );

  const updateLessonProgress = (lessonId: string, sublessonId: string, newProgress: number) => {
    setLessons(prevLessons => 
      prevLessons.map(lesson => {
        if (lesson.id === lessonId) {
          const updatedSublessons = lesson.sublessons.map(sublesson => 
            sublesson.id === sublessonId 
              ? { ...sublesson, progress: Math.min(100, Math.max(0, newProgress)) } 
              : sublesson
          );
          
          const newOverallProgress = updatedSublessons.reduce(
            (sum, sublesson) => sum + sublesson.progress, 0
          ) / updatedSublessons.length;
          
          return {
            ...lesson,
            sublessons: updatedSublessons,
            overallProgress: Math.round(newOverallProgress)
          };
        }
        return lesson;
      })
    );
  };

  return { lessons, updateLessonProgress };
};