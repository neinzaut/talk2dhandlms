import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { useLanguage } from '../common/LanguageContext';
import { SignRecognitionPractice } from '../practice/SignRecognitionPractice';
import { typography } from '../../constants/typography';

interface FingerSpellingSubLessonProps {
    language: 'asl' | 'fsl';
    onComplete: () => void;
}

export const FingerSpellingSubLesson: React.FC<FingerSpellingSubLessonProps> = ({
    language,
    onComplete
}) => {
    const [word, setWord] = useState('');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const cameraRef = useRef<any>(null);

    React.useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            }
        })();
    }, []);

    const handleWordChange = (text: string) => {
        setWord(text.toLowerCase());
        setCurrentLetterIndex(0);
        setIsCorrect(false);
    };

    const handlePrediction = (prediction: string) => {
        if (currentLetterIndex < word.length) {
            const currentLetter = word[currentLetterIndex].toLowerCase();
            const isLetterCorrect = prediction.toLowerCase() === currentLetter;
            setIsCorrect(isLetterCorrect);

            if (isLetterCorrect) {
                setTimeout(() => {
                    if (currentLetterIndex + 1 < word.length) {
                        setCurrentLetterIndex(prev => prev + 1);
                        setIsCorrect(false);
                    } else {
                        // Word completed
                        onComplete();
                    }
                }, 1000);
            }
        }
    };

    if (Platform.OS === 'web') {
        return (
            <ImageBackground 
                source={require('../../assets/icons/bgpattern.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <ScrollView style={styles.scrollView}>
                    <View style={styles.content}>
                        <Text style={styles.webMessage}>
                            Camera functionality is not available on web. Please use a mobile device for finger spelling practice.
                        </Text>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }

    if (hasPermission === null) {
        return (
            <ImageBackground 
                source={require('../../assets/icons/bgpattern.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <ScrollView style={styles.scrollView}>
                    <View style={styles.content}>
                        <Text>Requesting camera permission...</Text>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }

    if (hasPermission === false) {
        return (
            <ImageBackground 
                source={require('../../assets/icons/bgpattern.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <ScrollView style={styles.scrollView}>
                    <View style={styles.content}>
                        <Text>No access to camera</Text>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground 
            source={require('../../assets/icons/bgpattern.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.cameraContainer}>
                        <SignRecognitionPractice
                            targetSign={word[currentLetterIndex]}
                            onPrediction={handlePrediction}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={word}
                            onChangeText={handleWordChange}
                            placeholder="Type a word to practice"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentLetterIndex < word.length ? (
                                `Sign the letter: ${word[currentLetterIndex].toUpperCase()}`
                            ) : (
                                'Word completed!'
                            )}
                        </Text>
                        {isCorrect && (
                            <Text style={styles.correctText}>Correct!</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        margin: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cameraContainer: {
        width: '45%',
        aspectRatio: 16/9,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: 'normal',
        backgroundColor: '#fff',
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    progressText: {
        ...typography.h3,
        marginBottom: 8,
        textAlign: 'center',
    },
    correctText: {
        ...typography.bodyLarge,
        color: '#4CAF50',
        textAlign: 'center',
    },
    webMessage: {
        ...typography.bodyLarge,
        textAlign: 'center',
        padding: 16,
    },
}); 