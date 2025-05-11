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

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Platform, Switch } from 'react-native';
import { Camera } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { typography } from '../../constants/typography';

interface SignRecognitionPracticeProps {
    onPrediction: (prediction: string) => void;
    targetSign: string;
}

export const SignRecognitionPractice: React.FC<SignRecognitionPracticeProps> = ({
    onPrediction,
    targetSign,
}) => {
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
    }, [realtimeMode]);

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
                    const isMatch = data.prediction === targetSign;
                    setIsCorrect(isMatch);
                    
                    onPrediction(data.prediction);
                }
            } catch (parseErr) {
                console.error('Failed to parse prediction response:', parseErr);
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
                    
                    const isMatch = data.prediction === targetSign;
                    setIsCorrect(isMatch);
                    
                    onPrediction(data.prediction);
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
                            type="front"
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
                            onValueChange={(value) => setRealtimeMode(value)}
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
        </View>
    );
};

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
        backgroundColor: '#f5f5f5',
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
        backgroundColor: Platform.OS === 'web' ? '#f5f5f5' : 'transparent',
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
        backgroundColor: Platform.OS === 'web' ? 'white' : 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        ...(Platform.OS === 'web' ? {
            borderWidth: 1,
            borderColor: '#e0e0e0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        } : {}),
    },
    targetText: {
        ...typography.h2,
        color: Platform.OS === 'web' ? '#333' : '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    predictionResult: {
        alignItems: 'center',
        marginTop: 15,
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
        marginBottom: 20,
        backgroundColor: Platform.OS === 'web' ? '#f9f9f9' : 'rgba(0,0,0,0.3)',
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
        padding: 15,
        borderRadius: 8,
        marginVertical: 15,
        alignItems: 'center',
        borderWidth: Platform.OS === 'web' ? 1 : 0,
        borderColor: '#b3e5fc',
    },
    currentDetectionTitle: {
        ...typography.bodyLarge,
        color: Platform.OS === 'web' ? '#0277bd' : '#fff',
        marginBottom: 10,
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
}); 