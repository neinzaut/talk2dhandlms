/**
 * SubLessonScreen Component
 * 
 * This component renders the main practice interface for sign language learning.
 * It displays a camera feed for sign recognition practice and a grid of selectable signs taken from SignRecognitionPractice.tsx.
 * 
 * Features:
 * - Real-time sign recognition practice
 * - Interactive sign selection grid
 * - Language-specific content filtering
 * - Progress tracking
 * 
 * Used in:
 * - App navigation as a main practice screen
 * - Accessed from ModuleScreen when selecting a sublesson
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, FlatList, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLessons } from '../../hooks/useLessons';
import { useLanguage } from '../common/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { SubLessonStatus, SubLesson } from '../../types/lessons';
import { typography } from '../../constants/typography';
import { SignRecognitionPractice } from '../(practice)/SignRecognitionPractice';
import { getSignImages, getSignImage, SignImage } from '../../utils/imageUtils';
import { NumbersSubLesson } from './NumbersSubLesson';
import { FingerSpellingSubLesson } from './FingerSpellingSubLesson';
import { WebView } from 'react-native-webview';

export const SubLessonScreen: React.FC = () => {
    const { moduleId, sublessonId, title, language } = useLocalSearchParams<{ moduleId: string; sublessonId: string; title: string; language: string }>();
    const { selectedLanguage } = useLanguage();
    const { lessons, loading, error, updateProgress } = useLessons(selectedLanguage as SignLanguage);
    const router = useRouter();
    const hasMountedRef = useRef(false);
    const [selectedSign, setSelectedSign] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalSign, setModalSign] = useState<SignImage | null>(null);

    // State for learned signs
    const [learnedSigns, setLearnedSigns] = useState<Set<string>>(new Set());

    // Check if the module belongs to the selected language
    const isCorrectLanguage = moduleId.toLowerCase().startsWith(selectedLanguage.toLowerCase());

    useEffect(() => {
        // If the language doesn't match, redirect to the dashboard
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            // On initial mount, if language is incorrect, let the component render the warning message
            // instead of an immediate redirect that might race with router initialization.
            if (!isCorrectLanguage) {
                console.log("[SubLessonScreen] Initial mount with incorrect language. Deferring redirect, user will see warning.");
                return; 
            }
        }

        // For subsequent changes or if correct on initial valid run
        if (!isCorrectLanguage) {
            console.log("[SubLessonScreen] Incorrect language detected after mount, redirecting to dashboard.");
            router.replace('/');
        }
    }, [isCorrectLanguage, router]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    const module = lessons.find(lesson => lesson.id === moduleId);
    const sublesson = module?.sublessons.find(sub => sub.id === sublessonId);

    if (!module || !sublesson) {
        return (
            <View style={styles.container}>
                <Text>Sublesson not found</Text>
            </View>
        );
    }

    // If the language doesn't match, show a warning
    if (!isCorrectLanguage) {
        return (
            <View style={styles.container}>
                <View style={styles.warningContainer}>
                    <Ionicons name="warning" size={48} color="#f44336" />
                    <Text style={styles.warningTitle}>Language Mismatch</Text>
                    <Text style={styles.warningText}>
                        This sublesson is not available for {selectedLanguage}. Please select the correct language in the dashboard.
                    </Text>
                    <TouchableOpacity
                        style={styles.warningButton}
                        onPress={() => router.replace('/')}
                    >
                        <Text style={styles.warningButtonText}>Return to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const getStatusIcon = (status: SubLessonStatus) => {
        switch (status) {
            case 'complete':
                return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
            case 'in-progress':
                return <Ionicons name="time" size={24} color="#2196F3" />;
            default:
                return <Ionicons name="ellipse-outline" size={24} color="#9E9E9E" />;
        }
    };

    const renderSignSelection = () => {
        const signs = getSignImages(selectedLanguage, sublesson.content?.signs || [], 'labelled');

        return (
            <View style={styles.signSelectionContainer}>
                <Text style={styles.sectionTitle}>Select a Sign to Practice</Text>
                <Text style={styles.languageTitle}>{selectedLanguage} Signs</Text>
                <View style={styles.signsGrid}>
                    {signs.map((item) => (
                        <TouchableOpacity
                            key={item.meaning}
                            style={[
                                styles.signCard,
                                selectedSign === item.meaning && styles.selectedSignCard,
                                learnedSigns.has(item.meaning.toLowerCase()) && styles.learnedSignCard
                            ]}
                            onPress={() => setSelectedSign(item.meaning || null)}
                        >
                            <Image source={item.path} style={styles.signImage} />
                            <Text style={styles.signText}>{item.meaning}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const renderSublessonContent = () => {
        // Check if this is a module test sublesson
        if (sublesson.type === 'test') {
            router.push({
                pathname: '/module/test',
                params: { moduleId, sublessonId, title: module.title }
            });
            return null;
        }

        // Specific handling for fsl-2 dynamic gestures
        if (moduleId === 'fsl-2' && sublesson.id === 'fsl-2-1') {
            console.log("[SubLessonScreen] Rendering content for Dynamic Gestures (fsl-2-1)");
            if (Platform.OS === 'web') {
                console.log("[SubLessonScreen] Platform is web, rendering iframe for fsl-2-1");
                // Use an iframe for web platform
                return (
                    <View style={styles.webViewContainer}> 
                        <iframe
                            src="http://localhost:5000" // URL of your Flask app
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                            title="Dynamic Gesture Practice"
                            allow="camera; microphone" // Explicitly allow camera and microphone access
                        />
                    </View>
                );
            } else {
                // Use WebView for native platforms (iOS, Android)
                console.log("[SubLessonScreen] Platform is native, rendering WebView for fsl-2-1");
                return (
                    <View style={styles.webViewContainer}>
                        <WebView
                            source={{ uri: 'http://localhost:5000' }} // URL of your Flask app
                            style={styles.webView}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            allowsProtectedMedia={true}
                            originWhitelist={['*']}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error: ', nativeEvent);
                            }}
                            onLoad={() => console.log("WebView content loaded")}
                            onHttpError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn(
                                    'WebView HTTP error: ',
                                    nativeEvent.statusCode,
                                    nativeEvent.url,
                                );
                            }}
                        />
                    </View>
                );
            }
        }

        // Specific handling for fsl-2 localized terms
        if (moduleId === 'fsl-2' && sublesson.id === 'fsl-2-2') {
            console.log("[SubLessonScreen] Rendering content for Localized Terms (fsl-2-2)");
            if (Platform.OS === 'web') {
                console.log("[SubLessonScreen] Platform is web, rendering iframe for fsl-2-2 to port 5000");
                return (
                    <View style={styles.webViewContainer}>
                        <iframe
                            src="http://localhost:5000"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                            title="Localized Terms Practice"
                            allow="camera; microphone"
                        />
                    </View>
                );
            } else {
                // Use WebView for native platforms (iOS, Android)
                console.log("[SubLessonScreen] Platform is native, rendering WebView for fsl-2-2 to port 5000");
                return (
                    <View style={styles.webViewContainer}>
                        <WebView
                            source={{ uri: 'http://localhost:5000' }}
                            style={styles.webView}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            allowsProtectedMedia={true}
                            originWhitelist={['*']}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error (fsl-2-2): ', nativeEvent);
                            }}
                            onLoad={() => console.log("WebView content loaded (fsl-2-2)")}
                            onHttpError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn(
                                    'WebView HTTP error (fsl-2-2): ',
                                    nativeEvent.statusCode,
                                    nativeEvent.url,
                                );
                            }}
                        />
                    </View>
                );
            }
        }

        if (sublesson.type === 'practice') {
            // Check if this is a finger spelling practice sublesson
            if (sublesson.title.toLowerCase().includes('finger spelling')) {
                return (
                    <FingerSpellingSubLesson
                        language={selectedLanguage.toLowerCase() as 'asl' | 'fsl'}
                        onComplete={() => {
                            // Handle completion
                            console.log('Finger spelling sublesson completed');
                        }}
                    />
                );
            }
            
            // Check if this is a numbers practice sublesson
            else if (sublesson.content?.signs?.every(sign => !isNaN(Number(sign)))) {
                return (
                    <NumbersSubLesson
                        language={selectedLanguage}
                        onComplete={() => {
                            // Handle completion
                            console.log('Numbers sublesson completed');
                        }}
                    />
                );
            }
            
            // Default practice sublesson (alphabet)
            return (
                <View style={styles.content}>
                    <View style={styles.cameraContainer}>
                        <SignRecognitionPractice
                            targetSign={selectedSign}
                            onPrediction={(prediction) => {
                                console.log('Prediction:', prediction);
                            }}
                            onSignLearned={(sign) => {
                                handleSignLearned(sign);
                            }}
                        />
                    </View>
                    {renderSignSelection()}
                </View>
            );
        }
        
        return (
            <View style={styles.content}>
                <Text>Unsupported sublesson type</Text>
            </View>
        );
    };

    // Callback for when a sign is learned
    const handleSignLearned = (sign: string) => {
        setLearnedSigns(prev => new Set(prev).add(sign.toLowerCase()));
        // Optionally, you could also update overall progress here if needed
        // updateProgress(moduleId, sublessonId, 100, 'complete'); // Example, adjust logic
    };

    return (
        <ImageBackground 
            source={require('../../assets/icons/bgpattern.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>{sublesson.title}</Text>
                    <Text style={styles.type}>{sublesson.type}</Text>
                    <View style={styles.statusContainer}>
                        {getStatusIcon(sublesson.status)}
                        <Text style={styles.statusText}>
                            {sublesson.status.charAt(0).toUpperCase() + sublesson.status.slice(1)}
                        </Text>
                    </View>
                </View>
                {renderSublessonContent()}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        ...typography.h1,
        color: '#212529',
        marginBottom: 8,
    },
    type: {
        ...typography.bodyLarge,
        color: '#6c757d',
        textTransform: 'capitalize',
        marginBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusText: {
        ...typography.bodyLarge,
        marginLeft: 8,
        color: '#6c757d',
    },
    content: {
        padding: 20,
        // backgroundColor: 'rgba(255, 255, 255, 0.9)', // body container in sublesson
        margin: 20,
        borderRadius: 12,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cameraContainer: {
        width: '100%',
        maxWidth: '1000px',
        height: '45%',
        marginBottom: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        overflow: 'hidden',
        alignSelf: 'center',
        backgroundColor: '#000',
        position: 'relative',
        // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    signSelectionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        ...typography.h2,
        marginBottom: 16,
        color: '#212529',
    },
    languageTitle: {
        ...typography.h3,
        marginBottom: 12,
        color: '#495057',
    },
    signsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        gap: 15,
    },
    signCard: {
        width: '8%',
        aspectRatio: 0.8,
        alignItems: 'center',
        padding: 3,
        borderRadius: 6,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    selectedSignCard: {
        borderColor: '#007AFF',
        borderWidth: 2,
    },
    learnedSignCard: {
        borderColor: '#4CAF50',
        borderWidth: 2,
        backgroundColor: '#E8F5E9',
    },
    signImage: {
        width: 40,
        height: 40,
        marginBottom: 5,
    },
    signText: {
        ...typography.bodyMedium,
        color: '#495057',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 2,
    },
    warningContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    warningTitle: {
        ...typography.h1,
        color: '#f44336',
        marginTop: 16,
        marginBottom: 8,
    },
    warningText: {
        ...typography.bodyLarge,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    warningButton: {
        backgroundColor: '#f44336',
        padding: 12,
        borderRadius: 8,
    },
    warningButtonText: {
        ...typography.button,
        color: '#fff',
    },
    webViewContainer: {
        flex: 1,
        width: '100%',
        minHeight: 800,
        height: 'auto',
        alignSelf: 'stretch',
        backgroundColor: '#f0f0f0',
    },
    webView: {
        flex: 1,
    },
}); 