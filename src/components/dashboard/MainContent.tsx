import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MainContent: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {Array.from({ length: 6 }).map((_, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.title}>Card {index + 1}</Text>
                    <Text style={styles.content}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        gap: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        color: '#555',
    },
});

export default MainContent;
