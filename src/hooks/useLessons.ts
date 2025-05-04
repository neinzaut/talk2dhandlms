// This hook contains Reference Data for SL Lessons. ID categories are based on the language (ASL or FSL).

// src/hooks/useLessons.ts
import { useState } from 'react';
import type { Lesson, Sublesson } from '../../src/components/lessons/lessonTypes';

const ASL_LESSONS: Lesson[] = [
  {
    id: 'asl-1',
    title: "Lesson 1: Basics of American Sign Language",
    image: require('../assets/icons/lesson1-preview.png'),
    sublessons: [
      { id: 'asl-1-1', title: "Alphabet", progress: 70 },
      { id: 'asl-1-2', title: "ASL Numbers", progress: 30 },
      { id: 'asl-1-3', title: "ASL Finger Spelling", progress: 10 },
      { id: 'asl-1-4', title: "ASL Module Test", progress: 0 }
    ],
    overallProgress: 30
  },
  {
    id: 'asl-2',
    title: "Lesson 2: Intermediate American Sign Language",
    image: require('../assets/icons/lesson2-preview.png'),
    sublessons: [
      { id: 'asl-2-1', title: "Dynamic Gestures", progress: 70 },
      { id: 'asl-2-2', title: "Common Phrases", progress: 30 },
      { id: 'asl-2-3', title: "Module Test", progress: 0 },
    ],
    overallProgress: 0
  },
  {
    id: 'asl-3',
    title: "Lesson 3: Advanced American Sign Language",
    image: require('../assets/icons/lesson3-preview.png'),
    sublessons: [
      { id: 'asl-3-1', title: "Grammar", progress: 70 },
      { id: 'asl-3-2', title: "Conversation Simulation", progress: 30 },
      { id: 'asl-3-3', title: "Module Test", progress: 0 },
    ],
    overallProgress: 0
  },
];

const FSL_LESSONS: Lesson[] = [
  {
    id: 'fsl-1',
    title: "Lesson 1: Basics of Filipino Sign Language",
    image: require('../assets/icons/lesson1-preview.png'),
    sublessons: [
      { id: 'fsl-1-1', title: "Alphabet", progress: 70 },
      { id: 'fsl-1-2', title: "Numbers", progress: 30 },
      { id: 'fsl-1-3', title: "Finger Spelling", progress: 10 },
      { id: 'fsl-1-4', title: "Module Test", progress: 0 }
    ],
    overallProgress: 30
  },
  {
    id: 'fsl-2',
    title: "Lesson 2: Intermediate Filipino Sign Language",
    image: require('../assets/icons/lesson2-preview.png'),
    sublessons: [
      { id: 'fsl-2-1', title: "Dynamic Gestures", progress: 70 },
      { id: 'fsl-2-2', title: "Localized Terms & Common Phrases", progress: 30 },
      { id: 'fsl-2-3', title: "Module Test", progress: 0 },
    ],
    overallProgress: 0
  },
  {
    id: 'fsl-3',
    title: "Lesson 3: Advanced Filipino Sign Language",
    image: require('../assets/icons/lesson3-preview.png'),
    sublessons: [
      { id: 'fsl-3-1', title: "Grammar", progress: 70 },
      { id: 'fsl-3-2', title: "Conversation Simulation", progress: 30 },
      { id: 'fsl-3-3', title: "Module Test", progress: 0 },
    ],
    overallProgress: 0
  },
];

export const useLessons = (language: 'ASL' | 'FSL') => {

  // Store both sets of lessons in state
  const [allLessons] = useState({
    ASL: ASL_LESSONS,
    FSL: FSL_LESSONS
  });

  // Get the current language's lessons
  const lessons = allLessons[language];

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