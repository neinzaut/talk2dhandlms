import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { typography } from '../../constants/typography';
import { useRouter } from 'expo-router';
import DailyChallenge from './DailyChallenge';
import MatchingGame from './MatchingGame';
import PracticeByAudio from './PracticeByAudio';

const PracticeScreen: React.FC = () => {
    const { selectedLanguage } = useLanguage();
    const router = useRouter();
    const [activePractice, setActivePractice] = React.useState<string | null>(null);

    const practiceCategories = [
        {
            id: 'daily-challenge',
            title: 'Daily Challenge',
            description: 'Complete today\'s sign language challenge',
            icon: '🎯',
        },
        {
            id: 'matching-game',
            title: 'Matching Game',
            description: 'Match letters with their sign language images',
            icon: '🎮',
        },
        {
            id: 'practice-by-audio',
            title: 'Practice by Audio',
            description: 'Practice speaking sign language letters',
            icon: '🎤',
        },
    ];

    const handlePracticeComplete = () => {
        setActivePractice(null);
    };

    if (activePractice) {
        switch (activePractice) {
            case 'daily-challenge':
                return <DailyChallenge onComplete={handlePracticeComplete} />;
            case 'matching-game':
                return <MatchingGame onComplete={handlePracticeComplete} />;
            case 'practice-by-audio':
                return <PracticeByAudio onComplete={handlePracticeComplete} />;
            default:
                return null;
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Practice</Text>
                <Text style={styles.subtitle}>Choose a practice mode to improve your skills</Text>
            </View>

            <View style={styles.categoriesContainer}>
                {practiceCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => setActivePractice(category.id)}
                    >
                        <View style={styles.categoryIconContainer}>
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                        </View>
                        <View style={styles.categoryContent}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <Text style={styles.categoryDescription}>{category.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    title: {
        ...typography.h1,
        color: '#212529',
        marginBottom: 8,
    },
    subtitle: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
    categoriesContainer: {
        padding: 20,
        gap: 16,
    },
    categoryCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryIcon: {
        fontSize: 24,
    },
    categoryContent: {
        flex: 1,
        justifyContent: 'center',
    },
    categoryTitle: {
        ...typography.h2,
        color: '#212529',
        marginBottom: 4,
    },
    categoryDescription: {
        ...typography.bodyLarge,
        color: '#6c757d',
    },
});

export default PracticeScreen; 