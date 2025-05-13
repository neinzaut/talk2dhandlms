import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { typography } from '../../constants/typography';
import { SignRecognitionPractice } from './SignRecognitionPractice';

interface DailyChallengeProps {
    onComplete: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ onComplete }) => {
    const { selectedLanguage } = useLanguage();
    const [currentChallenge, setCurrentChallenge] = useState<string>('');
    const [score, setScore] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Generate a random letter for the challenge
    const generateChallenge = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        return alphabet[randomIndex];
    };

    useEffect(() => {
        setCurrentChallenge(generateChallenge());
    }, []);

    const handlePrediction = (prediction: string) => {
        if (prediction === currentChallenge) {
            setScore(prev => prev + 1);
            setChallengesCompleted(prev => prev + 1);
            
            if (challengesCompleted + 1 >= 5) {
                setIsComplete(true);
                onComplete();
            } else {
                setCurrentChallenge(generateChallenge());
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Daily Challenge</Text>
                <Text style={styles.subtitle}>Complete 5 signs to finish today's challenge!</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                            <View 
                                style={[
                                    styles.progressBarFill,
                                    { width: `${(challengesCompleted / 5) * 100}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {challengesCompleted}/5
                        </Text>
                    </View>
                    <Text style={styles.scoreText}>
                        Score: {score}
                    </Text>
                </View>
            </View>

            {!isComplete ? (
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeText}>
                        Show the sign for: {currentChallenge}
                    </Text>
                    <SignRecognitionPractice
                        targetSign={currentChallenge}
                        onPrediction={handlePrediction}
                    />
                </View>
            ) : (
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Challenge Complete! 🎉</Text>
                    <Text style={styles.completionText}>
                        You completed today's challenge with a score of {score}/5
                    </Text>
                    <TouchableOpacity
                        style={styles.newChallengeButton}
                        onPress={() => {
                            setScore(0);
                            setChallengesCompleted(0);
                            setIsComplete(false);
                            setCurrentChallenge(generateChallenge());
                        }}
                    >
                        <Text style={styles.newChallengeButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        ...typography.h1,
        color: '#212529',
        marginBottom: 8,
    },
    subtitle: {
        ...typography.bodyLarge,
        color: '#6c757d',
        marginBottom: 16,
    },
    progressContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#e9ecef',
        borderRadius: 4,
        marginRight: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 4,
    },
    progressText: {
        ...typography.bodyLarge,
        color: '#495057',
        minWidth: 40,
        textAlign: 'right',
    },
    scoreText: {
        ...typography.bodyLarge,
        color: '#495057',
        textAlign: 'right',
    },
    challengeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengeText: {
        ...typography.h2,
        color: '#212529',
        marginBottom: 24,
        textAlign: 'center',
    },
    completionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    completionTitle: {
        ...typography.h1,
        color: '#4CAF50',
        marginBottom: 16,
    },
    completionText: {
        ...typography.bodyLarge,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
    },
    newChallengeButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        width: '100%',
    },
    newChallengeButtonText: {
        ...typography.button,
        color: '#fff',
        textAlign: 'center',
    },
});

export default DailyChallenge; 