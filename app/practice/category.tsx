import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../src/components/common/LanguageContext';
import { typography } from '../../src/constants/typography';

const PracticeCategory = () => {
  const { categoryId, title } = useLocalSearchParams();
  const { selectedLanguage } = useLanguage();

  const getCategoryTitle = () => {
    switch (categoryId) {
      case 'daily-challenge':
        return 'Daily Challenge';
      case 'matching-game':
        return 'Matching Game';
      case 'practice-audio':
        return 'Practice by Audio';
      default:
        return 'Practice';
    }
  };

  return (
    <ImageBackground
      source={require('../../src/assets/icons/bgpattern.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{getCategoryTitle()}</Text>
        <View style={styles.content}>
          <Text style={styles.placeholderText}>
            Practice exercises coming soon...
          </Text>
          <Text style={styles.subtext}>
            {selectedLanguage === 'ASL' ? 'American' : 'Filipino'} Sign Language - {getCategoryTitle()}
          </Text>
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
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    ...typography.h3,
    color: '#212529',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    ...typography.bodyMedium,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default PracticeCategory; 