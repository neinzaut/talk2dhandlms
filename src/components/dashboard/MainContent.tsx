import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LessonItem } from '../lessons/LessonItem';
import { useLessons } from '../../hooks/useLessons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../common/LanguageContext';

const MainContent: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const { lessons } = useLessons(selectedLanguage);
  const navigation = useNavigation();

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('ModuleScreen', { 
      lessonId,
      language: selectedLanguage 
    });
  };

  const getLanguageName = () => {
    return selectedLanguage === 'ASL' 
      ? 'American Sign Language' 
      : 'Filipino Sign Language';
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Jump back into</Text>

      {/* Current Lesson */}
      {lessons.length > 0 && (
        <TouchableOpacity 
          style={[styles.currentLessonCard, { borderTopColor: '#4EC6FF', borderTopWidth: 4 }]}
          onPress={() => handleLessonPress(lessons[0].id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Current {getLanguageName()} Lesson</Text>
              <Text style={styles.subtitle}>{lessons[0].sublessons[0].title}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${lessons[0].sublessons[0].progress}%` }]}>
                  <Text style={styles.progressText}>{lessons[0].sublessons[0].progress}%</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={[styles.subtitle, { marginTop: 8 }]}>
                Already know this?
              </Text>
              <Text style={styles.content}>
                Take the Module Test to skip the course.
              </Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Answer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* All Lessons */}
      <Text style={styles.title}>{getLanguageName()} Lessons</Text>
      <View style={styles.lessonsList}>
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            title={lesson.title}
            image={lesson.image}
            sublessons={lesson.sublessons}
            overallProgress={lesson.overallProgress}
            onPress={() => handleLessonPress(lesson.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    height: '100%',
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  currentLessonCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  progressContainer: {
    width: 100,
    alignItems: 'flex-end',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTextContainer: {
    flex: 1,
  },
  content: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lessonsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
});

export default MainContent;