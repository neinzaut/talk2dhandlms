import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ProgressBar } from './ProgressBar';

export interface LessonItemProps {
    title: string;
    image: any;
    sublessons: Array<{
        id: string;
        title: string;
        progress: number;
    }>;
    overallProgress: number;
    onPress: () => void;
    onSubLessonPress: (lessonId: string, sublessonId: string, title: string) => void;
}

export const LessonItem: React.FC<LessonItemProps> = ({
    title,
    image,
    sublessons,
    overallProgress,
    onPress,
    onSubLessonPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={image} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <ProgressBar progress={overallProgress} />
                <View style={styles.sublessons}>
                    {sublessons.map((sublesson) => (
                        <TouchableOpacity
                            key={sublesson.id}
                            style={styles.sublesson}
                            onPress={() => onSubLessonPress(title, sublesson.id, sublesson.title)}
                        >
                            <Text style={styles.sublessonTitle}>{sublesson.title}</Text>
                            <ProgressBar progress={sublesson.progress} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sublessons: {
        marginTop: 10,
    },
    sublesson: {
        marginTop: 10,
    },
    sublessonTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
}); 