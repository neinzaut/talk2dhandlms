/**
 * ProgressBar.tsx
 * 
 * A reusable progress bar component that displays completion percentage.
 * Used throughout the app to show progress in lessons, modules, and achievements.
 * 
 * Key features:
 * - Simple, clean design
 * - Animated progress updates
 * - Customizable colors and dimensions
 * - Rounded corners for modern look
 * 
 * Things you can tweak:
 * - Bar height and width
 * - Background and progress colors
 * - Border radius
 * - Animation duration
 * - Progress calculation method
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
}); 