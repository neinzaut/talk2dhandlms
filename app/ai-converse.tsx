import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import SideNav from '../src/components/common/SideNav';
import AIConverseScreen from '../src/components/(ai)/AIConverseScreen';
import TopNav from '../src/components/common/TopNav';

export default function AIConverse() {
  return (
    <ImageBackground
      source={require('../src/assets/icons/bgpattern.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Side Navigation */}
        <SideNav />

        {/* Content Area */}
        <View style={styles.contentArea}>
          <Text style={styles.title}>AI Converse</Text>
          <AIConverseScreen />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  contentArea: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
}); 