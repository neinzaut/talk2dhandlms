import React from 'react';
import { Stack } from 'expo-router';

export default function PracticeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="category" 
        options={({ route }) => ({ 
          // title: route.params?.title as string || 'Practice Category',
          title: 'Back to Practice',
          headerShown: true 
        })} 
      />
    </Stack>
  );
} 