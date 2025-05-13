/**
 * Dashboard Component
 * 
 * The main dashboard interface that displays available lessons and learning progress.
 * It serves as the central hub for users to access different learning modules.
 * 
 * Features:
 * - Module listing and navigation
 * - Progress tracking
 * - Language selection
 * - Learning path visualization
 * 
 * Used in:
 * - Main navigation as the home screen
 * - Accessed after language selection
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { useLessons } from '../../hooks/useLessons';
import { useRouter } from 'expo-router';
import { typography } from '../../constants/typography';
import SideNav from '../common/SideNav';
import TopNav from '../common/TopNav';

export const Dashboard: React.FC = () => {
    const { selectedLanguage } = useLanguage();
    const { lessons } = useLessons(selectedLanguage);
    const router = useRouter();

    const handleModulePress = (moduleId: string, title: string) => {
        router.push({
            pathname: '/module',
            params: {
                moduleId,
                title,
            }
        });
    };

    return (
        <ImageBackground
            source={require('../../assets/icons/bgpattern.png')}
            style={styles.container}
            resizeMode="cover"
        >
            {/* Top Navigation */}
            <TopNav />

            {/* Main Content Area */}
            <View style={styles.mainContent}>
                {/* Side Navigation */}
                <SideNav />

                {/* Content and Leaderboard */}
                <View style={styles.contentArea}>
                    <ScrollView 
                        style={styles.lessonsContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.contentTitle}>Jump back into</Text>
                        {lessons.map((module) => (
                            <TouchableOpacity
                                key={module.id}
                                style={styles.moduleCard}
                                onPress={() => handleModulePress(module.id, module.title)}
                            >
                                <View style={styles.moduleContent}>
                                    <Image source={module.image} style={styles.moduleIcon} />
                                    <View style={styles.moduleInfo}>
                                        <Text style={styles.moduleNumber}>Module {module.id}</Text>
                                        <Text style={styles.moduleTitle}>{module.title}</Text>
                                    </View>
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressBarWrapper}>
                                            <View style={[styles.progressBar, { width: `${module.overallProgress}%` }]} />
                                        </View>
                                        <Text style={styles.progressText}>{module.overallProgress}%</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Experience and Leaderboard */}
                    <View style={styles.rightPanel}>
                        {/* Experience Area */}
                        <View style={styles.experienceArea}>
                            <Text style={styles.experienceTitle}>Experience</Text>
                            <View style={styles.experienceContent}>
                                <View style={styles.levelInfo}>
                                    <Text style={styles.levelText}>Level 5</Text>
                                    <Text style={styles.xpText}>2,450 XP</Text>
                                </View>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.xpProgressBar, { width: '75%' }]} />
                                </View>
                                <Text style={styles.nextLevelText}>Next Level: 3,000 XP</Text>
                            </View>
                        </View>

                        {/* Leaderboard */}
                        <View style={styles.leaderboard}>
                            <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                            <View style={styles.leaderboardContent}>
                                <View style={styles.leaderboardItem}>
                                    <Text style={styles.rank}>1</Text>
                                    <Text style={styles.username}>User1</Text>
                                    <Text style={styles.score}>2,450 XP</Text>
                                </View>
                                <View style={styles.leaderboardItem}>
                                    <Text style={styles.rank}>2</Text>
                                    <Text style={styles.username}>User2</Text>
                                    <Text style={styles.score}>2,100 XP</Text>
                                </View>
                                <View style={styles.leaderboardItem}>
                                    <Text style={styles.rank}>3</Text>
                                    <Text style={styles.username}>User3</Text>
                                    <Text style={styles.score}>1,950 XP</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    contentArea: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
    },
    lessonsContainer: {
        flex: 1,
        marginRight: 20,
    },
    contentTitle: {
        ...typography.h2,
        color: '#212529',
        marginBottom: 20,
    },
    moduleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    moduleContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moduleIcon: {
        width: 48,
        height: 48,
        marginRight: 16,
    },
    moduleInfo: {
        flex: 1,
    },
    moduleNumber: {
        ...typography.bodySmall,
        color: '#6c757d',
        marginBottom: 4,
    },
    moduleTitle: {
        ...typography.h3,
        color: '#212529',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
    },
    progressBarWrapper: {
        width: 100,
        height: 4,
        backgroundColor: '#e9ecef',
        borderRadius: 2,
        marginRight: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 2,
    },
    progressText: {
        ...typography.bodySmall,
        color: '#6c757d',
        minWidth: 40,
    },
    rightPanel: {
        width: 300,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    experienceArea: {
        marginBottom: 24,
    },
    experienceTitle: {
        ...typography.h3,
        color: '#212529',
        marginBottom: 16,
    },
    experienceContent: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    levelInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    levelText: {
        ...typography.bodyLarge,
        color: '#212529',
        fontWeight: '600',
    },
    xpText: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: '#e9ecef',
        borderRadius: 2,
        marginBottom: 8,
        overflow: 'hidden',
    },
    xpProgressBar: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 2,
    },
    nextLevelText: {
        ...typography.bodySmall,
        color: '#6c757d',
        textAlign: 'right',
    },
    leaderboard: {
        flex: 1,
    },
    leaderboardTitle: {
        ...typography.h3,
        color: '#212529',
        marginBottom: 16,
    },
    leaderboardContent: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    rank: {
        ...typography.bodyLarge,
        color: '#212529',
        fontWeight: '600',
        width: 30,
    },
    username: {
        ...typography.bodyLarge,
        color: '#212529',
        flex: 1,
    },
    score: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
});