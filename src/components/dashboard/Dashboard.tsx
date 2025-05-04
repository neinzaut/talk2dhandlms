import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import SideNav from '../common/SideNav';
import TopNav from '../common/TopNav';
import Leaderboard from './Leaderboard';
import MainContent from './MainContent';
import bgPattern from '../../assets/icons/bgpattern.png';
import { LanguageProvider } from '../common/LanguageContext';

export function Dashboard() {
    return (
        <LanguageProvider>
            <ImageBackground
                source={bgPattern}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <View style={styles.top}>
                        <TopNav />
                    </View>
                    <View style={styles.content}>
                        <SideNav />
                        <View style={styles.main}>
                            <MainContent />
                        </View>
                        <Leaderboard />
                    </View>
                </View>
            </ImageBackground>
        </LanguageProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    top: {
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        zIndex: 10,
    },
    content: {
        flexDirection: 'row',
        flex: 1,
    },
    main: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default Dashboard;