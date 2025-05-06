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