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
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Camera as ExpoCamera, CameraType } from 'expo-camera';
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
    const cameraRef = useRef<ExpoCamera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await ExpoCamera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                setIsProcessing(true);
                setError(null);
                
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.5,
                    base64: true,
                });

                // Convert the photo to base64
                const base64Image = `data:image/jpeg;base64,${photo.base64}`;

                // Send to API
                const response = await fetch('http://localhost:5000/api/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: base64Image,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    setPrediction(data.prediction);
                    setConfidence(data.confidence);
                    setAnnotatedImage(data.annotated_image);
                    onPrediction(data.prediction);
                } else {
                    setError(data.error || 'Failed to process image');
                }
            } catch (err) {
                setError('Failed to process image');
                console.error(err);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>No access to camera</Text></View>;
    }

    return (
        <View style={styles.container}>
            {annotatedImage ? (
                <Image 
                    source={{ uri: annotatedImage }} 
                    style={styles.camera}
                    resizeMode="contain"
                />
            ) : (
                <ExpoCamera
                    ref={cameraRef}
                    style={styles.camera}
                    type={CameraType.front}
                />
            )}
            
            <View style={styles.overlay}>
                <View style={styles.predictionContainer}>
                    <Text style={styles.targetText}>
                        Show the sign for: {targetSign}
                    </Text>
                    {prediction && (
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
                </View>
                
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

                {annotatedImage && (
                    <TouchableOpacity
                        style={styles.retakeButton}
                        onPress={() => {
                            setAnnotatedImage(null);
                            setPrediction(null);
                            setConfidence(null);
                        }}
                    >
                        <Text style={styles.retakeButtonText}>Take Another Picture</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
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
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    targetText: {
        ...typography.h2,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    predictionResult: {
        alignItems: 'center',
    },
    predictionText: {
        ...typography.h3,
        color: '#fff',
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
        color: '#fff',
        textAlign: 'center',
    },
    errorText: {
        ...typography.bodyLarge,
        color: '#f44336',
        textAlign: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
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
}); 