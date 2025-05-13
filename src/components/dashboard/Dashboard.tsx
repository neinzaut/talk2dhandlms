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

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { useLessons } from '../../hooks/useLessons';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DropdownMenu from '../common/DropdownMenu';
import UserDropdown from '../common/UserDropdown';
import { typography } from '../../constants/typography';
import SideNav from '../common/SideNav';

export const Dashboard: React.FC = () => {
    const { selectedLanguage, setSelectedLanguage } = useLanguage();
    const { lessons } = useLessons(selectedLanguage);
    const router = useRouter();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<View>(null);

    const languageData = {
        ASL: {
            icon: require('../../assets/icons/icon-asl.png'),
            label: 'American Sign Language',
        },
        FSL: {
            icon: require('../../assets/icons/icon-fsl.png'),
            label: 'Filipino Sign Language',
        },
    };

    const dropdownItems = [
        {
            icon: languageData.ASL.icon,
            label: languageData.ASL.label,
            onPress: () => setSelectedLanguage('ASL'),
        },
        {
            icon: languageData.FSL.icon,
            label: languageData.FSL.label,
            onPress: () => setSelectedLanguage('FSL'),
        },
    ];

    const handleOutsidePress = () => {
        setDropdownVisible(false);
    };

    const user = {
        name: 'Francesca Tuazon',
        email: 'tfa2079@dlsud.ph',
        avatar: require('../../assets/icons/icon-user.png'),
    };

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
            <View style={styles.nav}>
                <Image source={require('../../assets/icons/logo.png')} style={styles.logo} />
                <View style={styles.navLinks}>
                    <TouchableOpacity style={styles.navItem}>
                        <Text style={styles.navLink}>Streak</Text>
                    </TouchableOpacity>

                    <View ref={dropdownRef} style={styles.languageSelector}>
                        <TouchableOpacity
                            style={styles.selectedLanguage}
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={languageData[selectedLanguage].icon}
                                style={styles.selectedLanguageIcon}
                            />
                            <Text style={styles.selectedLanguageText} numberOfLines={1}>
                                {languageData[selectedLanguage].label}
                            </Text>
                            <Image
                                source={require('../../assets/icons/icon-dropdown.png')}
                                style={[
                                    styles.chevronIcon,
                                    dropdownVisible && { transform: [{ rotate: '180deg' }] }
                                ]}
                            />
                        </TouchableOpacity>
                        
                        <DropdownMenu 
                            items={dropdownItems}
                            isVisible={dropdownVisible}
                            onClose={() => setDropdownVisible(false)}
                        />
                    </View>

                    <UserDropdown user={user} />
                </View>

                {dropdownVisible && (
                    <Pressable 
                        style={styles.overlay} 
                        onPress={handleOutsidePress}
                    />
                )}
            </View>

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
                                    <Text style={styles.score}>1,850 XP</Text>
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
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
        position: 'relative',
        zIndex: 10,
    },
    overlay: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 5,
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navItem: {
        marginLeft: 20,
    },
    navLink: {
        color: '#545454',
        fontSize: 16,
    },
    languageSelector: {
        position: 'relative',
        marginLeft: 20,
        zIndex: 100,
    },
    selectedLanguage: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 180,
        maxWidth: 200,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    selectedLanguageIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    selectedLanguageText: {
        color: '#1f2937',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 8,
        flexShrink: 1,
    },
    chevronIcon: {
        width: 14,
        height: 14,
        marginLeft: 'auto',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    contentArea: {
        flex: 1,
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'transparent',
        paddingLeft: '4vh',
        paddingRight: '4vh',

    },
    contentTitle: {
        ...typography.h1,
        color: '#212529',
        marginBottom: 16,
    },
    lessonsContainer: {
        flex: 2,
        backgroundColor: 'transparent',
    },
    moduleCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 4,
        // elevation: 3,
    },
    moduleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    moduleIcon: {
        width: 60,
        height: 60,
        marginRight: 16,
        resizeMode: 'contain',
        backgroundColor: '#f8f9fa',
        padding: 8,
    },
    moduleInfo: {
        flex: 1,
        marginRight: 16,
    },
    moduleNumber: {
        ...typography.bodyMedium,
        color: '#6c757d',
        marginBottom: 4,
    },
    moduleTitle: {
        ...typography.h4,
        color: '#212529',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBarWrapper: {
        width: 120,
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
    },
    rightPanel: {
        width: 250,
        gap: 16,
        backgroundColor: 'transparent',
        marginLeft: '4vh',
    },
    experienceArea: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 4,
        elevation: 3,
    },
    experienceTitle: {
        ...typography.h2,
        color: '#212529',
        marginBottom: 16,
    },
    experienceContent: {
        gap: 12,
    },
    levelInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelText: {
        ...typography.h3,
        color: '#0073FF',
    },
    xpText: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#e9ecef',
        borderRadius: 4,
        overflow: 'hidden',
    },
    xpProgressBar: {
        height: '100%',
        backgroundColor: '#0073FF',
    },
    nextLevelText: {
        ...typography.bodyMedium,
        color: '#6c757d',
        textAlign: 'right',
    },
    leaderboard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 4,
        // elevation: 3,
        overflow: 'hidden',
    },
    leaderboardTitle: {
        ...typography.h2,
        color: '#212529',
        marginBottom: 16,
    },
    leaderboardContent: {
        gap: 12,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    rank: {
        ...typography.bodyLarge,
        width: 30,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    username: {
        ...typography.bodyLarge,
        flex: 1,
        color: '#212529',
    },
    score: {
        ...typography.bodyLarge,
        fontWeight: '600',
        color: '#28a745',
    },
});