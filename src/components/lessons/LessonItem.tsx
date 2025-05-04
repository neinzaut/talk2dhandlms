import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { Lesson } from './lessonTypes';

interface LessonItemProps {
  lesson: Lesson;
  onPress?: () => void;
  isCurrent?: boolean;
}

export const LessonItem: React.FC<LessonItemProps> = ({ 
  lesson,
  onPress = () => {},
  isCurrent = false
}) => {
  // Destructure with safe defaults
  const {
    title = 'Untitled Lesson',
    image = require('../../assets/icons/lesson1-preview.png'),
    sublessons = [],
    overallProgress = 0
  } = lesson;

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isCurrent && styles.currentLessonCard
      ]} 
      onPress={onPress}
      activeOpacity={0.9}
      onStartShouldSetResponder={() => true}
    >
      <View style={styles.lessonHeader}>
        <Image 
          source={image} 
          style={styles.lessonImage} 
          resizeMode="contain"
          defaultSource={require('../../assets/icons/lesson1-preview.png')}
        />
        <View style={styles.lessonTextContainer}>
          <Text style={styles.lessonTitle}>{title}</Text>
          <View style={styles.overallProgressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>{overallProgress}% complete</Text>
          </View>
        </View>
      </View>

      {sublessons.length > 0 && (
        <View style={styles.sublessonsContainer}>
          {sublessons.map((sublesson) => (
            <TouchableOpacity 
              key={sublesson.id}
              style={styles.sublessonItem}
              activeOpacity={0.7}
              onPress={() => {}}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.sublessonLeft}>
                <View style={[
                  styles.sublessonIcon,
                  sublesson.progress === 100 && styles.completedIcon,
                  sublesson.progress > 0 && styles.inProgressIcon
                ]}>
                  {sublesson.progress === 100 ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={styles.sublessonNumber}>
                      {sublessons.findIndex(s => s.id === sublesson.id) + 1}
                    </Text>
                  )}
                </View>
                <Text 
                  style={styles.sublessonTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {sublesson.title}
                </Text>
              </View>
              <View style={styles.sublessonProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${sublesson.progress}%` }]} />
                </View>
                <Text style={styles.sublessonProgressText}>
                  {sublesson.progress}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLessonCard: {
    borderTopColor: '#4EC6FF',
    borderTopWidth: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overallProgressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sublessonsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  sublessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sublessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  sublessonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  completedIcon: {
    backgroundColor: '#4CAF50',
  },
  inProgressIcon: {
    backgroundColor: '#2196F3',
  },
  sublessonNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sublessonTitle: {
    fontSize: 14,
    flex: 1,
  },
  sublessonProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  sublessonProgressText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    minWidth: 30,
  },
});

export default LessonItem;