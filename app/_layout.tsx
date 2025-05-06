import React from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../src/components/common/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="module" 
          options={({ route }) => ({ 
            title: route.params?.title,
            headerShown: true 
          })} 
        />
        <Stack.Screen 
          name="sublesson" 
          options={({ route }) => ({ 
            title: route.params?.title,
            headerShown: true 
          })} 
        />
      </Stack>
    </LanguageProvider>
  );
} 