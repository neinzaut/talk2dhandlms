import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Pressable } from 'react-native';
import { typography } from '../../constants/typography';

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    avatar: any;
  };
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOutsidePress = () => {
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Image source={user.avatar} style={styles.avatarImage} />
      </TouchableOpacity>

      {dropdownVisible && (
        <>
          <Pressable 
            style={styles.overlay} 
            onPress={handleOutsidePress}
          />
          <View style={styles.dropdownMenu}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>My Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.signOutContainer}>
              <TouchableOpacity style={styles.signOutButton}>
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginLeft: 20,
    zIndex: 100,
  },
  avatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#D9D9D9',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: -150,
    right: -150,
    bottom: -150,
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 176,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userName: {
    ...typography.bodyMedium,
    color: '#111827',
  },
  userEmail: {
    ...typography.bodySmall,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  menuItems: {
    paddingVertical: 4,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItemText: {
    ...typography.bodyMedium,
    color: '#374151',
  },
  signOutContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  signOutText: {
    ...typography.bodyMedium,
    color: '#374151',
  },
});

export default UserDropdown;