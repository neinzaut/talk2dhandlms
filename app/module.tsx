import React from 'react';
import { ModuleScreen } from '../src/components/lessons/ModuleScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Module() {
  const params = useLocalSearchParams();
  return <ModuleScreen route={{ params }} />;
} 