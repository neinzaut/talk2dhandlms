import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ImageBackground, ViewStyle, TextStyle, Image, ImageStyle, TouchableOpacity } from 'react-native';
import { SignRecognitionPractice } from '../(practice)/SignRecognitionPractice';
import { typography } from '../../constants/typography';
import { getSignImages } from '../../utils/imageUtils';

interface FingerSpellingSubLessonProps {
    language: 'ASL' | 'FSL';
    onComplete?: () => void;
}

export const FingerSpellingSubLesson: React.FC<FingerSpellingSubLessonProps> = ({
    language,
    onComplete
}) => {
    const [inputText, setInputText] = useState('');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleTextChange = (text: string) => {
        setInputText(text);
        setCurrentLetterIndex(0);
        setIsCorrect(false);
    };

    const handlePrediction = (prediction: string) => {
        if (currentLetterIndex < inputText.length) {
            const currentLetter = inputText[currentLetterIndex].toLowerCase();
            const isLetterCorrect = prediction.toLowerCase() === currentLetter;
            setIsCorrect(isLetterCorrect);

            if (isLetterCorrect) {
                setTimeout(() => {
                    if (currentLetterIndex + 1 < inputText.length) {
                        setCurrentLetterIndex(prev => prev + 1);
                        setIsCorrect(false);
                    } else {
                        // Word completed
                        onComplete?.();
                    }
                }, 1000);
            }
        }
    };

    const renderSignPreview = () => {
        if (!inputText) return null;

        const letters = inputText.split('');
        const signs = getSignImages(language, letters, 'labelled');

        return (
            <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Sign Preview</Text>
                <View style={styles.previewGrid}>
                    {signs.map((item, index) => (
                        <View 
                            key={index} 
                            style={[
                                styles.previewItem,
                                index === currentLetterIndex && styles.currentPreviewItem,
                                index < currentLetterIndex && styles.completedPreviewItem
                            ]}
                        >
                            <Image source={item.path} style={styles.previewImage} />
                            <Text style={styles.previewText}>{item.meaning}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={[
                        styles.cameraContainer,
                        isCorrect && styles.correctSign
                    ]}>
                        <SignRecognitionPractice
                            targetSign={inputText[currentLetterIndex] || ''}
                            onPrediction={handlePrediction}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={inputText}
                                onChangeText={handleTextChange}
                                placeholder="Type a word to practice"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {inputText.length > 0 && (
                                <TouchableOpacity 
                                    style={styles.clearButton}
                                    onPress={() => handleTextChange('')}
                                >
                                    <Text style={styles.clearButtonText}>×</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {renderSignPreview()}

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {inputText.length > 0 ? (
                                currentLetterIndex < inputText.length ? (
                                    `Sign the letter: ${inputText[currentLetterIndex].toUpperCase()}`
                                ) : (
                                    'Word completed!'
                                )
                            ) : (
                                'Type a word to start practicing'
                            )}
                        </Text>
                        {isCorrect && (
                            <Text style={styles.correctText}>Correct!</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
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
    } as ViewStyle,
    cameraContainer: {
        width: '100%',
        maxWidth: 900,
        height: '50%',
        aspectRatio: 16/9,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#D9D9D9',
        backgroundColor: '#000',
    } as ViewStyle,
    correctSign: {
        borderColor: '#4CAF50',
        borderWidth: 2,
    } as ViewStyle,
    inputContainer: {
        width: '60%',
        marginBottom: 16,
    } as ViewStyle,
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    } as ViewStyle,
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    } as TextStyle,
    clearButton: {
        position: 'absolute',
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 1,
    } as ViewStyle,
    clearButtonText: {
        fontSize: 20,
        color: '#666',
        lineHeight: 20,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
    } as TextStyle,
    previewContainer: {
        width: '100%',
        marginBottom: 16,
    } as ViewStyle,
    previewTitle: {
        ...typography.h3,
        marginBottom: 12,
        textAlign: 'center',
        color: '#212529',
    } as TextStyle,
    previewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 10,
    } as ViewStyle,
    previewItem: {
        width: 60,
        aspectRatio: 0.8,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    } as ViewStyle,
    currentPreviewItem: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196F3',
        borderWidth: 2,
    } as ViewStyle,
    completedPreviewItem: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4CAF50',
    } as ViewStyle,
    previewImage: {
        width: '85%',
        height: '70%',
        marginBottom: 4,
        resizeMode: 'contain',
    } as ImageStyle,
    previewText: {
        ...typography.bodyMedium,
        color: '#495057',
        fontSize: 12,
        textAlign: 'center',
    } as TextStyle,
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    } as ViewStyle,
    progressText: {
        ...typography.h3,
        marginBottom: 8,
        textAlign: 'center',
    } as TextStyle,
    correctText: {
        ...typography.bodyLarge,
        color: '#4CAF50',
        textAlign: 'center',
    } as TextStyle,
}); 