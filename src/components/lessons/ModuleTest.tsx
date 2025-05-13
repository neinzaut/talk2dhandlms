import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ViewStyle, TextStyle, ImageStyle, ImageBackground } from 'react-native';
import { SignRecognitionPractice } from '../practice/SignRecognitionPractice';
import { getSignImage } from '../../utils/imageUtils';
import { typography } from '../../constants/typography';
import { useLanguage } from '../common/LanguageContext';

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
    const { selectedLanguage } = useLanguage();
    const [isStarted, setIsStarted] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [testItems, setTestItems] = useState<TestItem[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [timer, setTimer] = useState(5);
    const [showPreview, setShowPreview] = useState(true);

    // Generate random test items based on module content
    useEffect(() => {
        console.log('Effect triggered - isStarted:', isStarted, 'moduleId:', moduleId);
        if (isStarted && !isNaN(moduleId)) {
            console.log('Generating test items...');
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
                const shuffledItems = items.sort(() => Math.random() - 0.5);
                console.log('Generated test items:', shuffledItems);
                setTestItems(shuffledItems);
            } else {
                console.log('Unsupported module ID:', moduleId);
                setTestItems([]);
            }
        }
    }, [isStarted, moduleId]);

    // Log state changes
    useEffect(() => {
        console.log('State updated - testItems:', testItems.length, 'currentItemIndex:', currentItemIndex);
    }, [testItems, currentItemIndex]);

    // Timer effect
    useEffect(() => {
        if (isStarted && !showResults && !showPreview) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        // Move to next item or show results
                        if (currentItemIndex + 1 < testItems.length) {
                            setCurrentItemIndex(prev => prev + 1);
                            setTimer(5);
                            setShowPreview(true);
                        } else {
                            setShowResults(true);
                            const score = Math.round((testItems.filter(item => item.isCorrect).length / testItems.length) * 100);
                            onComplete?.(score);
                        }
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isStarted, showResults, showPreview, currentItemIndex, testItems.length]);

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
            setShowPreview(false);
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

    const handleStartTest = () => {
        console.log('Starting test...');
        setIsStarted(true);
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

    const renderPreview = () => {
        const currentItem = testItems[currentItemIndex];
        console.log('Rendering preview - currentItem:', currentItem);
        if (!currentItem) return null;

        const signImage = getSignImage(selectedLanguage, currentItem.sign, currentItem.type);

        return (
            <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>
                    Sign this {currentItem.type}:
                </Text>
                {signImage.path ? (
                    <Image 
                        source={signImage.path}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={styles.previewText}>{currentItem.sign}</Text>
                )}
                <TouchableOpacity 
                    style={styles.startSigningButton}
                    onPress={() => setShowPreview(false)}
                >
                    <Text style={styles.startSigningButtonText}>Start Signing</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderContent = () => {
        if (!isStarted) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Module Test</Text>
                    <Text style={styles.description}>
                        Test your knowledge of the signs you've learned!
                    </Text>
                    <TouchableOpacity 
                        style={styles.startButton}
                        onPress={handleStartTest}
                    >
                        <Text style={styles.startButtonText}>Start Test</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (showResults) {
            return renderResults();
        }

        const currentItem = testItems[currentItemIndex];
        if (!currentItem) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Loading test items...</Text>
                    <Text style={styles.description}>
                        Please wait while we prepare your test...
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {renderHearts()}
                    
                    {showPreview ? (
                        renderPreview()
                    ) : (
                        <>
                            <View style={[
                                styles.cameraContainer,
                                isCorrect && styles.correctSign
                            ]}>
                                <SignRecognitionPractice
                                    targetSign={currentItem.sign}
                                    onPrediction={handlePrediction}
                                />
                            </View>
                            <View style={styles.timerContainer}>
                                <Text style={styles.timerText}>{timer}s</Text>
                            </View>
                        </>
                    )}

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentItem.type === 'letter' ? 'Letter' : 'Number'}: {currentItem.sign}
                        </Text>
                        <Text style={styles.progressCount}>
                            {currentItemIndex + 1} of {testItems.length}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        );
    };

    return (
        <ImageBackground 
            source={require('../../assets/icons/bgpattern.png')}
            style={styles.background}
            resizeMode="cover"
        >
            {renderContent()}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    } as ViewStyle,
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
        visibility: 'auto',
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
    previewContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
    } as ViewStyle,
    previewTitle: {
        ...typography.h2,
        marginBottom: 16,
        textAlign: 'center',
    } as TextStyle,
    previewImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    } as ImageStyle,
    startSigningButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    } as ViewStyle,
    startSigningButtonText: {
        ...typography.button,
        color: '#fff',
    } as TextStyle,
    timerContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 20,
    } as ViewStyle,
    timerText: {
        ...typography.h3,
        color: '#fff',
    } as TextStyle,
    previewText: {
        ...typography.h1,
        fontSize: 72,
        marginBottom: 20,
    } as TextStyle,
});
