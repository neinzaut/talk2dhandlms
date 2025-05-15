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
import { View, Text, StyleSheet } from 'react-native';
import { ModuleTest } from '../../src/components/lessons/ModuleTest';
import { useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../src/components/common/LanguageContext';

export default function ModuleTestScreen() {
  const params = useLocalSearchParams();
  const { selectedLanguage } = useLanguage();
  
  // Extract module number from the ID (e.g., 'asl-1' -> 1)
  const moduleIdString = params.moduleId as string;
  const sublessonIdString = params.sublessonId as string; // Get sublessonId
  const moduleNumber = parseInt(moduleIdString.split('-')[1], 10);
  
  if (isNaN(moduleNumber)) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid module ID</Text>
      </View>
    );
  }

  return <ModuleTest moduleIdString={moduleIdString} sublessonIdString={sublessonIdString} moduleNumber={moduleNumber} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
  },
}); 