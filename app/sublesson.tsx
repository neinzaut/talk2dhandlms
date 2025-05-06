import React from 'react';
import { SubLessonScreen } from '../src/components/lessons/SubLessonScreen';
import { useLocalSearchParams } from 'expo-router';
 
export default function SubLesson() {
  const params = useLocalSearchParams();
  return <SubLessonScreen route={{ params }} />;
} 