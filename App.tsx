/**
 * App.tsx
 * 
 * This is the root component of the application that handles:
 * 1. Font loading and initialization
 * 2. Basic app structure setup
 * 
 * Key features:
 * - Loads custom fonts (Fredoka) using expo-font --- actually di pa siya gumagana T_T
 * - Provides a root View container for the entire app
 * - Uses expo-router's Slot component for navigation
 * 
 * Things you can tweak:
 * - Add more custom fonts in the Font.loadAsync call
 * - Modify the root View's styling
 * - Add global providers or context wrappers
 * - Add global error boundaries
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Font from 'expo-font';
import { Slot } from 'expo-router';

export default function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Load fonts
                await Font.loadAsync({
                    'Fredoka': require('./src/assets/fonts/Fredoka.ttf'),
                });
            } catch (e) {
                console.warn(e);
            } finally {
                setIsReady(true);
            }
        }

        prepare();
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <Slot />
        </View>
    );
}