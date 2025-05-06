import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/typography';

const menuItems = [
  { label: 'Learn', icon: 'book-outline' },
  { label: 'Practice', icon: 'school-outline' },
  { label: 'AI Converse', icon: 'chatbubble-ellipses-outline' },
];

const SideNav: React.FC = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    if (isMobile) return null;

    return (
        <View style={styles.navWrapper}>
          <View style={styles.nav}>
            {/* <Image source={require('../../assets/icons/logo.png')} style={styles.logoImg} /> */}
            <View style={styles.navLinks}>
              {menuItems.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.navItem,
                    pressed && styles.navItemPressed,
                  ]}
                  android_ripple={{ color: '#e0e7ff' }}
                >
                  <Ionicons name={item.icon as any} size={22} color="#fff" style={styles.navIcon} />
                  <Text style={styles.navItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
  navWrapper: {
    // flex: 1,
    backgroundColor: '#0073FF',
    // borderTopRightRadius: 24,
    // borderBottomRightRadius: 24,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    // marginVertical: 16,
    // marginLeft: 8,
    // marginRight: 24,
  },
  nav: {
    width: 200,
    alignItems: 'center',
    paddingTop: 32,
    // paddingBottom: 32,
    // paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  logoImg: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  navLinks: {
    width: '100%',
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    // backgroundColor: 'rgba(255,255,255,0.06)',
  },
  navItemPressed: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  navIcon: {
    marginRight: 12,
  },
  navItemText: {
    ...typography.navItem,
    color: '#fff',
    letterSpacing: 0.2,
  },
});

export default SideNav;
