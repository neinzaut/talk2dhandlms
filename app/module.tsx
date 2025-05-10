/**
 * module.tsx
 * 
 * This is the module screen component that displays individual learning modules.
 * It receives route parameters and passes them to the ModuleScreen component.
 * 
 * Key features:
 * - Handles module-specific routing
 * - Passes route parameters to ModuleScreen
 * - Uses expo-router's useLocalSearchParams for parameter handling
 * 
 * Things you can tweak:
 * - Add additional route parameters
 * - Modify how parameters are passed to ModuleScreen
 * - Add loading states or error handling
 * - Customize the module screen layout
 */

import React from 'react';
import { ModuleScreen } from '../src/components/lessons/ModuleScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Module() {
  const params = useLocalSearchParams();
  return <ModuleScreen route={{ params }} />;
} 