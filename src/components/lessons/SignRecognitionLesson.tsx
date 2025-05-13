import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SignRecognitionPractice } from '../(practice)/SignRecognitionPractice';
import { typography } from '../../constants/typography';

interface SignRecognitionLessonProps {
    targetSign: string;
    language: 'ASL' | 'FSL';
    onComplete: () => void;
}

export const SignRecognitionLesson: React.FC<SignRecognitionLessonProps> = ({
    targetSign,
    language,
    onComplete,
}) => {
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [correctAttempts, setCorrectAttempts] = useState(0);

    const handlePrediction = (prediction: string) => {
        setAttempts(prev => prev + 1);
        if (prediction === targetSign) {
            setCorrectAttempts(prev => prev + 1);
            if (correctAttempts + 1 >= 3) { // Require 3 correct attempts
                onComplete();
            }
        }
    };

    if (!isPracticeMode) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {language} Sign Recognition Practice
                </Text>
                <Text style={styles.instruction}>
                    Practice the sign for: {targetSign}
                </Text>
                <Text style={styles.subInstruction}>
                    You need to correctly sign this 3 times to complete the lesson
                </Text>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => setIsPracticeMode(true)}
                >
                    <Text style={styles.buttonText}>Start Practice</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progress}>
                    Correct Attempts: {correctAttempts}/3
                </Text>
                <Text style={styles.target}>
                    Target Sign: {targetSign}
                </Text>
            </View>
            <SignRecognitionPractice />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        ...typography.h1,
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    instruction: {
        ...typography.h3,
        textAlign: 'center',
        marginBottom: 10,
    },
    subInstruction: {
        ...typography.bodyLarge,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        ...typography.button,
        color: '#fff',
        textAlign: 'center',
    },
    progress: {
        ...typography.bodyLarge,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    target: {
        ...typography.h3,
        color: '#007AFF',
    },
}); 