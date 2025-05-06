import React from 'react';
import { View, Text, SectionList, StyleSheet, useWindowDimensions } from 'react-native';
import { typography } from '../../constants/typography';

const Leaderboard: React.FC = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={[styles.rightNav, isMobile && styles.mobile]}>
            {/* Daily Quest Header */}
            <Text style={styles.logo}>Daily Quest</Text>

            {/* Daily Streak */}
            <View style={styles.section}>
                <Text style={styles.subheader}>Daily Streak</Text>
                <View style={styles.row}>
                    <Text style={styles.icon}>🔥</Text>
                    <Text style={styles.value}>5 Days</Text>
                </View>
            </View>

            {/* Total XP */}
            <View style={styles.section}>
                <Text style={styles.subheader}>Total XP</Text>
                <Text style={styles.value}>2,450 XP</Text>
            </View>

            {/* Leaderboard */}
            <SectionList
                sections={[
                    {
                        title: 'Leaderboard',
                        data: [
                            { name: 'User1', score: 2450, rankChange: 'up' },
                            { name: 'User2', score: 2100, rankChange: 'down' },
                            { name: 'User3', score: 1850, rankChange: '' },
                        ],
                    },
                ]}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.icon}>🏅</Text>
                        <Text style={styles.icon}>👤</Text>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.xp}>{item.score} XP</Text>
                        </View>
                        <Text style={styles.rankChange}>
                            {item.rankChange === 'up' ? '⬆️' : item.rankChange === 'down' ? '⬇️' : ''}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.logo}>{title}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rightNav: {
        width: 200,
        padding: 16,
        // backgroundColor: '#f4f4f4',
    },
    mobile: {
        width: '100%',
    },
    logo: {
        ...typography.h2,
        marginBottom: 10,
    },
    section: {
        marginBottom: 16,
        backgroundColor: '#fff', // Apply background color to the entire section
        borderRadius: 8, // Add rounded corners
        padding: 8, // Add padding to the section
        borderWidth: 1, // Add border
        borderColor: '#D9D9D9', // Border color
    },
    subheader: {
        ...typography.bodyMedium,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        ...typography.bodyLarge,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        // backgroundColor: '#fff',
        // borderWidth: 1,
        // borderColor: '#D9D9D9',
    },
    icon: {
        fontSize: 18,
        marginRight: 6,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        ...typography.bodyLarge,
        fontWeight: 'bold',
    },
    xp: {
        ...typography.bodyMedium,
        color: '#888',
    },
    rankChange: {
        fontSize: 18,
        marginLeft: 10,
    },
});

export default Leaderboard;
