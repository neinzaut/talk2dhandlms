import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LessonItem } from '../lessons/LessonItem';
import { useLessons } from '../../hooks/useLessons';

const MainContent: React.FC = () => {
  const { lessons } = useLessons();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onStartShouldSetResponder={() => true}
    >
      <Text style={styles.title}>Jump back into</Text>

      {/* Current Lesson */}
      {lessons.length > 0 && (
        <View style={styles.currentLessonContainer}>
          <LessonItem
            lesson={lessons[0]}
            isCurrent
          />
        </View>
      )}

      {/* All Lessons */}
      <View style={styles.allLessonsContainer}>
        {lessons.map((lesson, index) => (
          <View key={`lesson-${index}`} style={styles.lessonContainer}>
            <LessonItem
              lesson={lesson}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currentLessonContainer: {
    marginBottom: 20,
  },
  allLessonsContainer: {
    gap: 16,
  },
  lessonContainer: {
    width: '100%',
  },
});

export default MainContent;