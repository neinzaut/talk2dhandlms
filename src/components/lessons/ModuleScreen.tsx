/**
 * ModuleScreen.tsx
 * 
 * This component displays a detailed view of a learning module, including:
 * - Module overview with title and image
 * - Progress tracking for the entire module
 * - List of sublessons with their individual statuses
 * 
 * Key features:
 * - Shows module progress using a progress bar
 * - Displays sublessons with status indicators (complete, in-progress, not started)
 * - Handles navigation to individual sublessons
 * - Supports multiple languages through LanguageContext
 * - Uses a background pattern for visual appeal
 * 
 * Things you can tweak:
 * - Module header layout and styling
 * - Progress bar appearance and calculation
 * - Sublesson card design
 * - Status icons and their colors
 * - Background pattern and overall theme
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLessons } from '../../hooks/useLessons';
import { useLanguage } from '../common/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { SubLessonStatus } from '../../types/lessons';
import { typography } from '../../constants/typography';

export const ModuleScreen: React.FC = () => {
    const { moduleId, title } = useLocalSearchParams<{ moduleId: string; title: string }>();
    const { selectedLanguage } = useLanguage();
    const { lessons, loading, error } = useLessons(selectedLanguage);
    const router = useRouter();

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

    if (!module) {
        return (
            <View style={styles.container}>
                <Text>Module not found</Text>
            </View>
        );
    }

    const calculateModuleProgress = (sublessons: Array<{ status: SubLessonStatus }>) => {
        const totalSublessons = sublessons.length;
        const completedSublessons = sublessons.filter(sub => sub.status === 'complete').length;
        const inProgressSublessons = sublessons.filter(sub => sub.status === 'in-progress').length;
        
        // Calculate progress: completed sublessons count as 100%, in-progress count as 50%
        const progress = ((completedSublessons + (inProgressSublessons * 0.5)) / totalSublessons) * 100;
        return Math.round(progress);
    };

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

    const moduleProgress = calculateModuleProgress(module.sublessons);

    return (
        <ImageBackground 
            source={require('../../assets/icons/bgpattern.png')}
            style={styles.container}
            resizeMode="cover"
        >

            {/* MODULE OVERVIEW PAGE */}
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    {/* <Image source={module.image} style={styles.moduleImage} /> */}
                    <Image source={require('../../assets/icons/module-header.png')} style={styles.moduleImage} />
                    <Text style={styles.title}>{module.title}</Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarWrapper}>
                            <View style={[styles.progressBar, { width: `${moduleProgress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{moduleProgress}%</Text>
                    </View>
                </View>

                {/* MODULE OVERVIEW - SUBLESSONS LIST */}
                <View style={styles.sublessonsContainer}>
                    {module.sublessons.map((sublesson) => (
                        <TouchableOpacity
                            key={sublesson.id}
                            style={styles.sublessonCard}
                            onPress={() => router.push({
                                pathname: '/sublesson',
                                params: {
                                    moduleId: module.id,
                                    sublessonId: sublesson.id,
                                    title: sublesson.title,
                                    language: selectedLanguage
                                }
                            })}
                        >
                            <View style={styles.sublessonInfo}>
                                <Text style={styles.sublessonTitle}>{sublesson.title}</Text>
                                <Text style={styles.sublessonType}>{sublesson.type}</Text>
                            </View>
                            <View style={styles.statusContainer}>
                                {getStatusIcon(sublesson.status)}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
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
    moduleImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    title: {
        ...typography.h1,
        color: '#212529',
        marginBottom: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBarWrapper: {
        flex: 1,
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    progressText: {
        ...typography.label,
        color: '#6c757d',
        minWidth: 45,
        textAlign: 'right',
    },
    sublessonsContainer: {
        padding: 20,
        marginRight: '10vh',
        marginLeft: '10vh',
    },
    sublessonCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 4,
        // elevation: 3,
        overflow: 'hidden',
    },
    sublessonInfo: {
        flex: 1,
        marginRight: 16,
    },
    sublessonTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    sublessonType: {
        fontSize: 14,
        color: '#6c757d',
        textTransform: 'capitalize',
    },
    statusContainer: {
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});