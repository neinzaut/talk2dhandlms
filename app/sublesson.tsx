/**
 * sublesson.tsx
 * 
 * This is the sublesson screen component that displays individual learning sublessons.
 * It receives route parameters and passes them to the SubLessonScreen component.
 * 
 * Key features:
 * - Handles sublesson-specific routing
 * - Passes route parameters to SubLessonScreen
 * - Uses expo-router's useLocalSearchParams for parameter handling
 * 
 * Things you can tweak:
 * - Add additional route parameters
 * - Modify how parameters are passed to SubLessonScreen
 * - Add loading states or error handling
 * - Customize the sublesson screen layout
 */

import React from 'react';
import { SubLessonScreen } from '../src/components/lessons/SubLessonScreen';
import { useLocalSearchParams } from 'expo-router';
 
export default function SubLesson() {
  const params = useLocalSearchParams();
  return <SubLessonScreen route={{ params }} />;
} 