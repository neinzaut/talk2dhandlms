import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ViewStyle, TextStyle, ImageStyle, ImageBackground } from 'react-native';
import { SignRecognitionPractice, SignRecognitionPracticeRef } from '../(practice)/SignRecognitionPractice';
import { getSignImage } from '../../utils/imageUtils';
import { typography } from '../../constants/typography';
import { useLanguage } from '../common/LanguageContext';

const TEST_DURATION_PER_ITEM = 10; // Seconds per item
const PREDICTION_HISTORY_SIZE = 3;
const REQUIRED_CONFIDENCE = 0.6; // Minimum confidence to consider a prediction valid for matching

interface ModuleTestProps {
    moduleId: number;
    onComplete?: (finalScore: number, mistakes: string[]) => void; // Include mistakes in onComplete
}

interface TestItem {
    sign: string;
    type: 'letter' | 'number'; // Assuming we might have different types
    userAttemptImageUri?: string; // To store the URI of the user's attempt for mistakes
    isCorrect?: boolean; // We will use this to explicitly mark items for results display
}

export const ModuleTest: React.FC<ModuleTestProps> = ({
    moduleId,
    onComplete
}) => {
    const { selectedLanguage } = useLanguage();
    const [isTestRunning, setIsTestRunning] = useState(false); // Renamed from isStarted
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [testItems, setTestItems] = useState<TestItem[]>([]);
    const [showResultsScreen, setShowResultsScreen] = useState(false); // Renamed from showResults
    
    // New state variables based on selfTest.js logic
    const [score, setScore] = useState(0);
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [mistakenSigns, setMistakenSigns] = useState<string[]>([]);
    const [timerValue, setTimerValue] = useState(TEST_DURATION_PER_ITEM);
    
    const [rawPrediction, setRawPrediction] = useState<string | null>(null);
    const [rawConfidence, setRawConfidence] = useState<number | null>(null);
    const predictionHistoryRef = useRef<string[]>([]);
    const [smoothedPrediction, setSmoothedPrediction] = useState<string | null>(null);
    const [smoothedConfidence, setSmoothedConfidence] = useState<number | null>(null);

    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const signPracticeRef = useRef<SignRecognitionPracticeRef>(null); // Add ref for snapshot
    // const successSoundRef = useRef<Audio.Sound | null>(null);
    // const failureSoundRef = useRef<Audio.Sound | null>(null);

    // Generate test items (simplified, focusing on Module 1 for now)
    useEffect(() => {
        if (isTestRunning && moduleId === 1 && testItems.length === 0) { // Only generate once
            console.log('[ModuleTest] Generating test items for Module 1...');
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            const numbers = Array.from({ length: 10 }, (_, i) => i.toString()); // 0-9
            
            let items: TestItem[] = [];
            // Example: 3 letters, 2 numbers
            for (let i = 0; i < 3; i++) {
                items.push({ sign: letters[Math.floor(Math.random() * letters.length)], type: 'letter' });
            }
            for (let i = 0; i < 2; i++) {
                items.push({ sign: numbers[Math.floor(Math.random() * numbers.length)], type: 'number' });
            }
            
            const shuffledItems = items.sort(() => Math.random() - 0.5);
            console.log('[ModuleTest] Generated test items:', shuffledItems);
            setTestItems(shuffledItems);
            setCurrentItemIndex(0); // Ensure we start from the first item
            setTimerValue(TEST_DURATION_PER_ITEM); // Reset timer for the first item
        }
    }, [isTestRunning, moduleId, testItems.length]);

    // Prediction Smoothing Logic (from selfTest.js, adapted)
    useEffect(() => {
        if (rawPrediction === null) {
            setSmoothedPrediction(null);
            setSmoothedConfidence(null);
            predictionHistoryRef.current = [];
            return;
        }

        const history = predictionHistoryRef.current;
        if (rawPrediction && rawPrediction !== 'No hand detected') {
            history.push(rawPrediction);
            if (history.length > PREDICTION_HISTORY_SIZE) {
                history.shift();
            }
        }

        if (history.length === 0) {
            setSmoothedPrediction("No hand detected");
            setSmoothedConfidence(0);
            return;
        }

        const counts: { [key: string]: number } = {};
        history.forEach(p => {
            if (p === 'No hand detected') return;
            counts[p] = (counts[p] || 0) + 1;
        });

        let mostFrequent = "No hand detected";
        let maxCount = 0;
        for (const p in counts) {
            if (counts[p] > maxCount) {
                maxCount = counts[p];
                mostFrequent = p;
            }
        }
        
        const confidence = history.length > 0 ? maxCount / history.length : 0;
        setSmoothedPrediction(mostFrequent);
        setSmoothedConfidence(confidence);

    }, [rawPrediction]);


    // Core logic for handling a prediction from SignRecognitionPractice
    const handleRawPrediction = (prediction: string, confidence?: number) => {
        setRawPrediction(prediction);
        setRawConfidence(confidence || 0);
        
        // Decision making will happen in a useEffect listening to smoothedPrediction
    };
    
    // useEffect to react to smoothed predictions
    useEffect(() => {
        if (!isTestRunning || showResultsScreen || testItems.length === 0 || smoothedPrediction === null || smoothedConfidence === null) {
            return;
        }

        const currentItem = testItems[currentItemIndex];
        if (!currentItem) return;

        console.log(`[ModuleTest] Smoothed Prediction: ${smoothedPrediction} (Conf: ${smoothedConfidence?.toFixed(2)}), Target: ${currentItem.sign}`);

        if (smoothedPrediction.toUpperCase() === currentItem.sign.toUpperCase() && smoothedConfidence >= REQUIRED_CONFIDENCE) {
            console.log(`[ModuleTest] Correct sign: ${currentItem.sign} detected!`);
            setScore(prev => prev + 1);
            
            // Mark item as correct in the testItems array for later review in results
            setTestItems(prevItems => prevItems.map((item, index) => 
                index === currentItemIndex ? { ...item, isCorrect: true } : item
            ));
            
            moveToNextItem();
        }
    }, [smoothedPrediction, smoothedConfidence, isTestRunning, showResultsScreen, currentItemIndex, testItems]); // testItems added as dependency


    // Timer Effect
    useEffect(() => {
        if (isTestRunning && !showResultsScreen && testItems.length > 0) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

            timerIntervalRef.current = setInterval(async () => {
                setTimerValue(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current!);
                        const timedOutItem = testItems[currentItemIndex];
                        console.log(`[ModuleTest] Time out for item: ${timedOutItem?.sign}`);
                        setIncorrectAttempts(prevInc => prevInc + 1);
                        setMistakenSigns(prevMistakes => [...prevMistakes, timedOutItem?.sign || 'Unknown']);

                        // --- SNAPSHOT CAPTURE LOGIC ---
                        (async () => {
                            let userAttemptImageUri: string | undefined = undefined;
                            if (signPracticeRef.current && signPracticeRef.current.captureCurrentUserAttempt) {
                                try {
                                    userAttemptImageUri = await signPracticeRef.current.captureCurrentUserAttempt();
                                } catch (e) {
                                    console.warn('[ModuleTest] Failed to capture user snapshot:', e);
                                }
                            }
                            setTestItems(prevItems => prevItems.map((item, index) => 
                                index === currentItemIndex ? { 
                                    ...item, 
                                    isCorrect: false, 
                                    userAttemptImageUri
                                } : item
                            ));
                            moveToNextItem();
                        })();
                        // --- END SNAPSHOT CAPTURE LOGIC ---
                        return TEST_DURATION_PER_ITEM; 
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [isTestRunning, showResultsScreen, currentItemIndex, testItems.length, selectedLanguage]);

    const moveToNextItem = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); // Stop current timer

        if (currentItemIndex + 1 < testItems.length) {
            console.log('[ModuleTest] Moving to next item.');
            setCurrentItemIndex(prev => prev + 1);
            setTimerValue(TEST_DURATION_PER_ITEM); // Reset timer for the new item
            setRawPrediction(null); // Clear prediction for next item
        } else {
            console.log('[ModuleTest] Test finished. Showing results.');
            setIsTestRunning(false); // Stop the test
            setShowResultsScreen(true);
            if (onComplete) {
                onComplete(score, mistakenSigns);
            }
        }
    };

    const handleStartTest = () => {
        console.log('[ModuleTest] Starting test...');
        setTestItems([]); // Clear previous items
        setIsTestRunning(true);
        setShowResultsScreen(false);
        setScore(0);
        setIncorrectAttempts(0);
        setMistakenSigns([]);
        setCurrentItemIndex(0); // Explicitly set to 0
        setTimerValue(TEST_DURATION_PER_ITEM);
        setRawPrediction(null); // Clear any previous predictions
    };

    // --- UI Rendering ---

    const renderResultsScreen = () => {
        const finalScorePercentage = testItems.length > 0 ? Math.round((score / testItems.length) * 100) : 0;
        return (
            <ImageBackground source={require('../../assets/icons/bgpattern.png')} style={styles.backgroundImage}>
                <ScrollView contentContainerStyle={styles.resultsScrollContainer}>
                    <View style={styles.resultsContentContainer}>
                        <Text style={styles.titleText}>Test Results</Text>
                        <Text style={styles.finalScoreText}>Your Score: {finalScorePercentage}%</Text>
                        <Text style={styles.statsText}>Correct: {score} / {testItems.length}</Text>
                        <Text style={styles.statsText}>Incorrect: {incorrectAttempts}</Text>
                        
                        {testItems.filter(item => !item.isCorrect && item.sign).length > 0 && (
                            <View style={styles.mistakesBox}>
                                <Text style={styles.mistakesTitle}>Review Your Mistakes:</Text>
                                {testItems.map((item, idx) => {
                                    if (!item.isCorrect && item.sign) {
                                        const expectedSignImage = getSignImage(selectedLanguage, item.sign, item.type);
                                        return (
                                            <View key={idx} style={styles.mistakeItemContainer}>
                                                <View style={styles.mistakeSignInfo}>
                                                    <Text style={styles.mistakeText}>Expected: <Text style={styles.mistakeSignChar}>{item.sign}</Text></Text>
                                                    {expectedSignImage.path && (
                                                        <Image 
                                                            source={expectedSignImage.path} 
                                                            style={styles.mistakeExpectedImage}
                                                            resizeMode="contain" 
                                                        />
                                                    )}
                                                </View>
                                                {item.userAttemptImageUri && (
                                                    <View style={styles.mistakeUserAttemptContainer}>
                                                        <Text style={styles.mistakeSubText}>Your Attempt:</Text>
                                                        <Image 
                                                            source={{ uri: item.userAttemptImageUri }} 
                                                            style={styles.mistakeUserImage} 
                                                            resizeMode="contain"
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }
                                    return null;
                                })}
                            </View>
                        )}
                        <TouchableOpacity style={styles.button} onPress={handleStartTest}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    };
    
    const currentTargetItem = testItems[currentItemIndex];

    if (showResultsScreen) {
        return renderResultsScreen();
    }

    if (!isTestRunning || !currentTargetItem) {
        // Initial screen or loading items
        return (
            <ImageBackground source={require('../../assets/icons/bgpattern.png')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Module Test</Text>
                    <Text style={styles.descriptionText}>
                        Get ready to test your sign language knowledge!
                        You'll have {TEST_DURATION_PER_ITEM} seconds for each sign.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={handleStartTest}>
                        <Text style={styles.buttonText}>Start Test</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    // --- Active Test Screen ---
    const signImage = getSignImage(selectedLanguage, currentTargetItem.sign, currentTargetItem.type);
    
    let predictionColor = '#666'; // Default for "No hand detected" or low confidence
    if (smoothedPrediction && smoothedPrediction !== "No hand detected") {
        if (smoothedConfidence && smoothedConfidence >= 0.7) predictionColor = '#00aa00'; // Green
        else if (smoothedConfidence && smoothedConfidence >= 0.4) predictionColor = '#ff9900'; // Orange
    }


    return (
        <ImageBackground source={require('../../assets/icons/bgpattern.png')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.testProgressText}>Sign {currentItemIndex + 1} of {testItems.length}</Text>
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>{timerValue}s</Text>
                    </View>
                </View>

                <View style={styles.targetSignContainer}>
                    <Text style={styles.instructionText}>Sign the following:</Text>
                    {signImage.path ? (
                        <Image source={signImage.path} style={styles.targetImage} resizeMode="contain" />
                    ) : (
                        <Text style={styles.targetSignText}>{currentTargetItem.sign}</Text>
                    )}
                </View>

                <View style={styles.cameraContainer}>
                    <SignRecognitionPractice
                        ref={signPracticeRef}
                        targetSign={currentTargetItem.sign}
                        onPrediction={(pred, conf) => handleRawPrediction(pred, conf)}
                    />
                </View>
                
                <View style={styles.predictionDisplayContainer}>
                    <Text style={styles.predictionLabel}>Detected:</Text>
                    <Text style={[styles.predictionText, { color: predictionColor }]}>
                        {smoothedPrediction || "Waiting for prediction..."}
                    </Text>
                    {smoothedPrediction !== "No hand detected" && smoothedConfidence !== null && (
                        <Text style={styles.confidenceText}>
                            (Confidence: {(smoothedConfidence * 100).toFixed(1)}%)
                        </Text>
                    )}
                </View>

                <View style={styles.currentScoreContainer}>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                    <Text style={styles.scoreText}>Incorrect: {incorrectAttempts}</Text>
                </View>

            </ScrollView>
        </ImageBackground>
    );
};

// --- Styles (to be refined) ---
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between', // Pushes score to bottom if content is short
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    container: { // Used for start/results screen
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.85)', // Slight overlay for readability
        margin: 20,
        borderRadius: 15,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    testProgressText: {
        fontSize: typography.h3.fontSize,
        fontWeight: 'bold',
        color: '#333',
    },
    timerBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    timerText: {
        fontSize: typography.h3.fontSize,
        color: 'white',
        fontWeight: 'bold',
    },
    targetSignContainer: {
        alignItems: 'center',
        marginBottom: 10, // Reduced margin
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        width: '95%',
    },
    instructionText: {
        fontSize: typography.h2.fontSize,
        color: '#333',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    targetImage: {
        width: 150, // Slightly larger
        height: 150, // Slightly larger
        marginBottom: 10,
    },
    targetSignText: {
        fontSize: 60, // Larger for text signs
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    cameraContainer: {
        width: '95%',
        aspectRatio: 4 / 3, // Common camera aspect ratio
        backgroundColor: 'black',
        borderRadius: 10,
        overflow: 'hidden', // Ensures SignRecognitionPractice corners are clipped
        marginBottom: 10, // Reduced margin
        borderWidth: 2,
        borderColor: '#ddd',
    },
    predictionDisplayContainer: {
        alignItems: 'center',
        paddingVertical: 5, // Reduced padding
        marginBottom: 10, // Reduced margin
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        paddingHorizontal: 15,
        width: '95%',
    },
    predictionLabel: {
        fontSize: typography.bodyLarge.fontSize,
        color: '#555',
        fontWeight: '600',
    },
    predictionText: {
        fontSize: typography.h1.fontSize, // Larger prediction
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
    },
    confidenceText: {
        fontSize: typography.bodySmall.fontSize,
        color: '#777',
    },
    currentScoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '95%',
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
    },
    titleText: { // For Start/Results screen
        fontSize: typography.h1.fontSize,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    descriptionText: { // For Start screen
        fontSize: typography.bodyLarge.fontSize,
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#4CAF50', // Green
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 180,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: typography.h3.fontSize,
        fontWeight: 'bold',
    },
    scoreText: { // For results and live score
        fontSize: typography.h3.fontSize, // Consistent size
        color: 'white', // White for the dark score bar
        fontWeight: 'bold',
        marginVertical: 3,
        textAlign: 'center',
    },
    // Results Screen Specific
    resultsScrollContainer: { // For results screen specifically
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    resultsContentContainer: { // Inner container for results content
        width: '90%',
        maxWidth: 500,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    finalScoreText: { // For results page, potentially larger
        fontSize: typography.h1.fontSize, 
        color: '#007AFF',
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    statsText: { // For correct/incorrect counts on results page
        fontSize: typography.h3.fontSize,
        color: '#333',
        fontWeight: '600',
        marginVertical: 4,
        textAlign: 'center',
    },
    mistakesBox: {
        width: '100%',
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f0f0', // Light grey box for mistakes
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    mistakesContainer: { // Old, can be removed or merged if style is preferred
        marginTop: 20,
        alignItems: 'center',
        width: '90%',
    },
    mistakesTitle: {
        fontSize: typography.h2.fontSize,
        fontWeight: 'bold',
        color: '#E74C3C', // A more distinct red
        marginBottom: 15,
        textAlign: 'center',
    },
    mistakeItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal:5,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    mistakeSignInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    mistakeText: {
        fontSize: typography.bodyLarge.fontSize,
        color: '#333',
        marginBottom: 5,
    },
    mistakeSignChar: {
        fontWeight: 'bold',
        color: '#D35400' // Orange for the char itself
    },
    mistakeExpectedImage: {
        width: 70, // Smaller image for the list
        height: 70,
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    mistakeUserAttemptContainer: {
        alignItems: 'center',
        marginLeft: 10, // Space between expected and user attempt
    },
    mistakeSubText: {
        fontSize: typography.bodySmall.fontSize,
        color: '#555',
        marginBottom: 3,
    },
    mistakeUserImage: {
        width: 90, // User attempt image slightly larger or different style
        height: 90,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E74C3C', // Red border for user's incorrect attempt
    }
});

// Helper for sounds (optional, can be uncommented and implemented)
// async function setupSounds(successRef: React.MutableRefObject<Audio.Sound | null>, failureRef: React.MutableRefObject<Audio.Sound | null>) {
// try {
// console.log('Loading success sound...');
// const { sound: success } = await Audio.Sound.createAsync(
// require('../../assets/sounds/success.mp3') // Replace with actual path
// );
// successRef.current = success;

// console.log('Loading failure sound...');
// const { sound: failure } = await Audio.Sound.createAsync(
// require('../../assets/sounds/failure.mp3') // Replace with actual path
// );
// failureRef.current = failure;
// } catch (error) {
// console.error('Failed to load sounds', error);
// }
// }

// async function playSound(soundRef: React.MutableRefObject<Audio.Sound | null>) {
// try {
// if (soundRef.current) {
// await soundRef.current.replayAsync();
// }
// } catch (error) {
// console.error('Failed to play sound', error);
// }
// }

// useEffect(() => {
// setupSounds(successSoundRef, failureSoundRef);
// return () => {
// successSoundRef.current?.unloadAsync();
// failureSoundRef.current?.unloadAsync();
// };
// }, []);
// Example of how to use playSound:
// playSound(isSuccess ? successSoundRef : failureSoundRef);
