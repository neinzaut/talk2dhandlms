/**
 * module/test.tsx
 * 
 * This is the module test screen component that displays the test interface.
 * It receives route parameters and passes them to the ModuleTest component.
 * 
 * Key features:
 * - Handles test-specific routing
 * - Passes route parameters to ModuleTest
 * - Uses expo-router's useLocalSearchParams for parameter handling
 */

import React from 'react';
import { ModuleTest } from '../../src/components/lessons/ModuleTest';
import { useLocalSearchParams } from 'expo-router';

export default function ModuleTestScreen() {
  const params = useLocalSearchParams();
  return <ModuleTest moduleId={Number(params.moduleId)} />;
} 