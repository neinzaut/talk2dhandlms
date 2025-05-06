/**
 * SubLessonScreen Component
 * 
 * This component renders the main practice interface for sign language learning.
 * It displays a camera feed for sign recognition practice and a grid of selectable signs.
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLessons } from '../../hooks/useLessons';
import { useLanguage } from '../common/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { SubLessonStatus } from '../../types/lessons';
import { typography } from '../../constants/typography';
import { SignRecognitionPractice } from '../practice/SignRecognitionPractice';
import { getSignImages } from '../../utils/imageUtils';

export const SubLessonScreen: React.FC = () => {
    const { moduleId, sublessonId, title } = useLocalSearchParams<{ moduleId: string; sublessonId: string; title: string }>();
    const { selectedLanguage } = useLanguage();
    const { lessons, loading, error } = useLessons(selectedLanguage);
    const router = useRouter();
    const [selectedSign, setSelectedSign] = useState<string>('A');

    // Check if the module belongs to the selected language
    const isCorrectLanguage = moduleId.toLowerCase().startsWith(selectedLanguage.toLowerCase());

    useEffect(() => {
        // If the language doesn't match, redirect to the dashboard
        if (!isCorrectLanguage) {
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
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const signs = getSignImages(selectedLanguage, alphabet, 'labelled');

        return (
            <View style={styles.signSelectionContainer}>
                <Text style={styles.sectionTitle}>Select a Sign to Practice</Text>
                <Text style={styles.languageTitle}>{selectedLanguage} Signs</Text>
                <View style={styles.signsGrid}>
                    {signs.map((item) => (
                        <TouchableOpacity
                            key={item.meaning}
                            style={[
                                styles.signItem,
                                selectedSign === item.meaning && styles.selectedSignItem
                            ]}
                            onPress={() => setSelectedSign(item.meaning || '')}
                        >
                            <Image source={item.path} style={styles.signImage} />
                            <Text style={styles.signText}>{item.meaning}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
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

                <View style={styles.content}>
                    <View style={styles.cameraContainer}>
                        <SignRecognitionPractice
                            targetSign={selectedSign}
                            onPrediction={(prediction) => {
                                console.log('Prediction:', prediction);
                            }}
                        />
                    </View>
                    {renderSignSelection()}
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
    signItem: {
        width: '8%',
        aspectRatio: 0.8,
        alignItems: 'center',
        padding: 3,
        borderRadius: 6,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    selectedSignItem: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196F3',
    },
    signImage: {
        width: '85%',
        height: '70%',
        marginBottom: 4,
        resizeMode: 'contain',
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
}); 