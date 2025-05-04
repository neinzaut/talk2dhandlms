import { useState } from 'react';
import type { Lesson, Sublesson } from '../components/lessons/lessonTypes';

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: "Lesson 1: Basics of American Sign Language",
      image: require('../assets/icons/lesson1-preview.png'),
      sublessons: [
        { id: '1-1', title: "Alphabet", progress: 70 },
        { id: '1-2', title: "Numbers", progress: 30 },
        { id: '1-3', title: "Finger Spelling", progress: 10 },
        { id: '1-4', title: "Module Test", progress: 0 }
      ],
      overallProgress: 30
    },
    {
      id: '2',
      title: "Lesson 2: Intermediate ASL",
      image: require('../assets/icons/lesson2-preview.png'),
      sublessons: [
        { id: '2-1', title: "Dynamic Gestures", progress: 0 },
        { id: '2-2', title: "Common Phrases", progress: 0 },
        { id: '2-3', title: "Module Test", progress: 0 }
      ],
      overallProgress: 0
    },
    {
      id: '3',
      title: "Lesson 3: Advanced ASL",
      image: require('../assets/icons/lesson3-preview.png'),
      sublessons: [
        { id: '2-1', title: "Grammar", progress: 0 },
        { id: '2-2', title: "Sentences", progress: 0 },
        { id: '2-3', title: "Simulation Test", progress: 0 }
      ],
      overallProgress: 0
    }
  ]);

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