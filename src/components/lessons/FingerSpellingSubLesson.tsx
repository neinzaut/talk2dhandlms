import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ImageBackground, ViewStyle, TextStyle, Image, ImageStyle, TouchableOpacity } from 'react-native';
import { SignRecognitionPractice } from '../(practice)/SignRecognitionPractice';
import { typography } from '../../constants/typography';
import { getSignImage, getSignImages } from '../../utils/imageUtils';

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
    const [isSpelling, setIsSpelling] = useState(false); // New state to track if spelling mode is active

    // New State
    type LetterStatus = { char: string; status: 'pending' | 'active' | 'correct' | 'timedOut' };
    const [lettersStatus, setLettersStatus] = useState<LetterStatus[]>([]);
    
    const wordStartTimeRef = useRef<number | null>(null);
    const letterStartTimeRef = useRef<number | null>(null);
    const letterTimerIntervalRef = useRef<NodeJS.Timeout | null>(null); // For 10s advice timeout
    const displayLetterTimerIntervalRef = useRef<NodeJS.Timeout | null>(null); // For visible timer

    const [displayedLetterTime, setDisplayedLetterTime] = useState(0);
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);
    const [totalSpellingTime, setTotalSpellingTime] = useState(0);
    const [adviceMessage, setAdviceMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState<string>(""); // New state for the overlay message
    // New state to trigger the effect after a sign is learned
    const [lastProcessedInfo, setLastProcessedInfo] = useState<{ index: number; sign: string } | null>(null);

    const lettersStatusRef = useRef(lettersStatus);

    useEffect(() => {
        lettersStatusRef.current = lettersStatus;
    }, [lettersStatus]);

    // Effect for when inputText changes
    useEffect(() => {
        const newWord = inputText.trim().toUpperCase(); // Standardize to uppercase
        if (newWord.length > 0) {
            const newStatuses: LetterStatus[] = newWord.split('').map((char, index) => ({
                char,
                status: index === 0 ? 'active' : 'pending',
            }));
            setLettersStatus(newStatuses);
            setCurrentLetterIndex(0); // This will trigger the letterActivationEffect
            setShowCompletionMessage(false);
            setTotalSpellingTime(0);
            // setAdviceMessage(null); // Will be handled by letterActivationEffect
            wordStartTimeRef.current = Date.now();
            
            // When text changes, exit spelling mode
            setIsSpelling(false);
        } else {
            setLettersStatus([]);
            setCurrentLetterIndex(0);
            wordStartTimeRef.current = null;
            // Clear timers if text is cleared
            if (letterTimerIntervalRef.current) {
                clearTimeout(letterTimerIntervalRef.current);
                letterTimerIntervalRef.current = null;
            }
            if (displayLetterTimerIntervalRef.current) {
                clearInterval(displayLetterTimerIntervalRef.current);
                displayLetterTimerIntervalRef.current = null;
            }
            setDisplayedLetterTime(0);
            setAdviceMessage(null);
        }
    }, [inputText]);

    // Effect for activating current letter, managing display timer, and resetting letter-specific states
    useEffect(() => {
        // Clear previous display timer first
        if (displayLetterTimerIntervalRef.current) {
            clearInterval(displayLetterTimerIntervalRef.current);
            displayLetterTimerIntervalRef.current = null;
        }

        if (lettersStatus.length > 0 && currentLetterIndex < lettersStatus.length && isSpelling) {
            console.log(`[EFFECT_LETTER] Activating letter at index ${currentLetterIndex}: ${lettersStatus[currentLetterIndex]?.char}`);
            
            // Update status for the new active letter
            setLettersStatus(prev => {
                // Check if this update is actually changing anything to prevent potential loops if not careful
                // For this logic, it's generally fine as currentLetterIndex or lettersStatus.length are deps.
                return prev.map((s, idx) =>
                    idx === currentLetterIndex ? { ...s, status: s.status === 'correct' ? 'correct' : 'active' } :
                    (s.status === 'active' ? { ...s, status: 'pending' } : s) // Deactivate previous active if not correct
                );
            });

            letterStartTimeRef.current = Date.now();
            setAdviceMessage(null); // Clear advice when new letter becomes active
            setDisplayedLetterTime(0); // Reset displayed time for the new letter

            // Start new display timer for the current letter
            displayLetterTimerIntervalRef.current = setInterval(() => {
                if (letterStartTimeRef.current) {
                    const newTime = Math.floor((Date.now() - letterStartTimeRef.current) / 1000);
                    setDisplayedLetterTime(newTime);
                }
            }, 1000);

        } else {
             // Word completed or no letters, ensure display timer is stopped.
            if (displayLetterTimerIntervalRef.current) {
                clearInterval(displayLetterTimerIntervalRef.current);
                displayLetterTimerIntervalRef.current = null;
            }
        }

        // Cleanup display timer when component unmounts or dependencies change
        return () => {
            if (displayLetterTimerIntervalRef.current) {
                clearInterval(displayLetterTimerIntervalRef.current);
                displayLetterTimerIntervalRef.current = null;
            }
        };
    }, [currentLetterIndex, lettersStatus.length, isSpelling]); // Rerun when index changes, word length changes, or spelling mode changes

    // Effect for managing the 10-second advice timer
    useEffect(() => {
        // Clear previous advice timer first
        if (letterTimerIntervalRef.current) {
            clearTimeout(letterTimerIntervalRef.current);
            letterTimerIntervalRef.current = null;
        }

        if (lettersStatus.length > 0 && currentLetterIndex < lettersStatus.length) {
            const currentLetterInfo = lettersStatus[currentLetterIndex];

            if (currentLetterInfo && currentLetterInfo.status === 'active') {
                letterTimerIntervalRef.current = setTimeout(() => {
                    // Check again if the letter is still active and is the same one.
                    // This check is against the component's current state when timeout fires.
                    // A more robust way is to use functional update for setAdviceMessage or check against a ref.
                    // However, since `handleSignLearned` clears this timer and this effect also clears it on change,
                    // if this timer fires, it *should* be for the intended active letter.
                    setAdviceMessage(`Placeholder advice for ${currentLetterInfo.char}`);
                }, 10000); // 10 seconds
            }
        }

        // Cleanup advice timer when component unmounts or dependencies change
        return () => {
            if (letterTimerIntervalRef.current) {
                clearTimeout(letterTimerIntervalRef.current);
                letterTimerIntervalRef.current = null;
            }
        };
    }, [lettersStatus, currentLetterIndex]); // Rerun when lettersStatus or currentLetterIndex changes

    const handleTextChange = (text: string) => {
        setInputText(text); // This will trigger the useEffect for inputText
    };
    
    // New function to start spelling mode
    const startSpelling = () => {
        if (inputText.trim().length > 0) {
            console.log('[startSpelling] Beginning to spell:', inputText.trim().toUpperCase());
            
            // Reset any current progress
            const newStatuses: LetterStatus[] = inputText.trim().toUpperCase().split('').map((char, index) => ({
                char,
                status: index === 0 ? 'active' : 'pending',
            }));
            
            // First, exit any ongoing spelling mode
            setIsSpelling(false);
            
            // Clear all timers
            if (letterTimerIntervalRef.current) {
                clearTimeout(letterTimerIntervalRef.current);
                letterTimerIntervalRef.current = null;
            }
            if (displayLetterTimerIntervalRef.current) {
                clearInterval(displayLetterTimerIntervalRef.current);
                displayLetterTimerIntervalRef.current = null;
            }
            
            // Reset all states synchronously before starting
            setAdviceMessage(null);
            setShowCompletionMessage(false);
            setIsProcessing(false);
            setLettersStatus(newStatuses);
            setCurrentLetterIndex(0);
            setDisplayedLetterTime(0);
            
            // Set timing reference points
            wordStartTimeRef.current = Date.now();
            letterStartTimeRef.current = Date.now();
            
            // Finally enter spelling mode (this will trigger the effects)
            setTimeout(() => {
                setIsSpelling(true);
            }, 100);
        }
    };

    const handleSignLearned = (learnedSign: string) => {
        // Use lettersStatusRef.current to get the latest statuses for findIndex
        const currentLettersStatus = lettersStatusRef.current;

        console.log(`[handleSignLearned] Called with raw learnedSign: '${learnedSign}'`);
        
        if (!isSpelling || isProcessing) { // Prevent re-entry if already processing
            console.log('[handleSignLearned] Not in spelling mode or already processing, ignoring');
            return;
        }

        // Use the ref'd currentLettersStatus here
        const targetIndexInState = currentLettersStatus.findIndex(
            s => s.char === learnedSign && s.status !== 'correct'
        );

        if (targetIndexInState === -1) {
            // Use the ref'd currentLettersStatus for logging too
            const alreadyCorrectCheck = currentLettersStatus.find(s => s.char === learnedSign);
            if (alreadyCorrectCheck && alreadyCorrectCheck.status === 'correct') {
                console.log(`[handleSignLearned] '${learnedSign}' is already marked correct. Current lettersStatus (from ref):`, JSON.stringify(currentLettersStatus), `Ignoring.`);
            } else {
                console.warn(`[handleSignLearned] Received learnedSign '${learnedSign}', but it's not found as an active/pending target or is invalid. Current lettersStatus (from ref):`, JSON.stringify(currentLettersStatus), `currentLetterIndex: ${currentLetterIndex}. Ignoring.`);
            }
            return; 
        }
        
        // Use the ref'd currentLettersStatus for logging
        console.log(`[handleSignLearned] Processing recognized target sign: '${currentLettersStatus[targetIndexInState].char}' at index ${targetIndexInState} (using ref'd status)`);

        setIsProcessing(true); // Indicate that we are now processing this learned sign
        setProcessingMessage("Checking..."); // Generic initial message

        // Clear timers for the learned letter
        if (letterTimerIntervalRef.current) clearTimeout(letterTimerIntervalRef.current);
        if (displayLetterTimerIntervalRef.current) clearInterval(displayLetterTimerIntervalRef.current);
        setAdviceMessage(null);

        // Queue the state update for lettersStatus
        setLettersStatus(prevLettersStatus => 
            prevLettersStatus.map((s, idx) => 
                idx === targetIndexInState ? { ...s, status: 'correct' as const } : s
            )
        );
        // Trigger the useEffect by updating lastProcessedInfo
        setLastProcessedInfo({ index: targetIndexInState, sign: learnedSign }); 
    };

    // Effect to handle logic after a letter's status is updated to 'correct'
    useEffect(() => {
        if (lastProcessedInfo === null || !isProcessing) {
            // Only run if a sign was just processed and we are in a processing state
            return;
        }

        // Use a functional update to get the freshest lettersStatus
        setLettersStatus(currentLettersStatus => {
            console.log(`[EFFECT_LAST_PROCESSED] Running for index: ${lastProcessedInfo.index}, sign: '${lastProcessedInfo.sign}'. Current lettersStatus:`, JSON.stringify(currentLettersStatus));

            // Check if the specific processed letter is indeed marked as correct in the current state
            // This is a sanity check, it should be correct due to the update in handleSignLearned
            if (currentLettersStatus[lastProcessedInfo.index]?.status !== 'correct') {
                console.warn(`[EFFECT_LAST_PROCESSED] Mismatch! Letter at ${lastProcessedInfo.index} ('${lastProcessedInfo.sign}') is not 'correct' in currentLettersStatus. Status is: '${currentLettersStatus[lastProcessedInfo.index]?.status}'. Aborting this effect run.`);
                // Don't reset isProcessing or lastProcessedInfo here, as the state might be inconsistent.
                // Let it retry on next render or state update if necessary, or rely on user action.
                return currentLettersStatus; // Return current state as is
            }

            const allLettersNowCorrect = currentLettersStatus.every(s => s.status === 'correct');
            console.log(`[EFFECT_LAST_PROCESSED] allLettersNowCorrect: ${allLettersNowCorrect}`);

            if (allLettersNowCorrect) {
                console.log('[EFFECT_LAST_PROCESSED] All letters are correct. Showing completion.');
                if (wordStartTimeRef.current) {
                    const timeTaken = (Date.now() - wordStartTimeRef.current) / 1000;
                    setTotalSpellingTime(timeTaken);
                    console.log(`[EFFECT_LAST_PROCESSED] Word "${inputText.trim().toUpperCase()}" spelled in ${timeTaken.toFixed(2)}s`);
                }
                setShowCompletionMessage(true);
                setProcessingMessage("Word Complete!");

                // Call onComplete if provided
                if (onComplete) {
                    onComplete();
                }

                // Reset states for potential next word (unless input is cleared which handles it too)
                setIsProcessing(false);
                setLastProcessedInfo(null);
                setIsSpelling(false); // Exit spelling mode after completion

                // Clear timers definitively on completion
                if (letterTimerIntervalRef.current) clearTimeout(letterTimerIntervalRef.current);
                if (displayLetterTimerIntervalRef.current) clearInterval(displayLetterTimerIntervalRef.current);
                setDisplayedLetterTime(0);
                setAdviceMessage(null);
                
                return currentLettersStatus; // Return the final correct statuses
            } else {
                // Not all correct, find the next letter to practice
                let nextPracticeIndex = -1;
                for (let i = 0; i < currentLettersStatus.length; i++) {
                    if (currentLettersStatus[i].status !== 'correct') {
                        nextPracticeIndex = i;
                        break;
                    }
                }

                if (nextPracticeIndex !== -1) {
                    console.log(`[EFFECT_LAST_PROCESSED] Next letter to practice is '${currentLettersStatus[nextPracticeIndex].char}' at index ${nextPracticeIndex}`);
                    setProcessingMessage(`Moving to the next letter: '${currentLettersStatus[nextPracticeIndex].char}'`);

                    // Short delay to show "Moving to next letter..."
                    // This timeout is crucial. State updates inside it are applied after the delay.
                    setTimeout(() => {
                        console.log(`[EFFECT_LAST_PROCESSED] setTimeout: Setting currentLetterIndex to ${nextPracticeIndex}. Resetting processing flags.`);
                        setCurrentLetterIndex(nextPracticeIndex); // This will trigger the letter activation effect
                        setIsProcessing(false); 
                        setLastProcessedInfo(null); 
                    }, 1500); 

                    // Return currentLettersStatus for now. The map to set 'active' will happen in the letterActivationEffect via setCurrentLetterIndex
                    return currentLettersStatus; 
                } else {
                    // This case should ideally not be reached if allLettersNowCorrect was false,
                    // but as a fallback, if no non-correct letter is found, something is inconsistent.
                    console.error('[EFFECT_LAST_PROCESSED] Inconsistent state: Not all letters correct, but no next practice index found. Resetting processing flags.');
                    setIsProcessing(false);
                    setLastProcessedInfo(null);
                    return currentLettersStatus;
                }
            }
        });
    }, [lastProcessedInfo, isProcessing, onComplete, inputText]); // Use lastProcessedInfo and add inputText

    const renderSignPreview = () => {
        // inputText is already trimmed and uppercased in the useEffect that sets lettersStatus
        if (lettersStatus.length === 0) return null;

        return (
            <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Spell: {inputText.trim().toUpperCase()}</Text>
                <View style={styles.previewGrid}>
                    {lettersStatus.map((letterState, index) => {
                        // Get sign image with error handling
                        const signImage = getSignImage(language, letterState.char, 'labelled');
                        console.log(`Loading image for ${letterState.char}: ${signImage.path ? 'Found' : 'Not found'}`);
                        
                        return (
                            <View 
                                key={`${letterState.char}-${index}`} 
                                style={[
                                    styles.previewItem,
                                    letterState.status === 'active' && styles.currentPreviewItem,
                                    letterState.status === 'correct' && styles.completedPreviewItem,
                                ]}
                            >
                                {signImage.path ? (
                                    <Image 
                                        source={signImage.path} 
                                        style={styles.previewImage}
                                    />
                                ) : (
                                    <View style={styles.fallbackImageContainer}>
                                        <Text style={styles.fallbackImageText}>{letterState.char}</Text>
                                    </View>
                                )}
                                <Text style={styles.previewLetterText}>{letterState.char}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    if (showCompletionMessage) {
        return (
            <ImageBackground 
                source={require('../../assets/icons/bgpattern.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.content}>
                    <View style={styles.completionMessageContainer}>
                        <Text style={styles.completionText}>
                            Good job spelling {inputText.trim().toUpperCase()}!
                        </Text>
                        <Text style={styles.completionTimeText}>
                            It took you {totalSpellingTime.toFixed(1)} seconds! That's great!
                        </Text>
                        <TouchableOpacity 
                            style={styles.spellAnotherButton}
                            onPress={() => {
                                handleTextChange(''); // Clear input to reset the component state
                                setShowCompletionMessage(false); // Hide completion message
                            }}
                        >
                            <Text style={styles.spellAnotherButtonText}>Spell Another Word</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
                {isSpelling ? (
                    // When in spelling mode, show the camera and current letter
                    <View style={[
                        styles.cameraContainer,
                        lettersStatus[currentLetterIndex]?.status === 'correct' && styles.correctSign,
                        isProcessing && styles.processingSign
                    ]}>
                        <SignRecognitionPractice
                            targetSign={lettersStatus[currentLetterIndex]?.char || ''}
                            onSignLearned={handleSignLearned}
                            onPrediction={(prediction) => { /* Optional: if you need to react to every prediction */ }}
                        />
                        {isProcessing && (
                            <View style={styles.processingOverlay}>
                                <Text style={styles.processingText}>{processingMessage}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    // When not in spelling mode, show instructions
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>Finger Spelling Practice</Text>
                        <Text style={styles.instructionsText}>
                            Type a word in the field below and click "Spell" to practice finger spelling it letter by letter.
                        </Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={handleTextChange}
                            placeholder="Type a word to practice"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isSpelling} // Disable editing while spelling
                        />
                        {inputText.length > 0 && !isSpelling && (
                            <TouchableOpacity 
                                style={styles.clearButton}
                                onPress={() => handleTextChange('')}
                            >
                                <Text style={styles.clearButtonText}>×</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {inputText.length > 0 && !isSpelling && (
                        <TouchableOpacity 
                            style={styles.spellButton}
                            onPress={startSpelling}
                        >
                            <Text style={styles.spellButtonText}>Spell</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isSpelling && renderSignPreview()}

                {isSpelling && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {inputText.length > 0 ? (
                                currentLetterIndex < inputText.length ? (
                                    `Sign the letter: ${lettersStatus[currentLetterIndex]?.char.toUpperCase()}`
                                ) : (
                                    'Word completed!'
                                )
                            ) : (
                                'Type a word to start practicing'
                            )}
                        </Text>
                        {lettersStatus[currentLetterIndex]?.status === 'active' && (
                            <Text style={styles.timerText}>Letter Time: {displayedLetterTime}s</Text>
                        )}
                        {adviceMessage && <Text style={styles.adviceText}>{adviceMessage}</Text>}
                    </View>
                )}
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
        width: '100%',
        maxWidth: 500,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginRight: 10,
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
        color: '#333',
        fontSize: 18,
        lineHeight: 20,
    } as TextStyle,
    previewContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    } as ViewStyle,
    previewTitle: {
        ...typography.h2,
        color: '#333',
        marginBottom: 10,
    } as TextStyle,
    previewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    } as ViewStyle,
    previewItem: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
        minWidth: 40, // Ensure items have some width
        alignItems: 'center',
    } as ViewStyle,
    currentPreviewItem: {
        borderColor: '#007AFF', // Blue for active
        borderWidth: 2,
        backgroundColor: '#e3f2fd',
    } as ViewStyle,
    completedPreviewItem: { // Green border for correct letters
        borderColor: '#4CAF50',
        borderWidth: 2,
        backgroundColor: '#E8F5E9',
    } as ViewStyle,
    previewLetterText: { // Style for the text letter in the preview
        ...typography.h3,
        color: '#333',
    } as TextStyle,
    previewImage: { // If using images in preview
        width: 60,
        height: 60,
        marginBottom: 8,
        resizeMode: 'contain',
    } as ImageStyle,
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 16,
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    } as ViewStyle,
    progressText: {
        ...typography.h3,
        marginBottom: 8,
        color: '#333',
    } as TextStyle,
    timerText: {
        ...typography.bodyLarge,
        color: '#007AFF',
        marginTop: 4,
    } as TextStyle,
    adviceText: {
        ...typography.bodyMedium,
        color: '#FF9800',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 10,
    } as TextStyle,
    completionMessageContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 10,
        marginVertical: 20,
    } as ViewStyle,
    completionText: {
        ...typography.h2,
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 10,
    } as TextStyle,
    completionTimeText: {
        ...typography.bodyLarge,
        color: '#333',
        textAlign: 'center',
    } as TextStyle,
    spellAnotherButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        minWidth: 200,
    } as ViewStyle,
    spellAnotherButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    } as TextStyle,
    fallbackImageContainer: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    fallbackImageText: {
        ...typography.h3,
        color: '#333',
    } as TextStyle,
    processingSign: {
        borderColor: '#FFC107',
        borderWidth: 2,
    } as ViewStyle,
    processingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darkened background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    } as ViewStyle,
    processingText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darkened text background
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4CAF50', // Green border to indicate success
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    } as TextStyle,
    instructionsContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    } as ViewStyle,
    instructionsTitle: {
        ...typography.h2,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    } as TextStyle,
    instructionsText: {
        ...typography.bodyLarge,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
    } as TextStyle,
    spellButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    spellButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
}); 