import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useLessons } from '../../hooks/useLessons';
import { LessonItem } from './LessonItem';
import { useLanguage } from '../common/LanguageContext';

const ModuleScreen: React.FC = () => {
  const route = useRoute();
  const { lessonId } = route.params;
  const { selectedLanguage } = useLanguage();
  const { lessons, updateLessonProgress } = useLessons(selectedLanguage);
  
  // Find the lesson matching both ID and language
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
        isCurrent={false} // Or add logic to determine if this is current
      />
      
      {/* Language-specific module content */}
      <View style={styles.moduleContent}>
        <Text style={styles.languageBadge}>
          {selectedLanguage === 'ASL' 
            ? 'American Sign Language' 
            : 'Filipino Sign Language'}
        </Text>
        <Text style={styles.contentTitle}>{lesson.title}</Text>
        
        {/* Add your actual module content here */}
        {selectedLanguage === 'ASL' ? (
          <Text>ASL-specific content for this module...</Text>
        ) : (
          <Text>FSL-specific content for this module...</Text>
        )}
      </View>
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
    padding: 15,
    // backgroundColor: '#f8f9fa',
    backgroundColor: '#FF6536',
    borderRadius: 8,
  },
  languageBadge: {
    backgroundColor: '#4EC6FF',
    color: 'white',
    padding: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default ModuleScreen;