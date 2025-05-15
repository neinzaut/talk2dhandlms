/**
 * SignRecognitionPractice Component
 * 
 * A real-time sign language recognition component that uses the device camera
 * to detect and interpret hand signs. It provides immediate feedback on sign accuracy.
 * 
 * Features:
 * - Real-time camera feed
 * - Hand sign detection
 * - Accuracy feedback
 * - Target sign comparison
 * 
 * Used in:
 * - SubLessonScreen for practice sessions
 * - Individual sign practice mode
 */

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Platform, Switch } from 'react-native';
import { Camera } from 'expo-camera';
import type { CameraCapturedPicture, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { typography } from '../../constants/typography';

interface SignRecognitionPracticeProps {
    onPrediction: (prediction: string, confidence?: number) => void;
    targetSign: string;
    onSignLearned?: (sign: string) => void;
}

// Define the interface for the methods to be exposed via ref
export interface SignRecognitionPracticeRef {
  captureCurrentUserAttempt: () => Promise<string | null>;
}

export const SignRecognitionPractice = forwardRef<SignRecognitionPracticeRef, SignRecognitionPracticeProps>(({
    onPrediction,
    targetSign,
    onSignLearned,
}, ref) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [realtimeMode, setRealtimeMode] = useState(true);
    const [lastPrediction, setLastPrediction] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const cameraRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // New state for timer and feedback
    const startTimeRef = useRef<number | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [timeMessage, setTimeMessage] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // State for visible timer
    const [displayedTime, setDisplayedTime] = useState(0);
    const displayTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Ref to hold the latest targetSign for use in interval callbacks
    const currentTargetSignRef = useRef<string>(targetSign);

    // Expose the capture method
    useImperativeHandle(ref, () => ({
        captureCurrentUserAttempt: async () => {
            if (Platform.OS === 'web') {
                if (!videoRef.current) {
                    console.error("[SRP_Snapshot] Video ref not available for capture");
                    return null;
                }
                const canvas = document.createElement('canvas');
                // Ensure video dimensions are valid
                if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
                    console.error("[SRP_Snapshot] Video dimensions are zero, cannot capture.");
                    return null;
                }
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error("[SRP_Snapshot] Failed to get canvas context for capture");
                    return null;
                }
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL('image/jpeg');
            } else {
                if (!cameraRef.current) {
                    console.error("[SRP_Snapshot] Camera ref not available for capture");
                    return null;
                }
                try {
                    console.log("[SRP_Snapshot] Taking picture (native)...");
                    const photo = await cameraRef.current.takePictureAsync({
                        quality: 0.5, // Moderate quality to keep size down
                        base64: true, // Request base64 data
                        skipProcessing: true, // Faster if no edits needed on native side
                    });
                    console.log("[SRP_Snapshot] Picture taken (native).");
                    return photo.base64 ? `data:image/jpeg;base64,${photo.base64}` : null;
                } catch (e) {
                    console.error("[SRP_Snapshot] Failed to take picture (native):", e);
                    return null;
                }
            }
        }
    }));

    const checkBackendStatus = async () => {
        try {
            console.log('Checking backend health...');
            
            const url = 'http://localhost:8000/health';
            console.log(`Trying backend at ${url}`);
            
            try {
                const response = await fetch(url, { 
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: AbortSignal.timeout(5000)
                });
                
                if (!response.ok) {
                    console.error(`Health check failed with status: ${response.status}`);
                    return false;
                }
                
                const text = await response.text();
                console.log('Raw health check response:', text);
                
                const data = JSON.parse(text);
                console.log('Parsed health check response:', data);
                
                if (data.model_loaded === true) {
                    console.log('✅ Model is loaded according to server!');
                    return true;
                } else {
                    console.error('❌ Model is NOT loaded according to server.');
                    return false;
                }
            } catch (err) {
                console.error('Health check failed:', err);
                return false;
            }
        } catch (err) {
            console.error('Health check completely failed:', err);
            return false;
        }
    };

    useEffect(() => {
        let mounted = true;
        let localStream: MediaStream | null = null;

        const getStream = async () => {
            try {
                if (Platform.OS === 'web') {
                    localStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (mounted) setStream(localStream);
                    setHasPermission(true);
                } else {
                    const { status } = await Camera.requestCameraPermissionsAsync();
                    if (mounted) setHasPermission(status === 'granted');
                }
            } catch (err) {
                if (mounted) setError('Failed to get camera permission');
            }
        };

        getStream();

        return () => {
            mounted = false;
            setIsCameraActive(false);
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (Platform.OS === 'web' && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef.current]);

    useEffect(() => {
        let mounted = true;
        
        const setup = async () => {
            const modelLoaded = await checkBackendStatus();
            if (mounted && !modelLoaded) {
                setError("Model not loaded on backend. Please check server logs.");
                console.error("Model not loaded on backend server!");
            } else if (mounted && modelLoaded && realtimeMode) {
                startContinuousDetection();
            }
        };
        
        setup();
        
        return () => {
            mounted = false;
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (realtimeMode) {
            startContinuousDetection();
        } else {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
        }

        return () => {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
        };
    }, [realtimeMode, targetSign]);

    useEffect(() => {
        // Reset feedback and start timer when targetSign changes
        if (targetSign) {
            console.log(`[EFFECT_TARGET_SIGN] New target sign received: '${targetSign}' (Length: ${targetSign.length})`);
            currentTargetSignRef.current = targetSign;
            setIsCorrect(false); // Reset correct state for new letter
            setFeedbackMessage(null);
            setTimeMessage(null);
            setShowFeedback(false);
            startTimeRef.current = Date.now();
            
            // Visible Timer Logic
            setDisplayedTime(0);
            if (displayTimerIntervalRef.current) {
                clearInterval(displayTimerIntervalRef.current);
            }
            displayTimerIntervalRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const newTime = Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000);
                    setDisplayedTime(newTime);
                }
            }, 1000);

            // Ensure detection is active if in realtime mode
            if (realtimeMode && !captureIntervalRef.current) {
                startContinuousDetection();
            }
        } else {
            // If no target sign, clear timer and displayed time
            startTimeRef.current = null;
            if (displayTimerIntervalRef.current) {
                clearInterval(displayTimerIntervalRef.current);
                displayTimerIntervalRef.current = null;
            }
            setDisplayedTime(0);
        }
        
        // Always reset these states when targetSign changes
        setLastPrediction(null);
        setPrediction(null);
        setIsCorrect(false);
        
        return () => {
            if (displayTimerIntervalRef.current) {
                clearInterval(displayTimerIntervalRef.current);
                displayTimerIntervalRef.current = null;
            }
        };
    }, [targetSign, realtimeMode]);

    const startContinuousDetection = async () => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
        }

        const modelLoaded = await checkBackendStatus();
        if (!modelLoaded) {
            setError("Model not loaded on backend. Real-time detection unavailable.");
            return;
        }

        captureIntervalRef.current = setInterval(() => {
            if (!isProcessing && isCameraActive) {
                captureAndPredict();
            }
        }, 2000);
    };

    const captureAndPredict = async () => {
        try {
            if (isProcessing) return;
            
            setIsProcessing(true);
            
            let base64Image: string;
            
            if (Platform.OS === 'web') {
                if (!videoRef.current) {
                    setIsProcessing(false);
                    return;
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setIsProcessing(false);
                    return;
                }
                
                ctx.drawImage(videoRef.current, 0, 0);
                base64Image = canvas.toDataURL('image/jpeg');
            } else {
                if (!cameraRef.current) {
                    setIsProcessing(false);
                    return;
                }
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.5,
                    base64: true,
                });
                base64Image = `data:image/jpeg;base64,${photo.base64}`;
            }

            const url = 'http://localhost:8000/predict';
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image }),
            });
            
            if (!response.ok) {
                setIsProcessing(false);
                return;
            }
            
            const rawResponseText = await response.text();
            
            try {
                const data = JSON.parse(rawResponseText);
                
                if (data.success) {
                    setPrediction(data.prediction);
                    setLastPrediction(data.prediction);
                    setConfidence(data.confidence);
                    
                    // Use the ref for the most current targetSign
                    const currentTarget = currentTargetSignRef.current;
                    console.log(`[CAPTURE_PREDICT] Comparing: Backend prediction: '${data.prediction}' (Length: ${data.prediction.length}), Current Target (from ref): '${currentTarget}' (Length: ${currentTarget ? currentTarget.length : 'null'})`);
                    
                    // Case-insensitive comparison using the ref
                    const isMatch = !!(currentTarget && data.prediction && currentTarget.toLowerCase() === data.prediction.toLowerCase());
                    console.log(`[CAPTURE_PREDICT] Is match? ${isMatch}. Current isCorrect state: ${isCorrect}`);
                    
                    // Log detailed matching information
                    if (currentTarget) {
                        console.log(`[CAPTURE_PREDICT] Detailed matching:
                        Target: '${currentTarget}' (${currentTarget.toLowerCase()})
                        Prediction: '${data.prediction}' (${data.prediction.toLowerCase()})
                        Match?: ${data.prediction.toLowerCase() === currentTarget.toLowerCase()}
                        Confidence: ${data.confidence ? (data.confidence * 100).toFixed(1) + '%' : 'n/a'}`);
                    }
                    
                    if (isMatch && !isCorrect) {
                        console.log(`[CAPTURE_PREDICT] ✅ CORRECT MATCH DETECTED for ${currentTarget}!`);
                        setIsCorrect(true);
                        
                        if (onSignLearned) {
                            console.log(`[CAPTURE_PREDICT] 📣 Calling onSignLearned for ${currentTarget}`);
                            
                            // Temporarily pause predictions to allow state transitions
                            if (captureIntervalRef.current) {
                                clearInterval(captureIntervalRef.current);
                                captureIntervalRef.current = null;
                            }
                            
                            // Call onSignLearned first, then delay before resuming predictions
                            onSignLearned(currentTarget);
                            
                            // Extended pause to allow state changes to complete fully
                            // Using a longer timeout ensures the completion state has time to propagate
                            setTimeout(() => {
                                if (realtimeMode && isCameraActive) {
                                    console.log(`[CAPTURE_PREDICT] Resuming detection after match`);
                                    startContinuousDetection();
                                }
                            }, 4000); // Extended to 4 seconds to give more time for state changes
                        } else {
                            console.warn(`[CAPTURE_PREDICT] ⚠️ onSignLearned callback is not defined!`);
                        }

                        // Clear the display timer interval
                        if (displayTimerIntervalRef.current) {
                            clearInterval(displayTimerIntervalRef.current);
                            displayTimerIntervalRef.current = null;
                        }

                        if (startTimeRef.current) {
                            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
                            setFeedbackMessage("Correct!");
                            if (elapsedTime <= 5) {
                                setTimeMessage("Good job, you're learning quick!");
                            } else if (elapsedTime <= 10) {
                                setTimeMessage("You're learning well! Keep at it!");
                            } else {
                                setTimeMessage("Some signs take time, you got this!");
                            }
                            setShowFeedback(true);
                        }
                    } else if (isMatch && isCorrect) {
                        console.log(`[CAPTURE_PREDICT] Match found but already marked correct`);
                    } else if (!isMatch) {
                        console.log(`[CAPTURE_PREDICT] No match: '${data.prediction}' ≠ '${currentTarget}'`);
                    }
                    
                    onPrediction(data.prediction, data.confidence);
                } else {
                    console.log('Prediction not successful or no data: ', data.error || 'No specific error');
                }
            } catch (parseError) {
                console.error('Error parsing prediction response:', parseError, rawResponseText);
            }
        } catch (err: any) {
            console.error('Error in real-time processing:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const takePicture = async () => {
        try {
            setIsProcessing(true);
            setError(null);
            
            console.log('Starting prediction process...');
            
            const isModelLoaded = await checkBackendStatus();
            if (!isModelLoaded) {
                console.error('Cannot proceed with capture: model not loaded');
                setError('Model not loaded on server. Please check server logs and restart.');
                setIsProcessing(false);
                return;
            }
            
            console.log('Model is loaded, proceeding with capture...');
            
            let base64Image: string;
            
            if (Platform.OS === 'web') {
                if (!videoRef.current) {
                    setError('Camera not ready');
                    setIsProcessing(false);
                    return;
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setError('Failed to create canvas context');
                    setIsProcessing(false);
                    return;
                }
                
                ctx.drawImage(videoRef.current, 0, 0);
                base64Image = canvas.toDataURL('image/jpeg');
            } else {
                if (!cameraRef.current) {
                    setError('Camera not ready');
                    setIsProcessing(false);
                    return;
                }
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.5,
                    base64: true,
                });
                base64Image = `data:image/jpeg;base64,${photo.base64}`;
            }

            const url = 'http://localhost:8000/predict';
            console.log(`Sending image to ${url}`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Prediction failed with status ${response.status}:`, errorText);
                setError(`Prediction failed: ${response.status} ${errorText}`);
                setIsProcessing(false);
                return;
            }
            
            const rawResponseText = await response.text();
            console.log('Raw prediction response:', rawResponseText);
            
            try {
                const data = JSON.parse(rawResponseText);
                console.log('Parsed prediction response:', data);
                
                if (data.success) {
                    console.log('✅ Prediction successful:', data.prediction);
                    setPrediction(data.prediction);
                    setLastPrediction(data.prediction);
                    setConfidence(data.confidence);
                    setAnnotatedImage(data.annotated_image);
                    
                    // Ensure isMatch is strictly boolean
                    const isMatch = !!(targetSign && data.prediction && targetSign.toLowerCase() === data.prediction.toLowerCase());
                    setIsCorrect(isMatch);
                    
                    onPrediction(data.prediction, data.confidence);
                } else {
                    console.error('❌ Prediction error:', data.error);
                    setError(data.error || 'Failed to process image');
                }
            } catch (parseErr) {
                console.error('Failed to parse prediction response:', parseErr);
                setError('Failed to parse server response');
            }
        } catch (err: any) {
            console.error('Error processing image:', err);
            setError(`Failed to process image: ${err.message || String(err)}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const showTryAgain = prediction && targetSign && prediction !== targetSign && !isCorrect && !showFeedback;

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>No access to camera</Text></View>;
    }

    return (
        <View style={styles.mainContainer}>
            {/* Left side: Camera feed */}
            <View style={styles.cameraContainer}>
                {annotatedImage ? (
                    <Image 
                        source={{ uri: annotatedImage }} 
                        style={styles.camera}
                        resizeMode="contain"
                    />
                ) : isCameraActive ? (
                    Platform.OS === 'web' ? (
                        <video
                            ref={videoRef}
                            style={styles.camera}
                            autoPlay
                            playsInline
                            muted
                        />
                    ) : (
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            type={"front"}
                        />
                    )
                ) : null}
            </View>
            
            {/* Right side: Controls and information */}
            <View style={styles.controlsContainer}>
                <View style={styles.predictionContainer}>
                    <Text style={styles.targetText}>
                        Show the sign for: {targetSign}
                    </Text>
                    
                    <View style={styles.realtimeModeToggle}>
                        <Text style={styles.realtimeModeText}>Real-time detection:</Text>
                        <Switch
                            value={realtimeMode}
                            onValueChange={(value) => {
                                setRealtimeMode(value);
                                if (!value && captureIntervalRef.current) {
                                    clearInterval(captureIntervalRef.current);
                                    captureIntervalRef.current = null;
                                } else if (value && targetSign && isCameraActive && hasPermission) {
                                    startContinuousDetection();
                                }
                            }}
                            trackColor={{ false: '#767577', true: '#4CAF50' }}
                            thumbColor={realtimeMode ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                    
                    <View style={styles.currentDetectionContainer}>
                        <Text style={styles.currentDetectionTitle}>
                            Detected Sign Currently:
                        </Text>
                        <Text style={[
                            styles.currentDetectionText,
                            lastPrediction ? (lastPrediction === targetSign ? styles.correctPrediction : styles.incorrectPrediction) : {}
                        ]}>
                            {lastPrediction || 'None'}
                        </Text>
                        {isCorrect && lastPrediction && (
                            <Text style={styles.correctIndicator}>✓ Correct!</Text>
                        )}
                    </View>
                    
                    {prediction && !realtimeMode && (
                        <View style={styles.predictionResult}>
                            <Text style={[
                                styles.predictionText,
                                prediction === targetSign ? styles.correctPrediction : styles.incorrectPrediction
                            ]}>
                                Detected: {prediction}
                            </Text>
                            {confidence && (
                                <Text style={styles.confidenceText}>
                                    Confidence: {(confidence * 100).toFixed(1)}%
                                </Text>
                            )}
                        </View>
                    )}
                    
                    {error && (
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    )}
                    
                    {!realtimeMode && (
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.captureButtonInner} />
                            )}
                        </TouchableOpacity>
                    )}

                    {annotatedImage && !realtimeMode && (
                        <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => {
                                setAnnotatedImage(null);
                                setPrediction(null);
                                setConfidence(null);
                                setIsCameraActive(true);
                            }}
                        >
                            <Text style={styles.retakeButtonText}>Take Another Picture</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {Platform.OS !== 'web' && (
                <TouchableOpacity onPress={() => setIsCameraActive(!isCameraActive)} style={styles.toggleButton}>
                    <Text style={styles.buttonText}>{isCameraActive ? 'Pause Camera' : 'Resume Camera'}</Text>
                </TouchableOpacity>
            )}

            {showFeedback && feedbackMessage && (
                <View style={styles.feedbackContainer}>
                    <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.incorrectText]}>
                        {feedbackMessage}
                    </Text>
                    {timeMessage && <Text style={styles.timeMessageText}>{timeMessage}</Text>}
                </View>
            )}

            {/* Timer Display */}
            {targetSign && !showFeedback && (
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>Time: {displayedTime}s</Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        position: 'relative',
    },
    mainContainer: {
        flex: 1,
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        backgroundColor: 'white',
    },
    cameraContainer: {
        flex: Platform.OS === 'web' ? 1 : undefined,
        height: Platform.OS === 'web' ? '100%' : 300,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    controlsContainer: {
        flex: Platform.OS === 'web' ? 1 : undefined,
        padding: 20,
        height: Platform.OS === 'web' ? '100%' : 300,
        overflow: Platform.OS === 'web' ? 'auto' : 'visible',
        minHeight: Platform.OS === 'web' ? '100%' : 300,
    },
    camera: Platform.OS === 'web' 
        ? {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // TypeScript workaround for transform property
            transform: 'scaleX(-1)' as any
        } 
        : {
            width: '100%',
            height: '100%',
            objectFit: 'cover' as any,
            transform: [{ scaleX: -1 }]
        },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: 20,
    },
    predictionContainer: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    targetText: {
        ...typography.h2,
        color: Platform.OS === 'web' ? '#333' : '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    predictionResult: {
        alignItems: 'center',
        marginTop: 5,
    },
    predictionText: {
        ...typography.h3,
        color: Platform.OS === 'web' ? '#333' : '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    correctPrediction: {
        color: '#4CAF50',
    },
    incorrectPrediction: {
        color: '#f44336',
    },
    confidenceText: {
        ...typography.bodyLarge,
        color: Platform.OS === 'web' ? '#666' : '#fff',
        textAlign: 'center',
    },
    errorText: {
        ...typography.bodyLarge,
        color: '#f44336',
        textAlign: 'center',
        marginTop: 10,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Platform.OS === 'web' ? '#2196F3' : '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Platform.OS === 'web' ? '#2196F3' : '#fff',
        borderWidth: 2,
        borderColor: Platform.OS === 'web' ? '#1976D2' : '#000',
    },
    retakeButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 10,
    },
    retakeButtonText: {
        ...typography.button,
        color: '#fff',
    },
    realtimeModeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        // backgroundColor: Platform.OS === 'web' ? '#f9f9f9' : 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 8,
    },
    realtimeModeText: {
        ...typography.bodyLarge,
        color: Platform.OS === 'web' ? '#333' : '#fff',
        marginRight: 10,
    },
    currentDetectionContainer: {
        backgroundColor: Platform.OS === 'web' ? '#f0f9ff' : 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 8,
        marginVertical: 15,
        alignItems: 'center',
        borderWidth: Platform.OS === 'web' ? 1 : 0,
        borderColor: '#b3e5fc',
    },
    currentDetectionTitle: {
        ...typography.bodyLarge,
        color: Platform.OS === 'web' ? '#0277bd' : '#fff',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    currentDetectionText: {
        ...typography.h2,
        color: Platform.OS === 'web' ? '#333' : '#fff',
        fontSize: 40,
        marginVertical: 5,
    },
    correctIndicator: {
        ...typography.h3,
        color: '#4CAF50',
        marginTop: 5,
        fontWeight: 'bold',
    },
    toggleButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonText: {
        ...typography.button,
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        padding: 10,
        borderRadius: 8,
    },
    switchLabel: {
        ...typography.bodyLarge,
        color: Platform.OS === 'web' ? '#333' : '#fff',
        marginRight: 10,
    },
    cameraPreviewWeb: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cameraPreviewNative: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cameraPausedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    cameraPausedText: {
        fontSize: 18,
        color: '#888',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    annotatedImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    feedbackContainer: {
        position: 'absolute',
        bottom: 130, // Adjust as needed
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: typography.h3.fontSize,
        fontWeight: typography.h3.fontWeight,
        color: '#fff',
    },
    correctText: {
        color: '#4CAF50', // Green for correct
    },
    incorrectText: {
        color: '#F44336', // Red for incorrect (though not used for "Correct!")
    },
    timeMessageText: {
        fontSize: typography.bodyLarge.fontSize,
        color: '#fff',
        marginTop: 5,
    },
    timerContainer: {
        position: 'absolute',
        top: 70, // Adjust as needed, below controlsContainer
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        zIndex: 5, // Below controls, above camera
    },
    timerText: {
        fontSize: typography.bodyLarge.fontSize,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
}); 