/**
 * _layout.tsx
 * 
 * This is the root layout component for the app's navigation structure.
 * It defines the navigation stack and screen configurations.
 * 
 * Key features:
 * - Wraps the entire app in a LanguageProvider for internationalization
 * - Sets up a Stack navigator with three main screens:
 *   1. index: Main/home screen (no header)
 *   2. module: Module screen (with dynamic title from route params)
 *   3. sublesson: Sublesson screen (with dynamic title from route params)
 * 
 * Things you can tweak:
 * - Add more screens to the Stack
 * - Modify screen options (headers, animations, etc.)
 * - Add global providers or context wrappers
 * - Customize navigation behavior
 */

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