import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { SignRecognitionPractice } from '../practice/SignRecognitionPractice';
import { getSignImages } from '../../utils/imageUtils';
import { typography } from '../../constants/typography';

interface ModuleTestProps {
    moduleId: number;
    onComplete?: (score: number) => void;
}

interface TestItem {
    sign: string;
    type: 'letter' | 'number';
    capturedImage?: string;
    isCorrect?: boolean;
}

export const ModuleTest: React.FC<ModuleTestProps> = ({
    moduleId,
    onComplete
}) => {
    const [isStarted, setIsStarted] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [testItems, setTestItems] = useState<TestItem[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Generate random test items based on module content
    useEffect(() => {
        if (moduleId === 1) {
            // Module 1: Alphabets and Numbers
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            const numbers = Array.from({ length: 11 }, (_, i) => i.toString());
            
            const items: TestItem[] = [];
            // Add 3 random letters
            for (let i = 0; i < 3; i++) {
                const randomLetter = letters[Math.floor(Math.random() * letters.length)];
                items.push({ sign: randomLetter, type: 'letter' });
            }
            // Add 2 random numbers
            for (let i = 0; i < 2; i++) {
                const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
                items.push({ sign: randomNumber, type: 'number' });
            }
            // Shuffle the items
            setTestItems(items.sort(() => Math.random() - 0.5));
        }
        // Add more module conditions here
    }, [moduleId]);

    const handlePrediction = (prediction: string) => {
        const currentItem = testItems[currentItemIndex];
        const isCorrect = prediction.toLowerCase() === currentItem.sign.toLowerCase();
        setIsCorrect(isCorrect);

        if (isCorrect) {
            // Update the test item with success
            const updatedItems = [...testItems];
            updatedItems[currentItemIndex] = {
                ...currentItem,
                isCorrect: true
            };
            setTestItems(updatedItems);

            // Move to next item or show results
            setTimeout(() => {
                if (currentItemIndex + 1 < testItems.length) {
                    setCurrentItemIndex(prev => prev + 1);
                    setIsCorrect(false);
                } else {
                    setShowResults(true);
                    const score = Math.round((testItems.filter(item => item.isCorrect).length / testItems.length) * 100);
                    onComplete?.(score);
                }
            }, 1000);
        } else {
            // Deduct a heart
            setHearts(prev => {
                const newHearts = prev - 1;
                if (newHearts <= 0) {
                    setShowResults(true);
                    onComplete?.(0);
                }
                return newHearts;
            });
        }
    };

    const renderHearts = () => {
        return (
            <View style={styles.heartsContainer}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Text 
                        key={index} 
                        style={[
                            styles.heart,
                            index >= hearts && styles.heartEmpty
                        ]}
                    >
                        {index < hearts ? '❤️' : '🤍'}
                    </Text>
                ))}
            </View>
        );
    };

    const renderResults = () => {
        const score = Math.round((testItems.filter(item => item.isCorrect).length / testItems.length) * 100);
        const getScoreImage = () => {
            if (score === 100) return require('../../assets/icons/excellent.png');
            if (score >= 80) return require('../../assets/icons/good.png');
            if (score >= 50) return require('../../assets/icons/fine.png');
            return require('../../assets/icons/bad.png');
        };

        return (
            <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Test Results</Text>
                <Image source={getScoreImage()} style={styles.scoreImage} />
                <Text style={styles.scoreText}>{score}%</Text>
                
                <View style={styles.mistakesContainer}>
                    <Text style={styles.mistakesTitle}>Mistakes:</Text>
                    {testItems.map((item, index) => (
                        !item.isCorrect && (
                            <View key={index} style={styles.mistakeItem}>
                                <Text style={styles.mistakeText}>
                                    Expected: {item.sign}
                                </Text>
                            </View>
                        )
                    ))}
                </View>
            </View>
        );
    };

    if (!isStarted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Module Test</Text>
                <Text style={styles.description}>
                    Test your knowledge of the signs you've learned!
                </Text>
                <TouchableOpacity 
                    style={styles.startButton}
                    onPress={() => setIsStarted(true)}
                >
                    <Text style={styles.startButtonText}>Start Test</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (showResults) {
        return renderResults();
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
                {renderHearts()}
                
                <View style={[
                    styles.cameraContainer,
                    isCorrect && styles.correctSign
                ]}>
                    <SignRecognitionPractice
                        targetSign={testItems[currentItemIndex]?.sign || ''}
                        onPrediction={handlePrediction}
                    />
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Sign {testItems[currentItemIndex]?.type === 'letter' ? 'the letter' : 'the number'}: {testItems[currentItemIndex]?.sign}
                    </Text>
                    <Text style={styles.progressCount}>
                        {currentItemIndex + 1} of {testItems.length}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    content: {
        padding: 20,
        alignItems: 'center',
    } as ViewStyle,
    title: {
        ...typography.h1,
        marginBottom: 16,
        textAlign: 'center',
    } as TextStyle,
    description: {
        ...typography.bodyLarge,
        textAlign: 'center',
        marginBottom: 32,
        color: '#666',
    } as TextStyle,
    startButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    } as ViewStyle,
    startButtonText: {
        ...typography.button,
        color: '#fff',
    } as TextStyle,
    heartsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    } as ViewStyle,
    heart: {
        fontSize: 24,
    } as TextStyle,
    heartEmpty: {
        opacity: 0.5,
    } as TextStyle,
    cameraContainer: {
        width: '100%',
        maxWidth: 1000,
        height: '45%',
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
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    } as ViewStyle,
    progressText: {
        ...typography.h3,
        marginBottom: 8,
        textAlign: 'center',
    } as TextStyle,
    progressCount: {
        ...typography.bodyMedium,
        color: '#666',
    } as TextStyle,
    resultsContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    } as ViewStyle,
    resultsTitle: {
        ...typography.h1,
        marginBottom: 24,
    } as TextStyle,
    scoreImage: {
        width: 200,
        height: 200,
        marginBottom: 16,
    } as ImageStyle,
    scoreText: {
        ...typography.h1,
        color: '#2196F3',
        marginBottom: 32,
    } as TextStyle,
    mistakesContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    } as ViewStyle,
    mistakesTitle: {
        ...typography.h3,
        marginBottom: 16,
    } as TextStyle,
    mistakeItem: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
    } as ViewStyle,
    mistakeText: {
        ...typography.bodyMedium,
        color: '#dc3545',
    } as TextStyle,
});
