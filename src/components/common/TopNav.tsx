import React, { useState, useRef, useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import DropdownMenu from './DropdownMenu';
//import LanguageContext from './LanguageContext';
import { useLanguage } from './LanguageContext';
import { useStreak } from './StreakContext';
import UserDropdown from './UserDropdown';

type SignLanguage = 'ASL' | 'FSL';

const TopNav: React.FC = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const { streakCount } = useStreak();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<View>(null);

  const languageData: Record<SignLanguage, { icon: any; label: string }> = {
    ASL: {
      icon: require('../../assets/icons/icon-asl.png'),
      label: 'American Sign Language',
    },
    FSL: {
      icon: require('../../assets/icons/icon-fsl.png'),
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
    avatar: require('../../assets/icons/icon-user.png'),
  };

  return (
    <View style={styles.nav}>
      <Image source={require('../../assets/icons/logo.png')} style={styles.logo} />
      <View style={styles.navLinks}>
        <TouchableOpacity style={styles.streakContainer}>
          <Image 
            source={require('../../assets/icons/streak.png')} 
            style={styles.streakIcon}
          />
          <Text style={styles.streakText}>{streakCount} Day{streakCount !== 1 ? 's' : ''} Streak</Text>
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
              source={require('../../assets/icons/icon-dropdown.png')}
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

        {/* User Dropdown */}
        <UserDropdown user={user} />
      </View>

      {/* Click-outside handler */}
      {dropdownVisible && (
        <Pressable 
          style={styles.overlay} 
          onPress={handleOutsidePress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 20,
  },
  streakIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  streakText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TopNav;