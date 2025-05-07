import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import { SignRecognitionPractice } from '../practice/SignRecognitionPractice';
import { getSignImages } from '../../utils/imageUtils';
import { typography } from '../../constants/typography';

interface NumbersSubLessonProps {
    language: 'ASL' | 'FSL';
    onComplete?: () => void;
}

export const NumbersSubLesson: React.FC<NumbersSubLessonProps> = ({
    language,
    onComplete
}) => {
    const [selectedNumber, setSelectedNumber] = useState<string>('0');
    const numbers = Array.from({ length: 11 }, (_, i) => i.toString());
    const signs = getSignImages(language, numbers, 'labelled');

    const renderNumberSelection = () => {
        return (
            <View style={styles.signSelectionContainer}>
                <Text style={styles.sectionTitle}>Select a Number to Practice</Text>
                <Text style={styles.languageTitle}>{language} Number Signs</Text>
                <View style={styles.signsGrid}>
                    {signs.map((item) => (
                        <TouchableOpacity
                            key={item.meaning}
                            style={[
                                styles.signItem,
                                selectedNumber === item.meaning && styles.selectedSignItem
                            ]}
                            onPress={() => setSelectedNumber(item.meaning || '')}
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
                <View style={styles.content}>
                    <View style={styles.cameraContainer}>
                        <SignRecognitionPractice
                            targetSign={selectedNumber}
                            onPrediction={(prediction) => {
                                console.log('Prediction:', prediction);
                                if (prediction === selectedNumber && onComplete) {
                                    onComplete();
                                }
                            }}
                        />
                    </View>
                    {renderNumberSelection()}
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
        width: '100%',
    },
    sectionTitle: {
        ...typography.h2,
        marginBottom: 16,
        color: '#212529',
        textAlign: 'center',
    },
    languageTitle: {
        ...typography.h3,
        marginBottom: 12,
        color: '#495057',
        textAlign: 'center',
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
}); 