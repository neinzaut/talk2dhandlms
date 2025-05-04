import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useLessons } from '../../hooks/useLessons';
import { LessonItem } from './LessonItem';

const ModuleScreen: React.FC = () => {
  const route = useRoute();
  const { lessonId } = route.params;
  const { lessons, updateLessonProgress } = useLessons();
  
  const lesson = lessons.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LessonItem 
        title={lesson.title}
        image={lesson.image}
        sublessons={lesson.sublessons}
        overallProgress={lesson.overallProgress}
      />
      
      {/* Add your module content here */}
      <Text style={styles.moduleContent}>Module content goes here...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  moduleContent: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default ModuleScreen;