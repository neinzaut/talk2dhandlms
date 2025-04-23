import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

const SideNav: React.FC = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    if (isMobile) return null;

    return (
        <View style={styles.nav}>
            <Text style={styles.logo}>Menu</Text>
            <View style={styles.navLinks}>
                <Text style={styles.navItem}>Learn</Text>
                <Text style={styles.navItem}>Practice</Text>
                <Text style={styles.navItem}>AI Converse</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    nav: {
        width: 200,
        backgroundColor: '#0073FF',
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    logo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    navLinks: {
        gap: 10,
    },
    navItem: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
});

export default SideNav;
