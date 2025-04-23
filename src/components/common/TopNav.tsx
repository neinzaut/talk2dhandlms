import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TopNav: React.FC = () => {
  return (
    <View style={styles.nav}>
        <Image source={require('../../assets/icons/logo.png')} style={styles.logo} />
        <View style={styles.navLinks}>
            <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navLink}>Streak</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navLink}>Dropdown</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navLink}>User</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    logo: {
        width: '30vh',
        maxHeight: 40,
        resizeMode: 'contain',
    },
    navLinks: {
        flexDirection: 'row',
    },
    navItem: {
        marginLeft: 20,
    },
    navLink: {
        color: '#545454',
        fontSize: 16,
    },
});

export default TopNav;
