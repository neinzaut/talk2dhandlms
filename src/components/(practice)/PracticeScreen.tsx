import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { useRouter } from 'expo-router';
import { typography } from '../../constants/typography';

const practiceCategories = [
  {
    id: 'alphabet',
    title: 'Alphabet Practice',
    description: 'Practice signing the alphabet',
    icon: 'text-outline',
  },
  {
    id: 'numbers',
    title: 'Numbers Practice',
    description: 'Practice signing numbers',
    icon: 'calculator-outline',
  },
  {
    id: 'common-phrases',
    title: 'Common Phrases',
    description: 'Practice everyday phrases',
    icon: 'chatbubble-outline',
  },
];

const PracticeScreen: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const router = useRouter();

  const getLanguageName = () => {
    return selectedLanguage === 'ASL' 
      ? 'American Sign Language' 
      : 'Filipino Sign Language';
  };

  const handlePracticePress = (categoryId: string) => {
    router.push({
      pathname: '/practice/category',
      params: {
        categoryId,
        title: practiceCategories.find(cat => cat.id === categoryId)?.title
      }
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/icons/bgpattern.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{getLanguageName()} Practice</Text>
        
        <View style={styles.categoriesContainer}>
          {practiceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handlePracticePress(category.id)}
            >
              <View style={styles.categoryContent}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    ...typography.h1,
    color: '#212529',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    padding: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    ...typography.h3,
    color: '#212529',
    marginBottom: 8,
  },
  categoryDescription: {
    ...typography.bodyMedium,
    color: '#6c757d',
  },
});

export default PracticeScreen; 