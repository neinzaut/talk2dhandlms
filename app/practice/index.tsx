import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useLanguage } from '../../src/components/common/LanguageContext';
import { useRouter } from 'expo-router';
import DropdownMenu from '../../src/components/common/DropdownMenu';
import UserDropdown from '../../src/components/common/UserDropdown';
import { typography } from '../../src/constants/typography';
import SideNav from '../../src/components/common/SideNav';
import PracticeScreen from '../../src/components/(practice)/PracticeScreen';

export default function Practice() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<View>(null);

  const languageData = {
    ASL: {
      icon: require('../../src/assets/icons/icon-asl.png'),
      label: 'American Sign Language',
    },
    FSL: {
      icon: require('../../src/assets/icons/icon-fsl.png'),
      label: 'Filipino Sign Language',
    },
  };

  const dropdownItems = [
    {
      icon: languageData.ASL.icon,
      label: languageData.ASL.label,
      onPress: () => setSelectedLanguage('ASL'),
    },
    {
      icon: languageData.FSL.icon,
      label: languageData.FSL.label,
      onPress: () => setSelectedLanguage('FSL'),
    },
  ];

  const handleOutsidePress = () => {
    setDropdownVisible(false);
  };

  const user = {
    name: 'Francesca Tuazon',
    email: 'tfa2079@dlsud.ph',
    avatar: require('../../src/assets/icons/icon-user.png'),
  };

  return (
    <ImageBackground
      source={require('../../src/assets/icons/bgpattern.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Top Navigation */}
      <View style={styles.nav}>
        <Image source={require('../../src/assets/icons/logo.png')} style={styles.logo} />
        <View style={styles.navLinks}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navLink}>Streak</Text>
          </TouchableOpacity>

          <View ref={dropdownRef} style={styles.languageSelector}>
            <TouchableOpacity
              style={styles.selectedLanguage}
              onPress={() => setDropdownVisible(!dropdownVisible)}
              activeOpacity={0.8}
            >
              <Image
                source={languageData[selectedLanguage].icon}
                style={styles.selectedLanguageIcon}
              />
              <Text style={styles.selectedLanguageText} numberOfLines={1}>
                {languageData[selectedLanguage].label}
              </Text>
              <Image
                source={require('../../src/assets/icons/icon-dropdown.png')}
                style={[
                  styles.chevronIcon,
                  dropdownVisible && { transform: [{ rotate: '180deg' }] }
                ]}
              />
            </TouchableOpacity>
            
            <DropdownMenu 
              items={dropdownItems}
              isVisible={dropdownVisible}
              onClose={() => setDropdownVisible(false)}
            />
          </View>

          <UserDropdown user={user} />
        </View>

        {dropdownVisible && (
          <Pressable 
            style={styles.overlay} 
            onPress={handleOutsidePress}
          />
        )}
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Side Navigation */}
        <SideNav />

        {/* Content Area */}
        <View style={styles.contentArea}>
          <PracticeScreen />
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
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    position: 'relative',
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginLeft: 20,
  },
  navLink: {
    color: '#545454',
    fontSize: 16,
  },
  languageSelector: {
    position: 'relative',
    marginLeft: 20,
    zIndex: 100,
  },
  selectedLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 180,
    maxWidth: 200,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedLanguageIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  selectedLanguageText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    flexShrink: 1,
  },
  chevronIcon: {
    width: 14,
    height: 14,
    marginLeft: 'auto',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
}); 