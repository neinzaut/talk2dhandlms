import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { typography } from '../../constants/typography';
import { Audio } from 'expo-av';
import { getSignImages } from '../../utils/imageUtils';
import { MaterialIcons } from '@expo/vector-icons';

interface PracticeByAudioProps {
    onComplete: () => void;
}

interface Level {
    id: number;
    name: string;
    description: string;
    letters: string[];
}

// Language-specific level definitions
const ASL_LEVELS: Level[] = [
    {
        id: 1,
        name: 'Level 1',
        description: 'Basic Letters (A-E)',
        letters: ['A', 'B', 'C', 'D', 'E'],
    },
    {
        id: 2,
        name: 'Level 2',
        description: 'Intermediate Letters (F-J)',
        letters: ['F', 'G', 'H', 'I', 'J'],
    },
    {
        id: 3,
        name: 'Level 3',
        description: 'Advanced Letters (K-O)',
        letters: ['K', 'L', 'M', 'N', 'O'],
    },
    {
        id: 4,
        name: 'Level 4',
        description: 'Expert Letters (P-T)',
        letters: ['P', 'Q', 'R', 'S', 'T'],
    },
    {
        id: 5,
        name: 'Level 5',
        description: 'Master Letters (U-Z)',
        letters: ['U', 'V', 'W', 'X', 'Y', 'Z'],
    },
    {
        id: 6,
        name: 'Level 6',
        description: 'Numbers (0-9)',
        letters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
];

const FSL_LEVELS: Level[] = [
    {
        id: 1,
        name: 'Level 1',
        description: 'Basic Letters (A-E)',
        letters: ['A', 'B', 'C', 'D', 'E'],
    },
    {
        id: 2,
        name: 'Level 2',
        description: 'Intermediate Letters (F-J)',
        letters: ['F', 'G', 'H', 'I', 'J'],
    },
    {
        id: 3,
        name: 'Level 3',
        description: 'Advanced Letters (K-O)',
        letters: ['K', 'L', 'M', 'N', 'O'],
    },
    {
        id: 4,
        name: 'Level 4',
        description: 'Expert Letters (P-T)',
        letters: ['P', 'Q', 'R', 'S', 'T'],
    },
    {
        id: 5,
        name: 'Level 5',
        description: 'Master Letters (U-Z)',
        letters: ['U', 'V', 'W', 'X', 'Y', 'Z'],
    },
    {
        id: 6,
        name: 'Level 6',
        description: 'Special Characters',
        letters: ['ñ', 'ng', 'ch'],
    },
];

const PracticeByAudio: React.FC<PracticeByAudioProps> = ({ onComplete }) => {
    const { selectedLanguage } = useLanguage();
    const [currentLevel, setCurrentLevel] = useState<Level>(selectedLanguage === 'ASL' ? ASL_LEVELS[0] : FSL_LEVELS[0]);
    const [currentLetter, setCurrentLetter] = useState<string>('');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
    const [showLevels, setShowLevels] = useState(true);

    // Get available levels based on selected language
    const getAvailableLevels = () => {
        return selectedLanguage === 'ASL' ? ASL_LEVELS : FSL_LEVELS;
    };

    // Generate a random letter from current level
    const generateLetter = () => {
        const randomIndex = Math.floor(Math.random() * currentLevel.letters.length);
        return currentLevel.letters[randomIndex];
    };

    useEffect(() => {
        if (!showLevels) {
            setCurrentLetter(generateLetter());
        }
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, [showLevels, currentLevel]);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            setAnswerStatus(null);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            setIsRecording(false);

            // Here you would send the audio file to your API for processing
            // For now, we'll simulate a response
            const userAnswer = currentLetter; // This should come from your API
            handleAnswer(userAnswer);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const handleMicPress = () => {
        // Placeholder for audio input
        setIsRecording(!isRecording);
        
        // Simulate a response after 2 seconds
        if (!isRecording) {
            setTimeout(() => {
                setIsRecording(false);
                // Simulate a correct answer for testing
                handleAnswer(currentLetter);
            }, 2000);
        }
    };

    const handleAnswer = (answer: string) => {
        setAttempts(prev => prev + 1);
        
        if (answer === currentLetter) {
            setAnswerStatus('correct');
            setScore(prev => prev + 1);
            
            if (score + 1 >= 5) {
                setIsComplete(true);
                onComplete();
            } else {
                setTimeout(() => {
                    setCurrentLetter(generateLetter());
                    setAnswerStatus(null);
                }, 1000);
            }
        } else {
            setAnswerStatus('incorrect');
            setTimeout(() => {
                setAnswerStatus(null);
            }, 1000);
        }
    };

    const handleLevelSelect = (level: Level) => {
        setCurrentLevel(level);
        setScore(0);
        setAttempts(0);
        setIsComplete(false);
        setShowLevels(false);
    };

    if (showLevels) {
        return (
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Select Level</Text>
                    <Text style={styles.subtitle}>Choose a difficulty level to practice</Text>
                </View>

                <ScrollView style={styles.levelsContainer}>
                    {getAvailableLevels().map((level) => (
                        <TouchableOpacity
                            key={level.id}
                            style={styles.levelCard}
                            onPress={() => handleLevelSelect(level)}
                        >
                            <Text style={styles.levelTitle}>{level.name}</Text>
                            <Text style={styles.levelDescription}>{level.description}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Practice by Audio</Text>
                <Text style={styles.subtitle}>Say the letter shown in the sign!</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                            <View 
                                style={[
                                    styles.progressBarFill,
                                    { width: `${(score / 5) * 100}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {score}/5
                        </Text>
                    </View>
                    <Text style={styles.attemptsText}>
                        Attempts: {attempts}
                    </Text>
                </View>
            </View>

            {!isComplete ? (
                <View style={styles.practiceContainer}>
                    <View style={[
                        styles.signContainer,
                        answerStatus === 'correct' && styles.correctAnswer,
                        answerStatus === 'incorrect' && styles.incorrectAnswer
                    ]}>
                        <Image
                            source={getSignImages(selectedLanguage, [currentLetter], 'unlabelled')[0]?.path}
                            style={styles.signImage}
                            resizeMode="contain"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.micButton, isRecording && styles.recordingButton]}
                        onPress={handleMicPress}
                    >
                        <MaterialIcons
                            name={isRecording ? "mic" : "mic-none"}
                            size={32}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    <Text style={styles.instructionText}>
                        {isRecording ? 'Listening...' : 'Tap the microphone and say the letter'}
                    </Text>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setShowLevels(true)}
                    >
                        <Text style={styles.backButtonText}>← Back to Levels</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Level Complete! 🎉</Text>
                    <Text style={styles.completionText}>
                        You completed the level with a score of {score}/5
                    </Text>
                    <Text style={styles.attemptsSummary}>
                        Total attempts: {attempts}
                    </Text>
                    <TouchableOpacity
                        style={styles.newPracticeButton}
                        onPress={() => {
                            setScore(0);
                            setAttempts(0);
                            setIsComplete(false);
                            setCurrentLetter(generateLetter());
                        }}
                    >
                        <Text style={styles.newPracticeButtonText}>Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setShowLevels(true)}
                    >
                        <Text style={styles.backButtonText}>← Back to Levels</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
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
    attemptsText: {
        ...typography.bodyLarge,
        color: '#495057',
        textAlign: 'right',
    },
    practiceContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    signContainer: {
        width: 200,
        height: 200,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 4,
        borderColor: '#dee2e6',
        padding: 16,
    },
    correctAnswer: {
        borderColor: '#4CAF50',
    },
    incorrectAnswer: {
        borderColor: '#dc3545',
    },
    signImage: {
        width: '100%',
        height: '100%',
    },
    micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    recordingButton: {
        backgroundColor: '#dc3545',
    },
    instructionText: {
        ...typography.bodyLarge,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
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
        marginBottom: 8,
    },
    attemptsSummary: {
        ...typography.bodyLarge,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
    },
    newPracticeButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
    },
    newPracticeButtonText: {
        ...typography.button,
        color: '#fff',
        textAlign: 'center',
    },
    backButton: {
        padding: 16,
    },
    backButtonText: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
    levelsContainer: {
        flex: 1,
        padding: 20,
    },
    levelCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#dee2e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    levelTitle: {
        ...typography.h2,
        color: '#212529',
        marginBottom: 8,
    },
    levelDescription: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
});

export default PracticeByAudio; 