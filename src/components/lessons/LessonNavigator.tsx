import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignRecognitionLesson } from './SignRecognitionLesson';

type RootStackParamList = {
    ASL_Module1_Lesson1: {
        targetSign: string;
        language: 'ASL';
        onComplete: () => void;
    };
    ASL_Module1_Lesson2: {
        targetSign: string;
        language: 'ASL';
        onComplete: () => void;
    };
    FSL_Module1_Lesson1: {
        targetSign: string;
        language: 'FSL';
        onComplete: () => void;
    };
    FSL_Module1_Lesson2: {
        targetSign: string;
        language: 'FSL';
        onComplete: () => void;
    };
};

const Stack = createStackNavigator<RootStackParamList>();

export const LessonNavigator = () => {
    const handleComplete = () => {
        // Handle lesson completion
        console.log('Lesson completed!');
    };

    return (
        <Stack.Navigator>
            {/* Module 1 - ASL */}
            <Stack.Screen
                name="ASL_Module1_Lesson1"
                component={SignRecognitionLesson}
                initialParams={{
                    targetSign: 'A',
                    language: 'ASL',
                    onComplete: handleComplete,
                }}
                options={{
                    title: 'ASL - Module 1: Basic Signs',
                }}
            />
            <Stack.Screen
                name="ASL_Module1_Lesson2"
                component={SignRecognitionLesson}
                initialParams={{
                    targetSign: 'B',
                    language: 'ASL',
                    onComplete: handleComplete,
                }}
                options={{
                    title: 'ASL - Module 1: Basic Signs',
                }}
            />

            {/* Module 1 - FSL */}
            <Stack.Screen
                name="FSL_Module1_Lesson1"
                component={SignRecognitionLesson}
                initialParams={{
                    targetSign: 'A',
                    language: 'FSL',
                    onComplete: handleComplete,
                }}
                options={{
                    title: 'FSL - Module 1: Basic Signs',
                }}
            />
            <Stack.Screen
                name="FSL_Module1_Lesson2"
                component={SignRecognitionLesson}
                initialParams={{
                    targetSign: 'B',
                    language: 'FSL',
                    onComplete: handleComplete,
                }}
                options={{
                    title: 'FSL - Module 1: Basic Signs',
                }}
            />
        </Stack.Navigator>
    );
}; 